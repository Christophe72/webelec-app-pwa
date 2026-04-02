import Image from "next/image";
import { ImageMenu } from "./components/image-menu";
import { MAIN_MENU_ITEMS } from "./components/main-menu-items";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
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
        <div className={`${styles.animate} ${styles.animateHeading}`}>
          <h1 className={styles.heading}>WebElec</h1>
          <p className={styles.sub}>Assistant électrique RGIE</p>
        </div>

        {/* Menu principal avec images */}
        <ImageMenu items={MAIN_MENU_ITEMS} />

        {/* CTA buttons */}
        <div className={`${styles.animate} ${styles.animateActions}`}>
          <div className={styles.actions}>
            {/* <Link href="/diagnostic" className={styles.btnPrimary}>
              Commencer un diagnostic
            </Link>
            <Link href="/calculs/disjoncteur" className={styles.btnSecondary}>
              Calcul disjoncteur
            </Link> */}
          </div>
        </div>
      </section>
    </main>
  );
}
