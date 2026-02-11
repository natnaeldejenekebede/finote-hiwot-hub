import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, MessageSquare, BarChart3, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface Member {
  id: string;
  full_name: string;
  christian_name: string | null;
  department: string | null;
  status: string | null;
  created_at: string;
}

interface PrayerRequest {
  id: string;
  name: string;
  prayer_text: string;
  status: string | null;
  created_at: string;
}

const CHART_COLORS = ["hsl(43,65%,52%)", "hsl(0,75%,27%)", "hsl(150,40%,16%)", "hsl(43,80%,58%)"];

const Admin = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "members" | "prayers">("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    // Check admin role
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);
    
    const isAdmin = roles?.some((r) => r.role === "admin");
    if (!isAdmin) {
      toast({ title: "Access Denied", description: "Admin privileges required.", variant: "destructive" });
      navigate("/");
      return;
    }
    fetchData();
  };

  const fetchData = async () => {
    const [membersRes, prayersRes] = await Promise.all([
      supabase.from("members").select("*").order("created_at", { ascending: false }),
      supabase.from("prayer_requests").select("*").order("created_at", { ascending: false }),
    ]);
    if (membersRes.data) setMembers(membersRes.data);
    if (prayersRes.data) setPrayers(prayersRes.data);
    setLoading(false);
  };

  const updatePrayerStatus = async (id: string, status: string) => {
    await supabase.from("prayer_requests").update({ status }).eq("id", id);
    setPrayers((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    toast({ title: `Prayer ${status}` });
  };

  const updateMemberStatus = async (id: string, status: string) => {
    await supabase.from("members").update({ status }).eq("id", id);
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
    toast({ title: `Member ${status}` });
  };

  // Chart data
  const deptDistribution = ["education", "choir", "service", "finance"].map((dept) => ({
    name: dept.charAt(0).toUpperCase() + dept.slice(1),
    value: members.filter((m) => m.department === dept).length,
  }));

  const monthlyRegistrations = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const month = d.toLocaleDateString("en-US", { month: "short" });
    const count = members.filter((m) => {
      const mDate = new Date(m.created_at);
      return mDate.getMonth() === d.getMonth() && mDate.getFullYear() === d.getFullYear();
    }).length;
    return { month, count };
  });

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: BarChart3 },
    { id: "members" as const, label: "Members", icon: Users },
    { id: "prayers" as const, label: "Prayers", icon: MessageSquare },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="py-20 text-center">
          <p className="text-muted-foreground font-body">Loading admin panel...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Admin Command Center</h1>
          <p className="text-muted-foreground font-body mb-8">Manage members, content, and prayer requests</p>

          {/* Tab nav */}
          <div className="flex gap-2 mb-8 border-b border-border pb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-body font-medium transition-colors ${
                  activeTab === tab.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Overview */}
          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Stats cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  { label: "Total Members", value: members.length, icon: Users },
                  { label: "Pending Approvals", value: members.filter((m) => m.status === "pending").length, icon: BookOpen },
                  { label: "Prayer Requests", value: prayers.length, icon: MessageSquare },
                ].map((stat) => (
                  <div key={stat.label} className="bg-card rounded-lg border border-border p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <stat.icon className="w-5 h-5 text-primary" />
                      <span className="text-sm font-body text-muted-foreground">{stat.label}</span>
                    </div>
                    <p className="text-3xl font-display font-bold text-foreground">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card rounded-lg border border-border p-6">
                  <h3 className="font-display font-semibold text-foreground mb-4">Monthly Registrations</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={monthlyRegistrations}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(43,25%,85%)" />
                      <XAxis dataKey="month" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(43,65%,52%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-card rounded-lg border border-border p-6">
                  <h3 className="font-display font-semibold text-foreground mb-4">Department Distribution</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={deptDistribution} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                        {deptDistribution.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}

          {/* Members */}
          {activeTab === "members" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm font-body">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-3 text-muted-foreground">Name</th>
                        <th className="text-left p-3 text-muted-foreground">Christian Name</th>
                        <th className="text-left p-3 text-muted-foreground">Department</th>
                        <th className="text-left p-3 text-muted-foreground">Status</th>
                        <th className="text-left p-3 text-muted-foreground">Date</th>
                        <th className="text-left p-3 text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((m) => (
                        <tr key={m.id} className="border-t border-border">
                          <td className="p-3 text-foreground">{m.full_name}</td>
                          <td className="p-3 text-foreground">{m.christian_name || "—"}</td>
                          <td className="p-3 text-foreground capitalize">{m.department || "—"}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              m.status === "approved" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"
                            }`}>
                              {m.status}
                            </span>
                          </td>
                          <td className="p-3 text-muted-foreground">{new Date(m.created_at).toLocaleDateString()}</td>
                          <td className="p-3">
                            {m.status === "pending" && (
                              <div className="flex gap-1">
                                <Button size="sm" variant="ghost" onClick={() => updateMemberStatus(m.id, "approved")}>
                                  <Check className="w-4 h-4 text-accent" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => updateMemberStatus(m.id, "rejected")}>
                                  <X className="w-4 h-4 text-destructive" />
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                      {members.length === 0 && (
                        <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No members yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Prayers */}
          {activeTab === "prayers" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="space-y-3">
                {prayers.map((p) => (
                  <div key={p.id} className="bg-card rounded-lg border border-border p-4 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-foreground text-sm font-body mb-1">{p.prayer_text}</p>
                      <p className="text-xs text-muted-foreground font-body">
                        By {p.name} • {new Date(p.created_at).toLocaleDateString()} •{" "}
                        <span className={p.status === "approved" ? "text-accent" : "text-primary"}>{p.status}</span>
                      </p>
                    </div>
                    {p.status === "pending" && (
                      <div className="flex gap-1 flex-shrink-0">
                        <Button size="sm" variant="ghost" onClick={() => updatePrayerStatus(p.id, "approved")}>
                          <Check className="w-4 h-4 text-accent" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => updatePrayerStatus(p.id, "rejected")}>
                          <X className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                {prayers.length === 0 && (
                  <div className="bg-card rounded-lg border border-border p-8 text-center text-muted-foreground font-body">
                    No prayer requests yet.
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Admin;
