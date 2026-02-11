import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === "en" ? "am" : "en")}
      className="h-8 px-2 text-xs font-ethiopic"
    >
      {language === "en" ? "አማ" : "EN"}
    </Button>
  );
};

export default LanguageToggle;
