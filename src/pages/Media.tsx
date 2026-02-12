import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/SectionHeading";
import { Image, Music, Play, Pause, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const galleryItems = [
  { title: "Sunday Service", titleAm: "የእሑድ አገልግሎት", desc: "Weekly liturgy at Debre Mihret", descAm: "በደብረ ምህረት ሳምንታዊ ቅዳሴ" },
  { title: "Baptism Ceremony", titleAm: "ጥምቀት ሥርዓት", desc: "Sacrament of holy baptism", descAm: "የጥምቀት ምሥጢር" },
  { title: "Timket Festival", titleAm: "ጥምቀት በዓል", desc: "Epiphany celebration", descAm: "የጥምቀት ክብረ በዓል" },
  { title: "Choir Performance", titleAm: "የመዝሙር ቡድን", desc: "Youth choir during Easter", descAm: "በፋሲካ ወቅት ወጣት ዘማሪዎች" },
  { title: "Bible Study Group", titleAm: "የመጽሐፍ ቅዱስ ጥናት", desc: "Saturday class session", descAm: "ቅዳሜ የትምህርት ክፍለ ጊዜ" },
  { title: "Annual Conference", titleAm: "ዓመታዊ ጉባኤ", desc: "Youth spiritual retreat", descAm: "የወጣቶች መንፈሳዊ ማፈግፈጊያ" },
];

const hymns = [
  { title: "ወረደ እግዚአብሔር", artist: "Sunday School Choir", duration: "4:32" },
  { title: "ማርያም ድንግል", artist: "Sunday School Choir", duration: "5:15" },
  { title: "ቅዱስ ቅዱስ ቅዱስ", artist: "Sunday School Choir", duration: "3:48" },
  { title: "እግዚአብሔር ረዳቴ", artist: "Sunday School Choir", duration: "6:01" },
];

const Media = () => {
  const { t, i18n } = useTranslation();
  const isAm = i18n.language === "am";
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);

  return (
    <Layout>
      <section className="py-20 ethiopian-pattern">
        <div className="container mx-auto px-4">
          <SectionHeading title={t("media.title")} subtitle={t("media.subtitle")} />

          {/* Live Stream Placeholder */}
          <div className="max-w-3xl mx-auto mb-16">
            <h3 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Video className="w-6 h-6 text-primary" /> {t("media.liveStream")}
            </h3>
            <div className="aspect-video bg-card rounded-xl border border-border flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Video className="w-8 h-8 text-primary" />
              </div>
              <p className="text-muted-foreground font-body text-sm mb-2">{t("media.liveStreamDesc")}</p>
              <p className="text-muted-foreground/60 font-body text-xs">{t("media.noLiveStream")}</p>
            </div>
          </div>

          {/* Gallery */}
          <div className="mb-16">
            <h3 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Image className="w-6 h-6 text-primary" /> {t("media.photoGallery")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryItems.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="group relative aspect-[4/3] bg-gradient-to-br from-secondary/20 to-primary/10 rounded-lg border border-border overflow-hidden cursor-pointer hover:border-primary/30 transition-all">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image className="w-10 h-10 text-muted-foreground/30" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/80 to-transparent p-4">
                    <h4 className="font-display font-semibold text-primary-foreground text-sm">{isAm ? item.titleAm : item.title}</h4>
                    <p className="text-primary-foreground/70 text-xs font-body">{isAm ? item.descAm : item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Hymns with Audio Player */}
          <div>
            <h3 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Music className="w-6 h-6 text-primary" /> {t("media.hymns")}
            </h3>
            <div className="space-y-3 max-w-2xl">
              {hymns.map((hymn, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="flex items-center justify-between bg-card rounded-lg border border-border p-4 hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setPlayingIdx(playingIdx === i ? null : i)}
                      className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                    >
                      {playingIdx === i ? <Pause className="w-5 h-5 text-primary" /> : <Play className="w-5 h-5 text-primary" />}
                    </button>
                    <div>
                      <h4 className="font-display font-semibold text-foreground text-sm">{hymn.title}</h4>
                      <p className="text-muted-foreground text-xs font-body">{hymn.artist}</p>
                    </div>
                  </div>
                  <span className="text-muted-foreground text-xs font-body">{hymn.duration}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Media;
