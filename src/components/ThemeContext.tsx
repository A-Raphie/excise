"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type WinsznxTheme = "obstat" | "routedock" | "mandate";

interface ThemeContextType {
  theme: WinsznxTheme;
  setTheme: (theme: WinsznxTheme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "obstat",
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<WinsznxTheme>("obstat");

  useEffect(() => {
    const saved = localStorage.getItem("excise_theme") as WinsznxTheme | null;
    if (saved && (saved === "obstat" || saved === "routedock" || saved === "mandate")) {
      setThemeState(saved);
    }
  }, []);

  const setTheme = (newTheme: WinsznxTheme) => {
    setThemeState(newTheme);
    localStorage.setItem("excise_theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div
        className={
          theme === "obstat"
            ? "theme-obstat bg-[#f8fafc] text-slate-900 min-h-screen transition-colors duration-200"
            : theme === "mandate"
            ? "theme-mandate bg-[#fbfbfa] text-stone-900 min-h-screen transition-colors duration-200"
            : "theme-routedock bg-[#080b14] text-slate-100 min-h-screen transition-colors duration-200"
        }
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useWinsznxTheme() {
  return useContext(ThemeContext);
}
