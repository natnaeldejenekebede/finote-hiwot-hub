import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const steps = ["Personal Info", "Church Info", "Confirmation"];

const Join = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    fullName: "",
    christianName: "",
    phone: "",
    age: "",
    department: "",
    baptismalFather: "",
  });

  const update = (field: string, value: string) => setForm({ ...form, [field]: value });

  const handleSubmit = () => {
    toast({
      title: "Registration Submitted! ✦",
      description: "Thank you for joining Finote Hiwot Sunday School. We will contact you soon.",
    });
    setStep(0);
    setForm({ fullName: "", christianName: "", phone: "", age: "", department: "", baptismalFather: "" });
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
                    <Label htmlFor="christianName" className="font-body">Christian Name / የክርስትና ስም</Label>
                    <Input id="christianName" value={form.christianName} onChange={(e) => update("christianName", e.target.value)} placeholder="Enter your christian name" className="mt-1" />
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
                  <h3 className="font-display text-xl font-bold text-foreground">Confirm Your Details</h3>
                  <div className="space-y-2 text-sm font-body">
                    {[
                      ["Full Name", form.fullName],
                      ["Christian Name", form.christianName],
                      ["Phone", form.phone],
                      ["Age", form.age],
                      ["Department", form.department],
                      ["Baptismal Father", form.baptismalFather],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="text-foreground font-medium">{value || "—"}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
                    <Button onClick={handleSubmit} className="flex-1">Submit Registration</Button>
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
