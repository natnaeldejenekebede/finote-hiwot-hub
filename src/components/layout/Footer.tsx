import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-accent text-accent-foreground">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-ethiopic text-xl font-bold text-gold mb-3">ፍኖተ ሕይወት</h3>
          <p className="text-accent-foreground/70 text-sm font-body leading-relaxed">
            Finote Hiwot Sunday School at EOTC Hossana Debre Mihret Cathedral. Nurturing faith through education and fellowship.
          </p>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3 text-gold-glow">Quick Links</h4>
          <div className="space-y-2 text-sm font-body">
            {[
              { to: "/about", label: "About Us" },
              { to: "/education", label: "Education" },
              { to: "/events", label: "Events" },
              { to: "/media", label: "Media" },
            ].map((link) => (
              <Link key={link.to} to={link.to} className="block text-accent-foreground/70 hover:text-gold transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3 text-gold-glow">Special</h4>
          <div className="space-y-2 text-sm font-body">
            {[
              { to: "/path", label: "Spiritual Path" },
              { to: "/kids", label: "Kid's Corner" },
              { to: "/fasting", label: "Fasting Dashboard" },
              { to: "/prayer", label: "Prayer Wall" },
              { to: "/give", label: "Donate" },
            ].map((link) => (
              <Link key={link.to} to={link.to} className="block text-accent-foreground/70 hover:text-gold transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3 text-gold-glow">Contact</h4>
          <div className="space-y-2 text-sm text-accent-foreground/70 font-body">
            <p>Hossana Debre Mihret Cathedral</p>
            <p>Hossana, SNNPR, Ethiopia</p>
            <p>finotehiwot@church.org</p>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-accent-foreground/10 text-center text-xs text-accent-foreground/50 font-body">
        © {new Date().getFullYear()} Finote Hiwot Sunday School. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
