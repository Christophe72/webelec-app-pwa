export type TypeChantier = "NEUF" | "RENOVATION";

export type TypePiece =
  | "CHAMBRE"
  | "CUISINE"
  | "SEJOUR"
  | "SALLE_DE_BAIN"
  | "BUREAU"
  | "AUTRE";

export interface VisiteChantierRequest {
  typeChantier: TypeChantier;
  typePiece: TypePiece;
  surface: number;
  nbPrisesSouhaitees: number;
  pointLumineux: boolean;
  chauffageElectrique: boolean;
  reseau: boolean;
  commentaire: string;
}

export interface VisiteChantierResponse {
  resume: string;
  nbPrisesConseille: number;
  nbPointsLumineuxConseille: number;
  materielsDeBase: string[];
  remarques: string[];
  niveauComplexite: string;
}
export interface VisiteChantierError {
  message: string;
}
export type Piece =
  | "CHAMBRE"
  | "CUISINE"
  | "SEJOUR"
  | "SALLE_DE_BAIN"
  | "BUREAU"
  | "BUANDERIE"
  | "GARAGE"
  | "AUTRE";

export type COFFRET =
  | "COFFRET_1"
  | "COFFRET_2"
  | "COFFRET_3"
  | "COFFRET_4"
  | "COFFRET_5";

export type DISJONCTEUR_PAR_RANGE = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

