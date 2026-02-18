import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/SectionHeading";
import { Image, Music, Play, Pause, Video, FileDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";

interface GalleryItem { id: string; title: string; title_am: string | null; category: string; image_url: string; }
interface Hymn { id: string; title: string; artist: string; audio_url: string | null; duration: string | null; }
interface Doc { id: string; title: string; title_am: string | null; category: string; file_url: string; }

const Media = () => {
  const { t, i18n } = useTranslation();
  const isAm = i18n.language === "am";
  
  // Sections and Loading
  const [activeSection, setActiveSection] = useState<"photos" | "hymns" | "documents">("photos");
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [hymns, setHymns] = useState<Hymn[]>([]);
  const [documents, setDocuments] = useState<Doc[]>([]);
  const [liveActive, setLiveActive] = useState(false);
  const [liveUrl, setLiveUrl] = useState("");

  // Audio Player State
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // 1. Initialize Audio Engine
    if (!audioRef.current) {
      audioRef.current = new Audio();
      
      audioRef.current.ontimeupdate = () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      };
      
      audioRef.current.onloadedmetadata = () => {
        setDuration(audioRef.current?.duration || 0);
      };

      audioRef.current.onended = () => {
        setPlayingIdx(null);
        setCurrentTime(0);
      };
    }

    // 2. Fetch All Data
    const fetchAll = async () => {
      try {
        const [galRes, hymnRes, docRes, settingsRes] = await Promise.all([
          supabase.from("gallery").select("*").order("created_at", { ascending: false }),
          supabase.from("hymns").select("*").order("created_at", { ascending: false }),
          supabase.from("documents").select("*").order("created_at", { ascending: false }),
          supabase.from("site_settings").select("*"),
        ]);

        if (galRes.data) setGallery(galRes.data as GalleryItem[]);
        if (hymnRes.data) setHymns(hymnRes.data);
        if (docRes.data) setDocuments(docRes.data as Doc[]);
        
        if (settingsRes.data) {
          const urlSetting = settingsRes.data.find((s: any) => s.key === "live_stream_url");
          const activeSetting = settingsRes.data.find((s: any) => s.key === "live_stream_active");
          if (urlSetting) setLiveUrl(urlSetting.value);
          if (activeSetting) setLiveActive(activeSetting.value === "true");
        }
      } catch (error) {
        console.error("Error loading media:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();

    // Cleanup audio on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  // --- Helpers ---

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPublicMediaUrl = (bucket: string, path: string | null) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  };

  const toggleAudio = (url: string | null, index: number) => {
    if (!url || !audioRef.current) return;
    const fullUrl = getPublicMediaUrl("hymns", url);

    if (playingIdx === index) {
      audioRef.current.pause();
      setPlayingIdx(null);
    } else {
      audioRef.current.src = fullUrl;
      audioRef.current.play().catch(err => console.error("Playback failed:", err));
      setPlayingIdx(index);
    }
  };

  const getYoutubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  if (loading) {
    return (
      <Layout>
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-20 ethiopian-pattern min-h-screen">
        <div className="container mx-auto px-4">
          <SectionHeading title={t("media.title")} subtitle={t("media.subtitle")} />

          {/* 1. Live Stream Section */}
          <div className="max-w-3xl mx-auto mb-16">
            <h3 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Video className="w-6 h-6 text-primary" /> {t("media.liveStream")}
            </h3>
            {liveActive && liveUrl ? (
              <div className="aspect-video rounded-xl overflow-hidden border border-border shadow-lg bg-black">
                {getYoutubeEmbedUrl(liveUrl) ? (
                  <iframe 
                    src={getYoutubeEmbedUrl(liveUrl)!} 
                    className="w-full h-full" 
                    allow="autoplay; encrypted-media" 
                    allowFullScreen 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-card">
                    <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline font-body">
                      Open Live Stream
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-video bg-card rounded-xl border border-border flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Video className="w-8 h-8 text-primary" />
                </div>
                <p className="text-muted-foreground font-body text-sm">{t("media.noLiveStream")}</p>
              </div>
            )}
          </div>

          {/* 2. Tabs Navigation */}
          <div className="flex justify-center gap-2 mb-12">
            {(["photos", "hymns", "documents"] as const).map((sec) => (
              <Button 
                key={sec} 
                variant={activeSection === sec ? "default" : "outline"} 
                onClick={() => setActiveSection(sec)} 
                className="gap-2"
              >
                {sec === "photos" && <Image className="w-4 h-4" />}
                {sec === "hymns" && <Music className="w-4 h-4" />}
                {sec === "documents" && <FileDown className="w-4 h-4" />}
                {sec === "photos" ? (isAm ? "ፎቶዎች" : "Photos") : sec === "hymns" ? (isAm ? "መዝሙራት" : "Hymns") : (isAm ? "ሰነዶች" : "Documents")}
              </Button>
            ))}
          </div>

          {/* 3. Photos Tab */}
      {/* 3. Photos Tab - Increased Image Size */}
{activeSection === "photos" && (
  /* Changed lg:grid-cols-3 to lg:grid-cols-2 to make images significantly larger */
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
    {gallery.length === 0 && <p className="col-span-full text-center text-muted-foreground">No photos found.</p>}
    {gallery.map((item, i) => (
      <motion.div 
        key={item.id} 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: i * 0.05 }} 
        /* Changed aspect-square to aspect-video or aspect-[16/10] for a larger footprint */
        className="group relative aspect-video rounded-2xl overflow-hidden border border-border shadow-md bg-muted"
      >
        <img 
          src={getPublicMediaUrl("gallery", item.image_url)} 
          alt={item.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-6">
          <p className="text-white font-display font-bold text-lg">
            {isAm ? (item.title_am || item.title) : item.title}
          </p>
          <p className="text-white/70 text-sm capitalize">{item.category}</p>
        </div>
      </motion.div>
    ))}
  </div>
)}

          {/* 4. Hymns Tab (with Player UI) */}
          {activeSection === "hymns" && (
            <div className="max-w-2xl mx-auto space-y-4">
              {hymns.length === 0 && <p className="text-center text-muted-foreground">No hymns found.</p>}
              {hymns.map((hymn, i) => (
                <motion.div 
                  key={hymn.id} 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  className="bg-card border border-border rounded-xl p-4 shadow-sm hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => toggleAudio(hymn.audio_url, i)} 
                        className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-all text-primary"
                      >
                        {playingIdx === i ? (
                          <Pause size={24} fill="currentColor" />
                        ) : (
                          <Play size={24} className="ml-1" fill="currentColor" />
                        )}
                      </button>
                      <div>
                        <h4 className="font-bold text-foreground text-sm">{hymn.title}</h4>
                        <p className="text-xs text-muted-foreground">{hymn.artist}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono text-muted-foreground">
                        {playingIdx === i ? formatTime(duration) : (hymn.duration || "--:--")}
                      </span>
                    </div>
                  </div>

                  {/* Real-time Progress Bar */}
                  {playingIdx === i && (
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-[10px] font-mono text-primary/80">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                      <div className="relative h-1 w-full bg-primary/10 rounded-full overflow-hidden">
                        <motion.div 
                          className="absolute top-0 left-0 h-full bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${(currentTime / duration) * 100}%` }}
                          transition={{ type: "tween", ease: "linear" }}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {/* 5. Documents Tab */}
          {activeSection === "documents" && (
            <div className="max-w-2xl mx-auto space-y-3">
              {documents.length === 0 && <p className="text-center text-muted-foreground">No documents found.</p>}
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between bg-card border border-border p-4 rounded-xl hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/5 rounded-lg text-primary">
                      <FileDown size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm">
                        {isAm ? (doc.title_am || doc.title) : doc.title}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">{doc.category}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a 
                      href={getPublicMediaUrl("documents", doc.file_url)} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="gap-2"
                    >
                      <FileDown className="w-4 h-4" /> Download
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Media;