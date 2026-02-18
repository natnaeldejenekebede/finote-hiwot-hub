import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BIBLE_81 } from "@/constants/bibleData";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Book, CheckCircle, Flame, BookOpen, Trophy, Zap, MessageSquarePlus, Save } from "lucide-react";
import Layout from "@/components/layout/Layout";
import confetti from "canvas-confetti";
import { useToast } from "@/hooks/use-toast";

const BibleTracker = ({ userId }: { userId: string }) => {
  const [userProgress, setUserProgress] = useState<Record<string, number[]>>({});
  const [reflections, setReflections] = useState<Record<string, string>>({});
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [lastRead, setLastRead] = useState<{ bookId: string; ch: number } | null>(null);
  const [selectedNote, setSelectedNote] = useState<{ bookId: string; ch: number } | null>(null);
  const { i18n, t } = useTranslation();
  const { toast } = useToast();
  const isAm = i18n.language === "am";

  const categories = [
    { id: "All", key: "all" }, { id: "Law", key: "law" }, { id: "History", key: "history" },
    { id: "Wisdom", key: "wisdom" }, { id: "Prophets", key: "prophets" }, { id: "Gospels", key: "gospels" },
    { id: "Epistles", key: "epistles" }, { id: "Deuterocanon", key: "deuterocanon" }, { id: "Church Order", key: "churchOrder" }
  ];

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    // 1. Fetch Progress
    const { data: progress } = await supabase.from("bible_progress").select("*").eq("user_id", userId);
    if (progress) {
      const progressMap = progress.reduce((acc: any, row: any) => {
        acc[row.book_id] = row.completed_chapters;
        return acc;
      }, {});
      setUserProgress(progressMap);
      const latest = [...progress].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0];
      if (latest) setLastRead({ bookId: latest.book_id, ch: latest.completed_chapters.slice(-1)[0] });
    }

    // 2. Fetch Reflections
    const { data: notes } = await supabase.from("bible_reflections").select("*").eq("user_id", userId);
    if (notes) {
      const notesMap = notes.reduce((acc: any, row: any) => {
        acc[`${row.book_id}-${row.chapter_number}`] = row.reflection_text;
        return acc;
      }, {});
      setReflections(notesMap);
    }
  };

  const toggleChapter = async (bookId: string, chapter: number) => {
    const book = BIBLE_81.find(b => b.id === bookId);
    const currentChapters = userProgress[bookId] || [];
    const isAdding = !currentChapters.includes(chapter);
    const newChapters = isAdding ? [...currentChapters, chapter] : currentChapters.filter((c) => c !== chapter);

    setUserProgress({ ...userProgress, [bookId]: newChapters });
    setLastRead({ bookId, ch: chapter });

    if (isAdding && newChapters.length === book?.chapters) {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#FFD700', '#C0C0C0'] });
    }

    await supabase.from("bible_progress").upsert({
      user_id: userId, book_id: bookId, completed_chapters: newChapters, updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,book_id' });
  };

  const saveReflection = async (text: string) => {
    if (!selectedNote) return;
    const { bookId, ch } = selectedNote;
    const { error } = await supabase.from("bible_reflections").upsert({
      user_id: userId, book_id: bookId, chapter_number: ch, reflection_text: text, updated_at: new Date().toISOString()
    });

    if (!error) {
      setReflections({ ...reflections, [`${bookId}-${ch}`]: text });
      toast({ title: isAm ? "ተቀምጧል" : "Saved", description: isAm ? "ማስታወሻዎ ተቀምጧል" : "Note saved successfully" });
    }
  };

  const stats = useMemo(() => {
    const totalChapters = BIBLE_81.reduce((sum, b) => sum + b.chapters, 0);
    const doneChapters = Object.values(userProgress).flat().length;
    const doneBooks = BIBLE_81.filter(b => (userProgress[b.id]?.length || 0) === b.chapters).length;
    return { percent: Math.round((doneChapters / totalChapters) * 100), chapters: doneChapters, books: doneBooks };
  }, [userProgress]);

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 dark:bg-background/95 pb-20 pt-24">
        <div className="container mx-auto max-w-5xl px-4">
          
          {/* Dashboard Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatsCard icon={<Trophy className="text-primary" />} label={isAm ? "ያለቁ መጻሕፍት" : "Books Finished"} value={`${stats.books} / 81`} />
            <StatsCard 
              icon={<Zap className="text-orange-500" />} 
              label={isAm ? "ጠቅላላ ሂደት" : "Overall Progress"} 
              value={`${stats.percent}%`} 
              progress={stats.percent} 
            />
            <StatsCard icon={<BookOpen className="text-blue-500" />} label={isAm ? "ምዕራፎች" : "Total Chapters"} value={stats.chapters.toString()} />
          </div>

          {/* Quick Resume */}
          {lastRead && (
            <div className="mb-8 p-4 bg-primary text-primary-foreground rounded-2xl flex items-center justify-between shadow-lg shadow-primary/20 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-3">
                <Flame className="w-5 h-5 text-orange-300 animate-pulse" />
                <div>
                  <p className="text-[10px] uppercase font-bold opacity-80">{isAm ? "ካቆሙበት ይቀጥሉ" : "Quick Resume"}</p>
                  <p className="font-bold text-sm">
                    {BIBLE_81.find(b => b.id === lastRead.bookId)?.[isAm ? 'nameAm' : 'nameEn']} - {lastRead.ch}
                  </p>
                </div>
              </div>
              <Button size="sm" variant="secondary" onClick={() => document.getElementById(`book-${lastRead.bookId}`)?.scrollIntoView({ behavior: 'smooth' })}>
                {isAm ? "ሂድ" : "Go to"}
              </Button>
            </div>
          )}

          {/* Filter Bar */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 rounded-full text-[11px] font-bold transition-all border whitespace-nowrap ${
                  activeCategory === cat.id ? "bg-foreground text-background" : "bg-card hover:border-primary"
                }`}
              >
                {t(`bible.categories.${cat.key}`)}
              </button>
            ))}
          </div>

          {/* Books List */}
          <div className="space-y-4">
            {BIBLE_81.filter(b => activeCategory === "All" || b.category === activeCategory).map((book) => {
              const readCount = userProgress[book.id]?.length || 0;
              const isDone = readCount === book.chapters;

              return (
                <div key={book.id} id={`book-${book.id}`} className={`group bg-card rounded-2xl border transition-all ${isDone ? 'border-accent/40 bg-accent/5' : ''}`}>
                  <Accordion type="single" collapsible>
                    <AccordionItem value={book.id} className="border-none">
                      <AccordionTrigger className="px-5 py-4 hover:no-underline">
                        <div className="flex items-center justify-between w-full pr-4 text-left">
                           <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${isDone ? 'bg-accent text-accent-foreground' : 'bg-secondary'}`}>
                                {isDone ? <CheckCircle className="w-5 h-5" /> : book.nameEn[0]}
                              </div>
                              <div>
                                <h4 className="font-bold text-base leading-tight">{isAm ? book.nameAm : book.nameEn}</h4>
                                <p className="text-[10px] text-muted-foreground uppercase">{book.chapters} {t("bible.chapters")}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-xs font-black">{Math.round((readCount/book.chapters)*100)}%</p>
                           </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-5 pb-6">
                        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                          {Array.from({ length: book.chapters }, (_, i) => i + 1).map((ch) => {
                            const hasNote = reflections[`${book.id}-${ch}`];
                            return (
                              <div key={ch} className="relative group/ch">
                                <button
                                  onClick={() => toggleChapter(book.id, ch)}
                                  className={`w-full aspect-square rounded-lg text-[10px] font-bold border transition-all ${
                                    userProgress[book.id]?.includes(ch) ? "bg-primary text-primary-foreground border-primary" : "bg-background"
                                  }`}
                                >
                                  {ch}
                                </button>
                                <Sheet>
                                  <SheetTrigger asChild>
                                    <button 
                                      onClick={() => setSelectedNote({ bookId: book.id, ch })}
                                      className={`absolute -top-1 -right-1 p-1 rounded-full shadow-sm transition-opacity ${hasNote ? 'bg-orange-500 opacity-100' : 'bg-secondary opacity-0 group-hover/ch:opacity-100'}`}
                                    >
                                      <MessageSquarePlus className={`w-2 h-2 ${hasNote ? 'text-white' : 'text-primary'}`} />
                                    </button>
                                  </SheetTrigger>
                                  <SheetContent>
                                    <SheetHeader>
                                      <SheetTitle className="font-display">
                                        {isAm ? book.nameAm : book.nameEn} - {ch}
                                      </SheetTitle>
                                    </SheetHeader>
                                    <div className="mt-6 space-y-4">
                                      <Textarea 
                                        placeholder={t("bible.reflectionHint")}
                                        className="min-h-[300px] text-sm font-body"
                                        defaultValue={reflections[`${book.id}-${ch}`] || ""}
                                        id={`note-${book.id}-${ch}`}
                                      />
                                      <Button className="w-full gap-2" onClick={() => {
                                        const val = (document.getElementById(`note-${book.id}-${ch}`) as HTMLTextAreaElement).value;
                                        saveReflection(val);
                                      }}>
                                        <Save className="w-4 h-4" /> {t("bible.saveNote")}
                                      </Button>
                                    </div>
                                  </SheetContent>
                                </Sheet>
                              </div>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

const StatsCard = ({ icon, label, value, progress }: any) => (
  <div className="bg-card p-5 rounded-2xl border shadow-sm flex items-center gap-4">
    <div className="p-3 bg-secondary rounded-xl">{icon}</div>
    <div className="flex-1">
      <p className="text-[10px] uppercase text-muted-foreground font-bold">{label}</p>
      <div className="flex items-center justify-between">
        <p className="text-xl font-display font-black">{value}</p>
        {progress !== undefined && <Progress value={progress} className="w-12 h-1" />}
      </div>
    </div>
  </div>
);

export default BibleTracker;