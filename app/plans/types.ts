export type ElementType =
  | "prise"
  | "interrupteur"
  | "lampe"
  | "tableau"
  | "va-et-vient"
  | "dj"
  | "ddr"
  | "rj45"
  | "tv"
  | "detecteur-fumee"
  | "sonnette"
  | "boite-deriv"
  | "poussoir";

export type PlacedElement = {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  rotation: number;
};

export const CELL = 40; // px par cellule
export const ELEMENT_SIZE = CELL * 2; // éléments placés en 2x2 cellules
export const GRID_W = 2400;
export const GRID_H = 1600;

export const SIDEBAR_ITEMS: { type: ElementType; label: string }[] = [
  { type: "lampe", label: "Point lumineux" },
  { type: "interrupteur", label: "Interrupteur" },
  { type: "va-et-vient", label: "Va-et-vient" },
  { type: "poussoir", label: "Bouton poussoir" },
  { type: "sonnette", label: "Sonnette" },
  { type: "prise", label: "Prise 2P+T" },
  { type: "rj45", label: "Prise RJ45" },
  { type: "tv", label: "Prise TV" },
  { type: "tableau", label: "Tableau" },
  { type: "dj", label: "Disjoncteur" },
  { type: "ddr", label: "Différentiel" },
  { type: "detecteur-fumee", label: "Détecteur fumée" },
  { type: "boite-deriv", label: "Boîte dérivation" },
];
