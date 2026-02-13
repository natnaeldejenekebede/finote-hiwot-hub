import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Users, BookOpen, MessageSquare, BarChart3, Check, X, Trash2, FileText, Bell, HelpCircle, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface Member { id: string; full_name: string; christian_name: string | null; department: string | null; status: string | null; created_at: string; }
interface PrayerRequest { id: string; name: string; prayer_text: string; status: string | null; created_at: string; }
interface CommunityQuestion { id: string; user_name: string; question: string; answer: string | null; status: string; created_at: string; }

const CHART_COLORS = ["hsl(43,65%,52%)", "hsl(0,75%,27%)", "hsl(150,40%,16%)", "hsl(43,80%,58%)"];

type TabId = "overview" | "members" | "prayers" | "content" | "qa";

const Admin = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [members, setMembers] = useState<Member[]>([]);
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [questions, setQuestions] = useState<CommunityQuestion[]>([]);
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [loading, setLoading] = useState(true);
  const [articleTitle, setArticleTitle] = useState("");
  const [articleContent, setArticleContent] = useState("");
  const [articleCategory, setArticleCategory] = useState("general");
  const [answeringId, setAnsweringId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState("");

  useEffect(() => { checkAuth(); }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate("/auth"); return; }
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
    const isAdmin = roles?.some((r) => r.role === "admin");
    if (!isAdmin) { toast({ title: t("admin.accessDenied"), description: t("admin.adminRequired"), variant: "destructive" }); navigate("/"); return; }
    fetchData();
  };

  const fetchData = async () => {
    const [membersRes, prayersRes, questionsRes] = await Promise.all([
      supabase.from("members").select("*").order("created_at", { ascending: false }),
      supabase.from("prayer_requests").select("*").order("created_at", { ascending: false }),
      supabase.from("community_questions").select("*").order("created_at", { ascending: false }),
    ]);
    if (membersRes.data) setMembers(membersRes.data);
    if (prayersRes.data) setPrayers(prayersRes.data);
    if (questionsRes.data) setQuestions(questionsRes.data);
    setLoading(false);
  };

  const updateMemberStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("members").update({ status }).eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
    toast({ title: `Member ${status}` });
  };

  const updatePrayerStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("prayer_requests").update({ status }).eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    setPrayers((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    toast({ title: `Prayer ${status}` });
  };

  const deletePrayer = async (id: string) => {
    const { error } = await supabase.from("prayer_requests").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    setPrayers((prev) => prev.filter((p) => p.id !== id));
    toast({ title: "Prayer deleted" });
  };

  const createArticle = async () => {
    if (!articleTitle.trim()) { toast({ title: "Title required", variant: "destructive" }); return; }
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("posts").insert({
      title: articleTitle, content: articleContent, category: articleCategory, author_id: user?.id, published: true,
    });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: t("admin.articleCreated") || "Article created!" });
    setArticleTitle(""); setArticleContent("");
  };

  const submitAnswer = async (id: string) => {
    if (!answerText.trim()) return;
    const { error } = await supabase.from("community_questions").update({ answer: answerText, status: "answered" }).eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, answer: answerText, status: "answered" } : q)));
    setAnsweringId(null); setAnswerText("");
    toast({ title: t("admin.answerPublished") || "Answer published!" });
  };

  const deleteQuestion = async (id: string) => {
    const { error } = await supabase.from("community_questions").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    toast({ title: "Question deleted" });
  };

  const pendingMembers = members.filter((m) => m.status === "pending").length;
  const pendingPrayers = prayers.filter((p) => p.status === "pending").length;
  const pendingQuestions = questions.filter((q) => q.status === "pending").length;
  const totalNotifications = pendingMembers + pendingPrayers + pendingQuestions;

  const deptDistribution = ["education", "choir", "service", "finance"].map((dept) => ({
    name: dept.charAt(0).toUpperCase() + dept.slice(1), value: members.filter((m) => m.department === dept).length,
  }));

  const monthlyRegistrations = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(); d.setMonth(d.getMonth() - (5 - i));
    const month = d.toLocaleDateString("en-US", { month: "short" });
    const count = members.filter((m) => { const mDate = new Date(m.created_at); return mDate.getMonth() === d.getMonth() && mDate.getFullYear() === d.getFullYear(); }).length;
    return { month, count };
  });

  const tabs = [
    { id: "overview" as const, label: t("admin.overview"), icon: BarChart3, badge: 0 },
    { id: "members" as const, label: t("admin.members"), icon: Users, badge: pendingMembers },
    { id: "prayers" as const, label: t("admin.prayers"), icon: MessageSquare, badge: pendingPrayers },
    { id: "content" as const, label: t("admin.content"), icon: FileText, badge: 0 },
    { id: "qa" as const, label: t("admin.qa") || "Q&A", icon: HelpCircle, badge: pendingQuestions },
  ];

  if (loading) return <Layout><div className="py-20 text-center"><p className="text-muted-foreground font-body">{t("common.loading")}</p></div></Layout>;

  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="font-display text-3xl font-bold text-foreground">{t("admin.title")}</h1>
            {totalNotifications > 0 && (
              <span className="flex items-center gap-1 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-xs font-body font-semibold">
                <Bell className="w-3 h-3" /> {totalNotifications} {t("admin.newNotifications")}
              </span>
            )}
          </div>
          <p className="text-muted-foreground font-body mb-8">{t("admin.subtitle")}</p>

          <div className="flex gap-2 mb-8 border-b border-border pb-4 flex-wrap">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-body font-medium transition-colors relative ${
                  activeTab === tab.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                }`}>
                <tab.icon className="w-4 h-4" /> {tab.label}
                {tab.badge > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-[10px] flex items-center justify-center font-bold">{tab.badge}</span>}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
                {[
                  { label: t("admin.totalMembers"), value: members.length, icon: Users },
                  { label: t("admin.pendingApprovals"), value: pendingMembers, icon: BookOpen },
                  { label: t("admin.prayerRequests"), value: prayers.length, icon: MessageSquare },
                  { label: t("admin.qa") || "Q&A", value: pendingQuestions, icon: HelpCircle },
                ].map((stat) => (
                  <div key={stat.label} className="bg-card rounded-lg border border-border p-6">
                    <div className="flex items-center gap-3 mb-2"><stat.icon className="w-5 h-5 text-primary" /><span className="text-sm font-body text-muted-foreground">{stat.label}</span></div>
                    <p className="text-3xl font-display font-bold text-foreground">{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card rounded-lg border border-border p-6">
                  <h3 className="font-display font-semibold text-foreground mb-4">{t("admin.monthlyReg")}</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={monthlyRegistrations}><CartesianGrid strokeDasharray="3 3" stroke="hsl(43,25%,85%)" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="count" fill="hsl(43,65%,52%)" radius={[4, 4, 0, 0]} /></BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-card rounded-lg border border-border p-6">
                  <h3 className="font-display font-semibold text-foreground mb-4">{t("admin.deptDist")}</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart><Pie data={deptDistribution} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name} (${value})`}>{deptDistribution.map((_, i) => (<Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />))}</Pie><Tooltip /></PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "members" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm font-body">
                    <thead className="bg-muted"><tr>
                      <th className="text-left p-3 text-muted-foreground">{t("admin.name")}</th>
                      <th className="text-left p-3 text-muted-foreground">{t("admin.christianName")}</th>
                      <th className="text-left p-3 text-muted-foreground">{t("admin.departmentCol")}</th>
                      <th className="text-left p-3 text-muted-foreground">{t("admin.status")}</th>
                      <th className="text-left p-3 text-muted-foreground">{t("admin.date")}</th>
                      <th className="text-left p-3 text-muted-foreground">{t("admin.actions")}</th>
                    </tr></thead>
                    <tbody>
                      {members.map((m) => (
                        <tr key={m.id} className="border-t border-border">
                          <td className="p-3 text-foreground">{m.full_name}</td>
                          <td className="p-3 text-foreground">{m.christian_name || "—"}</td>
                          <td className="p-3 text-foreground capitalize">{m.department || "—"}</td>
                          <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs ${m.status === "approved" ? "bg-accent/10 text-accent" : m.status === "rejected" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>{m.status}</span></td>
                          <td className="p-3 text-muted-foreground">{new Date(m.created_at).toLocaleDateString()}</td>
                          <td className="p-3">{m.status === "pending" && (<div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => updateMemberStatus(m.id, "approved")}><Check className="w-4 h-4 text-accent" /></Button>
                            <Button size="sm" variant="ghost" onClick={() => updateMemberStatus(m.id, "rejected")}><X className="w-4 h-4 text-destructive" /></Button>
                          </div>)}</td>
                        </tr>
                      ))}
                      {members.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">{t("admin.noMembers")}</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "prayers" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="space-y-3">
                {prayers.map((p) => (
                  <div key={p.id} className="bg-card rounded-lg border border-border p-4 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-foreground text-sm font-body mb-1">{p.prayer_text}</p>
                      <p className="text-xs text-muted-foreground font-body">
                        By {p.name} • {new Date(p.created_at).toLocaleDateString()} • <span className={p.status === "approved" ? "text-accent" : "text-primary"}>{p.status}</span>
                      </p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      {p.status === "pending" && (
                        <Button size="sm" variant="ghost" onClick={() => updatePrayerStatus(p.id, "approved")}><Check className="w-4 h-4 text-accent" /></Button>
                      )}
                      {p.status === "pending" && (
                        <Button size="sm" variant="ghost" onClick={() => updatePrayerStatus(p.id, "rejected")}><X className="w-4 h-4 text-destructive" /></Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => deletePrayer(p.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                  </div>
                ))}
                {prayers.length === 0 && <div className="bg-card rounded-lg border border-border p-8 text-center text-muted-foreground font-body">{t("admin.noPrayers")}</div>}
              </div>
            </motion.div>
          )}

          {activeTab === "content" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="max-w-2xl">
                <h3 className="font-display text-xl font-bold text-foreground mb-4">{t("admin.createArticle")}</h3>
                <div className="bg-card rounded-lg border border-border p-6 space-y-4">
                  <div><Label className="font-body">{t("admin.articleTitle")}</Label><Input value={articleTitle} onChange={(e) => setArticleTitle(e.target.value)} className="mt-1" placeholder="Enter title..." /></div>
                  <div>
                    <Label className="font-body">Category</Label>
                    <select value={articleCategory} onChange={(e) => setArticleCategory(e.target.value)} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
                      <option value="general">General</option><option value="Dogma">Dogma</option><option value="Canon">Canon</option><option value="Ethics">Ethics</option>
                    </select>
                  </div>
                  <div><Label className="font-body">{t("admin.articleContent")}</Label><Textarea value={articleContent} onChange={(e) => setArticleContent(e.target.value)} rows={6} className="mt-1" placeholder="Write article content..." /></div>
                  <Button onClick={createArticle}>{t("admin.createArticle")}</Button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "qa" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="font-display text-xl font-bold text-foreground mb-4">{t("admin.qaManagement") || "Q&A Management"}</h3>
              <div className="space-y-3">
                {questions.map((q) => (
                  <div key={q.id} className="bg-card rounded-lg border border-border p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs font-body font-semibold px-2 py-0.5 rounded-full ${q.status === "answered" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"}`}>
                            {q.status === "answered" ? t("qa.answered") || "Answered" : t("qa.pending") || "Pending"}
                          </span>
                          <span className="text-xs text-muted-foreground font-body">{q.user_name} • {new Date(q.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-foreground text-sm font-body font-semibold mb-2">{q.question}</p>
                        {q.answer && (
                          <div className="bg-muted/50 rounded-md p-3 border border-border mb-2">
                            <p className="text-sm font-body text-foreground"><span className="font-semibold text-primary">Answer:</span> {q.answer}</p>
                          </div>
                        )}
                        {answeringId === q.id && (
                          <div className="flex gap-2 mt-2">
                            <Textarea value={answerText} onChange={(e) => setAnswerText(e.target.value)} placeholder="Write your answer..." rows={2} className="flex-1" />
                            <div className="flex flex-col gap-1">
                              <Button size="sm" onClick={() => submitAnswer(q.id)}><Send className="w-4 h-4" /></Button>
                              <Button size="sm" variant="ghost" onClick={() => { setAnsweringId(null); setAnswerText(""); }}><X className="w-4 h-4" /></Button>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        {q.status === "pending" && (
                          <Button size="sm" variant="ghost" onClick={() => { setAnsweringId(q.id); setAnswerText(q.answer || ""); }}>
                            <FileText className="w-4 h-4 text-primary" />
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => deleteQuestion(q.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                      </div>
                    </div>
                  </div>
                ))}
                {questions.length === 0 && <div className="bg-card rounded-lg border border-border p-8 text-center text-muted-foreground font-body">{t("admin.noQuestions") || "No questions yet."}</div>}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Admin;
