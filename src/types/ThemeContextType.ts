interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
  resetTheme: () => void;
}

export type { ThemeContextType };
