import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-accent text-accent-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-ethiopic text-xl font-bold text-gold mb-3">ፍኖተ ሕይወት</h3>
            <p className="text-accent-foreground/70 text-sm font-body leading-relaxed">
              {t("footer.description")}
            </p>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-3 text-gold-glow">{t("footer.quickLinks")}</h4>
            <div className="space-y-2 text-sm font-body">
              {[
                { to: "/about", label: t("nav.about") },
                { to: "/education", label: t("nav.education") },
                { to: "/events", label: t("nav.events") },
                { to: "/media", label: t("nav.media") },
              ].map((link) => (
                <Link key={link.to} to={link.to} className="block text-accent-foreground/70 hover:text-gold transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-3 text-gold-glow">{t("footer.special")}</h4>
            <div className="space-y-2 text-sm font-body">
              {[
                { to: "/path", label: t("nav.path") },
                { to: "/kids", label: t("nav.kids") },
                { to: "/fasting", label: t("nav.fasting") },
                { to: "/prayer", label: t("nav.prayer") },
                { to: "/give", label: t("nav.donations") },
              ].map((link) => (
                <Link key={link.to} to={link.to} className="block text-accent-foreground/70 hover:text-gold transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-3 text-gold-glow">{t("footer.contact")}</h4>
            <div className="space-y-2 text-sm text-accent-foreground/70 font-body">
              <p>Hossana Debre Mihret Cathedral</p>
              <p>Hossana, SNNPR, Ethiopia</p>
              <p>finotehiwot@church.org</p>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-accent-foreground/10 text-center text-xs text-accent-foreground/50 font-body">
          © {new Date().getFullYear()} Finote Hiwot Sunday School. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
