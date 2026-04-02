export type PlanElementType =
  | "prise"
  | "interrupteur"
  | "va_et_vient"
  | "point_lumineux"
  | "tableau"
  | "rj45"
  | "boite_derivation";

export type ElementType = PlanElementType;

export type PlanElementMeta = {
  hauteur?: number;
  puissance?: number;
  commandeDe?: string;
  nombrePostes?: number;
  priseType?: "simple" | "double";
  amperage?: "10A" | "16A" | "20A" | "32A";
  avecTerre?: boolean;
  dediee?: boolean;
  interrupteurType?: "simple" | "va_et_vient" | "permutateur";
  luminaireType?: "plafond" | "applique";
  rangees?: number;
  differentielPrincipal?: string;
};

export type PlanElement = {
  id: string;
  type: PlanElementType;
  x: number;
  y: number;
  rotation: number;
  label?: string;
  piece?: string;
  circuit?: string;
  reference?: string;
  meta?: PlanElementMeta;
};

export type PlanLink = {
  id: string;
  fromElementId: string;
  toElementId: string;
  type: "commande" | "circuit";
};

export type PlanRoom = {
  id: string;
  name: string;
};

export type PlanBackground = {
  src: string;
  opacity: number;
  locked: boolean;
  x: number;
  y: number;
};

export type PlanDocument = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  backgroundImage?: string;
  rooms: PlanRoom[];
  elements: PlanElement[];
  links: PlanLink[];
  background?: PlanBackground;
};

export type PlacedElement = PlanElement;

export const CELL = 40; // px par cellule
export const ELEMENT_SIZE = CELL * 2; // éléments placés en 2x2 cellules
export const GRID_W = 2400;
export const GRID_H = 1600;

export const SIDEBAR_ITEMS: { type: ElementType; label: string }[] = [
  { type: "point_lumineux", label: "Point lumineux" },
  { type: "interrupteur", label: "Interrupteur" },
  { type: "va_et_vient", label: "Va-et-vient" },
  { type: "prise", label: "Prise 2P+T" },
  { type: "rj45", label: "Prise RJ45" },
  { type: "tableau", label: "Tableau" },
  { type: "boite_derivation", label: "Boîte dérivation" },
];
