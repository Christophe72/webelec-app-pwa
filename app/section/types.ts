export type TypeReseau = "monophase" | "triphase";

export type TypeCircuit = "eclairage" | "prises" | "mixte" | "specifique";

export type ModePose = "A1" | "B1" | "B2" | "C" | "E";

export type SectionCable = 1.5 | 2.5 | 4 | 6 | 10 | 16 | 25 | 35 | 50;

export interface SectionInput {
  puissanceW: number;
  tensionV: number;
  reseau: TypeReseau;
  longueurCableM: number;
  temperatureC: number;
  circuit: TypeCircuit;
  modePose: ModePose;
}

export interface SectionResult {
  intensiteCalculeeA: number;
  sectionRecommandee: SectionCable;
  capaciteSectionA: number;
  chuteTensionV: number;
  chuteTensionPourcent: number;
  conforme: boolean;
  messages: string[];
}
