export type TypeReseau = "monophase" | "triphase";

export type TypeCircuit = "eclairage" | "prises" | "mixte" | "specifique";

export type SectionCable = 1.5 | 2.5 | 4 | 6 | 10;

export interface InstallationInput {
  puissanceW: number;
  tensionV: number;
  reseau: TypeReseau;
  sectionMm2: SectionCable;
  circuit: TypeCircuit;
  longueurCableM: number;
}

export interface EvaluationInstallation {
  intensiteCalculeeA: number;
  disjoncteurConseilleA: number;
  disjoncteurMaxRgieA: number;
  chuteTensionV: number;
  chuteTensionPourcent: number;
  conforme: boolean;
  messages: string[];
}
