import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/SectionHeading";
import EthiopianCross from "@/components/EthiopianCross";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { User, CheckCircle2, Clock, BookOpen, ScrollText, Calendar } from "lucide-react";
import { BIBLE_81 } from "@/constants/bibleData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [member, setMember] = useState<any>(null);
  const [bibleProgress, setBibleProgress] = useState(0);
  const [reflections, setReflections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isAm = i18n.language === "am";

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }
      setUser(user);
      
      // 1. Load Membership
      const { data: memberData } = await supabase.from("members").select("*").eq("user_id", user.id).maybeSingle();
      setMember(memberData);

      // 2. Load Bible Progress Summary
      const { data: progressData } = await supabase.from("bible_progress").select("completed_chapters").eq("user_id", user.id);
      if (progressData) {
        const totalChaptersInBible = BIBLE_81.reduce((sum, book) => sum + book.chapters, 0);
        const completedCount = progressData.reduce((sum, row) => sum + (row.completed_chapters?.length || 0), 0);
        const percentage = Math.round((completedCount / totalChaptersInBible) * 100);
        setBibleProgress(percentage);
      }

      // 3. Load Reflections/Journal
      const { data: reflectionData } = await supabase
        .from("bible_reflections")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });
      setReflections(reflectionData || []);

      setLoading(false);
    };
    load();
  }, [navigate]);

  if (loading) return <Layout><div className="py-20 text-center"><p className="text-muted-foreground font-body">{t("common.loading")}</p></div></Layout>;

  return (
    <Layout>
      <section className="py-20 ethiopian-pattern cross-watermark min-h-screen">
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeading title={t("profile.title")} subtitle={t("profile.subtitle")} />
          
          <div className="max-w-2xl mx-auto space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              
              {/* User Identity Header */}
              <div className="bg-card rounded-xl border border-border p-8 mb-6 text-center shadow-sm">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 border-2 border-primary/20">
                  <User className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground">
                  {user?.user_metadata?.full_name || user?.email}
                </h3>
                <p className="text-muted-foreground text-sm font-body">{user?.email}</p>
              </div>

              <Tabs defaultValue="membership" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="membership">{t("profile.membershipCard")}</TabsTrigger>
                  <TabsTrigger value="journal" className="gap-2">
                    <ScrollText className="w-4 h-4" />
                    {isAm ? "የንባብ ማስታወሻ" : "My Journal"}
                  </TabsTrigger>
                </TabsList>

                {/* Membership Tab */}
                <TabsContent value="membership" className="space-y-6">
                  {/* Progress Overview Card */}
                  <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-secondary rounded-lg">
                        <BookOpen className="w-5 h-5 text-secondary-foreground" />
                      </div>
                      <h3 className="font-display font-bold text-foreground">
                        {isAm ? "የመጽሐፍ ቅዱስ ንባብ" : "Bible Reading Progress"}
                      </h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs font-medium">
                        <span>{bibleProgress}% {isAm ? "ተጠናቋል" : "Completed"}</span>
                      </div>
                      <Progress value={bibleProgress} className="h-2" />
                      <Link to="/bible-tracker" className="block pt-2">
                        <Button variant="outline" size="sm" className="w-full text-xs gap-2">
                          {isAm ? "ንባቡን ቀጥል" : "Continue Reading"}
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Status Card */}
                  {member ? (
                    <div className="bg-card rounded-xl border-2 border-primary/30 p-8 shadow-md">
                      <div className="flex items-center gap-2 mb-6">
                        <EthiopianCross className="w-6 h-6 text-primary" />
                        <h3 className="font-display text-lg font-bold text-foreground">{t("profile.membershipCard")}</h3>
                      </div>
                      <div className="space-y-4 font-body text-sm">
                        <div className="flex justify-between py-2 border-b border-border/50">
                          <span className="text-muted-foreground">{t("admin.name")}</span>
                          <span className="text-foreground font-medium">{member.full_name}</span>
                        </div>
                        {member.christian_name && (
                          <div className="flex justify-between py-2 border-b border-border/50">
                            <span className="text-muted-foreground">{t("admin.christianName")}</span>
                            <span className="text-foreground font-medium">{member.christian_name}</span>
                          </div>
                        )}
                        <div className="flex justify-between py-2 border-b border-border/50">
                          <span className="text-muted-foreground">{t("profile.department")}</span>
                          <span className="text-foreground font-medium capitalize">{member.department || "—"}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-border/50">
                          <span className="text-muted-foreground">{t("profile.status")}</span>
                          <span className={`flex items-center gap-1 font-medium ${member.status === "approved" ? "text-accent" : "text-primary"}`}>
                            {member.status === "approved" ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                            {member.status === "approved" ? t("profile.approved") : t("profile.pending")}
                          </span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">{t("profile.memberSince")}</span>
                          <span className="text-foreground font-medium">{new Date(member.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-card rounded-xl border border-border p-8 text-center shadow-sm">
                      <p className="text-muted-foreground font-body mb-4">{t("profile.notRegistered")}</p>
                      <Link to="/join"><Button>{t("profile.registerNow")}</Button></Link>
                    </div>
                  )}
                </TabsContent>

                {/* Journal Tab */}
                <TabsContent value="journal">
                  <div className="space-y-4">
                    {reflections.length > 0 ? (
                      reflections.map((note) => {
                        const book = BIBLE_81.find(b => b.id === note.book_id);
                        return (
                          <div key={note.id} className="bg-card rounded-xl border border-border p-5 shadow-sm hover:border-primary/30 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-2">
                                <div className="bg-primary/10 p-1.5 rounded-md">
                                  <ScrollText className="w-4 h-4 text-primary" />
                                </div>
                                <h4 className="font-bold text-sm">
                                  {isAm ? book?.nameAm : book?.nameEn} {isAm ? "ምዕራፍ" : "Chapter"} {note.chapter_number}
                                </h4>
                              </div>
                              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                <Calendar className="w-3 h-3" />
                                {new Date(note.updated_at).toLocaleDateString()}
                              </div>
                            </div>
                            <p className="text-sm text-foreground/80 font-body leading-relaxed italic">
                              "{note.reflection_text}"
                            </p>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-12 bg-card rounded-xl border border-dashed border-border">
                        <ScrollText className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
                        <p className="text-muted-foreground text-sm font-body">
                          {isAm ? "እስካሁን ምንም ማስታወሻ አልጻፉም" : "You haven't written any reflections yet."}
                        </p>
                        <Link to="/bible-tracker">
                          <Button variant="link" className="mt-2">{isAm ? "አሁን ይጀምሩ" : "Start writing now"}</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Profile;