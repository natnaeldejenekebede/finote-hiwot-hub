import { useMemo } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/SectionHeading";
import EthiopianCross from "@/components/EthiopianCross";
import { useTranslation } from "react-i18next";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const fastingSeasons = [
  { nameKey: "greatLent", name: "Great Lent / ዐቢይ ጾም", start: new Date("2026-02-23"), end: new Date("2026-04-12"), days: 55,
    description: "The longest and most important fasting period, commemorating Christ's 40-day fast and the Passion Week.",
    descAm: "ረዥሙና ዋነኛው የጾም ወቅት፣ የክርስቶስን 40 ቀን ጾም እና የስቅለት ሳምንትን የሚያስታውስ።",
    scripture: "\"Man shall not live by bread alone, but by every word that proceeds from the mouth of God.\" — Matthew 4:4",
    scriptureAm: "\"ሰው በእንጀራ ብቻ አይኖርም፤ ከእግዚአብሔር አፍ በሚወጣ ቃል ሁሉ እንጂ።\" — ማቴ 4:4",
    significance: "A period of deep repentance, prayer, and spiritual renewal.",
    sigAm: "ጥልቅ ንስሐ፣ ጸሎት እና መንፈሳዊ ታደስ ወቅት።",
    color: "from-secondary/20 to-secondary/5", borderColor: "border-secondary/30" },
  { nameKey: "apostlesFast", name: "Apostles' Fast / ጾመ ሐዋርያት", start: new Date("2026-06-01"), end: new Date("2026-07-12"), days: 41,
    description: "Commemorating the fasting of the Holy Apostles after receiving the Holy Spirit at Pentecost.",
    descAm: "ቅዱሳን ሐዋርያት መንፈስ ቅዱስን ከተቀበሉ በኋላ ያደረጉትን ጾም ማስታወስ።",
    scripture: "\"Then the disciples went out and preached everywhere.\" — Mark 16:20",
    scriptureAm: "\"ደቀ መዛሙርቱም ወጥተው በሁሉ ስፍራ ሰበኩ።\" — ማር 16:20",
    significance: "Honoring the apostles who spread the Gospel.",
    sigAm: "ወንጌልን ያሰራጩትን ሐዋርያት ማክበር።",
    color: "from-accent/20 to-accent/5", borderColor: "border-accent/30" },
  { nameKey: "assumptionFast", name: "Fast of the Assumption / ጾመ ፍልሰታ", start: new Date("2026-08-07"), end: new Date("2026-08-22"), days: 15,
    description: "Commemorating the Assumption of the Virgin Mary.",
    descAm: "የድንግል ማርያም ዕርገትን የሚያስታውስ ጾም።",
    scripture: "\"My soul magnifies the Lord.\" — Luke 1:46-47",
    scriptureAm: "\"ነፍሴ ጌታን ታከብራለች።\" — ሉቃ 1:46-47",
    significance: "Special prayers and hymns dedicated to the Blessed Virgin Mary.",
    sigAm: "ለብፅዕት ድንግል ማርያም የተሰጡ ልዩ ጸሎቶች እና መዝሙሮች።",
    color: "from-primary/20 to-primary/5", borderColor: "border-primary/30" },
  { nameKey: "advent", name: "Advent / ጾመ ገና", start: new Date("2025-11-15"), end: new Date("2026-01-07"), days: 43,
    description: "Preparing for the Nativity of Our Lord Jesus Christ.",
    descAm: "ለጌታችን ኢየሱስ ክርስቶስ ልደት መዘጋጀት።",
    scripture: "\"For unto you is born this day a Savior.\" — Luke 2:11",
    scriptureAm: "\"ዛሬ መድኃኒት ተወልዶላችኋልና።\" — ሉቃ 2:11",
    significance: "Joyful anticipation of Christmas.",
    sigAm: "የገና ደስታዊ ጥበቃ።",
    color: "from-gold-glow/20 to-primary/5", borderColor: "border-primary/30" },
  { nameKey: "ninevehFast", name: "Nineveh Fast / ጾመ ነነዌ", start: new Date("2026-02-09"), end: new Date("2026-02-11"), days: 3,
    description: "Three-day fast commemorating the repentance of the people of Nineveh.",
    descAm: "የነነዌ ሕዝቦች ንስሐ ለማስታወስ የ3 ቀናት ጾም።",
    scripture: "\"The people of Nineveh believed God, proclaimed a fast.\" — Jonah 3:5",
    scriptureAm: "\"የነነዌ ሕዝቦች እግዚአብሔርን አመኑ፣ ጾምም አወጁ።\" — ዮናስ 3:5",
    significance: "A reminder of God's mercy toward those who repent.",
    sigAm: "ለንስሐ ገቢዎች የእግዚአብሔር ምሕረት ማስታወሻ።",
    color: "from-muted to-muted/50", borderColor: "border-muted-foreground/20" },
];

const feasts = [
  { name: "Meskel", nameAm: "መስቀል", date: new Date("2026-09-27") },
  { name: "Ledet (Christmas)", nameAm: "ልደት", date: new Date("2027-01-07") },
  { name: "Timket (Epiphany)", nameAm: "ጥምቀት", date: new Date("2027-01-19") },
];

function getCurrentFasting(now: Date) { return fastingSeasons.find((s) => now >= s.start && now <= s.end); }
function getNextFasting(now: Date) {
  const upcoming = fastingSeasons.filter((s) => s.start > now).sort((a, b) => a.start.getTime() - b.start.getTime());
  return upcoming[0] || fastingSeasons[0];
}
function getDaysRemaining(now: Date, end: Date) { return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))); }
function getDaysUntil(now: Date, start: Date) { return Math.max(0, Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))); }
function isWedOrFri(now: Date) { const day = now.getDay(); return day === 3 || day === 5; }

const FastingDashboard = () => {
  const now = new Date();
  const current = useMemo(() => getCurrentFasting(now), []);
  const next = useMemo(() => getNextFasting(now), []);
  const isFastDay = isWedOrFri(now);
  const { t, i18n } = useTranslation();
  const isAm = i18n.language === "am";

  return (
    <Layout>
      <section className="py-20 ethiopian-pattern cross-watermark">
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeading title={t("fasting.title")} subtitle={t("fasting.subtitle")} />

          {/* Wed/Fri indicator */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto mb-6">
            <div className={`rounded-lg border p-4 flex items-center gap-3 ${isFastDay ? "bg-secondary/10 border-secondary/30" : "bg-card border-border"}`}>
              {isFastDay ? <AlertCircle className="w-5 h-5 text-secondary flex-shrink-0" /> : <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />}
              <div>
                <p className="font-display font-semibold text-foreground text-sm">{t("fasting.wedFriTitle")}</p>
                <p className="text-muted-foreground text-xs font-body">
                  {isFastDay ? t("fasting.todayIsFastDay") : t("fasting.todayIsNotFastDay")}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Current status */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto mb-12">
            {current ? (
              <div className={`bg-gradient-to-r ${current.color} rounded-xl border ${current.borderColor} p-8`}>
                <div className="flex items-center gap-3 mb-4">
                  <EthiopianCross className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-xs font-body text-primary font-semibold uppercase tracking-wide">{t("fasting.currentlyFasting")}</p>
                    <h3 className="font-display text-2xl font-bold text-foreground">{isAm ? t(`fasting.${current.nameKey}`) : current.name}</h3>
                  </div>
                </div>
                <p className="text-muted-foreground font-body mb-4">{isAm ? current.descAm : current.description}</p>
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-body text-muted-foreground mb-1">
                    <span>{t("fasting.day")} {current.days - getDaysRemaining(now, current.end)} {t("fasting.of")} {current.days}</span>
                    <span>{getDaysRemaining(now, current.end)} {t("fasting.remaining")}</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${((current.days - getDaysRemaining(now, current.end)) / current.days) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }} className="h-full gradient-gold rounded-full" />
                  </div>
                </div>
                <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-border">
                  <p className="text-xs font-body text-primary font-semibold mb-1">{t("fasting.dailyScripture")}</p>
                  <p className="font-display text-foreground italic text-sm">{isAm ? current.scriptureAm : current.scripture}</p>
                </div>
                <div className="mt-4 bg-card/50 rounded-lg p-4 border border-border">
                  <p className="text-xs font-body text-primary font-semibold mb-1">{t("fasting.significance")}</p>
                  <p className="text-muted-foreground text-sm font-body">{isAm ? current.sigAm : current.significance}</p>
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-border p-8 text-center">
                <EthiopianCross className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold text-foreground mb-2">{t("fasting.noActiveFast")}</h3>
                <p className="text-muted-foreground font-body mb-4">
                  {t("fasting.nextFast")} <strong className="text-primary">{isAm ? t(`fasting.${next?.nameKey}`) : next?.name}</strong>{" "}
                  {t("fasting.inDays")} <strong>{getDaysUntil(now, next?.start || now)}</strong> {t("fasting.daysWord")}
                </p>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="font-display text-foreground italic text-sm">{isAm ? next?.scriptureAm : next?.scripture}</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Feast countdowns */}
          <div className="max-w-3xl mx-auto mb-12">
            <h3 className="font-display text-2xl font-bold text-foreground mb-6 text-center">{t("fasting.countdownTitle")}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {feasts.map((feast, i) => {
                const daysUntil = getDaysUntil(now, feast.date);
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="bg-card rounded-xl border border-border p-6 text-center">
                    <EthiopianCross className="w-6 h-6 text-primary mx-auto mb-2" />
                    <h4 className="font-display font-semibold text-foreground mb-1">{isAm ? feast.nameAm : feast.name}</h4>
                    <p className="text-3xl font-display font-bold text-primary">{daysUntil}</p>
                    <p className="text-xs text-muted-foreground font-body">{t("fasting.daysWord")}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* All seasons */}
          <div className="max-w-3xl mx-auto">
            <h3 className="font-display text-2xl font-bold text-foreground mb-6 text-center">{t("fasting.allSeasons")}</h3>
            <div className="space-y-4">
              {fastingSeasons.map((season, i) => {
                const isActive = current?.nameKey === season.nameKey;
                return (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    className={`bg-gradient-to-r ${season.color} rounded-lg border ${season.borderColor} p-6 ${isActive ? "ring-2 ring-primary" : ""}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-display font-semibold text-foreground flex items-center gap-2">
                          {isActive && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                          {isAm ? t(`fasting.${season.nameKey}`) : season.name}
                        </h4>
                        <p className="text-xs font-body text-muted-foreground mt-1">
                          {season.start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} –{" "}
                          {season.end.toLocaleDateString("en-US", { month: "short", day: "numeric" })} • {season.days} {t("home.days")}
                        </p>
                      </div>
                      {isActive && <span className="text-xs font-body text-primary font-semibold bg-primary/10 px-3 py-1 rounded-full">{t("fasting.activeNow")}</span>}
                    </div>
                    <p className="text-muted-foreground text-sm font-body mt-2">{isAm ? season.descAm : season.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FastingDashboard;
