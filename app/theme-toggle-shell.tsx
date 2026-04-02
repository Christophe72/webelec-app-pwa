"use client";

import { ThemeToggle } from "./theme-toggle";
import styles from "./theme-toggle-shell.module.css";

export function ThemeToggleShell() {
  return (
    <div className={styles.dock}>
      <ThemeToggle
        variant="inline"
        className="ring-1 ring-black/10 dark:ring-white/15"
      />
    </div>
  );
}
