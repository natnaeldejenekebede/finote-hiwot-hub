import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "am";

const translations: Record<string, Record<Language, string>> = {
  home: { en: "Home", am: "መነሻ" },
  about: { en: "About", am: "ስለ እኛ" },
  events: { en: "Events", am: "ዝግጅቶች" },
  media: { en: "Media", am: "ሚዲያ" },
  education: { en: "Education", am: "ትምህርት" },
  donations: { en: "Donations", am: "ልገሳ" },
  join: { en: "Join Us", am: "ይቀላቀሉን" },
  prayer: { en: "Prayer Wall", am: "የጸሎት ግድግዳ" },
  fasting: { en: "Fasting", am: "ጾም" },
  kids: { en: "Kids", am: "ሕፃናት" },
  path: { en: "Spiritual Path", am: "መንፈሳዊ ጉዞ" },
  admin: { en: "Admin", am: "አስተዳዳሪ" },
  login: { en: "Login", am: "ግባ" },
  register: { en: "Register", am: "ተመዝገብ" },
  submit: { en: "Submit", am: "አቅርብ" },
  verseOfDay: { en: "Verse of the Day", am: "የዕለቱ ጥቅስ" },
  search: { en: "Search", am: "ፈልግ" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem("fh-lang") as Language) || "en";
  });

  const t = (key: string) => translations[key]?.[language] || key;

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("fh-lang", lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
