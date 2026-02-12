import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/SectionHeading";
import { Calendar as CalendarIcon, Clock, MapPin, List, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const events = [
  { title: "Weekly Bible Study", titleAm: "ሳምንታዊ የመጽሐፍ ቅዱስ ጥናት", date: "Every Saturday", dateAm: "በየቅዳሜው", time: "2:00 PM – 4:00 PM", location: "Main Hall", locationAm: "ዋና አዳራሽ", type: "class", desc: "In-depth scripture study for all age groups.", descAm: "ለሁሉም ዕድሜ የመጽሐፍ ቅዱስ ጥናት።", calDate: null },
  { title: "Sunday School Class", titleAm: "ሰንበት ትምህርት", date: "Every Sunday", dateAm: "በየእሑድ", time: "8:00 AM – 10:00 AM", location: "Church Classroom", locationAm: "የቤተ ክርስቲያን ክፍል", type: "class", desc: "Regular teaching sessions on Dogma, Canon, and Ethics.", descAm: "በዶግማ፣ ቀኖና እና ሥነ-ምግባር ላይ ትምህርት።", calDate: null },
  { title: "Feast of St. Gabriel", titleAm: "የቅዱስ ገብርኤል በዓል", date: "March 28, 2026", dateAm: "መጋቢት 19, 2018", time: "All Day", location: "Cathedral", locationAm: "ካቴድራል", type: "feast", desc: "Annual celebration honoring St. Gabriel the Archangel.", descAm: "የቅዱስ ገብርኤልን መታሰቢያ ዓመታዊ ክብረ በዓል።", calDate: new Date("2026-03-28") },
  { title: "Palm Sunday / ሆሳዕና", titleAm: "ሆሳዕና", date: "April 5, 2026", dateAm: "መጋቢት 27, 2018", time: "All Day", location: "Cathedral", locationAm: "ካቴድራል", type: "feast", desc: "Commemoration of Christ's entry into Jerusalem.", descAm: "የክርስቶስን ወደ ኢየሩሳሌም ገብነት ማስታወስ።", calDate: new Date("2026-04-05") },
  { title: "Easter / ፋሲካ", titleAm: "ፋሲካ", date: "April 12, 2026", dateAm: "ሚያዝያ 4, 2018", time: "All Day", location: "Cathedral", locationAm: "ካቴድራል", type: "feast", desc: "The glorious celebration of the Resurrection of Our Lord.", descAm: "የጌታችን ትንሣኤ ክብረ በዓል።", calDate: new Date("2026-04-12") },
  { title: "Meskel", titleAm: "መስቀል", date: "September 27, 2026", dateAm: "መስከረም 17, 2019", time: "All Day", location: "Cathedral", locationAm: "ካቴድራል", type: "feast", desc: "Finding of the True Cross celebration.", descAm: "የመስቀል በዓል ክብረ በዓል።", calDate: new Date("2026-09-27") },
  { title: "Ledet (Christmas)", titleAm: "ልደት", date: "January 7, 2027", dateAm: "ታህሣሥ 29, 2019", time: "All Day", location: "Cathedral", locationAm: "ካቴድራል", type: "feast", desc: "Ethiopian Christmas – Birth of Our Lord Jesus Christ.", descAm: "የጌታችን የኢየሱስ ክርስቶስ ልደት።", calDate: new Date("2027-01-07") },
  { title: "Timket (Epiphany)", titleAm: "ጥምቀት", date: "January 19, 2027", dateAm: "ጥር 11, 2019", time: "All Day", location: "Cathedral", locationAm: "ካቴድራል", type: "feast", desc: "Epiphany – Baptism of Jesus in the Jordan.", descAm: "ጥምቀት – የኢየሱስ በዮርዳኖስ ጥምቀት።", calDate: new Date("2027-01-19") },
  { title: "Choir Practice", titleAm: "የመዝሙር ልምምድ", date: "Every Friday", dateAm: "በየዓርቡ", time: "5:00 PM – 7:00 PM", location: "Choir Room", locationAm: "የመዝሙር ክፍል", type: "class", desc: "Rehearsal for Sunday liturgical hymns (Mezmur).", descAm: "ለእሑድ ቅዳሴ መዝሙር ልምምድ።", calDate: null },
];

const typeColors: Record<string, string> = {
  class: "bg-accent/10 text-accent border-accent/20",
  feast: "bg-primary/10 text-primary border-primary/20",
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTHS_AM = ["ጥር","የካ","መጋ","ሚያ","ግን","ሰኔ","ሐም","ነሐ","መስ","ጥቅ","ህዳ","ታህ"];

const Events = () => {
  const [view, setView] = useState<"list" | "calendar">("list");
  const { t, i18n } = useTranslation();
  const isAm = i18n.language === "am";

  const calendarEvents = useMemo(() => {
    return events.filter(e => e.calDate).sort((a, b) => a.calDate!.getTime() - b.calDate!.getTime());
  }, []);

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

          {view === "list" ? (
            <div className="max-w-3xl mx-auto space-y-4">
              {events.map((event, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="bg-card rounded-lg border border-border p-6 hover:border-primary/30 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <h3 className="font-display font-semibold text-lg text-foreground">{isAm ? event.titleAm : event.title}</h3>
                    <span className={`text-xs font-body font-semibold px-3 py-1 rounded-full border ${typeColors[event.type]}`}>
                      {event.type === "feast" ? t("events.feastDay") : t("events.weeklyClass")}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm font-body mb-3">{isAm ? event.descAm : event.desc}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground font-body">
                    <span className="flex items-center gap-1"><CalendarIcon size={14} /> {isAm ? event.dateAm : event.date}</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {event.time}</span>
                    <span className="flex items-center gap-1"><MapPin size={14} /> {isAm ? event.locationAm : event.location}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <h3 className="font-display text-xl font-bold text-foreground mb-6 text-center">{t("events.upcomingFeasts")}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {calendarEvents.map((event, i) => {
                  const d = event.calDate!;
                  const monthLabel = isAm ? MONTHS_AM[d.getMonth()] : MONTHS[d.getMonth()];
                  const daysUntil = Math.max(0, Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
                  return (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                      className="bg-card rounded-xl border border-border overflow-hidden hover:border-primary/30 transition-all">
                      <div className="bg-primary/10 p-4 text-center">
                        <p className="text-xs font-body text-primary font-semibold uppercase">{monthLabel}</p>
                        <p className="text-4xl font-display font-bold text-foreground">{d.getDate()}</p>
                        <p className="text-xs text-muted-foreground font-body">{d.getFullYear()}</p>
                      </div>
                      <div className="p-4">
                        <h4 className="font-display font-semibold text-foreground mb-1">{isAm ? event.titleAm : event.title}</h4>
                        <p className="text-muted-foreground text-xs font-body mb-2">{isAm ? event.descAm : event.desc}</p>
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
