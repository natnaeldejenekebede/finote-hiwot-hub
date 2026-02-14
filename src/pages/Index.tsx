import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, BookOpen, Users, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/SectionHeading";
import EthiopianCross from "@/components/EthiopianCross";
import heroBg from "@/assets/hero-bg.jpg";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";

const fallbackVerses = [
  { verse: "\"I am the way, the truth, and the life.\"", verseAm: "\"መንገዱና እውነቱና ሕይወቱ እኔ ነኝ።\"", ref: "John 14:6", refAm: "ዮሐ 14:6" },
  { verse: "\"The Lord is my shepherd, I lack nothing.\"", verseAm: "\"እግዚአብሔር እረኛዬ ነው፤ የሚያሳጣኝ የለም።\"", ref: "Psalm 23:1", refAm: "መዝ 23:1" },
];

const upcomingFeasts = [
  { name: "Feast of St. Gabriel", nameAm: "የቅዱስ ገብርኤል በዓል", date: new Date("2026-03-28") },
  { name: "Meskel", nameAm: "መስቀል", date: new Date("2026-09-27") },
  { name: "Ledet (Christmas)", nameAm: "ልደት", date: new Date("2027-01-07") },
  { name: "Timket (Epiphany)", nameAm: "ጥምቀት", date: new Date("2027-01-19") },
];

function getNextFeast() {
  const now = new Date();
  return upcomingFeasts.find(f => f.date > now) || upcomingFeasts[0];
}

function getCountdown(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0 };
  return { days: Math.floor(diff / (1000 * 60 * 60 * 24)), hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) };
}

const Index = () => {
  const { t, i18n } = useTranslation();
  const isAm = i18n.language === "am";
  const feast = getNextFeast();
  const countdown = getCountdown(feast.date);

  const [wisdom, setWisdom] = useState({ verse: "", ref: "" });

  useEffect(() => {
    const fetchWisdom = async () => {
      const { data } = await supabase.from("daily_wisdom").select("*").limit(1);
      if (data && data[0]) {
        setWisdom({
          verse: isAm ? data[0].verse_am : data[0].verse_en,
          ref: isAm ? data[0].reference_am : data[0].reference_en,
        });
      } else {
        const fb = fallbackVerses[0];
        setWisdom({ verse: isAm ? fb.verseAm : fb.verse, ref: isAm ? fb.refAm : fb.ref });
      }
    };
    fetchWisdom();
  }, [isAm]);

  const features = [
    { icon: BookOpen, title: t("home.spiritualEd"), desc: t("home.spiritualEdDesc"), link: "/about" },
    { icon: Calendar, title: t("home.eventsCalendar"), desc: t("home.eventsCalendarDesc"), link: "/events" },
    { icon: Users, title: t("home.fellowship"), desc: t("home.fellowshipDesc"), link: "/join" },
    { icon: Heart, title: t("home.supportMission"), desc: t("home.supportMissionDesc"), link: "/give" },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-foreground/80" />
        <div className="absolute inset-0 ethiopian-pattern opacity-30" />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-3xl">
          <EthiopianCross className="w-12 h-12 text-gold mx-auto mb-6" />
          <h1 className="font-display text-5xl md:text-7xl font-bold text-primary-foreground mb-2">{t("home.schoolName")}</h1>
          <p className="font-display text-xl md:text-2xl text-gold-glow mb-2">{t("home.schoolSubtitle")}</p>
          <p className="text-primary-foreground/70 text-sm font-body mb-8">{t("home.cathedral")}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link to="/join"><Button variant="hero" size="lg">{t("home.becomeMember")}</Button></Link>
            <Link to="/about"><Button variant="hero-outline" size="lg">{t("home.learnMore")}</Button></Link>
          </div>

          {wisdom.verse && (
            <div className="bg-foreground/30 backdrop-blur-sm rounded-lg p-6 border border-primary-foreground/10 max-w-xl mx-auto">
              <p className="font-display text-primary-foreground/90 italic text-lg mb-2">{wisdom.verse}</p>
              <p className="text-gold text-sm font-body font-semibold">— {wisdom.ref}</p>
            </div>
          )}
        </motion.div>
      </section>

      {/* Countdown */}
      <section className="gradient-burgundy py-6">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <EthiopianCross className="w-5 h-5 text-gold" />
          <p className="text-secondary-foreground font-body text-sm">
            <span className="font-semibold text-gold">{isAm ? feast.nameAm : feast.name}</span>{" "}
            {t("home.feastIn")}{" "}
            <span className="font-bold text-lg text-secondary-foreground">{countdown.days}</span> {t("home.days")},{" "}
            <span className="font-bold text-lg text-secondary-foreground">{countdown.hours}</span> {t("home.hours")}
          </p>
          <EthiopianCross className="w-5 h-5 text-gold hidden sm:block" />
        </div>
      </section>

      {/* Daily Wisdom */}
      <section className="py-12 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
              <h2 className="font-display text-2xl font-bold text-foreground">{t("home.dailyWisdom")}</h2>
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <p className="text-muted-foreground font-body text-sm mb-4">{t("home.dailyWisdomSubtitle")}</p>
            {wisdom.verse && (
              <div className="bg-card rounded-xl border border-border p-8">
                <p className="font-display text-foreground italic text-xl leading-relaxed mb-3">{wisdom.verse}</p>
                <p className="text-primary text-sm font-body font-semibold">— {wisdom.ref}</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 ethiopian-pattern">
        <div className="container mx-auto px-4">
          <SectionHeading title={t("home.pillarsTitle")} subtitle={t("home.pillarsSubtitle")} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link to={f.link}
                  className="block bg-card rounded-lg p-6 border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 group h-full">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <f.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2 text-foreground">{f.title}</h3>
                  <p className="text-muted-foreground text-sm font-body">{f.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 gradient-gold text-center">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-primary-foreground mb-4">{t("home.ctaTitle")}</h2>
          <p className="text-primary-foreground/80 font-body mb-8 max-w-lg mx-auto">{t("home.ctaDesc")}</p>
          <Link to="/join"><Button variant="hero-outline" size="lg">{t("home.registerNow")}</Button></Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
