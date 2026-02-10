import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/SectionHeading";
import { Calendar as CalendarIcon, Clock, MapPin } from "lucide-react";

const events = [
  { title: "Weekly Bible Study", date: "Every Saturday", time: "2:00 PM – 4:00 PM", location: "Main Hall", type: "class", desc: "In-depth scripture study for all age groups." },
  { title: "Sunday School Class", date: "Every Sunday", time: "8:00 AM – 10:00 AM", location: "Church Classroom", type: "class", desc: "Regular teaching sessions on Dogma, Canon, and Ethics." },
  { title: "Feast of St. Gabriel", date: "March 28, 2026", time: "All Day", location: "Cathedral", type: "feast", desc: "Annual celebration honoring St. Gabriel the Archangel." },
  { title: "Palm Sunday / ሆሳዕና", date: "April 5, 2026", time: "All Day", location: "Cathedral", type: "feast", desc: "Commemoration of Christ's entry into Jerusalem." },
  { title: "Easter / ፋሲካ", date: "April 12, 2026", time: "All Day", location: "Cathedral", type: "feast", desc: "The glorious celebration of the Resurrection of Our Lord." },
  { title: "Choir Practice", date: "Every Friday", time: "5:00 PM – 7:00 PM", location: "Choir Room", type: "class", desc: "Rehearsal for Sunday liturgical hymns (Mezmur)." },
];

const typeColors: Record<string, string> = {
  class: "bg-accent/10 text-accent border-accent/20",
  feast: "bg-primary/10 text-primary border-primary/20",
};

const Events = () => (
  <Layout>
    <section className="py-20 ethiopian-pattern">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Events & Calendar"
          subtitle="Stay connected with our weekly classes and annual celebrations"
        />

        <div className="max-w-3xl mx-auto space-y-4">
          {events.map((event, i) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-card rounded-lg border border-border p-6 hover:border-primary/30 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <h3 className="font-display font-semibold text-lg text-foreground">{event.title}</h3>
                <span className={`text-xs font-body font-semibold px-3 py-1 rounded-full border ${typeColors[event.type]}`}>
                  {event.type === "feast" ? "Feast Day" : "Weekly Class"}
                </span>
              </div>
              <p className="text-muted-foreground text-sm font-body mb-3">{event.desc}</p>
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground font-body">
                <span className="flex items-center gap-1"><CalendarIcon size={14} /> {event.date}</span>
                <span className="flex items-center gap-1"><Clock size={14} /> {event.time}</span>
                <span className="flex items-center gap-1"><MapPin size={14} /> {event.location}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default Events;
