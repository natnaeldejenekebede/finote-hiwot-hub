import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EthiopianCross from "@/components/EthiopianCross";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { useTranslation } from "react-i18next";

const loginSchema = z.object({ email: z.string().email("Invalid email address"), password: z.string().min(6, "Password must be at least 6 characters") });
const signupSchema = loginSchema.extend({ fullName: z.string().min(2, "Name must be at least 2 characters") });

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (isLogin) {
      const result = loginSchema.safeParse({ email, password });
      if (!result.success) { toast({ title: "Validation Error", description: result.error.errors[0].message, variant: "destructive" }); setLoading(false); return; }
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { toast({ title: "Login Failed", description: error.message, variant: "destructive" }); }
      else { toast({ title: t("auth.welcomeBack") + " ✦" }); navigate("/"); }
    } else {
      const result = signupSchema.safeParse({ email, password, fullName });
      if (!result.success) { toast({ title: "Validation Error", description: result.error.errors[0].message, variant: "destructive" }); setLoading(false); return; }
      const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName }, emailRedirectTo: window.location.origin } });
      if (error) { toast({ title: "Signup Failed", description: error.message, variant: "destructive" }); }
      else { toast({ title: t("auth.checkEmail"), description: t("auth.checkEmailDesc") }); }
    }
    setLoading(false);
  };

  return (
    <Layout>
      <section className="py-20 ethiopian-pattern cross-watermark min-h-[70vh] flex items-center">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <EthiopianCross className="w-10 h-10 text-primary mx-auto mb-4" />
              <h1 className="font-display text-3xl font-bold text-foreground">{isLogin ? t("auth.welcomeBack") : t("auth.createAccount")}</h1>
              <p className="text-muted-foreground font-body mt-1">{isLogin ? t("auth.signInDesc") : t("auth.signUpDesc")}</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (<div><Label htmlFor="fullName" className="font-body">{t("auth.fullName")}</Label><Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your full name" className="mt-1" /></div>)}
                <div><Label htmlFor="email" className="font-body">{t("auth.email")}</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="mt-1" /></div>
                <div><Label htmlFor="password" className="font-body">{t("auth.password")}</Label><Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="mt-1" /></div>
                <Button type="submit" disabled={loading} className="w-full">{loading ? t("auth.pleaseWait") : isLogin ? t("auth.signIn") : t("auth.signUp")}</Button>
              </form>
              <div className="mt-4 text-center">
                <button onClick={() => setIsLogin(!isLogin)} className="text-sm font-body text-primary hover:underline">
                  {isLogin ? t("auth.noAccount") : t("auth.hasAccount")}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Auth;
