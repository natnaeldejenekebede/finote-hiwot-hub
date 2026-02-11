import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/SectionHeading";
import { BookOpen, Clock, BarChart3, GraduationCap } from "lucide-react";

const categories = ["All", "Dogma", "Canon", "Ethics"] as const;

const lessons = [
  { title: "The Holy Trinity in EOTC Theology", category: "Dogma", level: "Intermediate", readTime: 15, desc: "Understanding the nature of the Triune God through the lens of Ethiopian patristic tradition." },
  { title: "The Seven Sacraments", category: "Canon", level: "Beginner", readTime: 10, desc: "An overview of the seven holy sacraments as practiced in the Ethiopian Orthodox Tewahedo Church." },
  { title: "Christian Ethics & Daily Living", category: "Ethics", level: "Beginner", readTime: 8, desc: "Applying biblical morality to everyday decisions, relationships, and community life." },
  { title: "The Incarnation & Tewahedo Christology", category: "Dogma", level: "Advanced", readTime: 20, desc: "The unique 'United Nature' (Tewahedo) Christological position of the EOTC." },
  { title: "Fasting Traditions & Spiritual Discipline", category: "Canon", level: "Beginner", readTime: 12, desc: "The structure, purpose, and spiritual benefits of the EOTC's extensive fasting calendar." },
  { title: "Forgiveness & Reconciliation", category: "Ethics", level: "Intermediate", readTime: 10, desc: "Biblical principles of conflict resolution, repentance, and restoring relationships." },
  { title: "The Book of Enoch in Ethiopian Canon", category: "Dogma", level: "Advanced", readTime: 18, desc: "Why the EOTC preserves the Book of Enoch and its theological significance." },
  { title: "Marriage in the Ethiopian Church", category: "Canon", level: "Intermediate", readTime: 14, desc: "The sacrament of marriage: preparation, ceremony, and spiritual commitment." },
  { title: "Humility & Service", category: "Ethics", level: "Beginner", readTime: 7, desc: "Following Christ's example of servant leadership in church and community." },
];

const categoryColors: Record<string, string> = {
  Dogma: "bg-secondary/10 text-secondary border-secondary/20",
  Canon: "bg-accent/10 text-accent border-accent/20",
  Ethics: "bg-primary/10 text-primary border-primary/20",
};

const levelIcons: Record<string, string> = {
  Beginner: "🌱",
  Intermediate: "📖",
  Advanced: "🎓",
};

import { useState } from "react";

const Education = () => {
  const [filter, setFilter] = useState<string>("All");

  const filtered = filter === "All" ? lessons : lessons.filter((l) => l.category === filter);

  return (
    <Layout>
      <section className="py-20 ethiopian-pattern cross-watermark">
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeading
            title="Education Hub"
            subtitle="ትምህርት — Grow in knowledge of Dogma, Canon, and Ethics"
          />

          {/* Category filter */}
          <div className="flex justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-body font-medium transition-all ${
                  filter === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground border border-border hover:border-primary/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Lesson grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {filtered.map((lesson, i) => (
              <motion.div
                key={lesson.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-card rounded-lg border border-border p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-body font-semibold px-3 py-1 rounded-full border ${categoryColors[lesson.category]}`}>
                    {lesson.category}
                  </span>
                  <span className="text-lg">{levelIcons[lesson.level]}</span>
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {lesson.title}
                </h3>
                <p className="text-muted-foreground text-sm font-body mb-4 line-clamp-2">{lesson.desc}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground font-body">
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {lesson.readTime} min
                  </span>
                  <span className="flex items-center gap-1">
                    <BarChart3 size={12} /> {lesson.level}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Education;
