import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/SectionHeading";
import { Clock, BarChart3, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";

const categories = ["All", "Dogma", "Canon", "Ethics", "general"] as const;

const categoryColors: Record<string, string> = {
  Dogma: "bg-secondary/10 text-secondary border-secondary/20",
  Canon: "bg-accent/10 text-accent border-accent/20",
  Ethics: "bg-primary/10 text-primary border-primary/20",
  general: "bg-muted text-muted-foreground border-border",
};

const levelIcons: Record<string, string> = { beginner: "🌱", intermediate: "📖", advanced: "🎓" };

interface Post {
  id: string;
  title: string;
  content: string | null;
  category: string;
  level: string | null;
  reading_time: number | null;
  created_at: string;
}

const Education = () => {
  const [filter, setFilter] = useState<string>("All");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (data) setPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const catLabels: Record<string, string> = {
    All: t("education.all"),
    Dogma: t("education.dogma"),
    Canon: t("education.canon"),
    Ethics: t("education.ethics"),
    general: "General",
  };

  const filtered = filter === "All" ? posts : posts.filter((l) => l.category === filter);

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
                {catLabels[cat] || cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground font-body">{t("education.noArticles") || "No articles found."}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {filtered.map((post, i) => (
                <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  className="bg-card rounded-lg border border-border p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-body font-semibold px-3 py-1 rounded-full border ${categoryColors[post.category] || categoryColors.general}`}>
                      {catLabels[post.category] || post.category}
                    </span>
                    <span className="text-lg">{levelIcons[post.level || "beginner"] || "📖"}</span>
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm font-body mb-4 line-clamp-3">
                    {post.content || ""}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground font-body">
                    <span className="flex items-center gap-1"><Clock size={12} /> {post.reading_time || 5} {t("education.min")}</span>
                    <span className="flex items-center gap-1"><BarChart3 size={12} /> {post.level || "beginner"}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Education;
