import { supabase } from "@/integrations/supabase/client";

/**
 * Convert Google Drive sharing links to direct-view/download URLs.
 */
export const convertGoogleDriveUrl = (url: string): string => {
  // Pattern: https://drive.google.com/file/d/FILE_ID/view...
  const fileMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (fileMatch) {
    return `https://drive.google.com/uc?export=view&id=${fileMatch[1]}`;
  }
  // Pattern: https://drive.google.com/open?id=FILE_ID
  const openMatch = url.match(/drive\.google\.com\/open\?id=([^&]+)/);
  if (openMatch) {
    return `https://drive.google.com/uc?export=view&id=${openMatch[1]}`;
  }
  return url;
};

export const isGoogleDriveUrl = (url: string): boolean => {
  return url.includes("drive.google.com");
};

export type MediaBucket = "media-gallery" | "media-hymns" | "media-documents" | "media-kids";

interface UploadResult {
  publicUrl: string;
  path: string;
}

/**
 * Upload a file to a Supabase Storage bucket. Returns public URL.
 */
export const uploadFile = async (
  bucket: MediaBucket,
  file: File,
  folder?: string,
  onProgress?: (progress: number) => void
): Promise<UploadResult> => {
  const ext = file.name.split(".").pop() || "bin";
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = folder ? `${folder}/${timestamp}_${safeName}` : `${timestamp}_${safeName}`;

  // Simulate progress (Supabase JS doesn't provide real upload progress)
  let progress = 0;
  const interval = setInterval(() => {
    progress = Math.min(progress + Math.random() * 20, 90);
    onProgress?.(Math.round(progress));
  }, 200);

  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  clearInterval(interval);

  if (error) {
    onProgress?.(0);
    throw new Error(error.message);
  }

  onProgress?.(100);

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);

  return { publicUrl: urlData.publicUrl, path: data.path };
};

/**
 * Delete a file from a Supabase Storage bucket.
 */
export const deleteFile = async (bucket: MediaBucket, path: string): Promise<void> => {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw new Error(error.message);
};

/**
 * Validate file type and size.
 */
export const validateFile = (
  file: File,
  allowedTypes: string[],
  maxSizeMB: number = 10
): string | null => {
  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > maxSizeMB) {
    return `File too large (${sizeMB.toFixed(1)}MB). Max: ${maxSizeMB}MB.`;
  }
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  if (allowedTypes.length > 0 && !allowedTypes.includes(ext)) {
    return `Invalid file type (.${ext}). Allowed: ${allowedTypes.join(", ")}`;
  }
  return null;
};

export const IMAGE_TYPES = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
export const AUDIO_TYPES = ["mp3", "wav", "ogg", "m4a", "aac"];
export const DOC_TYPES = ["pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx"];
