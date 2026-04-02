"use client";

import { useEffect, useState } from "react";

type ThemeToggleProps = {
  variant?: "floating" | "inline";
  className?: string;
};

export function ThemeToggle({
  variant = "floating",
  className = "",
}: ThemeToggleProps) {
  const [dark, setDark] = useState(false);

  // Read the class already applied by the inline script
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const root = document.documentElement;
    const next = !root.classList.contains("dark");

    root.classList.add("theme-switching");
    root.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setDark(next);

    setTimeout(() => root.classList.remove("theme-switching"), 2000);
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Passer en mode jour" : "Passer en mode nuit"}
      title={dark ? "Mode jour" : "Mode nuit"}
      data-theme-toggle
      data-theme-toggle-variant={variant}
      className={`${variant === "floating" ? "fixed bottom-5 right-5 z-50" : ""}
                 w-11 h-11 rounded-full shadow-lg
                 flex items-center justify-center text-xl select-none
                 bg-white border border-gray-200 text-gray-700 hover:bg-gray-100
                 dark:bg-gray-800 dark:border-gray-700 dark:text-yellow-300 dark:hover:bg-gray-700
                 transition-colors ${className}`}
    >
      {dark ? "☀" : "☾"}
    </button>
  );
}
