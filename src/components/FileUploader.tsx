import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Upload, X, Image, Music, FileText, Link2, Loader2 } from "lucide-react";
import { uploadFile, validateFile, convertGoogleDriveUrl, isGoogleDriveUrl, IMAGE_TYPES, AUDIO_TYPES, DOC_TYPES, type MediaBucket } from "@/lib/storage";
import { toast } from "@/hooks/use-toast";

interface FileUploaderProps {
  bucket: MediaBucket;
  folder?: string;
  accept: "image" | "audio" | "document";
  onUploaded: (url: string) => void;
  label?: string;
}

const ACCEPT_MAP = {
  image: { types: IMAGE_TYPES, mime: "image/*", icon: Image, maxMB: 5 },
  audio: { types: AUDIO_TYPES, mime: "audio/*", icon: Music, maxMB: 20 },
  document: { types: DOC_TYPES, mime: ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx", icon: FileText, maxMB: 15 },
};

const FileUploader = ({ bucket, folder, accept, onUploaded, label }: FileUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [driveLink, setDriveLink] = useState("");
  const [mode, setMode] = useState<"file" | "link">("file");
  const inputRef = useRef<HTMLInputElement>(null);
  const config = ACCEPT_MAP[accept];
  const Icon = config.icon;

  const handleFile = async (file: File) => {
    const err = validateFile(file, config.types, config.maxMB);
    if (err) { toast({ title: "Validation Error", description: err, variant: "destructive" }); return; }

    if (accept === "image") {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }

    setUploading(true);
    setProgress(0);
    try {
      const result = await uploadFile(bucket, file, folder, setProgress);
      onUploaded(result.publicUrl);
      toast({ title: "✅ Upload complete!" });
    } catch (e: any) {
      toast({ title: "Upload failed", description: e.message, variant: "destructive" });
    } finally {
      setUploading(false);
      setProgress(0);
      setPreview(null);
    }
  };

  const handleDriveLink = () => {
    if (!driveLink.trim()) return;
    const converted = isGoogleDriveUrl(driveLink) ? convertGoogleDriveUrl(driveLink) : driveLink;
    onUploaded(converted);
    toast({ title: "✅ Link added!" });
    setDriveLink("");
  };

  return (
    <div className="space-y-2">
      <Label className="font-body text-xs">{label || "Upload or Link"}</Label>
      <div className="flex gap-1 mb-2">
        <Button type="button" size="sm" variant={mode === "file" ? "default" : "outline"} onClick={() => setMode("file")} className="text-xs gap-1">
          <Upload className="w-3 h-3" /> Upload
        </Button>
        <Button type="button" size="sm" variant={mode === "link" ? "default" : "outline"} onClick={() => setMode("link")} className="text-xs gap-1">
          <Link2 className="w-3 h-3" /> URL / Drive
        </Button>
      </div>

      {mode === "file" ? (
        <div>
          <input ref={inputRef} type="file" accept={config.mime} className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          <Button type="button" variant="outline" size="sm" className="w-full gap-2 border-dashed" disabled={uploading}
            onClick={() => inputRef.current?.click()}>
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Icon className="w-4 h-4" />}
            {uploading ? "Uploading..." : `Choose ${accept} file`}
          </Button>
          {uploading && <Progress value={progress} className="mt-2 h-2" />}
          {preview && (
            <div className="mt-2 relative w-20 h-20">
              <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-md border border-border" />
              <button onClick={() => setPreview(null)} className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex gap-2">
          <Input value={driveLink} onChange={(e) => setDriveLink(e.target.value)} placeholder="Paste URL or Google Drive link..." className="text-sm" />
          <Button type="button" size="sm" onClick={handleDriveLink} disabled={!driveLink.trim()}>Add</Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
