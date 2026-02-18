import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Users, BookOpen, MessageSquare, BarChart3, Check, X, Trash2,
  FileText, Bell, HelpCircle, Send, Image, Music, Calendar,
  Heart, Sparkles, Video, FileDown, DollarSign
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface Member { id: string; full_name: string; christian_name: string | null; department: string | null; status: string | null; created_at: string; }
interface PrayerRequest { id: string; name: string; prayer_text: string; status: string | null; created_at: string; }
interface CommunityQuestion { id: string; user_name: string; question: string; answer: string | null; status: string; created_at: string; }
interface Post { id: string; title: string; category: string; created_at: string; }
interface GalleryItem { id: string; title: string; category: string; image_url: string; }
interface Hymn { id: string; title: string; artist: string; audio_url: string | null; duration: string | null; }
interface Event { id: string; title: string; title_am: string | null; description: string | null; event_date: string | null; event_time: string | null; location: string | null; event_type: string; }
interface Project { id: string; name: string; name_am: string | null; goal_amount: number; raised_amount: number; active: boolean; }
interface Doc { id: string; title: string; category: string; file_url: string; }

const CHART_COLORS = ["hsl(43,65%,52%)", "hsl(0,75%,27%)", "hsl(150,40%,16%)", "hsl(43,80%,58%)"];

// type TabId = "overview" | "members" | "prayers" | "content" | "media" | "events" | "donations" | "wisdom" | "qa";
type TabId = "overview" | "members" | "prayers" | "content" | "media" | "events" | "donations" | "wisdom" | "qa" | "notifications";

const Admin = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [members, setMembers] = useState<Member[]>([]);
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [questions, setQuestions] = useState<CommunityQuestion[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [hymns, setHymns] = useState<Hymn[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [documents, setDocuments] = useState<Doc[]>([]);
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [loading, setLoading] = useState(true);

  // Article form
  const [articleTitle, setArticleTitle] = useState("");
  const [articleContent, setArticleContent] = useState("");
  const [articleCategory, setArticleCategory] = useState("general");

  // Q&A form
  const [answeringId, setAnsweringId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState("");

  // Gallery form
  const [galTitle, setGalTitle] = useState("");
  const [galCategory, setGalCategory] = useState("general");
  const [galUrl, setGalUrl] = useState("");

  // Hymn form
  const [hymnTitle, setHymnTitle] = useState("");
  const [hymnArtist, setHymnArtist] = useState("Sunday School Choir");
  const [hymnUrl, setHymnUrl] = useState("");
  const [hymnDuration, setHymnDuration] = useState("");

  // Document form
  const [docTitle, setDocTitle] = useState("");
  const [docCategory, setDocCategory] = useState("lesson");
  const [docUrl, setDocUrl] = useState("");

  // Event form
  const [evTitle, setEvTitle] = useState("");
  const [evTitleAm, setEvTitleAm] = useState("");
  const [evDesc, setEvDesc] = useState("");
  const [evDate, setEvDate] = useState("");
  const [evTime, setEvTime] = useState("");
  const [evLocation, setEvLocation] = useState("");
  const [evType, setEvType] = useState("feast");

  // Project form
  const [projName, setProjName] = useState("");
  const [projNameAm, setProjNameAm] = useState("");
  const [projGoal, setProjGoal] = useState("");

  // Daily wisdom form
  const [wisdomVerseEn, setWisdomVerseEn] = useState("");
  const [wisdomRefEn, setWisdomRefEn] = useState("");
  const [wisdomVerseAm, setWisdomVerseAm] = useState("");
  const [wisdomRefAm, setWisdomRefAm] = useState("");

  // Live stream
  const [liveUrl, setLiveUrl] = useState("");
  const [liveActive, setLiveActive] = useState(false);

  // Notification form states
  const [notifTitleEn, setNotifTitleEn] = useState("");
  const [notifTitleAm, setNotifTitleAm] = useState("");
  const [notifMsgEn, setNotifMsgEn] = useState("");
  const [notifMsgAm, setNotifMsgAm] = useState("");
  const [targetUserId, setTargetUserId] = useState("all");

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
    const [membersRes, prayersRes, questionsRes, postsRes, galRes, hymnsRes, eventsRes, projRes, docsRes, wisdomRes, settingsRes] = await Promise.all([
      supabase.from("members").select("*").order("created_at", { ascending: false }),
      supabase.from("prayer_requests").select("*").order("created_at", { ascending: false }),
      supabase.from("community_questions").select("*").order("created_at", { ascending: false }),
      supabase.from("posts").select("id, title, category, created_at").order("created_at", { ascending: false }),
      supabase.from("gallery").select("*").order("created_at", { ascending: false }),
      supabase.from("hymns").select("*").order("created_at", { ascending: false }),
      supabase.from("events").select("*").order("event_date", { ascending: true }),
      supabase.from("projects").select("*").order("created_at", { ascending: false }),
      supabase.from("documents").select("*").order("created_at", { ascending: false }),
      supabase.from("daily_wisdom").select("*").limit(1),
      supabase.from("site_settings").select("*"),
    ]);
    if (membersRes.data) setMembers(membersRes.data);
    if (prayersRes.data) setPrayers(prayersRes.data);
    if (questionsRes.data) setQuestions(questionsRes.data);
    if (postsRes.data) setPosts(postsRes.data);
    if (galRes.data) setGallery(galRes.data);
    if (hymnsRes.data) setHymns(hymnsRes.data);
    if (eventsRes.data) setEvents(eventsRes.data as Event[]);
    if (projRes.data) setProjects(projRes.data);
    if (docsRes.data) setDocuments(docsRes.data);
    if (wisdomRes.data && wisdomRes.data[0]) {
      const w = wisdomRes.data[0];
      setWisdomVerseEn(w.verse_en); setWisdomRefEn(w.reference_en);
      setWisdomVerseAm(w.verse_am); setWisdomRefAm(w.reference_am);
    }
    if (settingsRes.data) {
      const urlSetting = settingsRes.data.find((s: any) => s.key === "live_stream_url");
      const activeSetting = settingsRes.data.find((s: any) => s.key === "live_stream_active");
      if (urlSetting) setLiveUrl(urlSetting.value);
      if (activeSetting) setLiveActive(activeSetting.value === "true");
    }
    setLoading(false);
  };

  // === CRUD Helpers ===
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
    if (error) return;
    setPrayers((prev) => prev.filter((p) => p.id !== id));
    toast({ title: "Prayer deleted" });
  };

  const createArticle = async () => {
    if (!articleTitle.trim()) { toast({ title: "Title required", variant: "destructive" }); return; }
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("posts").insert({ title: articleTitle, content: articleContent, category: articleCategory, author_id: user?.id, published: true });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Article created!" });
    setArticleTitle(""); setArticleContent("");
    fetchData();
  };

  const deletePost = async (id: string) => {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) return;
    setPosts((prev) => prev.filter((p) => p.id !== id));
    toast({ title: "Article deleted" });
  };

  const submitAnswer = async (id: string) => {
    if (!answerText.trim()) return;
    const { error } = await supabase.from("community_questions").update({ answer: answerText, status: "answered" }).eq("id", id);
    if (error) return;
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, answer: answerText, status: "answered" } : q)));
    setAnsweringId(null); setAnswerText("");
    toast({ title: "Answer published!" });
  };

  const deleteQuestion = async (id: string) => {
    const { error } = await supabase.from("community_questions").delete().eq("id", id);
    if (error) return;
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    toast({ title: "Question deleted" });
  };

  const addGalleryPhoto = async () => {
    if (!galTitle.trim() || !galUrl.trim()) { toast({ title: "Title & URL required", variant: "destructive" }); return; }
    const { error } = await supabase.from("gallery").insert({ title: galTitle, category: galCategory, image_url: galUrl });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Photo added!" }); setGalTitle(""); setGalUrl("");
    fetchData();
  };

  const deleteGallery = async (id: string) => {
    await supabase.from("gallery").delete().eq("id", id);
    setGallery((prev) => prev.filter((g) => g.id !== id));
    toast({ title: "Photo deleted" });
  };

  const addHymn = async () => {
    if (!hymnTitle.trim()) { toast({ title: "Title required", variant: "destructive" }); return; }
    const { error } = await supabase.from("hymns").insert({ title: hymnTitle, artist: hymnArtist, audio_url: hymnUrl || null, duration: hymnDuration || null });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Hymn added!" }); setHymnTitle(""); setHymnUrl(""); setHymnDuration("");
    fetchData();
  };

  const deleteHymn = async (id: string) => {
    await supabase.from("hymns").delete().eq("id", id);
    setHymns((prev) => prev.filter((h) => h.id !== id));
    toast({ title: "Hymn deleted" });
  };

  const addDocument = async () => {
    if (!docTitle.trim() || !docUrl.trim()) { toast({ title: "Title & URL required", variant: "destructive" }); return; }
    const { error } = await supabase.from("documents").insert({ title: docTitle, category: docCategory, file_url: docUrl });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Document added!" }); setDocTitle(""); setDocUrl("");
    fetchData();
  };

  const deleteDocument = async (id: string) => {
    await supabase.from("documents").delete().eq("id", id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    toast({ title: "Document deleted" });
  };

  const addEvent = async () => {
    if (!evTitle.trim()) { toast({ title: "Title required", variant: "destructive" }); return; }
    const { error } = await supabase.from("events").insert({
      title: evTitle, title_am: evTitleAm || null, description: evDesc || null,
      event_date: evDate || null, event_time: evTime || null, location: evLocation || null, event_type: evType,
    });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Event created!" }); setEvTitle(""); setEvTitleAm(""); setEvDesc(""); setEvDate(""); setEvTime(""); setEvLocation("");
    fetchData();
  };

  const deleteEvent = async (id: string) => {
    await supabase.from("events").delete().eq("id", id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
    toast({ title: "Event deleted" });
  };

  const addProject = async () => {
    if (!projName.trim() || !projGoal) { toast({ title: "Name & goal required", variant: "destructive" }); return; }
    const { error } = await supabase.from("projects").insert({ name: projName, name_am: projNameAm || null, goal_amount: parseInt(projGoal) });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Project created!" }); setProjName(""); setProjNameAm(""); setProjGoal("");
    fetchData();
  };

  const updateProjectProgress = async (id: string, raised: number) => {
    const { error } = await supabase.from("projects").update({ raised_amount: raised }).eq("id", id);
    if (error) return;
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, raised_amount: raised } : p)));
    toast({ title: "Progress updated!" });
  };

  const deleteProject = async (id: string) => {
    await supabase.from("projects").delete().eq("id", id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    toast({ title: "Project deleted" });
  };

  const updateDailyWisdom = async () => {
    const { data: existing } = await supabase.from("daily_wisdom").select("id").limit(1);
    if (existing && existing.length > 0) {
      await supabase.from("daily_wisdom").update({ verse_en: wisdomVerseEn, reference_en: wisdomRefEn, verse_am: wisdomVerseAm, reference_am: wisdomRefAm }).eq("id", existing[0].id);
    } else {
      await supabase.from("daily_wisdom").insert({ verse_en: wisdomVerseEn, reference_en: wisdomRefEn, verse_am: wisdomVerseAm, reference_am: wisdomRefAm });
    }
    toast({ title: "Daily Wisdom updated!" });
  };

  const updateLiveStream = async () => {
    await supabase.from("site_settings").update({ value: liveUrl }).eq("key", "live_stream_url");
    await supabase.from("site_settings").update({ value: liveActive ? "true" : "false" }).eq("key", "live_stream_active");
    toast({ title: "Live stream settings saved!" });
  };


 const sendNotification = async () => {
  if (!notifTitleEn.trim() && !notifTitleAm.trim()) {
    toast({ title: "Title required", variant: "destructive" });
    return;
  }
  setLoading(true);

  try {
    let userIds: string[] = [];
    
    if (targetUserId === "all") {
      // We pull the user_id from the members we already fetched
      // Note: Make sure your member interface includes user_id if it's different from id
      const { data: profiles, error: pError } = await supabase.from("profiles" as any).select("user_id");
      if (pError) throw pError;
      userIds = profiles?.map(p => p.user_id) || [];
    } else {
      userIds = [targetUserId];
    }

    if (userIds.length === 0) {
      toast({ title: "No recipients found", variant: "destructive" });
      setLoading(false);
      return;
    }

    const notifications = userIds.map(uid => ({
      user_id: uid,
      title_en: notifTitleEn,
      title_am: notifTitleAm,
      message_en: notifMsgEn,
      message_am: notifMsgAm,
      is_read: false
    }));

    const { error } = await supabase.from("notifications" as any).insert(notifications);

    if (error) throw error;

    toast({ title: "Notifications sent successfully!" });
    setNotifTitleEn(""); setNotifTitleAm(""); setNotifMsgEn(""); setNotifMsgAm("");
  } catch (error: any) {
    console.error(error);
    toast({ title: "Error", description: error.message, variant: "destructive" });
  } finally {
    setLoading(false);
  }
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

  const tabs: { id: TabId; label: string; icon: any; badge: number }[] = [
    { id: "overview", label: t("admin.overview"), icon: BarChart3, badge: 0 },
    { id: "members", label: t("admin.members"), icon: Users, badge: pendingMembers },
    { id: "prayers", label: t("admin.prayers"), icon: MessageSquare, badge: pendingPrayers },
    { id: "content", label: t("admin.content"), icon: FileText, badge: 0 },
    { id: "media", label: "Media", icon: Image, badge: 0 },
    { id: "events", label: t("nav.events"), icon: Calendar, badge: 0 },
    { id: "donations", label: t("nav.donations"), icon: DollarSign, badge: 0 },
    { id: "wisdom", label: "Wisdom", icon: Sparkles, badge: 0 },
    { id: "notifications", label: "Push Alerts", icon: Bell, badge: 0 },
    { id: "qa", label: t("admin.qa") || "Q&A", icon: HelpCircle, badge: pendingQuestions },
  ];

  if (loading) return <Layout><div className="py-20 text-center"><p className="text-muted-foreground font-body">{t("common.loading")}</p></div></Layout>;

  const CardSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-card rounded-lg border border-border p-6 space-y-4">
      <h3 className="font-display text-lg font-bold text-foreground">{title}</h3>
      {children}
    </div>
  );

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

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
                {[
                  { label: t("admin.totalMembers"), value: members.length, icon: Users },
                  { label: t("admin.pendingApprovals"), value: pendingMembers, icon: BookOpen },
                  { label: t("admin.prayerRequests"), value: prayers.length, icon: MessageSquare },
                  { label: "Q&A Pending", value: pendingQuestions, icon: HelpCircle },
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

          {/* MEMBERS */}
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
                      <th className="text-left p-3 text-muted-foreground">{t("admin.actions")}</th>
                    </tr></thead>
                    <tbody>
                      {members.map((m) => (
                        <tr key={m.id} className="border-t border-border">
                          <td className="p-3 text-foreground">{m.full_name}</td>
                          <td className="p-3 text-foreground">{m.christian_name || "—"}</td>
                          <td className="p-3 text-foreground capitalize">{m.department || "—"}</td>
                          <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs ${m.status === "approved" ? "bg-accent/10 text-accent" : m.status === "rejected" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>{m.status}</span></td>
                          <td className="p-3">{m.status === "pending" && (<div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => updateMemberStatus(m.id, "approved")}><Check className="w-4 h-4 text-accent" /></Button>
                            <Button size="sm" variant="ghost" onClick={() => updateMemberStatus(m.id, "rejected")}><X className="w-4 h-4 text-destructive" /></Button>
                          </div>)}</td>
                        </tr>
                      ))}
                      {members.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">{t("admin.noMembers")}</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* PRAYERS */}
          {activeTab === "prayers" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="space-y-3">
                {prayers.map((p) => (
                  <div key={p.id} className="bg-card rounded-lg border border-border p-4 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-foreground text-sm font-body mb-1">{p.prayer_text}</p>
                      <p className="text-xs text-muted-foreground font-body">By {p.name} • {new Date(p.created_at).toLocaleDateString()} • <span className={p.status === "approved" ? "text-accent" : "text-primary"}>{p.status}</span></p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      {p.status === "pending" && <Button size="sm" variant="ghost" onClick={() => updatePrayerStatus(p.id, "approved")}><Check className="w-4 h-4 text-accent" /></Button>}
                      <Button size="sm" variant="ghost" onClick={() => deletePrayer(p.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                  </div>
                ))}
                {prayers.length === 0 && <div className="bg-card rounded-lg border border-border p-8 text-center text-muted-foreground font-body">{t("admin.noPrayers")}</div>}
              </div>
            </motion.div>
          )}

          {/* CONTENT (Articles) */}
          {activeTab === "content" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl">
              <CardSection title={t("admin.createArticle")}>
                <div><Label className="font-body">{t("admin.articleTitle")}</Label><Input value={articleTitle} onChange={(e) => setArticleTitle(e.target.value)} className="mt-1" placeholder="Enter title..." /></div>
                <div>
                  <Label className="font-body">Category</Label>
                  <select value={articleCategory} onChange={(e) => setArticleCategory(e.target.value)} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
                    <option value="general">General</option><option value="Dogma">Dogma</option><option value="Canon">Canon</option><option value="Ethics">Ethics</option>
                  </select>
                </div>
                <div><Label className="font-body">{t("admin.articleContent")}</Label><Textarea value={articleContent} onChange={(e) => setArticleContent(e.target.value)} rows={4} className="mt-1" placeholder="Write article..." /></div>
                <Button onClick={createArticle}>{t("admin.createArticle")}</Button>
              </CardSection>

              <CardSection title={t("admin.manageArticles")}>
                {posts.length === 0 && <p className="text-sm text-muted-foreground">No articles yet.</p>}
                {posts.map((p) => (
                  <div key={p.id} className="flex items-center justify-between border-b border-border pb-2">
                    <div>
                      <p className="text-sm font-body text-foreground font-semibold">{p.title}</p>
                      <p className="text-xs text-muted-foreground">{p.category} • {new Date(p.created_at).toLocaleDateString()}</p>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => deletePost(p.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </div>
                ))}
              </CardSection>
            </motion.div>
          )}

          {/* MEDIA */}
          {activeTab === "media" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl">
              {/* Live Stream */}
              <CardSection title="Live Stream Control">
                <div className="flex items-center gap-3">
                  <Label className="font-body">Live Now</Label>
                  <Switch checked={liveActive} onCheckedChange={setLiveActive} />
                </div>
                <div><Label className="font-body">YouTube URL</Label><Input value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} className="mt-1" placeholder="https://youtube.com/..." /></div>
                <Button onClick={updateLiveStream}>Save Stream Settings</Button>
              </CardSection>

              {/* Gallery */}
              <CardSection title="Photo Gallery Manager">
                <div className="grid grid-cols-2 gap-2">
                  <div><Label className="font-body text-xs">Title</Label><Input value={galTitle} onChange={(e) => setGalTitle(e.target.value)} placeholder="Photo title" /></div>
                  <div><Label className="font-body text-xs">Category</Label>
                    <select value={galCategory} onChange={(e) => setGalCategory(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
                      <option value="general">General</option><option value="service">Sunday Service</option><option value="baptism">Baptism</option><option value="festival">Festival</option><option value="choir">Choir</option><option value="conference">Conference</option>
                    </select>
                  </div>
                </div>
                <div><Label className="font-body text-xs">Image URL</Label><Input value={galUrl} onChange={(e) => setGalUrl(e.target.value)} placeholder="https://..." /></div>
                <Button size="sm" onClick={addGalleryPhoto}><Image className="w-4 h-4 mr-1" /> Add Photo</Button>
                {gallery.map((g) => (
                  <div key={g.id} className="flex items-center justify-between border-b border-border pb-2">
                    <div className="flex items-center gap-2">
                      <img src={g.image_url} alt={g.title} className="w-10 h-10 rounded object-cover" />
                      <span className="text-sm font-body">{g.title} <span className="text-xs text-muted-foreground">({g.category})</span></span>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => deleteGallery(g.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </div>
                ))}
              </CardSection>

              {/* Hymns */}
              <CardSection title="Hymns Manager (መዝሙራት)">
                <div className="grid grid-cols-2 gap-2">
                  <div><Label className="font-body text-xs">Title</Label><Input value={hymnTitle} onChange={(e) => setHymnTitle(e.target.value)} placeholder="Hymn title" /></div>
                  <div><Label className="font-body text-xs">Artist</Label><Input value={hymnArtist} onChange={(e) => setHymnArtist(e.target.value)} /></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><Label className="font-body text-xs">Audio/YouTube URL</Label><Input value={hymnUrl} onChange={(e) => setHymnUrl(e.target.value)} placeholder="https://..." /></div>
                  <div><Label className="font-body text-xs">Duration</Label><Input value={hymnDuration} onChange={(e) => setHymnDuration(e.target.value)} placeholder="4:32" /></div>
                </div>
                <Button size="sm" onClick={addHymn}><Music className="w-4 h-4 mr-1" /> Add Hymn</Button>
                {hymns.map((h) => (
                  <div key={h.id} className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-sm font-body">{h.title} — {h.artist}</span>
                    <Button size="sm" variant="ghost" onClick={() => deleteHymn(h.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </div>
                ))}
              </CardSection>

              {/* Documents */}
              <CardSection title="Documents Manager (ሰነዶች)">
                <div className="grid grid-cols-2 gap-2">
                  <div><Label className="font-body text-xs">Title</Label><Input value={docTitle} onChange={(e) => setDocTitle(e.target.value)} placeholder="Document title" /></div>
                  <div><Label className="font-body text-xs">Category</Label>
                    <select value={docCategory} onChange={(e) => setDocCategory(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
                      <option value="lesson">Lesson</option><option value="book">Book</option><option value="rule">Rule</option><option value="certificate">Certificate</option>
                    </select>
                  </div>
                </div>
                <div><Label className="font-body text-xs">File URL (PDF/Link)</Label><Input value={docUrl} onChange={(e) => setDocUrl(e.target.value)} placeholder="https://..." /></div>
                <Button size="sm" onClick={addDocument}><FileDown className="w-4 h-4 mr-1" /> Add Document</Button>
                {documents.map((d) => (
                  <div key={d.id} className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-sm font-body">{d.title} <span className="text-xs text-muted-foreground">({d.category})</span></span>
                    <Button size="sm" variant="ghost" onClick={() => deleteDocument(d.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </div>
                ))}
              </CardSection>
            </motion.div>
          )}

          {/* EVENTS */}
          {activeTab === "events" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl">
              <CardSection title="Create Event">
                <div className="grid grid-cols-2 gap-2">
                  <div><Label className="font-body text-xs">Title (EN)</Label><Input value={evTitle} onChange={(e) => setEvTitle(e.target.value)} placeholder="Event title" /></div>
                  <div><Label className="font-body text-xs">Title (አማ)</Label><Input value={evTitleAm} onChange={(e) => setEvTitleAm(e.target.value)} placeholder="የበዓል ስም" /></div>
                </div>
                <div><Label className="font-body text-xs">Description</Label><Textarea value={evDesc} onChange={(e) => setEvDesc(e.target.value)} rows={2} placeholder="Event description..." /></div>
                <div className="grid grid-cols-3 gap-2">
                  <div><Label className="font-body text-xs">Date</Label><Input type="date" value={evDate} onChange={(e) => setEvDate(e.target.value)} /></div>
                  <div><Label className="font-body text-xs">Time</Label><Input value={evTime} onChange={(e) => setEvTime(e.target.value)} placeholder="8:00 AM" /></div>
                  <div><Label className="font-body text-xs">Type</Label>
                    <select value={evType} onChange={(e) => setEvType(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
                      <option value="feast">Feast Day</option><option value="class">Weekly Class</option>
                    </select>
                  </div>
                </div>
                <div><Label className="font-body text-xs">Location</Label><Input value={evLocation} onChange={(e) => setEvLocation(e.target.value)} placeholder="Cathedral" /></div>
                <Button onClick={addEvent}><Calendar className="w-4 h-4 mr-1" /> Create Event</Button>
              </CardSection>

              <CardSection title="Existing Events">
                {events.length === 0 && <p className="text-sm text-muted-foreground">No events yet.</p>}
                {events.map((e) => (
                  <div key={e.id} className="flex items-center justify-between border-b border-border pb-2">
                    <div>
                      <p className="text-sm font-body font-semibold text-foreground">{e.title}</p>
                      <p className="text-xs text-muted-foreground">{e.event_date || "Recurring"} • {e.event_type}</p>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => deleteEvent(e.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </div>
                ))}
              </CardSection>
            </motion.div>
          )}

          {/* DONATIONS */}
          {activeTab === "donations" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl">
              <CardSection title="Add Project">
                <div className="grid grid-cols-2 gap-2">
                  <div><Label className="font-body text-xs">Name (EN)</Label><Input value={projName} onChange={(e) => setProjName(e.target.value)} placeholder="Project name" /></div>
                  <div><Label className="font-body text-xs">Name (አማ)</Label><Input value={projNameAm} onChange={(e) => setProjNameAm(e.target.value)} placeholder="የፕሮጀክት ስም" /></div>
                </div>
                <div><Label className="font-body text-xs">Goal Amount (ETB)</Label><Input type="number" value={projGoal} onChange={(e) => setProjGoal(e.target.value)} placeholder="500000" /></div>
                <Button onClick={addProject}><Heart className="w-4 h-4 mr-1" /> Add Project</Button>
              </CardSection>

              <CardSection title="Manage Projects">
                {projects.length === 0 && <p className="text-sm text-muted-foreground">No projects yet.</p>}
                {projects.map((p) => {
                  const pct = p.goal_amount > 0 ? Math.round((p.raised_amount / p.goal_amount) * 100) : 0;
                  return (
                    <div key={p.id} className="border-b border-border pb-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-body font-semibold text-foreground">{p.name}</p>
                        <Button size="sm" variant="ghost" onClick={() => deleteProject(p.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                      </div>
                      <p className="text-xs text-muted-foreground">{p.raised_amount.toLocaleString()} / {p.goal_amount.toLocaleString()} ETB ({pct}%)</p>
                      <div className="flex items-center gap-2">
                        <Input type="number" defaultValue={p.raised_amount} className="w-32 text-sm" onBlur={(e) => updateProjectProgress(p.id, parseInt(e.target.value) || 0)} />
                        <span className="text-xs text-muted-foreground">Update raised amount</span>
                      </div>
                    </div>
                  );
                })}
              </CardSection>
            </motion.div>
          )}

          {/* DAILY WISDOM */}
          {activeTab === "wisdom" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl">
              <CardSection title="Daily Wisdom Manager">
                <div><Label className="font-body">English Verse</Label><Textarea value={wisdomVerseEn} onChange={(e) => setWisdomVerseEn(e.target.value)} rows={2} className="mt-1" /></div>
                <div><Label className="font-body">English Reference</Label><Input value={wisdomRefEn} onChange={(e) => setWisdomRefEn(e.target.value)} className="mt-1" placeholder="Psalm 23:1" /></div>
                <div><Label className="font-body font-ethiopic">Amharic Verse (አማርኛ ጥቅስ)</Label><Textarea value={wisdomVerseAm} onChange={(e) => setWisdomVerseAm(e.target.value)} rows={2} className="mt-1" /></div>
                <div><Label className="font-body font-ethiopic">Amharic Reference (ማጣቀሻ)</Label><Input value={wisdomRefAm} onChange={(e) => setWisdomRefAm(e.target.value)} className="mt-1" placeholder="መዝ 23:1" /></div>
                <Button onClick={updateDailyWisdom}><Sparkles className="w-4 h-4 mr-1" /> Update Verse</Button>
              </CardSection>
            </motion.div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === "notifications" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-3xl">
              <CardSection title="Send Push Notification">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label className="font-body">Recipient Group</Label>
                    <select 
                      value={targetUserId} 
                      onChange={(e) => setTargetUserId(e.target.value)}
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    >
                      <option value="all">All Registered Members</option>
                      {members.map(m => (
                        <option key={m.id} value={m.id}>{m.full_name} ({m.christian_name || 'No Christian Name'})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Title (English)</Label>
                    <Input value={notifTitleEn} onChange={(e) => setNotifTitleEn(e.target.value)} placeholder="Emergency Meeting" />
                  </div>
                  <div className="space-y-2">
                    <Label>ርዕስ (Amharic)</Label>
                    <Input value={notifTitleAm} onChange={(e) => setNotifTitleAm(e.target.value)} className="font-ethiopic" placeholder="አስቸኳይ ስብሰባ" />
                  </div>
                  <div className="space-y-2">
                    <Label>Message (English)</Label>
                    <Textarea value={notifMsgEn} onChange={(e) => setNotifMsgEn(e.target.value)} placeholder="Details about the event..." />
                  </div>
                  <div className="space-y-2">
                    <Label>መልዕክት (Amharic)</Label>
                    <Textarea value={notifMsgAm} onChange={(e) => setNotifMsgAm(e.target.value)} className="font-ethiopic" placeholder="ስለ መርሃ ግብሩ ዝርዝር መረጃ..." />
                  </div>
                </div>
                <Button onClick={sendNotification} className="w-full mt-4" disabled={loading}>
                  <Send className="w-4 h-4 mr-2" /> Broadcast Notification
                </Button>
              </CardSection>
              
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 p-4 rounded-lg flex gap-3">
                <Sparkles className="text-amber-600 shrink-0" />
                <p className="text-xs text-amber-800 dark:text-amber-200 font-body">
                  <strong>Tip:</strong> Notifications sent here will trigger the red badge on the user's bell icon in real-time. Use Amharic fields to ensure all community members can read the alerts.
                </p>
              </div>
            </motion.div>
          )}

          {/* Q&A */}
          {activeTab === "qa" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="font-display text-xl font-bold text-foreground mb-4">Q&A Management</h3>
              <div className="space-y-3">
                {questions.map((q) => (
                  <div key={q.id} className="bg-card rounded-lg border border-border p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs font-body font-semibold px-2 py-0.5 rounded-full ${q.status === "answered" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"}`}>
                            {q.status === "answered" ? "Answered" : "Pending"}
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
                {questions.length === 0 && <div className="bg-card rounded-lg border border-border p-8 text-center text-muted-foreground font-body">No questions yet.</div>}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Admin;
