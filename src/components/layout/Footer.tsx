import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-foreground text-primary-foreground">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-display text-xl font-bold text-gold mb-3">ፍኖተ ሕይወት</h3>
          <p className="text-primary-foreground/70 text-sm font-body leading-relaxed">
            Finote Hiwot Sunday School at EOTC Hossana Debre Mihret Cathedral. Nurturing faith through education and fellowship.
          </p>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3 text-gold-glow">Quick Links</h4>
          <div className="space-y-2 text-sm font-body">
            {[
              { to: "/about", label: "About Us" },
              { to: "/events", label: "Events" },
              { to: "/media", label: "Media" },
              { to: "/join", label: "Join Us" },
              { to: "/give", label: "Donate" },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block text-primary-foreground/70 hover:text-gold transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3 text-gold-glow">Contact</h4>
          <div className="space-y-2 text-sm text-primary-foreground/70 font-body">
            <p>Hossana Debre Mihret Cathedral</p>
            <p>Hossana, SNNPR, Ethiopia</p>
            <p>finotehiwot@church.org</p>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-primary-foreground/10 text-center text-xs text-primary-foreground/50 font-body">
        © {new Date().getFullYear()} Finote Hiwot Sunday School. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
