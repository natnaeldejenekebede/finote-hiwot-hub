import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Star, BookOpen, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";

const stories = [
  { title: "Noah's Ark", amharic: "የኖኅ መርከብ", emoji: "🚢", color: "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700",
    story: "God told Noah to build a big boat. He gathered two of every animal. When the flood came, everyone on the ark was safe!",
    storyAm: "እግዚአብሔር ኖኅን ትልቅ መርከብ እንዲሠራ ነገረው። ከእያንዳንዱ እንስሳ ሁለት ሁለት ሰበሰበ። ጎርፍ ሲመጣ በመርከቡ ላይ ያሉ ሁሉ ደህና ነበሩ!",
    verse: "\"By faith Noah built an ark to save his family.\" — Hebrews 11:7", verseAm: "\"ኖኅ ቤተ ሰቡን ለማዳን በእምነት መርከብ ሠራ።\" — ዕብ 11:7" },
  { title: "David & Goliath", amharic: "ዳዊትና ጎልያድ", emoji: "⚔️", color: "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700",
    story: "Young David wasn't afraid of the giant Goliath. With just a sling and a stone — and God's help — he won!",
    storyAm: "ወጣቱ ዳዊት ግዙፉን ጎልያድ አልፈራም። በወንጭፍና በድንጋይ — በእግዚአብሔር እርዳታ — ድል አደረገ!",
    verse: "\"The Lord is my strength and my shield.\" — Psalm 28:7", verseAm: "\"እግዚአብሔር ጥንካሬዬ እና ጋሻዬ ነው።\" — መዝ 28:7" },
  { title: "Daniel in the Lion's Den", amharic: "ዳንኤል በአንበሶች ጉድጓድ", emoji: "🦁", color: "bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700",
    story: "Daniel kept praying to God even when it was against the king's rules. God closed the lions' mouths and kept Daniel safe!",
    storyAm: "ዳንኤል የንጉሡን ሕግ ቢጥስም ለእግዚአብሔር መጸለይ አላቆመም። እግዚአብሔር የአንበሶቹን አፍ ዘጋ!",
    verse: "\"My God sent his angel and shut the lions' mouths.\" — Daniel 6:22", verseAm: "\"አምላኬ መልአኩን ልኮ የአንበሶቹን አፍ ዘጋ።\" — ዳን 6:22" },
  { title: "Jonah and the Whale", amharic: "ዮናስና ዓሣ ነባሪ", emoji: "🐋", color: "bg-cyan-100 dark:bg-cyan-900/30 border-cyan-300 dark:border-cyan-700",
    story: "God told Jonah to go to Nineveh, but Jonah ran away! A big fish swallowed him for 3 days. Jonah learned to obey God.",
    storyAm: "እግዚአብሔር ዮናስን ወደ ነነዌ እንዲሄድ ነገረው፣ ነገር ግን ዮናስ ሸሸ! ትልቅ ዓሣ ለ3 ቀናት ዋጠው። ዮናስ እግዚአብሔርን መታዘዝ ተማረ።",
    verse: "\"From inside the fish Jonah prayed to the Lord.\" — Jonah 2:1", verseAm: "\"ዮናስ ከዓሣው ሆድ ውስጥ ለእግዚአብሔር ጸለየ።\" — ዮናስ 2:1" },
  { title: "Baby Moses", amharic: "ሕፃን ሙሴ", emoji: "👶", color: "bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700",
    story: "Baby Moses was placed in a basket on the river to keep him safe. The princess found him and raised him as her own son!",
    storyAm: "ሕፃን ሙሴ ለደህንነቱ በወንዝ ላይ በቅርጫት ተቀመጠ። ልዕልቲቱ አገኘችው እና እንደ ራሷ ልጅ አሳደገችው!",
    verse: "\"She named him Moses saying, 'I drew him out of the water.'\" — Exodus 2:10", verseAm: "\"ሙሴ ብላ ሰየመችው 'ከውኃ ስላወጣሁት' ብላ።\" — ዘጸ 2:10" },
  { title: "The Good Samaritan", amharic: "ደግ ሳምራዊ", emoji: "💝", color: "bg-pink-100 dark:bg-pink-900/30 border-pink-300 dark:border-pink-700",
    story: "A kind man stopped to help a stranger who was hurt, even when others passed by. Jesus taught us to be kind to everyone!",
    storyAm: "ሌሎች ሲያልፉ ደግ ሰው ቆሞ የቆሰለን ሰው ረዳ። ኢየሱስ ለሁሉም ደግ እንድንሆን አስተማረን!",
    verse: "\"Love your neighbor as yourself.\" — Luke 10:27", verseAm: "\"ባልንጀራህን እንደ ራስህ ውደድ።\" — ሉቃ 10:27" },
];

const memoryVerses = [
  { verse: "\"Children, obey your parents in the Lord.\"", verseAm: "\"ልጆች ሆይ በጌታ ለወላጆቻችሁ ታዘዙ።\"", ref: "Ephesians 6:1", refAm: "ኤፌ 6:1" },
  { verse: "\"Jesus said, 'Let the little children come to me.'\"", verseAm: "\"ኢየሱስ 'ሕፃናቱን ወደ እኔ ልቀቁ' አለ።\"", ref: "Matthew 19:14", refAm: "ማቴ 19:14" },
  { verse: "\"I can do all things through Christ who strengthens me.\"", verseAm: "\"በሚያበረታኝ በክርስቶስ ሁሉን እችላለሁ።\"", ref: "Philippians 4:13", refAm: "ፊል 4:13" },
  { verse: "\"Be kind to one another.\"", verseAm: "\"እርስ በእርሳችሁ ደጋግ ሁኑ።\"", ref: "Ephesians 4:32", refAm: "ኤፌ 4:32" },
];

const KidsCorner = () => {
  const [expandedStory, setExpandedStory] = useState<number | null>(null);
  const { t, i18n } = useTranslation();
  const isAm = i18n.language === "am";

  return (
    <Layout>
      <section className="bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400 py-12 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-2">🌟 {t("kids.title")} 🌟</h1>
          <p className="text-white/90 text-xl font-body drop-shadow">{t("kids.subtitle")}</p>
        </motion.div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-foreground flex items-center justify-center gap-3">
              <BookOpen className="w-7 h-7 text-primary" /> {t("kids.bibleStories")}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {stories.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <button onClick={() => setExpandedStory(expandedStory === i ? null : i)}
                  className={`w-full text-left rounded-2xl border-2 p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${s.color} ${expandedStory === i ? "ring-2 ring-primary" : ""}`}>
                  <div className="text-4xl mb-3">{s.emoji}</div>
                  <h3 className="font-display text-lg font-bold text-foreground">{isAm ? s.amharic : s.title}</h3>
                  <p className="font-ethiopic text-sm text-primary mb-3">{isAm ? s.title : s.amharic}</p>
                  {expandedStory === i ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <p className="text-sm font-body text-muted-foreground mb-3 leading-relaxed">{isAm ? s.storyAm : s.story}</p>
                      <p className="text-xs font-body italic text-primary/80">{isAm ? s.verseAm : s.verse}</p>
                    </motion.div>
                  ) : (
                    <p className="text-xs text-muted-foreground font-body">{t("kids.tapToRead")}</p>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-yellow-50 to-pink-50 dark:from-accent/10 dark:to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-foreground flex items-center justify-center gap-3">
              <Star className="w-7 h-7 text-primary" /> {t("kids.memoryVerses")}
            </h2>
            <p className="text-muted-foreground font-body mt-2">{t("kids.memoryVersesDesc")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {memoryVerses.map((mv, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="bg-card rounded-xl border border-border p-6 text-center">
                <Heart className="w-6 h-6 text-pink-400 mx-auto mb-3" />
                <p className="font-display text-foreground italic text-lg mb-2">{isAm ? mv.verseAm : mv.verse}</p>
                <p className="text-primary text-sm font-body font-semibold">— {isAm ? mv.refAm : mv.ref}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default KidsCorner;
