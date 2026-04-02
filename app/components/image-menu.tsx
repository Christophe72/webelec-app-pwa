import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./image-menu.module.css";

export type ImageMenuItem = {
  href: string;
  label: string;
  imageSrc: string;
  imageAlt: string;
};

type ImageMenuProps = {
  items: ImageMenuItem[];
  delayStartMs?: number;
  delayStepMs?: number;
};

export function ImageMenu({
  items,
  delayStartMs = 250,
  delayStepMs = 200,
}: ImageMenuProps) {
  return (
    <nav className={styles.menuGrid} aria-label="Menu principal">
      {items.map((item, index) => (
        <Link
          key={item.href}
          href={item.href}
          className={styles.menuCard}
          style={
            {
              "--delay": `${delayStartMs + index * delayStepMs}ms`,
            } as CSSProperties
          }
        >
          <span className={styles.imageWrap}>
            <Image
              src={item.imageSrc}
              alt={item.imageAlt}
              width={20}
              height={20}
              className={styles.image}
            />
          </span>
          <span className={styles.label}>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
