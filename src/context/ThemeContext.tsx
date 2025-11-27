import { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react";

import type { ThemeContextType } from "../types/ThemeContextType";

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  setTheme: () => {},
  resetTheme: () => {},
});

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<"light" | "dark">(() => {
    const savedTheme = localStorage.getItem("theme");
    return (savedTheme as "light" | "dark") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const setTheme = (newTheme: "light" | "dark") => {
    setThemeState(newTheme);
  };

  const resetTheme = () => {
    setThemeState("light");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export { ThemeContext, ThemeProvider, useTheme };
