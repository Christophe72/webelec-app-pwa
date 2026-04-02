import Image from "next/image";
import Link from "next/link";
import { AppHeader } from "./app-header";
import styles from "./page.module.css";

const CARDS = [
  { href: "/diagnostic", label: "Diagnostic", icon: "🔍" },
  { href: "/section", label: "Section câble", icon: "⚡" },
  { href: "/calculs/disjoncteur", label: "Disjoncteur", icon: "🔌" },
  { href: "/qcm", label: "QCM RGIE", icon: "📝" },
];

export default function Home() {
  return (
    <main className={styles.main}>
      <AppHeader />

      <section className={styles.section}>
        {/* Logo */}
        <Image
          src="/icon-512x512.png"
          alt="WebElec Logo"
          width={384}
          height={384}
          className={styles.logoImg}
          priority
        />

        {/* Heading */}
        <div className={styles.animate} style={{ "--delay": "80ms" } as React.CSSProperties}>
          <h1 className={styles.heading}>WebElec</h1>
          <p className={styles.sub}>Assistant électrique RGIE</p>
        </div>

        {/* Quick-access cards */}
        <div className={styles.cards}>
          {CARDS.map((card, i) => (
            <Link
              key={card.href}
              href={card.href}
              className={styles.card}
              style={{ "--delay": `${250 + i * 200}ms` } as React.CSSProperties}
            >
              <span className={styles.cardIcon}>{card.icon}</span>
              {card.label}
            </Link>
          ))}
        </div>

        {/* CTA buttons */}
        <div
          className={styles.animate}
          style={{ "--delay": `${250 + CARDS.length * 200}ms` } as React.CSSProperties}
        >
          <div className={styles.actions}>
            <Link href="/diagnostic" className={styles.btnPrimary}>
              Commencer un diagnostic
            </Link>
            <Link href="/calculs/disjoncteur" className={styles.btnSecondary}>
              Calcul disjoncteur
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
