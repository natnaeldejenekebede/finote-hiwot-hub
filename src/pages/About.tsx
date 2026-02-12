import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/SectionHeading";
import { BookOpen, Users, Target } from "lucide-react";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();

  const values = [
    { icon: BookOpen, title: t("about.doctrineTitle"), text: t("about.doctrineText") },
    { icon: Users, title: t("about.communityTitle"), text: t("about.communityText") },
    { icon: Target, title: t("about.missionTitle"), text: t("about.missionText") },
  ];

  const roles = t("about.roles", { returnObjects: true }) as string[];

  return (
    <Layout>
      <section className="py-20 ethiopian-pattern">
        <div className="container mx-auto px-4">
          <SectionHeading title={t("about.title")} subtitle={t("about.subtitle")} />

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <div className="bg-card rounded-lg border border-border p-8 mb-12">
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">{t("about.historyTitle")}</h3>
              <p className="text-muted-foreground font-body leading-relaxed mb-4">{t("about.historyP1")}</p>
              <p className="text-muted-foreground font-body leading-relaxed">{t("about.historyP2")}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {values.map((v, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                  className="bg-card rounded-lg border border-border p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <v.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-display font-semibold text-foreground mb-2">{v.title}</h4>
                  <p className="text-muted-foreground text-sm font-body">{v.text}</p>
                </motion.div>
              ))}
            </div>

            <div className="bg-secondary/10 rounded-lg border border-secondary/20 p-8">
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">{t("about.orgTitle")}</h3>
              <div className="space-y-3 font-body text-sm text-muted-foreground">
                {roles.map((role) => (
                  <div key={role} className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    <span>{role}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
