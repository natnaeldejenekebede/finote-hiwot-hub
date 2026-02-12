import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/SectionHeading";
import { Clock, BarChart3 } from "lucide-react";
import { useTranslation } from "react-i18next";

const categories = ["All", "Dogma", "Canon", "Ethics"] as const;

const lessons = [
  { title: "The Holy Trinity in EOTC Theology", titleAm: "ቅድስት ሥላሴ በኢ.ኦ.ተ.ቤ ሥነ-መለኮት", category: "Dogma", level: "Intermediate", readTime: 15, desc: "Understanding the nature of the Triune God through the lens of Ethiopian patristic tradition.", descAm: "በኢትዮጵያ አባቶች ወግ አማካኝነት የሥላሴ እግዚአብሔርን ባሕርይ መረዳት።" },
  { title: "The Seven Sacraments", titleAm: "ሰባቱ ምሥጢራት", category: "Canon", level: "Beginner", readTime: 10, desc: "An overview of the seven holy sacraments as practiced in the Ethiopian Orthodox Tewahedo Church.", descAm: "በኢ.ኦ.ተ.ቤ ሰባቱ ቅዱሳት ምሥጢራት ላይ አጠቃላይ ዕይታ።" },
  { title: "Christian Ethics & Daily Living", titleAm: "ክርስቲያናዊ ሥነ-ምግባር እና ዕለታዊ ሕይወት", category: "Ethics", level: "Beginner", readTime: 8, desc: "Applying biblical morality to everyday decisions, relationships, and community life.", descAm: "መጽሐፍ ቅዱሳዊ ሥነ-ምግባርን ለዕለት ተዕለት ውሳኔዎች መተግበር።" },
  { title: "The Incarnation & Tewahedo Christology", titleAm: "ሥጋዌ እና የተዋሕዶ ክርስቶሎጂ", category: "Dogma", level: "Advanced", readTime: 20, desc: "The unique 'United Nature' (Tewahedo) Christological position of the EOTC.", descAm: "የኢ.ኦ.ተ.ቤ ልዩ 'ተዋሕዶ' ክርስቶሎጂያዊ አቋም።" },
  { title: "Fasting Traditions & Spiritual Discipline", titleAm: "የጾም ወጎች እና መንፈሳዊ ሥነ-ሥርዓት", category: "Canon", level: "Beginner", readTime: 12, desc: "The structure, purpose, and spiritual benefits of the EOTC's extensive fasting calendar.", descAm: "የኢ.ኦ.ተ.ቤ ሰፊ የጾም የቀን መቁጠሪያ ዓላማ እና መንፈሳዊ ጥቅሞች።" },
  { title: "Forgiveness & Reconciliation", titleAm: "ይቅርታ እና ዕርቅ", category: "Ethics", level: "Intermediate", readTime: 10, desc: "Biblical principles of conflict resolution, repentance, and restoring relationships.", descAm: "መጽሐፍ ቅዱሳዊ የግጭት አፈታት፣ ንስሐ እና ግንኙነቶችን ማደስ።" },
  { title: "The Book of Enoch in Ethiopian Canon", titleAm: "የሄኖክ መጽሐፍ በኢትዮጵያ ቀኖና", category: "Dogma", level: "Advanced", readTime: 18, desc: "Why the EOTC preserves the Book of Enoch and its theological significance.", descAm: "ኢ.ኦ.ተ.ቤ የሄኖክን መጽሐፍ ለምን ትጠብቃለች እና ሥነ-መለኮታዊ ጠቀሜታው።" },
  { title: "Marriage in the Ethiopian Church", titleAm: "ጋብቻ በኢትዮጵያ ቤተ ክርስቲያን", category: "Canon", level: "Intermediate", readTime: 14, desc: "The sacrament of marriage: preparation, ceremony, and spiritual commitment.", descAm: "የጋብቻ ምሥጢር፡ ዝግጅት፣ ሥርዓት እና መንፈሳዊ ቁርጠኝነት።" },
  { title: "Humility & Service", titleAm: "ትሕትና እና አገልግሎት", category: "Ethics", level: "Beginner", readTime: 7, desc: "Following Christ's example of servant leadership in church and community.", descAm: "በቤተ ክርስቲያንና ማኅበረሰብ ውስጥ የክርስቶስን የአገልጋይ አመራር ምሳሌ መከተል።" },
];

const categoryColors: Record<string, string> = {
  Dogma: "bg-secondary/10 text-secondary border-secondary/20",
  Canon: "bg-accent/10 text-accent border-accent/20",
  Ethics: "bg-primary/10 text-primary border-primary/20",
};

const levelIcons: Record<string, string> = { Beginner: "🌱", Intermediate: "📖", Advanced: "🎓" };

const Education = () => {
  const [filter, setFilter] = useState<string>("All");
  const { t, i18n } = useTranslation();
  const isAm = i18n.language === "am";

  const catLabels: Record<string, string> = {
    All: t("education.all"), Dogma: t("education.dogma"), Canon: t("education.canon"), Ethics: t("education.ethics"),
  };

  const filtered = filter === "All" ? lessons : lessons.filter((l) => l.category === filter);

  return (
    <Layout>
      <section className="py-20 ethiopian-pattern cross-watermark">
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeading title={t("education.title")} subtitle={t("education.subtitle")} />

          <div className="flex justify-center gap-2 mb-10 flex-wrap">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-body font-medium transition-all ${
                  filter === cat ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border hover:border-primary/30"
                }`}>
                {catLabels[cat]}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {filtered.map((lesson, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="bg-card rounded-lg border border-border p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-body font-semibold px-3 py-1 rounded-full border ${categoryColors[lesson.category]}`}>
                    {catLabels[lesson.category]}
                  </span>
                  <span className="text-lg">{levelIcons[lesson.level]}</span>
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {isAm ? lesson.titleAm : lesson.title}
                </h3>
                <p className="text-muted-foreground text-sm font-body mb-4 line-clamp-2">
                  {isAm ? lesson.descAm : lesson.desc}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground font-body">
                  <span className="flex items-center gap-1"><Clock size={12} /> {lesson.readTime} {t("education.min")}</span>
                  <span className="flex items-center gap-1"><BarChart3 size={12} /> {lesson.level}</span>
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
