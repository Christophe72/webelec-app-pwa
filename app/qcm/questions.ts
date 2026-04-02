export type Question = {
  id: number;
  question: string;
  choices: string[];
  answer: number; // index dans choices
  explication: string;
  categorie: string;
};

export const QUESTIONS: Question[] = [
  {
    id: 1,
    categorie: "Sections",
    question: "Quelle est la section minimale obligatoire pour un circuit d'éclairage selon le RGIE ?",
    choices: ["1 mm²", "1,5 mm²", "2,5 mm²", "4 mm²"],
    answer: 1,
    explication: "Le RGIE impose une section minimale de 1,5 mm² pour tout circuit d'éclairage en cuivre.",
  },
  {
    id: 2,
    categorie: "Sections",
    question: "Quelle section minimale est requise pour un circuit de prises 16 A ?",
    choices: ["1,5 mm²", "2,5 mm²", "4 mm²", "6 mm²"],
    answer: 1,
    explication: "Les circuits de prises 16 A nécessitent au minimum 2,5 mm² en cuivre selon le RGIE.",
  },
  {
    id: 3,
    categorie: "Chute de tension",
    question: "Quelle est la chute de tension maximale admissible pour un circuit d'éclairage selon le RGIE ?",
    choices: ["2 %", "3 %", "5 %", "8 %"],
    answer: 1,
    explication: "Le RGIE limite la chute de tension à 3 % pour les circuits d'éclairage, contre 5 % pour les autres circuits.",
  },
  {
    id: 4,
    categorie: "Chute de tension",
    question: "Quelle est la chute de tension maximale admissible pour un circuit de prises ?",
    choices: ["3 %", "4 %", "5 %", "6 %"],
    answer: 2,
    explication: "Pour les circuits de force (prises, moteurs…), la limite RGIE est de 5 % de la tension nominale.",
  },
  {
    id: 5,
    categorie: "Disjoncteurs",
    question: "Quel est le calibre maximal d'un disjoncteur pour une section de câble de 1,5 mm² (éclairage) ?",
    choices: ["6 A", "10 A", "16 A", "20 A"],
    answer: 1,
    explication: "Un câble de 1,5 mm² en éclairage doit être protégé par un disjoncteur de 10 A maximum selon le RGIE.",
  },
  {
    id: 6,
    categorie: "Disjoncteurs",
    question: "Quel est le calibre maximal d'un disjoncteur pour une section de 2,5 mm² (prises) ?",
    choices: ["16 A", "20 A", "25 A", "32 A"],
    answer: 1,
    explication: "Le RGIE autorise un disjoncteur de 20 A maximum pour un câble de 2,5 mm² sur circuit de prises.",
  },
  {
    id: 7,
    categorie: "Tension réseau",
    question: "Quelle est la tension nominale du réseau monophasé en Belgique ?",
    choices: ["110 V", "220 V", "230 V", "240 V"],
    answer: 2,
    explication: "Depuis 1987, la tension nominale monophasée en Belgique (et en Europe) est de 230 V (±10 %).",
  },
  {
    id: 8,
    categorie: "Tension réseau",
    question: "En réseau triphasé belge, quelle est la tension composée (entre phases) ?",
    choices: ["230 V", "380 V", "400 V", "415 V"],
    answer: 2,
    explication: "La tension composée du réseau triphasé belge est de 400 V. La tension simple (phase-neutre) reste 230 V.",
  },
  {
    id: 9,
    categorie: "Couleurs",
    question: "Quelle couleur est obligatoire pour le conducteur de protection (PE) selon le RGIE ?",
    choices: ["Rouge", "Bleu", "Vert/jaune", "Marron"],
    answer: 2,
    explication: "Le conducteur de protection doit impérativement être repéré par la bicolore vert/jaune. Aucune autre utilisation de cette couleur n'est autorisée.",
  },
  {
    id: 10,
    categorie: "Couleurs",
    question: "Quelle couleur identifie le conducteur neutre dans une installation RGIE ?",
    choices: ["Rouge", "Bleu", "Noir", "Gris"],
    answer: 1,
    explication: "Le conducteur neutre est identifié par la couleur bleu clair. Les phases utilisent marron, noir et gris (ou rouge dans les anciens câblages).",
  },
  {
    id: 11,
    categorie: "Protection différentielle",
    question: "Quelle est la sensibilité minimale du différentiel général obligatoire en habitation selon le RGIE ?",
    choices: ["10 mA", "30 mA", "100 mA", "300 mA"],
    answer: 3,
    explication: "Le RGIE impose un différentiel général de 300 mA au tableau principal, complété par des 30 mA sur les circuits sensibles.",
  },
  {
    id: 12,
    categorie: "Protection différentielle",
    question: "Un différentiel 30 mA est obligatoire pour quels circuits en Belgique ?",
    choices: [
      "Éclairage uniquement",
      "Prises uniquement",
      "Locaux humides uniquement",
      "Tous les circuits depuis 2008",
    ],
    answer: 3,
    explication: "Depuis la mise à jour du RGIE en 2008, tous les circuits d'une habitation doivent être protégés par un différentiel 30 mA.",
  },
  {
    id: 13,
    categorie: "Mise à la terre",
    question: "Dans un schéma TT (standard belge), comment est réalisée la mise à la terre ?",
    choices: [
      "Par le réseau de distribution",
      "Par un piquet de terre local",
      "Elle n'est pas requise",
      "Partagée avec le conducteur neutre",
    ],
    answer: 1,
    explication: "En schéma TT, la terre du bâtiment est assurée par un électrode locale (piquet de terre), indépendante du réseau.",
  },
  {
    id: 14,
    categorie: "Sécurité",
    question: "Quelle est la tension limite de sécurité (TBTS) en milieu sec selon le RGIE ?",
    choices: ["12 V", "25 V", "50 V", "110 V"],
    answer: 2,
    explication: "En milieu sec, la tension limite de sécurité TBTS est de 50 V AC. Elle tombe à 25 V en milieu humide et 12 V en milieu immergé.",
  },
  {
    id: 15,
    categorie: "Sections PE",
    question: "Pour un câble de phase de 6 mm², quelle doit être la section minimale du conducteur PE ?",
    choices: ["2,5 mm²", "4 mm²", "6 mm²", "10 mm²"],
    answer: 2,
    explication: "Jusqu'à 16 mm², le conducteur PE doit avoir la même section que le conducteur de phase. Pour 6 mm² de phase → 6 mm² de PE.",
  },
];
