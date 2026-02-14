import { useState, useEffect } from "react";
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
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<"photos" | "hymns" | "documents">("photos");
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [hymns, setHymns] = useState<Hymn[]>([]);
  const [documents, setDocuments] = useState<Doc[]>([]);
  const [liveActive, setLiveActive] = useState(false);
  const [liveUrl, setLiveUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
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
        const url = settingsRes.data.find((s: any) => s.key === "live_stream_url");
        const active = settingsRes.data.find((s: any) => s.key === "live_stream_active");
        if (url) setLiveUrl(url.value);
        if (active) setLiveActive(active.value === "true");
      }
      setLoading(false);
    };
    fetchAll();
  }, []);

  if (loading) return <Layout><div className="py-20 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></div></Layout>;

  const getYoutubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  return (
    <Layout>
      <section className="py-20 ethiopian-pattern">
        <div className="container mx-auto px-4">
          <SectionHeading title={t("media.title")} subtitle={t("media.subtitle")} />

          {/* Live Stream */}
          <div className="max-w-3xl mx-auto mb-16">
            <h3 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Video className="w-6 h-6 text-primary" /> {t("media.liveStream")}
            </h3>
            {liveActive && liveUrl ? (
              <div className="aspect-video rounded-xl overflow-hidden border border-border">
                {getYoutubeEmbedUrl(liveUrl) ? (
                  <iframe src={getYoutubeEmbedUrl(liveUrl)!} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-card">
                    <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline font-body">Open Live Stream</a>
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

          {/* Tabs */}
          <div className="flex justify-center gap-2 mb-8">
            {(["photos", "hymns", "documents"] as const).map((sec) => (
              <Button key={sec} variant={activeSection === sec ? "default" : "outline"} size="sm" onClick={() => setActiveSection(sec)} className="gap-2">
                {sec === "photos" && <Image className="w-4 h-4" />}
                {sec === "hymns" && <Music className="w-4 h-4" />}
                {sec === "documents" && <FileDown className="w-4 h-4" />}
                {sec === "photos" ? (isAm ? "ፎቶዎች" : "Photos") : sec === "hymns" ? (isAm ? "መዝሙራት" : "Hymns") : (isAm ? "ሰነዶች" : "Documents")}
              </Button>
            ))}
          </div>

          {/* Photos */}
          {activeSection === "photos" && (
            <div className="mb-16">
              <h3 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Image className="w-6 h-6 text-primary" /> {t("media.photoGallery")}
              </h3>
              {gallery.length === 0 && <p className="text-center text-muted-foreground font-body">No photos yet.</p>}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {gallery.map((item, i) => (
                  <motion.div key={item.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    className="group relative aspect-[4/3] rounded-lg border border-border overflow-hidden cursor-pointer hover:border-primary/30 transition-all">
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/80 to-transparent p-4">
                      <h4 className="font-display font-semibold text-primary-foreground text-sm">{isAm ? (item.title_am || item.title) : item.title}</h4>
                      <p className="text-primary-foreground/70 text-xs font-body capitalize">{item.category}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Hymns */}
          {activeSection === "hymns" && (
            <div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Music className="w-6 h-6 text-primary" /> {t("media.hymns")}
              </h3>
              {hymns.length === 0 && <p className="text-center text-muted-foreground font-body">No hymns yet.</p>}
              <div className="space-y-3 max-w-2xl mx-auto">
                {hymns.map((hymn, i) => (
                  <motion.div key={hymn.id} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    className="flex items-center justify-between bg-card rounded-lg border border-border p-4 hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => {
                          if (hymn.audio_url) {
                            if (hymn.audio_url.includes("youtube")) {
                              window.open(hymn.audio_url, "_blank");
                            }
                          }
                          setPlayingIdx(playingIdx === i ? null : i);
                        }}
                        className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                      >
                        {playingIdx === i ? <Pause className="w-5 h-5 text-primary" /> : <Play className="w-5 h-5 text-primary" />}
                      </button>
                      <div>
                        <h4 className="font-display font-semibold text-foreground text-sm">{hymn.title}</h4>
                        <p className="text-muted-foreground text-xs font-body">{hymn.artist}</p>
                      </div>
                    </div>
                    <span className="text-muted-foreground text-xs font-body">{hymn.duration || "—"}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {activeSection === "documents" && (
            <div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <FileDown className="w-6 h-6 text-primary" /> {isAm ? "ሰነዶች" : "Documents"}
              </h3>
              {documents.length === 0 && <p className="text-center text-muted-foreground font-body">No documents yet.</p>}
              <div className="space-y-3 max-w-2xl mx-auto">
                {documents.map((doc, i) => (
                  <motion.div key={doc.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    className="flex items-center justify-between bg-card rounded-lg border border-border p-4 hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileDown className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-foreground text-sm">{isAm ? (doc.title_am || doc.title) : doc.title}</h4>
                        <p className="text-muted-foreground text-xs font-body capitalize">{doc.category}</p>
                      </div>
                    </div>
                    <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline"><FileDown className="w-4 h-4 mr-1" /> Download</Button>
                    </a>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Media;
