import type { ElementType } from "./types";

interface ElementIconProps {
  type: ElementType;
  size?: number;
}

export function ElementIcon({ type, size = 24 }: ElementIconProps) {
  const s = size;

  switch (type) {
    case "lampe":
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        >
          <circle cx="32" cy="32" r="18" />
          <path d="M14 32h36M32 14v36" />
        </svg>
      );

    case "interrupteur":
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        >
          <circle cx="20" cy="32" r="6" />
          <circle cx="44" cy="32" r="6" />
          <path d="M26 32l16-10" />
        </svg>
      );

    case "prise":
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        >
          <rect x="12" y="12" width="40" height="40" rx="6" />
          <circle cx="26" cy="30" r="3" fill="currentColor" stroke="none" />
          <circle cx="38" cy="30" r="3" fill="currentColor" stroke="none" />
          <path d="M32 40v6" />
          <path d="M28 46h8" />
        </svg>
      );

    case "tableau":
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        >
          <rect x="14" y="10" width="36" height="44" rx="4" />
          <rect x="20" y="18" width="24" height="6" strokeWidth="2" />
          <rect x="20" y="28" width="24" height="18" strokeWidth="2" />
          <circle cx="46" cy="14" r="2" fill="currentColor" stroke="none" />
        </svg>
      );

    case "va-et-vient":
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        >
          <circle cx="8" cy="32" r="4" fill="currentColor" stroke="none" />
          <path d="M12 32L56 18" />
          <path d="M12 32L56 46" />
          <circle cx="56" cy="18" r="4" fill="currentColor" stroke="none" />
          <circle cx="56" cy="46" r="4" fill="currentColor" stroke="none" />
        </svg>
      );

    case "dj":
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        >
          <rect x="16" y="12" width="32" height="40" rx="4" />
          <path d="M22 24h20M22 34h20M32 12v-6M32 52v6" />
        </svg>
      );

    case "ddr":
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        >
          <rect x="14" y="12" width="36" height="40" rx="4" />
          <path d="M20 24h24M20 34h24" />
          <path d="M32 40c6 0 10 4 10 10" />
          <path d="M42 50h-6" />
        </svg>
      );

    case "rj45":
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        >
          <rect x="12" y="12" width="40" height="40" rx="6" />
          <rect x="22" y="26" width="20" height="14" strokeWidth="2" />
          <path d="M24 26v-6h16v6" strokeWidth="2" />
        </svg>
      );

    case "tv":
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        >
          <rect x="12" y="12" width="40" height="40" rx="6" />
          <circle cx="32" cy="32" r="6" />
          <circle cx="32" cy="32" r="2" fill="currentColor" stroke="none" />
        </svg>
      );

    case "detecteur-fumee":
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        >
          <circle cx="32" cy="32" r="20" />
          <path d="M22 28h20M22 34h20" />
        </svg>
      );

    case "sonnette":
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        >
          <path d="M20 42a12 12 0 0 1 24 0" />
          <path d="M18 42h28" />
          <circle cx="32" cy="46" r="2" fill="currentColor" stroke="none" />
        </svg>
      );

    case "boite-deriv":
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        >
          <rect x="16" y="16" width="32" height="32" />
          <circle cx="32" cy="32" r="3" fill="currentColor" stroke="none" />
        </svg>
      );

    case "poussoir":
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        >
          <rect x="18" y="18" width="28" height="28" rx="4" />
          <circle cx="32" cy="32" r="6" />
        </svg>
      );

    default:
      return <svg width={s} height={s} viewBox="0 0 64 64" />;
  }
}
