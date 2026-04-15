import React from "react";

export default function VisiteChantier() {
  const title = "Visite de chantier";
  const description =
    "Analyse de la visite de chantier pour le diagnostic électrique RGIE.";
  const keywords = "visite de chantier, diagnostic, RGIE, électricité";

  const nombreDePieces = 5; // Exemple de nombre de pièces à analyser
  const superficiePiece = 20; // Exemple de superficie de chaque pièce en m²
  const nombreDePrisesParPiece = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const nombreDePointsLumineuxParPiece = [1, 2, 3, 4, 5];
  const nombreDeCircuits = 2;
  const nombreDeTableaux = 1;
  const rangeeTableaux = [1, 2, 3, 4, 5]; // Exemple de nombre de rangées de tableaux électriques
  const nombreDisjoncteurParRangeeDuCoffret = 6; // Exemple de nombre de disjoncteurs par rangée du coffret électrique
  const superficieTotale = nombreDePieces * superficiePiece;

  const quantiteDeMateriel = 10; // Exemple de quantité de matériel nécessaire
  const materielsDeBase = [
    "Câbles électriques",
    "Disjoncteurs",
    "Prises",
    "Points lumineux",
    "Tableaux électriques",
    "Gaine ICTA",
    "Boîtes de dérivation",
    "Interrupteurs",
    "Tubes IRL",
    "Goulottes",
  ];

  return <div></div>;
}
