import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Star, BookOpen, Heart, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";

interface KidsStory {
  id: string;
  title_en: string;
  title_am: string;
  story_text_en: string;
  story_text_am: string;
  bible_reference: string | null;
  image_url: string | null;
  audio_url: string | null;
  emoji: string | null;
  color_class: string | null;
  order_index: number;
}

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
  const [stories, setStories] = useState<KidsStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      const { data, error } = await supabase
        .from("kids_corner")
        .select("*")
        .order("order_index", { ascending: true });
      if (data) setStories(data);
      setLoading(false);
    };
    fetchStories();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
        </div>
      </Layout>
    );
  }

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
          {stories.length === 0 && (
            <p className="text-center text-muted-foreground font-body">No stories yet. Check back soon!</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {stories.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <button onClick={() => setExpandedStory(expandedStory === i ? null : i)}
                  className={`w-full text-left rounded-2xl border-2 p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${s.color_class || "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700"} ${expandedStory === i ? "ring-2 ring-primary" : ""}`}>
                  <div className="text-4xl mb-3">{s.emoji || "📖"}</div>
                  <h3 className="font-display text-lg font-bold text-foreground">{isAm ? s.title_am : s.title_en}</h3>
                  <p className="font-ethiopic text-sm text-primary mb-3">{isAm ? s.title_en : s.title_am}</p>
                  {expandedStory === i ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <p className="text-sm font-body text-muted-foreground mb-3 leading-relaxed">{isAm ? s.story_text_am : s.story_text_en}</p>
                      {s.bible_reference && (
                        <p className="text-xs font-body italic text-primary/80">{s.bible_reference}</p>
                      )}
                      {s.audio_url && (
                        <audio controls className="w-full mt-3" src={s.audio_url}>
                          Your browser does not support audio.
                        </audio>
                      )}
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
