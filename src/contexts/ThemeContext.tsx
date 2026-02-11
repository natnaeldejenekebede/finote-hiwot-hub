import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "parchment" | "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({ theme: "parchment", setTheme: () => {} });

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("fh-theme") as Theme) || "parchment";
  });

  useEffect(() => {
    localStorage.setItem("fh-theme", theme);
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    if (theme === "dark") root.classList.add("dark");
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
