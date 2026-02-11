import { Sun, Moon, Scroll } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const cycle = () => {
    const order = ["parchment", "light", "dark"] as const;
    const next = order[(order.indexOf(theme as typeof order[number]) + 1) % 3];
    setTheme(next);
  };

  const Icon = theme === "dark" ? Moon : theme === "light" ? Sun : Scroll;

  return (
    <Button variant="ghost" size="icon" onClick={cycle} aria-label="Toggle theme" className="h-8 w-8">
      <Icon className="w-4 h-4" />
    </Button>
  );
};

export default ThemeToggle;
