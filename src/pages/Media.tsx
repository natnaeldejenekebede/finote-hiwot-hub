import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/SectionHeading";
import { Image, Music } from "lucide-react";

const galleryItems = [
  { title: "Sunday Service", desc: "Weekly liturgy at Debre Mihret" },
  { title: "Baptism Ceremony", desc: "Sacrament of holy baptism" },
  { title: "Timket Festival", desc: "Epiphany celebration" },
  { title: "Choir Performance", desc: "Youth choir during Easter" },
  { title: "Bible Study Group", desc: "Saturday class session" },
  { title: "Annual Conference", desc: "Youth spiritual retreat" },
];

const hymns = [
  { title: "ወረደ እግዚአብሔር", artist: "Sunday School Choir", duration: "4:32" },
  { title: "ማርያም ድንግል", artist: "Sunday School Choir", duration: "5:15" },
  { title: "ቅዱስ ቅዱስ ቅዱስ", artist: "Sunday School Choir", duration: "3:48" },
  { title: "እግዚአብሔር ረዳቴ", artist: "Sunday School Choir", duration: "6:01" },
];

const Media = () => (
  <Layout>
    <section className="py-20 ethiopian-pattern">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Media Center"
          subtitle="Photos from services and hymns from our choir"
        />

        {/* Gallery */}
        <div className="mb-16">
          <h3 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Image className="w-6 h-6 text-primary" /> Photo Gallery
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryItems.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group relative aspect-[4/3] bg-gradient-to-br from-secondary/20 to-primary/10 rounded-lg border border-border overflow-hidden cursor-pointer hover:border-primary/30 transition-all"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image className="w-10 h-10 text-muted-foreground/30" />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/80 to-transparent p-4">
                  <h4 className="font-display font-semibold text-primary-foreground text-sm">{item.title}</h4>
                  <p className="text-primary-foreground/70 text-xs font-body">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Hymns */}
        <div>
          <h3 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Music className="w-6 h-6 text-primary" /> Hymns / መዝሙራት
          </h3>
          <div className="space-y-3 max-w-2xl">
            {hymns.map((hymn, i) => (
              <motion.div
                key={hymn.title}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center justify-between bg-card rounded-lg border border-border p-4 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Music className="w-5 h-5 text-primary" />
                  </div>
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

export default Media;
