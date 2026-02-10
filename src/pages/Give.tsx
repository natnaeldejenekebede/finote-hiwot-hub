import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/SectionHeading";
import { Progress } from "@/components/ui/progress";
import { Heart, Building2, Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const projects = [
  { name: "Sunday School Building Expansion", goal: 500000, raised: 320000 },
  { name: "Youth Library & Resource Center", goal: 150000, raised: 95000 },
  { name: "Choir Equipment Fund", goal: 80000, raised: 72000 },
];

const bankAccounts = [
  { bank: "Commercial Bank of Ethiopia", account: "1000xxxxxxxxxx", name: "Finote Hiwot Sunday School" },
  { bank: "Awash Bank", account: "0143xxxxxxxxxx", name: "ፍኖተ ሕይወት ሰ/ት/ቤት" },
];

const Give = () => {
  const copyAccount = (account: string) => {
    navigator.clipboard.writeText(account);
    toast({ title: "Copied!", description: "Account number copied to clipboard." });
  };

  return (
    <Layout>
      <section className="py-20 ethiopian-pattern">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Support Our Mission"
            subtitle="Your generous contributions help us nurture the next generation of faithful believers"
          />

          <div className="max-w-3xl mx-auto">
            {/* Projects */}
            <div className="mb-12">
              <h3 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Heart className="w-6 h-6 text-primary" /> Active Projects
              </h3>
              <div className="space-y-4">
                {projects.map((project, i) => {
                  const pct = Math.round((project.raised / project.goal) * 100);
                  return (
                    <motion.div
                      key={project.name}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-card rounded-lg border border-border p-6"
                    >
                      <h4 className="font-display font-semibold text-foreground mb-2">{project.name}</h4>
                      <Progress value={pct} className="h-2 mb-2" />
                      <div className="flex justify-between text-xs font-body text-muted-foreground">
                        <span>{project.raised.toLocaleString()} ETB raised</span>
                        <span>{pct}% of {project.goal.toLocaleString()} ETB</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Bank info */}
            <div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-primary" /> Bank Account Details
              </h3>
              <div className="space-y-4">
                {bankAccounts.map((bank) => (
                  <div key={bank.bank} className="bg-card rounded-lg border border-border p-6">
                    <h4 className="font-display font-semibold text-foreground mb-1">{bank.bank}</h4>
                    <p className="text-muted-foreground text-sm font-body mb-1">Account Name: {bank.name}</p>
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono text-primary bg-primary/10 px-2 py-1 rounded">{bank.account}</code>
                      <button
                        onClick={() => copyAccount(bank.account)}
                        className="p-1 text-muted-foreground hover:text-primary transition-colors"
                        aria-label="Copy account number"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Give;
