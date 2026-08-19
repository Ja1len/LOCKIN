"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getTheme, saveTheme, type ThemeMode } from "./store";

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  themes: {
    id: ThemeMode;
    name: string;
    description: string;
    swatches: string[];
    bg: string;
    accent: string;
  }[];
}

export const THEMES: ThemeContextType["themes"] = [
  {
    id: "clean",
    name: "Clean Study",
    description: "Bright, academic, and structured for daily study.",
    swatches: ["#f7f7f2", "#2d6a4f", "#e6e8e2"],
    bg: "#f7f7f2",
    accent: "#2d6a4f",
  },
  {
    id: "focus",
    name: "Deep Focus",
    description: "Quiet, minimal dark mode with ultra-low visual distraction.",
    swatches: ["#121814", "#18221b", "#a7d9bb"],
    bg: "#121814",
    accent: "#a7d9bb",
  },
  {
    id: "energy",
    name: "Energy Mode",
    description: "Warm, vibrant, and achievement-oriented momentum.",
    swatches: ["#fdf8f0", "#c94724", "#fbd38d"],
    bg: "#fdf8f0",
    accent: "#c94724",
  },
];

const ThemeContext = createContext<ThemeContextType>({
  theme: "clean",
  setTheme: () => {},
  themes: THEMES,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("clean");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = getTheme();
    setThemeState(saved);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "focus") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme, mounted]);

  const setTheme = (nextTheme: ThemeMode) => {
    setThemeState(nextTheme);
    saveTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
