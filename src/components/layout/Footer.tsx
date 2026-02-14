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
            {/* Social Media */}
            <div className="flex gap-3 mt-4">
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-accent-foreground/10 flex items-center justify-center hover:bg-primary/20 transition-colors" aria-label="YouTube">
                <svg className="w-4 h-4 text-accent-foreground/70 hover:text-gold" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.19a3 3 0 00-2.11-2.13C19.53 3.5 12 3.5 12 3.5s-7.53 0-9.39.56A3 3 0 00.5 6.19 31.2 31.2 0 000 12a31.2 31.2 0 00.5 5.81 3 3 0 002.11 2.13c1.86.56 9.39.56 9.39.56s7.53 0 9.39-.56a3 3 0 002.11-2.13A31.2 31.2 0 0024 12a31.2 31.2 0 00-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"/></svg>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-accent-foreground/10 flex items-center justify-center hover:bg-primary/20 transition-colors" aria-label="Facebook">
                <svg className="w-4 h-4 text-accent-foreground/70 hover:text-gold" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07c0 6.02 4.39 11.01 10.13 11.93v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.26h3.33l-.53 3.49h-2.8v8.44C19.61 23.08 24 18.09 24 12.07z"/></svg>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-accent-foreground/10 flex items-center justify-center hover:bg-primary/20 transition-colors" aria-label="Telegram">
                <svg className="w-4 h-4 text-accent-foreground/70 hover:text-gold" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 0C5.37 0 0 5.37 0 12s5.37 12 11.99 12S24 18.63 24 12 18.62 0 11.99 0zm5.9 8.1l-1.97 9.28c-.15.66-.54.82-1.09.51l-3.02-2.23-1.46 1.4c-.16.16-.29.29-.6.29l.22-3.07 5.58-5.04c.24-.22-.05-.34-.38-.13l-6.89 4.34-2.97-.93c-.65-.2-.66-.65.13-.96l11.6-4.47c.54-.2 1.01.13.84.96z"/></svg>
              </a>
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
