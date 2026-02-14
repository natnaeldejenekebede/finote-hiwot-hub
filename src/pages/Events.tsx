import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/SectionHeading";
import { Calendar as CalendarIcon, Clock, MapPin, List, LayoutGrid, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";

interface EventItem {
  id: string;
  title: string;
  title_am: string | null;
  description: string | null;
  description_am: string | null;
  event_date: string | null;
  event_time: string | null;
  location: string | null;
  location_am: string | null;
  event_type: string;
  recurring: boolean;
}

const typeColors: Record<string, string> = {
  class: "bg-accent/10 text-accent border-accent/20",
  feast: "bg-primary/10 text-primary border-primary/20",
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const Events = () => {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const isAm = i18n.language === "am";

  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase.from("events").select("*").order("event_date", { ascending: true });
      if (data) setEvents(data as EventItem[]);
      setLoading(false);
    };
    fetchEvents();
  }, []);

  const calendarEvents = useMemo(() => events.filter(e => e.event_date), [events]);

  if (loading) return <Layout><div className="py-20 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></div></Layout>;

  return (
    <Layout>
      <section className="py-20 ethiopian-pattern">
        <div className="container mx-auto px-4">
          <SectionHeading title={t("events.title")} subtitle={t("events.subtitle")} />

          <div className="flex justify-center gap-2 mb-8">
            <Button variant={view === "list" ? "default" : "outline"} size="sm" onClick={() => setView("list")} className="gap-2">
              <List className="w-4 h-4" /> {t("events.listView")}
            </Button>
            <Button variant={view === "calendar" ? "default" : "outline"} size="sm" onClick={() => setView("calendar")} className="gap-2">
              <LayoutGrid className="w-4 h-4" /> {t("events.calendarView")}
            </Button>
          </div>

          {events.length === 0 && <p className="text-center text-muted-foreground font-body">No events yet. Check back soon!</p>}

          {view === "list" ? (
            <div className="max-w-3xl mx-auto space-y-4">
              {events.map((event, i) => (
                <motion.div key={event.id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="bg-card rounded-lg border border-border p-6 hover:border-primary/30 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <h3 className="font-display font-semibold text-lg text-foreground">{isAm ? (event.title_am || event.title) : event.title}</h3>
                    <span className={`text-xs font-body font-semibold px-3 py-1 rounded-full border ${typeColors[event.event_type] || typeColors.feast}`}>
                      {event.event_type === "class" ? t("events.weeklyClass") : t("events.feastDay")}
                    </span>
                  </div>
                  {event.description && <p className="text-muted-foreground text-sm font-body mb-3">{isAm ? (event.description_am || event.description) : event.description}</p>}
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground font-body">
                    {event.event_date && <span className="flex items-center gap-1"><CalendarIcon size={14} /> {new Date(event.event_date).toLocaleDateString()}</span>}
                    {event.event_time && <span className="flex items-center gap-1"><Clock size={14} /> {event.event_time}</span>}
                    {event.location && <span className="flex items-center gap-1"><MapPin size={14} /> {isAm ? (event.location_am || event.location) : event.location}</span>}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <h3 className="font-display text-xl font-bold text-foreground mb-6 text-center">{t("events.upcomingFeasts")}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {calendarEvents.map((event, i) => {
                  const d = new Date(event.event_date!);
                  const monthLabel = MONTHS[d.getMonth()];
                  const daysUntil = Math.max(0, Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
                  return (
                    <motion.div key={event.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                      className="bg-card rounded-xl border border-border overflow-hidden hover:border-primary/30 transition-all">
                      <div className="bg-primary/10 p-4 text-center">
                        <p className="text-xs font-body text-primary font-semibold uppercase">{monthLabel}</p>
                        <p className="text-4xl font-display font-bold text-foreground">{d.getDate()}</p>
                        <p className="text-xs text-muted-foreground font-body">{d.getFullYear()}</p>
                      </div>
                      <div className="p-4">
                        <h4 className="font-display font-semibold text-foreground mb-1">{isAm ? (event.title_am || event.title) : event.title}</h4>
                        {event.description && <p className="text-muted-foreground text-xs font-body mb-2">{isAm ? (event.description_am || event.description) : event.description}</p>}
                        <span className="text-xs font-body text-primary font-semibold">
                          {daysUntil > 0 ? `${daysUntil} ${t("home.days")}` : "Today!"}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Events;
