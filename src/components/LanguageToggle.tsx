import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const LanguageToggle = () => {
  const { i18n } = useTranslation();

  const toggle = () => {
    const next = i18n.language === "am" ? "en" : "am";
    i18n.changeLanguage(next);
    localStorage.setItem("fh-lang", next);
    document.documentElement.lang = next;
    document.documentElement.style.fontFamily =
      next === "am"
        ? "'Noto Sans Ethiopic', 'Playfair Display', sans-serif"
        : "";
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      className="h-8 px-2 text-xs font-ethiopic"
    >
      {i18n.language === "am" ? "EN" : "አማ"}
    </Button>
  );
};

export default LanguageToggle;
