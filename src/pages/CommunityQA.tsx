import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageCircle, Send, CheckCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

interface Question {
  id: string;
  user_name: string;
  question: string;
  answer: string | null;
  status: string;
  created_at: string;
}

const CommunityQA = () => {
  const { t } = useTranslation();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userName, setUserName] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const { data } = await supabase
      .from("community_questions")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setQuestions(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) {
      toast({ title: t("qa.questionRequired"), variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("community_questions").insert({
      user_name: userName.trim() || "Anonymous",
      question: questionText.trim(),
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: t("qa.submitted"), description: t("qa.submittedDesc") });
      setUserName("");
      setQuestionText("");
      fetchQuestions();
    }
    setSubmitting(false);
  };

  return (
    <Layout>
      <section className="py-20 ethiopian-pattern cross-watermark">
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeading title={t("qa.title")} subtitle={t("qa.subtitle")} />

          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Submit Form */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="bg-card rounded-xl border border-border p-8">
                <h3 className="font-display text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Send className="w-5 h-5 text-primary" /> {t("qa.submitQuestion")}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label className="font-body">{t("qa.name")}</Label>
                    <Input
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder={t("qa.namePlaceholder")}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="font-body">{t("qa.questionLabel")}</Label>
                    <Textarea
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                      placeholder={t("qa.questionPlaceholder")}
                      rows={4}
                      className="mt-1"
                    />
                  </div>
                  <Button type="submit" disabled={submitting} className="w-full">
                    {submitting ? t("common.loading") : t("qa.submitBtn")}
                  </Button>
                </form>
              </div>
            </motion.div>

            {/* Questions List */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h3 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-secondary" /> {t("qa.communityQuestions")}
              </h3>
              {loading ? (
                <div className="bg-card rounded-xl border border-border p-8 text-center">
                  <p className="text-muted-foreground font-body">{t("common.loading")}</p>
                </div>
              ) : questions.length === 0 ? (
                <div className="bg-card rounded-xl border border-border p-8 text-center">
                  <MessageCircle className="w-8 h-8 text-primary mx-auto mb-3" />
                  <p className="text-muted-foreground font-body text-sm">{t("qa.noQuestions")}</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {questions.map((q, i) => (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-card rounded-lg border border-border p-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {q.status === "answered" ? (
                          <span className="flex items-center gap-1 text-xs font-body font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                            <CheckCircle className="w-3 h-3" /> {t("qa.answered")}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs font-body font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Clock className="w-3 h-3" /> {t("qa.pending")}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground font-body">
                          {q.user_name} • {new Date(q.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-foreground text-sm font-body font-semibold mb-2">{q.question}</p>
                      {q.answer && (
                        <div className="bg-muted/50 rounded-md p-3 border border-border">
                          <p className="text-sm font-body text-foreground">
                            <span className="font-semibold text-primary">{t("qa.answerLabel")}:</span> {q.answer}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CommunityQA;
