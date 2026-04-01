import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import styles from "./app-header.module.css";

const MENU_ITEMS = [
  { href: "/diagnostic", label: "Diagnostic" },
  { href: "/section", label: "Section câble" },
  { href: "/calculs/disjoncteur", label: "Disjoncteur" },
  { href: "/qcm", label: "QCM RGIE" },
];

export function AppHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          WebElec
        </Link>

        <nav className={styles.nav}>
          {MENU_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className={styles.navLink}>
              {item.label}
            </Link>
          ))}
          <ThemeToggle
            variant="inline"
            className="h-9 w-9 border-gray-300 text-base shadow-sm dark:border-gray-700"
          />
        </nav>
      </div>
    </header>
  );
}
