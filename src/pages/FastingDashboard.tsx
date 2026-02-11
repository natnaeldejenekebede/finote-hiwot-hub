import { useMemo } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/SectionHeading";
import EthiopianCross from "@/components/EthiopianCross";

// EOTC Fasting Seasons (simplified for demo with 2026 approximate dates)
const fastingSeasons = [
  {
    name: "Great Lent / ዐቢይ ጾም",
    start: new Date("2026-02-23"),
    end: new Date("2026-04-12"),
    days: 55,
    description: "The longest and most important fasting period, commemorating Christ's 40-day fast and the Passion Week.",
    scripture: "\"Man shall not live by bread alone, but by every word that proceeds from the mouth of God.\" — Matthew 4:4",
    significance: "A period of deep repentance, prayer, and spiritual renewal. All animal products are avoided. Extra prayers and prostrations are added to daily worship.",
    color: "from-secondary/20 to-secondary/5",
    borderColor: "border-secondary/30",
  },
  {
    name: "Apostles' Fast / ጾመ ሐዋርያት",
    start: new Date("2026-06-01"),
    end: new Date("2026-07-12"),
    days: 41,
    description: "Commemorating the fasting of the Holy Apostles after receiving the Holy Spirit at Pentecost.",
    scripture: "\"Then the disciples went out and preached everywhere.\" — Mark 16:20",
    significance: "Honoring the apostles who spread the Gospel. A time to renew commitment to evangelism and service.",
    color: "from-accent/20 to-accent/5",
    borderColor: "border-accent/30",
  },
  {
    name: "Fast of the Assumption / ጾመ ፍልሰታ",
    start: new Date("2026-08-07"),
    end: new Date("2026-08-22"),
    days: 15,
    description: "Commemorating the Assumption of the Virgin Mary. A period of deep devotion to the Theotokos.",
    scripture: "\"My soul magnifies the Lord, and my spirit rejoices in God my Savior.\" — Luke 1:46-47",
    significance: "Special prayers and hymns (Mezmur) dedicated to the Blessed Virgin Mary. Daily services held at dawn.",
    color: "from-primary/20 to-primary/5",
    borderColor: "border-primary/30",
  },
  {
    name: "Advent / ጾመ ገና",
    start: new Date("2025-11-15"),
    end: new Date("2026-01-07"),
    days: 43,
    description: "Preparing for the Nativity of Our Lord Jesus Christ (Ethiopian Christmas / Genna).",
    scripture: "\"For unto you is born this day in the city of David a Savior, who is Christ the Lord.\" — Luke 2:11",
    significance: "Joyful anticipation of Christmas. Special focus on Old Testament prophecies about the coming Messiah.",
    color: "from-gold-glow/20 to-primary/5",
    borderColor: "border-primary/30",
  },
  {
    name: "Nineveh Fast / ጾመ ነነዌ",
    start: new Date("2026-02-09"),
    end: new Date("2026-02-11"),
    days: 3,
    description: "Three-day fast commemorating the repentance of the people of Nineveh after Jonah's preaching.",
    scripture: "\"The people of Nineveh believed God, proclaimed a fast, and put on sackcloth.\" — Jonah 3:5",
    significance: "A powerful reminder of God's mercy toward those who repent. Strict fasting and intensive prayer for 3 days.",
    color: "from-muted to-muted/50",
    borderColor: "border-muted-foreground/20",
  },
];

function getCurrentFasting(now: Date) {
  return fastingSeasons.find((s) => now >= s.start && now <= s.end);
}

function getNextFasting(now: Date) {
  const upcoming = fastingSeasons
    .filter((s) => s.start > now)
    .sort((a, b) => a.start.getTime() - b.start.getTime());
  return upcoming[0] || fastingSeasons[0];
}

function getDaysRemaining(now: Date, end: Date) {
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function getDaysUntil(now: Date, start: Date) {
  const diff = start.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

const FastingDashboard = () => {
  const now = new Date();
  const current = useMemo(() => getCurrentFasting(now), []);
  const next = useMemo(() => getNextFasting(now), []);

  return (
    <Layout>
      <section className="py-20 ethiopian-pattern cross-watermark">
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeading
            title="Fasting Dashboard"
            subtitle="ጾም — Track the sacred fasting seasons of the EOTC"
          />

          {/* Current status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto mb-12"
          >
            {current ? (
              <div className={`bg-gradient-to-r ${current.color} rounded-xl border ${current.borderColor} p-8`}>
                <div className="flex items-center gap-3 mb-4">
                  <EthiopianCross className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-xs font-body text-primary font-semibold uppercase tracking-wide">Currently Fasting</p>
                    <h3 className="font-display text-2xl font-bold text-foreground">{current.name}</h3>
                  </div>
                </div>
                <p className="text-muted-foreground font-body mb-4">{current.description}</p>
                
                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-body text-muted-foreground mb-1">
                    <span>Day {current.days - getDaysRemaining(now, current.end)} of {current.days}</span>
                    <span>{getDaysRemaining(now, current.end)} days remaining</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((current.days - getDaysRemaining(now, current.end)) / current.days) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full gradient-gold rounded-full"
                    />
                  </div>
                </div>

                {/* Daily scripture */}
                <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-border">
                  <p className="text-xs font-body text-primary font-semibold mb-1">Daily Scripture</p>
                  <p className="font-display text-foreground italic text-sm">{current.scripture}</p>
                </div>

                <div className="mt-4 bg-card/50 rounded-lg p-4 border border-border">
                  <p className="text-xs font-body text-primary font-semibold mb-1">Spiritual Significance</p>
                  <p className="text-muted-foreground text-sm font-body">{current.significance}</p>
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-border p-8 text-center">
                <EthiopianCross className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold text-foreground mb-2">No Active Fasting Season</h3>
                <p className="text-muted-foreground font-body mb-4">
                  The next fasting season is <strong className="text-primary">{next?.name}</strong> in{" "}
                  <strong>{getDaysUntil(now, next?.start || now)} days</strong>
                </p>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="font-display text-foreground italic text-sm">{next?.scripture}</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* All seasons */}
          <div className="max-w-3xl mx-auto">
            <h3 className="font-display text-2xl font-bold text-foreground mb-6 text-center">
              All Fasting Seasons
            </h3>
            <div className="space-y-4">
              {fastingSeasons.map((season, i) => {
                const isActive = current?.name === season.name;
                return (
                  <motion.div
                    key={season.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className={`bg-gradient-to-r ${season.color} rounded-lg border ${season.borderColor} p-6 ${
                      isActive ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-display font-semibold text-foreground flex items-center gap-2">
                          {isActive && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                          {season.name}
                        </h4>
                        <p className="text-xs font-body text-muted-foreground mt-1">
                          {season.start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} –{" "}
                          {season.end.toLocaleDateString("en-US", { month: "short", day: "numeric" })} • {season.days} days
                        </p>
                      </div>
                      {isActive && (
                        <span className="text-xs font-body text-primary font-semibold bg-primary/10 px-3 py-1 rounded-full">
                          Active Now
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm font-body mt-2">{season.description}</p>
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
