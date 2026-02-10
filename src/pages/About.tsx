import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/SectionHeading";
import { BookOpen, Users, Target } from "lucide-react";

const values = [
  { icon: BookOpen, title: "Doctrine & Tradition", text: "Preserving the Apostolic faith of the Ethiopian Orthodox Tewahedo Church through structured Bible study and patristic teachings." },
  { icon: Users, title: "Community & Fellowship", text: "Fostering unity among youth and members through worship, service, and shared spiritual growth." },
  { icon: Target, title: "Mission & Service", text: "Equipping the next generation to serve the Church and community with knowledge, compassion, and devotion." },
];

const About = () => (
  <Layout>
    <section className="py-20 ethiopian-pattern">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="About Finote Hiwot"
          subtitle="The Path of Life — ፍኖተ ሕይወት"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-card rounded-lg border border-border p-8 mb-12">
            <h3 className="font-display text-2xl font-bold text-foreground mb-4">Our History</h3>
            <p className="text-muted-foreground font-body leading-relaxed mb-4">
              Finote Hiwot Sunday School was established at Hossana Debre Mihret Cathedral to nurture the spiritual development of the youth in the Ethiopian Orthodox Tewahedo tradition. Named after the biblical concept of "The Path of Life," our school has grown into a vibrant center of faith education.
            </p>
            <p className="text-muted-foreground font-body leading-relaxed">
              Through structured programs in Dogma, Canon Law, and Christian Ethics, we equip young believers with the knowledge and spiritual foundation to live a life rooted in Christ. Our teachers are devoted church scholars and deacons who carry forward centuries of sacred tradition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-card rounded-lg border border-border p-6 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-display font-semibold text-foreground mb-2">{v.title}</h4>
                <p className="text-muted-foreground text-sm font-body">{v.text}</p>
              </motion.div>
            ))}
          </div>

          <div className="bg-secondary/10 rounded-lg border border-secondary/20 p-8">
            <h3 className="font-display text-2xl font-bold text-foreground mb-4">Organizational Structure</h3>
            <div className="space-y-3 font-body text-sm text-muted-foreground">
              {[
                "Head — ሰብሳቢ (Chairperson)",
                "Vice Head — ምክትል ሰብሳቢ",
                "Education Department — የትምህርት ክፍል",
                "Choir & Hymn Department — የመዝሙር ክፍል",
                "Service Department — የአገልግሎት ክፍል",
                "Finance Department — የገንዘብ ክፍል",
              ].map((role) => (
                <div key={role} className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  <span>{role}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  </Layout>
);

export default About;
