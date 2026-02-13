import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/");
  };

  const navLinks = [
    { path: "/", label: t("nav.home") },
    { path: "/about", label: t("nav.about") },
    { path: "/education", label: t("nav.education") },
    { path: "/events", label: t("nav.events") },
    { path: "/media", label: t("nav.media") },
    { path: "/give", label: t("nav.donations") },
    { path: "/prayer", label: t("nav.prayer") },
    { path: "/qa", label: t("nav.qa") },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="text-2xl font-display font-bold text-primary">✦</span>
          <div className="leading-tight">
            <span className="font-ethiopic font-bold text-foreground text-lg">ፍኖተ ሕይወት</span>
            <span className="block text-xs text-muted-foreground font-body">Finote Hiwot Sunday School</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-2 rounded-md text-sm font-medium font-body transition-colors ${
                location.pathname === link.path
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-1 ml-2 border-l border-border pl-2">
            <LanguageToggle />
            <ThemeToggle />
            {user ? (
              <>
                <Link to="/profile">
                  <Button size="sm" variant="ghost"><User className="w-4 h-4" /></Button>
                </Link>
                <Button size="sm" variant="ghost" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button size="sm" variant="ghost">{t("nav.login")}</Button>
                </Link>
                <Link to="/join">
                  <Button size="sm">{t("nav.join")}</Button>
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <LanguageToggle />
          <ThemeToggle />
          <button
            className="p-2 text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden bg-card border-b border-border"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2 rounded-md text-sm font-medium font-body transition-colors ${
                    location.pathname === link.path
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setMobileOpen(false)}>
                    <Button size="sm" variant="ghost" className="w-full mt-2 justify-start gap-2">
                      <User className="w-4 h-4" /> {t("nav.profile")}
                    </Button>
                  </Link>
                  <Button size="sm" variant="ghost" onClick={() => { handleLogout(); setMobileOpen(false); }} className="w-full justify-start gap-2">
                    <LogOut className="w-4 h-4" /> {t("nav.logout")}
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/auth" onClick={() => setMobileOpen(false)}>
                    <Button size="sm" variant="ghost" className="w-full mt-2">{t("nav.login")}</Button>
                  </Link>
                  <Link to="/join" onClick={() => setMobileOpen(false)}>
                    <Button size="sm" className="w-full mt-1">{t("nav.join")}</Button>
                  </Link>
                </>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
