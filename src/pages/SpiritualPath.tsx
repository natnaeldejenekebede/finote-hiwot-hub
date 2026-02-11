import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/SectionHeading";
import EthiopianCross from "@/components/EthiopianCross";

const stages = [
  {
    id: 1,
    title: "Newcomer",
    amharic: "አዲስ መጤ",
    color: "from-muted to-muted/50",
    borderColor: "border-muted-foreground/30",
    icon: "🌱",
    description: "Begin your journey in the Ethiopian Orthodox faith. Learn the basics of prayer, fasting, and worship.",
    curriculum: [
      "Introduction to EOTC History",
      "Basic Prayers (Abune Zesemayat, Wengel)",
      "The Sign of the Cross",
      "Introduction to Fasting Traditions",
      "Church Etiquette & Worship",
    ],
    duration: "3 months",
  },
  {
    id: 2,
    title: "Learner",
    amharic: "ተማሪ",
    color: "from-accent/20 to-accent/10",
    borderColor: "border-accent/40",
    icon: "📖",
    description: "Deepen your understanding of Dogma, Canon, and Ethics — the three pillars of EOTC teaching.",
    curriculum: [
      "Dogma: The Holy Trinity & Incarnation",
      "Canon: Church Law & Sacraments",
      "Ethics: Christian Moral Living",
      "Old & New Testament Survey",
      "Lives of the Saints (Synaxarium)",
    ],
    duration: "6 months",
  },
  {
    id: 3,
    title: "Disciple",
    amharic: "ደቀ መዝሙር",
    color: "from-primary/20 to-primary/10",
    borderColor: "border-primary/40",
    icon: "✝️",
    description: "Apply your knowledge through active participation in church life and community service.",
    curriculum: [
      "Advanced Patristic Theology",
      "Liturgical Calendar & Feasts",
      "Ge'ez Language Basics",
      "Church Music (Zema) Introduction",
      "Teaching Assistant Role",
    ],
    duration: "1 year",
  },
  {
    id: 4,
    title: "Teacher",
    amharic: "መምህር",
    color: "from-secondary/20 to-secondary/10",
    borderColor: "border-secondary/40",
    icon: "🕯️",
    description: "Lead and teach others. Guide the next generation of believers in their spiritual growth.",
    curriculum: [
      "Pedagogy & Teaching Methods",
      "Advanced Ge'ez & Liturgical Texts",
      "Apologetics & Defense of Faith",
      "Youth Ministry Leadership",
      "Conflict Resolution & Pastoral Care",
    ],
    duration: "2 years",
  },
  {
    id: 5,
    title: "Servant",
    amharic: "አገልጋይ",
    color: "from-primary/30 to-gold-glow/20",
    borderColor: "border-primary",
    icon: "👑",
    description: "The highest calling — devoted service to God and His Church. A life of prayer, teaching, and humble leadership.",
    curriculum: [
      "Advanced Church Administration",
      "Spiritual Counseling",
      "Interfaith Dialogue",
      "Mission & Evangelism",
      "Lifelong Devotion & Mentorship",
    ],
    duration: "Ongoing",
  },
];

const SpiritualPath = () => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <Layout>
      <section className="py-20 ethiopian-pattern cross-watermark">
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeading
            title="The Spiritual Path"
            subtitle="መንፈሳዊ ጉዞ — From Newcomer to Servant of God"
          />

          {/* SVG Roadmap */}
          <div className="max-w-4xl mx-auto">
            {/* Vertical timeline */}
            <div className="relative">
              {/* Connecting line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-muted via-primary to-primary/80 hidden md:block" />

              {stages.map((stage, i) => (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="mb-8 md:ml-20 relative"
                >
                  {/* Timeline node */}
                  <div className="absolute -left-[4.5rem] top-4 hidden md:flex">
                    <button
                      onClick={() => setSelected(selected === stage.id ? null : stage.id)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all duration-300 hover:scale-110 ${
                        selected === stage.id
                          ? "bg-primary border-primary text-primary-foreground shadow-lg animate-glow-pulse"
                          : `bg-card ${stage.borderColor}`
                      }`}
                    >
                      {stage.icon}
                    </button>
                  </div>

                  <button
                    onClick={() => setSelected(selected === stage.id ? null : stage.id)}
                    className={`w-full text-left bg-gradient-to-r ${stage.color} rounded-xl border ${stage.borderColor} p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      selected === stage.id ? "ring-2 ring-primary shadow-lg" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl md:hidden">{stage.icon}</span>
                        <div>
                          <h3 className="font-display text-xl font-bold text-foreground">
                            Stage {stage.id}: {stage.title}
                          </h3>
                          <p className="font-ethiopic text-sm text-primary">{stage.amharic}</p>
                        </div>
                      </div>
                      <span className="text-xs font-body text-muted-foreground bg-card px-3 py-1 rounded-full">
                        {stage.duration}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm font-body">{stage.description}</p>
                  </button>

                  {/* Expanded curriculum */}
                  <AnimatePresence>
                    {selected === stage.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 bg-card rounded-lg border border-border p-6">
                          <h4 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                            <EthiopianCross className="w-4 h-4 text-primary" />
                            Curriculum Requirements
                          </h4>
                          <ul className="space-y-2">
                            {stage.curriculum.map((item) => (
                              <li key={item} className="flex items-start gap-3 text-sm font-body text-muted-foreground">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SpiritualPath;
