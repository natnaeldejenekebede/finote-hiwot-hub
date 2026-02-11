import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Heart, Send } from "lucide-react";
import EthiopianCross from "@/components/EthiopianCross";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

const prayerSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  prayer_text: z.string().trim().min(5, "Please write at least a few words").max(500),
  is_anonymous: z.boolean(),
});

interface PrayerRequest {
  id: string;
  name: string;
  prayer_text: string;
  is_anonymous: boolean;
  created_at: string;
}

const PrayerWall = () => {
  const [name, setName] = useState("");
  const [prayerText, setPrayerText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);

  useEffect(() => {
    fetchPrayers();
  }, []);

  const fetchPrayers = async () => {
    const { data } = await supabase
      .from("prayer_requests")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(20);
    if (data) setPrayers(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = prayerSchema.safeParse({ name, prayer_text: prayerText, is_anonymous: isAnonymous });
    if (!result.success) {
      toast({ title: "Validation Error", description: result.error.errors[0].message, variant: "destructive" });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("prayer_requests").insert({
      name: isAnonymous ? "Anonymous" : result.data.name,
      prayer_text: result.data.prayer_text,
      is_anonymous: result.data.is_anonymous,
    });

    if (error) {
      toast({ title: "Error", description: "Failed to submit prayer request.", variant: "destructive" });
    } else {
      toast({ title: "Prayer Submitted ✦", description: "Your prayer request has been submitted for review." });
      setName("");
      setPrayerText("");
      setIsAnonymous(false);
    }
    setSubmitting(false);
  };

  return (
    <Layout>
      <section className="py-20 ethiopian-pattern cross-watermark">
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeading
            title="Virtual Prayer Wall"
            subtitle="የጸሎት ግድግዳ — Submit names and prayers for intercession"
          />

          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Submit form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="bg-card rounded-xl border border-border p-8">
                <h3 className="font-display text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Send className="w-5 h-5 text-primary" />
                  Submit a Prayer Request
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="font-body">Your Name / ስም</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      disabled={isAnonymous}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch checked={isAnonymous} onCheckedChange={setIsAnonymous} />
                    <Label className="font-body text-sm text-muted-foreground">Submit anonymously</Label>
                  </div>
                  <div>
                    <Label htmlFor="prayer" className="font-body">Prayer Request / ጸሎት</Label>
                    <Textarea
                      id="prayer"
                      value={prayerText}
                      onChange={(e) => setPrayerText(e.target.value)}
                      placeholder="Write your prayer request or name for intercession (Ammetet)..."
                      rows={4}
                      className="mt-1"
                    />
                  </div>
                  <Button type="submit" disabled={submitting} className="w-full">
                    {submitting ? "Submitting..." : "Submit Prayer"}
                  </Button>
                </form>
              </div>
            </motion.div>

            {/* Prayer wall display */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-secondary" />
                Community Prayers
              </h3>
              {prayers.length === 0 ? (
                <div className="bg-card rounded-xl border border-border p-8 text-center">
                  <EthiopianCross className="w-8 h-8 text-primary mx-auto mb-3" />
                  <p className="text-muted-foreground font-body text-sm">
                    No approved prayers yet. Be the first to submit a prayer request.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {prayers.map((p, i) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-card rounded-lg border border-border p-4"
                    >
                      <p className="text-foreground text-sm font-body mb-2">{p.prayer_text}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground font-body">
                        <span>— {p.is_anonymous ? "Anonymous" : p.name}</span>
                        <span>{new Date(p.created_at).toLocaleDateString()}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PrayerWall;
