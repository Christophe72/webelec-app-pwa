import type { SectionCable, TypeCircuit } from "./types";

export function getDisjoncteurMaxRgie(
  sectionMm2: SectionCable,
  circuit: TypeCircuit,
): number {
  if (sectionMm2 === 1.5) {
    if (circuit === "eclairage") {
      return 10;
    }
    return 16;
  }

  if (sectionMm2 === 2.5) {
    if (circuit === "prises") {
      return 20;
    }
    if (circuit === "mixte") {
      return 16;
    }
    if (circuit === "eclairage") {
      return 16;
    }
    return 20;
  }

  if (sectionMm2 === 4) {
    return 25;
  }

  if (sectionMm2 === 6) {
    return 32;
  }
  if(sectionMm2 === 10) {
    return 40;
  }
 
  return 63;
}

export function getMessagesRegles(
  sectionMm2: SectionCable,
  circuit: TypeCircuit,
): string[] {
  const messages: string[] = [];

  if (circuit === "mixte") {
    messages.push("Circuit mixte limité à 16A");
  }

  if (sectionMm2 === 1.5 && circuit === "eclairage") {
    messages.push("Éclairage 1.5 mm² recommandé en 10A");
  }

  messages.push("Vérifier chute de tension et mode de pose");

  return messages;
}

export function getMessagesChuteTension(
  chuteTensionPourcent: number,
  circuit: TypeCircuit,
): string[] {
  const messages: string[] = [];
  const limitePourcent = circuit === "eclairage" ? 3 : 5;

  if (chuteTensionPourcent > limitePourcent) {
    messages.push(
      `Chute de tension élevée (${chuteTensionPourcent.toFixed(2)}% > ${limitePourcent}%)`,
    );
  }

  return messages;
}
