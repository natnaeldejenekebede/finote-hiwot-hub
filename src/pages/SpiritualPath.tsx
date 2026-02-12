import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/SectionHeading";
import EthiopianCross from "@/components/EthiopianCross";
import { useTranslation } from "react-i18next";

const stages = [
  { id: 1, titleKey: "newcomer", amharic: "አዲስ መጤ", color: "from-muted to-muted/50", borderColor: "border-muted-foreground/30", icon: "🌱",
    description: "Begin your journey in the Ethiopian Orthodox faith. Learn the basics of prayer, fasting, and worship.",
    descAm: "በኢትዮጵያ ኦርቶዶክስ እምነት ጉዞዎን ይጀምሩ። የጸሎት፣ የጾም እና የአምልኮ መሠረቶችን ይማሩ።",
    curriculum: ["Introduction to EOTC History", "Basic Prayers (Abune Zesemayat, Wengel)", "The Sign of the Cross", "Introduction to Fasting Traditions", "Church Etiquette & Worship"],
    curriculumAm: ["የኢ.ኦ.ተ.ቤ ታሪክ መግቢያ", "መሠረታዊ ጸሎቶች (አቡነ ዘሰማያት፣ ወንጌል)", "የመስቀል ምልክት", "የጾም ወጎች መግቢያ", "የቤተ ክርስቲያን ሥርዓትና አምልኮ"],
    duration: "3 months", durationAm: "3 ወራት" },
  { id: 2, titleKey: "learner", amharic: "ተማሪ", color: "from-accent/20 to-accent/10", borderColor: "border-accent/40", icon: "📖",
    description: "Deepen your understanding of Dogma, Canon, and Ethics — the three pillars of EOTC teaching.",
    descAm: "ዶግማ፣ ቀኖና እና ሥነ-ምግባር — የኢ.ኦ.ተ.ቤ ትምህርት ሦስት ምሰሶዎች ግንዛቤዎን ያሳድጉ።",
    curriculum: ["Dogma: The Holy Trinity & Incarnation", "Canon: Church Law & Sacraments", "Ethics: Christian Moral Living", "Old & New Testament Survey", "Lives of the Saints (Synaxarium)"],
    curriculumAm: ["ዶግማ፡ ቅድስት ሥላሴ እና ሥጋዌ", "ቀኖና፡ ሕገ ቤተ ክርስቲያን እና ምሥጢራት", "ሥነ-ምግባር፡ ክርስቲያናዊ ሕይወት", "ብሉይ እና አዲስ ኪዳን ፍተሻ", "ስንክሳር"],
    duration: "6 months", durationAm: "6 ወራት" },
  { id: 3, titleKey: "disciple", amharic: "ደቀ መዝሙር", color: "from-primary/20 to-primary/10", borderColor: "border-primary/40", icon: "✝️",
    description: "Apply your knowledge through active participation in church life and community service.",
    descAm: "በቤተ ክርስቲያን ሕይወት እና ማኅበረሰብ አገልግሎት ንቁ ተሳትፎ አማካኝነት ዕውቀትዎን ተግብሩ።",
    curriculum: ["Advanced Patristic Theology", "Liturgical Calendar & Feasts", "Ge'ez Language Basics", "Church Music (Zema) Introduction", "Teaching Assistant Role"],
    curriculumAm: ["የላቀ የአባቶች ሥነ-መለኮት", "የቅዳሴ የቀን መቁጠሪያ እና በዓላት", "የግዕዝ ቋንቋ መሠረታዊ", "የቤተ ክርስቲያን ሙዚቃ (ዜማ) መግቢያ", "የመምህር ረዳት ሚና"],
    duration: "1 year", durationAm: "1 ዓመት" },
  { id: 4, titleKey: "teacher", amharic: "መምህር", color: "from-secondary/20 to-secondary/10", borderColor: "border-secondary/40", icon: "🕯️",
    description: "Lead and teach others. Guide the next generation of believers in their spiritual growth.",
    descAm: "ሌሎችን ይምሩ እና ያስተምሩ። ቀጣዩን ትውልድ አማኞች በመንፈሳዊ ዕድገታቸው ይምሩ።",
    curriculum: ["Pedagogy & Teaching Methods", "Advanced Ge'ez & Liturgical Texts", "Apologetics & Defense of Faith", "Youth Ministry Leadership", "Conflict Resolution & Pastoral Care"],
    curriculumAm: ["የማስተማር ዘዴዎች", "የላቀ ግዕዝ እና የቅዳሴ ጽሑፎች", "ሃይማኖት ተከላካይነት", "የወጣቶች አገልግሎት አመራር", "የግጭት አፈታት"],
    duration: "2 years", durationAm: "2 ዓመታት" },
  { id: 5, titleKey: "servant", amharic: "አገልጋይ", color: "from-primary/30 to-gold-glow/20", borderColor: "border-primary", icon: "👑",
    description: "The highest calling — devoted service to God and His Church.",
    descAm: "ከፍተኛው ጥሪ — ለእግዚአብሔርና ለቤተ ክርስቲያኑ የተሰጠ አገልግሎት።",
    curriculum: ["Advanced Church Administration", "Spiritual Counseling", "Interfaith Dialogue", "Mission & Evangelism", "Lifelong Devotion & Mentorship"],
    curriculumAm: ["የላቀ የቤተ ክርስቲያን አስተዳደር", "መንፈሳዊ ምክር", "የሃይማኖቶች ውይይት", "ተልዕኮ እና ወንጌል ስርጭት", "የሕይወት ዘመን ትጋት"],
    duration: "Ongoing", durationAm: "ቀጣይ" },
];

const SpiritualPath = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const { t, i18n } = useTranslation();
  const isAm = i18n.language === "am";

  return (
    <Layout>
      <section className="py-20 ethiopian-pattern cross-watermark">
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeading title={t("path.title")} subtitle={t("path.subtitle")} />
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-muted via-primary to-primary/80 hidden md:block" />
              {stages.map((stage, i) => (
                <motion.div key={stage.id} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="mb-8 md:ml-20 relative">
                  <div className="absolute -left-[4.5rem] top-4 hidden md:flex">
                    <button onClick={() => setSelected(selected === stage.id ? null : stage.id)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all duration-300 hover:scale-110 ${
                        selected === stage.id ? "bg-primary border-primary text-primary-foreground shadow-lg animate-glow-pulse" : `bg-card ${stage.borderColor}`
                      }`}>{stage.icon}</button>
                  </div>
                  <button onClick={() => setSelected(selected === stage.id ? null : stage.id)}
                    className={`w-full text-left bg-gradient-to-r ${stage.color} rounded-xl border ${stage.borderColor} p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      selected === stage.id ? "ring-2 ring-primary shadow-lg" : ""
                    }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl md:hidden">{stage.icon}</span>
                        <div>
                          <h3 className="font-display text-xl font-bold text-foreground">
                            {t("path.stage")} {stage.id}: {t(`path.${stage.titleKey}`)}
                          </h3>
                          <p className="font-ethiopic text-sm text-primary">{stage.amharic}</p>
                        </div>
                      </div>
                      <span className="text-xs font-body text-muted-foreground bg-card px-3 py-1 rounded-full">
                        {isAm ? stage.durationAm : stage.duration}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm font-body">{isAm ? stage.descAm : stage.description}</p>
                  </button>
                  <AnimatePresence>
                    {selected === stage.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="mt-3 bg-card rounded-lg border border-border p-6">
                          <h4 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                            <EthiopianCross className="w-4 h-4 text-primary" /> {t("path.curriculumTitle")}
                          </h4>
                          <ul className="space-y-2">
                            {(isAm ? stage.curriculumAm : stage.curriculum).map((item) => (
                              <li key={item} className="flex items-start gap-3 text-sm font-body text-muted-foreground">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" /> {item}
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
