import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/SectionHeading";
import EthiopianCross from "@/components/EthiopianCross";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { User, CheckCircle2, Clock } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }
      setUser(user);
      const { data } = await supabase.from("members").select("*").eq("user_id", user.id).maybeSingle();
      setMember(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <Layout><div className="py-20 text-center"><p className="text-muted-foreground font-body">{t("common.loading")}</p></div></Layout>;

  return (
    <Layout>
      <section className="py-20 ethiopian-pattern cross-watermark">
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeading title={t("profile.title")} subtitle={t("profile.subtitle")} />
          <div className="max-w-lg mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {/* User info */}
              <div className="bg-card rounded-xl border border-border p-8 mb-6 text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground">{user?.user_metadata?.full_name || user?.email}</h3>
                <p className="text-muted-foreground text-sm font-body">{user?.email}</p>
              </div>

              {member ? (
                <div className="bg-card rounded-xl border-2 border-primary/30 p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <EthiopianCross className="w-6 h-6 text-primary" />
                    <h3 className="font-display text-lg font-bold text-foreground">{t("profile.membershipCard")}</h3>
                  </div>
                  <div className="space-y-3 font-body text-sm">
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">{t("admin.name")}</span>
                      <span className="text-foreground font-medium">{member.full_name}</span>
                    </div>
                    {member.christian_name && (
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">{t("admin.christianName")}</span>
                        <span className="text-foreground font-medium">{member.christian_name}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">{t("profile.department")}</span>
                      <span className="text-foreground font-medium capitalize">{member.department || "—"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
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
                <div className="bg-card rounded-xl border border-border p-8 text-center">
                  <EthiopianCross className="w-8 h-8 text-primary mx-auto mb-3" />
                  <p className="text-muted-foreground font-body mb-4">{t("profile.notRegistered")}</p>
                  <Link to="/join"><Button>{t("profile.registerNow")}</Button></Link>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Profile;
