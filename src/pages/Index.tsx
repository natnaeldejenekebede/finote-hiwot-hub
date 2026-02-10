import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, BookOpen, Users, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/SectionHeading";
import EthiopianCross from "@/components/EthiopianCross";
import heroBg from "@/assets/hero-bg.jpg";

const dailyScripture = {
  verse: "\"I am the way, the truth, and the life. No one comes to the Father except through Me.\"",
  reference: "John 14:6",
};

const upcomingFeast = {
  name: "Feast of St. Gabriel",
  date: new Date("2026-03-28"),
};

function getCountdown(target: Date) {
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
  };
}

const features = [
  { icon: BookOpen, title: "Spiritual Education", desc: "Dogma, Canon, and Ethics courses for all ages.", link: "/about" },
  { icon: Calendar, title: "Events & Calendar", desc: "Weekly classes and annual festivals.", link: "/events" },
  { icon: Users, title: "Fellowship", desc: "Join a vibrant community of believers.", link: "/join" },
  { icon: Heart, title: "Support Our Mission", desc: "Contribute to ongoing church projects.", link: "/give" },
];

const Index = () => {
  const countdown = getCountdown(upcomingFeast.date);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-foreground/80" />
        <div className="absolute inset-0 ethiopian-pattern opacity-30" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-3xl"
        >
          <EthiopianCross className="w-12 h-12 text-gold mx-auto mb-6" />
          <h1 className="font-display text-5xl md:text-7xl font-bold text-primary-foreground mb-2">
            ፍኖተ ሕይወት
          </h1>
          <p className="font-display text-xl md:text-2xl text-gold-glow mb-2">
            Finote Hiwot Sunday School
          </p>
          <p className="text-primary-foreground/70 text-sm font-body mb-8">
            EOTC Hossana Debre Mihret Cathedral
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link to="/join">
              <Button variant="hero" size="lg">Become a Member</Button>
            </Link>
            <Link to="/about">
              <Button variant="hero-outline" size="lg">Learn More</Button>
            </Link>
          </div>

          {/* Scripture */}
          <div className="bg-foreground/30 backdrop-blur-sm rounded-lg p-6 border border-primary-foreground/10 max-w-xl mx-auto">
            <p className="font-display text-primary-foreground/90 italic text-lg mb-2">
              {dailyScripture.verse}
            </p>
            <p className="text-gold text-sm font-body font-semibold">— {dailyScripture.reference}</p>
          </div>
        </motion.div>
      </section>

      {/* Countdown */}
      <section className="gradient-burgundy py-6">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <EthiopianCross className="w-5 h-5 text-gold" />
          <p className="text-secondary-foreground font-body text-sm">
            <span className="font-semibold text-gold">{upcomingFeast.name}</span> in{" "}
            <span className="font-bold text-lg text-secondary-foreground">{countdown.days}</span> days,{" "}
            <span className="font-bold text-lg text-secondary-foreground">{countdown.hours}</span> hours
          </p>
          <EthiopianCross className="w-5 h-5 text-gold hidden sm:block" />
        </div>
      </section>

      {/* Features */}
      <section className="py-20 ethiopian-pattern">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Our Pillars"
            subtitle="Rooted in the ancient traditions of the Ethiopian Orthodox Tewahedo Church"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={f.link}
                  className="block bg-card rounded-lg p-6 border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 group h-full"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <f.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2 text-foreground">{f.title}</h3>
                  <p className="text-muted-foreground text-sm font-body">{f.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 gradient-gold text-center">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-primary-foreground mb-4">
            Walk the Path of Life With Us
          </h2>
          <p className="text-primary-foreground/80 font-body mb-8 max-w-lg mx-auto">
            Register today and become part of a community devoted to spiritual growth and service.
          </p>
          <Link to="/join">
            <Button variant="hero-outline" size="lg">Register Now</Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
