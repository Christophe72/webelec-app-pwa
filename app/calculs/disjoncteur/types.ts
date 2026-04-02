export type TypeReseau = "monophase" | "triphase";

export type TypeCircuit = "eclairage" | "prises" | "mixte" | "specifique";

export type SectionCable =
  | 1.5
  | 2.5
  | 4
  | 6
  | 10
  | 16
  | 25
  | 35
  | 50
  | 70
  | 95
  | 120
  | 150
  | 185
  | 240
  | 300;

export interface InstallationInput {
  puissanceW: number;
  tensionV: number;
  longueurCableM: number;
  reseau: TypeReseau;
  sectionMm2: SectionCable;
  circuit: TypeCircuit;
}

export interface EvaluationInstallation {
  intensiteCalculeeA: number;
  disjoncteurConseilleA: number;
  disjoncteurMaxRgieA: number;
  conforme: boolean;
  messages: string[];
  chuteTensionV: number;
  chuteTensionPourcent: number;
  longueurCableM: number;
}
