import type { SectionCable, TypeReseau } from "./types";

export const DISJONCTEURS_STANDARDS = [
  2, 4, 6, 10, 16, 20, 25, 32, 40, 50, 63,
] as const;

export function calculerIntensite(
  puissanceW: number,
  tensionV: number,
  reseau: TypeReseau,
): number {
  if (tensionV <= 0 || puissanceW < 0) {
    return 0;
  }

  if (reseau === "monophase") {
    return puissanceW / tensionV;
  }

  return puissanceW / (Math.sqrt(3) * tensionV);
}

export function choisirDisjoncteurStandard(intensiteA: number): number {
  const intensiteSecurisee = Math.max(0, intensiteA);
  const calibre = DISJONCTEURS_STANDARDS.find((std) => std >= intensiteSecurisee);

  return calibre ?? DISJONCTEURS_STANDARDS[DISJONCTEURS_STANDARDS.length - 1];
}

const RESISTIVITE_CUIVRE = 0.0175;

export function calculerChuteTension(
  intensiteA: number,
  tensionV: number,
  longueurCableM: number,
  sectionMm2: SectionCable,
  reseau: TypeReseau,
): { chuteTensionV: number; chuteTensionPourcent: number } {
  if (
    intensiteA < 0 ||
    tensionV <= 0 ||
    longueurCableM <= 0 ||
    sectionMm2 <= 0
  ) {
    return { chuteTensionV: 0, chuteTensionPourcent: 0 };
  }

  const chuteTensionV =
    reseau === "monophase"
      ? (2 * RESISTIVITE_CUIVRE * longueurCableM * intensiteA) / sectionMm2
      : (Math.sqrt(3) * RESISTIVITE_CUIVRE * longueurCableM * intensiteA) /
        sectionMm2;

  const chuteTensionPourcent = (chuteTensionV / tensionV) * 100;

  return { chuteTensionV, chuteTensionPourcent };
}
