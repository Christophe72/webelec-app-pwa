import type {
  ModePose,
  SectionCable,
  SectionInput,
  SectionResult,
  TypeReseau,
} from "./types";

// ─── Résistivité cuivre (Ω·mm²/m) ────────────────────────────────────────────

const RESISTIVITE_CUIVRE = 0.0175;
const COEFF_TEMPERATURE_CUIVRE = 0.00393;

// ─── Capacités de courant par section et mode de pose (A) ─────────────────────
// Source : RGIE / NF C 15-100 — câble cuivre bipolaire

const CAPACITES: Record<ModePose, Record<SectionCable, number>> = {
  //         1.5   2.5    4     6    10    16    25    35    50
  A1: {
    1.5: 13,
    2.5: 17.5,
    4: 23,
    6: 29,
    10: 39,
    16: 52,
    25: 68,
    35: 84,
    50: 99,
  },
  B1: {
    1.5: 15,
    2.5: 20,
    4: 27,
    6: 34,
    10: 46,
    16: 62,
    25: 80,
    35: 99,
    50: 118,
  },
  B2: {
    1.5: 14.5,
    2.5: 19.5,
    4: 26,
    6: 33,
    10: 44,
    16: 58,
    25: 73,
    35: 90,
    50: 107,
  },
  C: {
    1.5: 17.5,
    2.5: 24,
    4: 32,
    6: 41,
    10: 57,
    16: 76,
    25: 96,
    35: 119,
    50: 144,
  },
  E: {
    1.5: 19.5,
    2.5: 27,
    4: 36,
    6: 46,
    10: 63,
    16: 85,
    25: 110,
    35: 137,
    50: 167,
  },
};

const SECTIONS_ORDONNEES: SectionCable[] = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50];

// ─── Limites RGIE chute de tension ────────────────────────────────────────────

const LIMITE_CHUTE: Record<string, number> = {
  eclairage: 3,
  prises: 5,
  mixte: 5,
  specifique: 5,
};

// ─── Calculs ──────────────────────────────────────────────────────────────────

function calculerIntensite(
  puissanceW: number,
  tensionV: number,
  reseau: TypeReseau,
): number {
  if (tensionV <= 0 || puissanceW < 0) return 0;
  return reseau === "monophase"
    ? puissanceW / tensionV
    : puissanceW / (Math.sqrt(3) * tensionV);
}

function choisirSection(intensiteA: number, modePose: ModePose): SectionCable {
  const capacites = CAPACITES[modePose];
  const section = SECTIONS_ORDONNEES.find((s) => capacites[s] >= intensiteA);
  return section ?? 50;
}

function calculerChuteTension(
  intensiteA: number,
  tensionV: number,
  longueurM: number,
  sectionMm2: number,
  temperatureC: number,
  reseau: TypeReseau,
): { chuteTensionV: number; chuteTensionPourcent: number } {
  if (
    intensiteA <= 0 ||
    tensionV <= 0 ||
    longueurM <= 0 ||
    sectionMm2 <= 0 ||
    !Number.isFinite(temperatureC)
  ) {
    return { chuteTensionV: 0, chuteTensionPourcent: 0 };
  }

  // Corrige la résistivité à partir de la référence à 20°C.
  const resistiviteCorrigee =
    RESISTIVITE_CUIVRE * (1 + COEFF_TEMPERATURE_CUIVRE * (temperatureC - 20));

  const chuteTensionV =
    reseau === "monophase"
      ? (2 * resistiviteCorrigee * longueurM * intensiteA) / sectionMm2
      : (Math.sqrt(3) * resistiviteCorrigee * longueurM * intensiteA) /
        sectionMm2;

  return {
    chuteTensionV,
    chuteTensionPourcent: (chuteTensionV / tensionV) * 100,
  };
}

// ─── Engine principal ─────────────────────────────────────────────────────────

export function calculerSection(input: SectionInput): SectionResult {
  const {
    puissanceW,
    tensionV,
    reseau,
    longueurCableM,
    temperatureC,
    circuit,
    modePose,
  } = input;

  const intensiteCalculeeA = calculerIntensite(puissanceW, tensionV, reseau);

  // Section minimale par capacité de courant
  let sectionRecommandee = choisirSection(intensiteCalculeeA, modePose);

  // Vérifier aussi la chute de tension — augmenter la section si nécessaire
  const limitePourcent = LIMITE_CHUTE[circuit] ?? 5;
  let { chuteTensionV, chuteTensionPourcent } = calculerChuteTension(
    intensiteCalculeeA,
    tensionV,
    longueurCableM,
    sectionRecommandee,
    temperatureC,
    reseau,
  );

  // Remonter la section si la chute de tension est trop élevée
  while (chuteTensionPourcent > limitePourcent) {
    const idx = SECTIONS_ORDONNEES.indexOf(sectionRecommandee);
    if (idx >= SECTIONS_ORDONNEES.length - 1) break;
    sectionRecommandee = SECTIONS_ORDONNEES[idx + 1];
    ({ chuteTensionV, chuteTensionPourcent } = calculerChuteTension(
      intensiteCalculeeA,
      tensionV,
      longueurCableM,
      sectionRecommandee,
      temperatureC,
      reseau,
    ));
  }

  const capaciteSectionA = CAPACITES[modePose][sectionRecommandee];
  const conforme =
    intensiteCalculeeA <= capaciteSectionA &&
    chuteTensionPourcent <= limitePourcent;

  const messages: string[] = [];

  if (chuteTensionPourcent > limitePourcent) {
    messages.push(
      `Chute de tension trop élevée (${chuteTensionPourcent.toFixed(2)}% > ${limitePourcent}%)`,
    );
  }
  if (circuit === "eclairage" && sectionRecommandee < 1.5) {
    messages.push("Section minimale 1.5 mm² recommandée pour l'éclairage");
  }
  if (circuit === "prises" && sectionRecommandee < 2.5) {
    messages.push("Section minimale 2.5 mm² recommandée pour les prises");
  }
  messages.push("Vérifier le mode de pose et les facteurs de correction");

  return {
    intensiteCalculeeA,
    sectionRecommandee,
    capaciteSectionA,
    chuteTensionV,
    chuteTensionPourcent,
    conforme,
    messages,
  };
}
