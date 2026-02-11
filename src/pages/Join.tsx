import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

const steps = ["Personal Info", "Spiritual Background", "Department Selection"];

const memberSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  christianName: z.string().trim().max(100).optional(),
  phone: z.string().trim().min(9, "Phone number is too short").max(15),
  age: z.string().refine((v) => !isNaN(Number(v)) && Number(v) > 0 && Number(v) < 120, "Invalid age"),
  department: z.string().min(1, "Please select a department"),
  baptismalFather: z.string().trim().max(100).optional(),
});

const Join = () => {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    christianName: "",
    phone: "",
    age: "",
    department: "",
    baptismalFather: "",
  });

  const update = (field: string, value: string) => setForm({ ...form, [field]: value });

  const handleSubmit = async () => {
    const result = memberSchema.safeParse(form);
    if (!result.success) {
      toast({ title: "Validation Error", description: result.error.errors[0].message, variant: "destructive" });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("members").insert({
      full_name: form.fullName,
      christian_name: form.christianName || null,
      phone: form.phone,
      age: parseInt(form.age),
      department: form.department,
      baptismal_father: form.baptismalFather || null,
    });

    if (error) {
      toast({ title: "Error", description: "Failed to submit registration.", variant: "destructive" });
    } else {
      toast({
        title: "Registration Submitted! ✦",
        description: "Thank you for joining Finote Hiwot Sunday School. We will contact you soon.",
      });
      setStep(0);
      setForm({ fullName: "", christianName: "", phone: "", age: "", department: "", baptismalFather: "" });
    }
    setSubmitting(false);
  };

  return (
    <Layout>
      <section className="py-20 ethiopian-pattern">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Join Finote Hiwot"
            subtitle="Become a member of our Sunday School family"
          />

          <div className="max-w-lg mx-auto">
            {/* Step indicators */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {steps.map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-body font-semibold transition-colors ${
                    i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    {i + 1}
                  </div>
                  <span className="text-xs font-body text-muted-foreground hidden sm:inline">{s}</span>
                  {i < steps.length - 1 && <div className="w-8 h-px bg-border" />}
                </div>
              ))}
            </div>

            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card rounded-lg border border-border p-8"
            >
              {step === 0 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName" className="font-body">Full Name / ሙሉ ስም</Label>
                    <Input id="fullName" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="Enter your full name" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="font-body">Phone Number</Label>
                    <Input id="phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+251 ..." className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="age" className="font-body">Age</Label>
                    <Input id="age" type="number" value={form.age} onChange={(e) => update("age", e.target.value)} placeholder="Your age" className="mt-1" />
                  </div>
                  <Button onClick={() => setStep(1)} className="w-full">Next</Button>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="christianName" className="font-body">Christian Name / የክርስትና ስም</Label>
                    <Input id="christianName" value={form.christianName} onChange={(e) => update("christianName", e.target.value)} placeholder="Enter your christian name" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="baptismalFather" className="font-body">Baptismal Father / የክርስትና አባት</Label>
                    <Input id="baptismalFather" value={form.baptismalFather} onChange={(e) => update("baptismalFather", e.target.value)} placeholder="Name of your baptismal father" className="mt-1" />
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep(0)} className="flex-1">Back</Button>
                    <Button onClick={() => setStep(2)} className="flex-1">Next</Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <Label className="font-body">Department / ክፍል</Label>
                    <Select value={form.department} onValueChange={(v) => update("department", v)}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Select department" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="education">Education / ትምህርት</SelectItem>
                        <SelectItem value="choir">Choir / መዝሙር</SelectItem>
                        <SelectItem value="service">Service / አገልግሎት</SelectItem>
                        <SelectItem value="finance">Finance / ገንዘብ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <h3 className="font-display text-lg font-bold text-foreground mt-6">Confirm Your Details</h3>
                  <div className="space-y-2 text-sm font-body">
                    {[
                      ["Full Name", form.fullName],
                      ["Phone", form.phone],
                      ["Age", form.age],
                      ["Christian Name", form.christianName],
                      ["Baptismal Father", form.baptismalFather],
                      ["Department", form.department],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="text-foreground font-medium">{value || "—"}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
                    <Button onClick={handleSubmit} disabled={submitting} className="flex-1">
                      {submitting ? "Submitting..." : "Submit Registration"}
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Join;
