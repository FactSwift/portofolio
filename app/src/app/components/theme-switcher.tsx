"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300/80 bg-white/70 text-slate-900 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-300 hover:text-brand-600 dark:border-slate-700/80 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:border-red-400 dark:hover:text-red-300"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
