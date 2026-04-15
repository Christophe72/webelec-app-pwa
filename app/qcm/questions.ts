export type Question = {
  id: number;
  question: string;
  choices: string[];
  answer: number; // index dans choices
  explication: string;
  categorie: string;
  difficulte: "facile" | "moyen" | "difficile";
};

export const QUESTIONS: Question[] = [
  {
    id: 1,
    categorie: "Sections",
    difficulte: "facile",
    question:
      "Quelle est la section minimale obligatoire pour un circuit d'éclairage selon le RGIE ?",
    choices: ["1 mm²", "1,5 mm²", "2,5 mm²", "4 mm²"],
    answer: 1,
    explication:
      "Le RGIE impose une section minimale de 1,5 mm² pour tout circuit d'éclairage en cuivre.",
  },
  {
    id: 2,
    categorie: "Sections",
    difficulte: "facile",
    question:
      "Quelle section minimale est requise pour un circuit de prises 16 A ?",
    choices: ["1,5 mm²", "2,5 mm²", "4 mm²", "6 mm²"],
    answer: 1,
    explication:
      "Les circuits de prises 16 A nécessitent au minimum 2,5 mm² en cuivre selon le RGIE.",
  },
  {
    id: 3,
    categorie: "Chute de tension",
    difficulte: "moyen",
    question:
      "Quelle est la chute de tension maximale admissible pour un circuit d'éclairage selon le RGIE ?",
    choices: ["2 %", "3 %", "5 %", "8 %"],
    answer: 1,
    explication:
      "Le RGIE limite la chute de tension à 3 % pour les circuits d'éclairage, contre 5 % pour les autres circuits.",
  },
  {
    id: 4,
    categorie: "Chute de tension",
    difficulte: "moyen",
    question:
      "Quelle est la chute de tension maximale admissible pour un circuit de prises ?",
    choices: ["3 %", "4 %", "5 %", "6 %"],
    answer: 2,
    explication:
      "Pour les circuits de force (prises, moteurs…), la limite RGIE est de 5 % de la tension nominale.",
  },
  {
    id: 5,
    categorie: "Disjoncteurs",
    difficulte: "moyen",
    question:
      "Quel est le calibre maximal d'un disjoncteur pour une section de câble de 1,5 mm² (éclairage) ?",
    choices: ["6 A", "10 A", "16 A", "20 A"],
    answer: 1,
    explication:
      "Un câble de 1,5 mm² en éclairage doit être protégé par un disjoncteur de 10 A maximum selon le RGIE.",
  },
  {
    id: 6,
    categorie: "Disjoncteurs",
    difficulte: "moyen",
    question:
      "Quel est le calibre maximal d'un disjoncteur pour une section de 2,5 mm² (prises) ?",
    choices: ["16 A", "20 A", "25 A", "32 A"],
    answer: 1,
    explication:
      "Le RGIE autorise un disjoncteur de 20 A maximum pour un câble de 2,5 mm² sur circuit de prises.",
  },
  {
    id: 7,
    categorie: "Tension réseau",
    difficulte: "facile",
    question:
      "Quelle est la tension nominale du réseau monophasé en Belgique ?",
    choices: ["110 V", "220 V", "230 V", "240 V"],
    answer: 2,
    explication:
      "Depuis 1987, la tension nominale monophasée en Belgique (et en Europe) est de 230 V (±10 %).",
  },
  {
    id: 8,
    categorie: "Tension réseau",
    difficulte: "facile",
    question:
      "En réseau triphasé belge, quelle est la tension composée (entre phases) ?",
    choices: ["230 V", "380 V", "400 V", "415 V"],
    answer: 2,
    explication:
      "La tension composée du réseau triphasé belge est de 400 V. La tension simple (phase-neutre) reste 230 V.",
  },
  {
    id: 9,
    categorie: "Couleurs",
    difficulte: "facile",
    question:
      "Quelle couleur est obligatoire pour le conducteur de protection (PE) selon le RGIE ?",
    choices: ["Rouge", "Bleu", "Vert/jaune", "Marron"],
    answer: 2,
    explication:
      "Le conducteur de protection doit impérativement être repéré par la bicolore vert/jaune. Aucune autre utilisation de cette couleur n'est autorisée.",
  },
  {
    id: 10,
    categorie: "Couleurs",
    difficulte: "facile",
    question:
      "Quelle couleur identifie le conducteur neutre dans une installation RGIE ?",
    choices: ["Rouge", "Bleu", "Noir", "Gris"],
    answer: 1,
    explication:
      "Le conducteur neutre est identifié par la couleur bleu clair. Les phases utilisent marron, noir et gris (ou rouge dans les anciens câblages).",
  },
  {
    id: 11,
    categorie: "Protection différentielle",
    difficulte: "difficile",
    question:
      "Quelle est la sensibilité minimale du différentiel général obligatoire en habitation selon le RGIE ?",
    choices: ["10 mA", "30 mA", "100 mA", "300 mA"],
    answer: 3,
    explication:
      "Le RGIE impose un différentiel général de 300 mA au tableau principal, complété par des 30 mA sur les circuits sensibles.",
  },
  {
    id: 12,
    categorie: "Protection différentielle",
    difficulte: "difficile",
    question:
      "Un différentiel 30 mA est obligatoire pour quels circuits en Belgique ?",
    choices: [
      "Éclairage uniquement",
      "Prises uniquement",
      "Locaux humides uniquement",
      "Tous les circuits depuis 2008",
    ],
    answer: 3,
    explication:
      "Depuis la mise à jour du RGIE en 2008, tous les circuits d'une habitation doivent être protégés par un différentiel 30 mA.",
  },
  {
    id: 13,
    categorie: "Mise à la terre",
    difficulte: "difficile",
    question:
      "Dans un schéma TT (standard belge), comment est réalisée la mise à la terre ?",
    choices: [
      "Par le réseau de distribution",
      "Par un piquet de terre local",
      "Elle n'est pas requise",
      "Partagée avec le conducteur neutre",
    ],
    answer: 1,
    explication:
      "En schéma TT, la terre du bâtiment est assurée par un électrode locale (piquet de terre), indépendante du réseau.",
  },
  {
    id: 14,
    categorie: "Sécurité",
    difficulte: "moyen",
    question:
      "Quelle est la tension limite de sécurité (TBTS) en milieu sec selon le RGIE ?",
    choices: ["12 V", "25 V", "50 V", "110 V"],
    answer: 2,
    explication:
      "En milieu sec, la tension limite de sécurité TBTS est de 50 V AC. Elle tombe à 25 V en milieu humide et 12 V en milieu immergé.",
  },
  {
    id: 15,
    categorie: "Sections PE",
    difficulte: "difficile",
    question:
      "Pour un câble de phase de 6 mm², quelle doit être la section minimale du conducteur PE ?",
    choices: ["2,5 mm²", "4 mm²", "6 mm²", "10 mm²"],
    answer: 2,
    explication:
      "Jusqu'à 16 mm², le conducteur PE doit avoir la même section que le conducteur de phase. Pour 6 mm² de phase → 6 mm² de PE.",
  },
  {
    id: 16,
    categorie: "Mise à la terre",
    difficulte: "facile",
    question:
      "Quelle doit être la résistance de dispersion de la prise de terre dans une installation domestique ?",
    choices: [
      "Inférieure à 10 Ω",
      "Inférieure à 30 Ω",
      "Inférieure à 100 Ω",
      "Inférieure à 300 Ω",
    ],
    answer: 2,
    explication:
      "Le guide indique que la résistance de dispersion de la prise de terre doit être inférieure à 100 Ω. Il recommande toutefois en pratique de viser moins de 30 Ω.",
  },
  {
    id: 17,
    categorie: "Mise à la terre",
    difficulte: "moyen",
    question: "Quelle est la section minimale du conducteur de terre ?",
    choices: ["6 mm²", "10 mm²", "16 mm²", "25 mm²"],
    answer: 2,
    explication:
      "Le conducteur de terre possède une isolation vert-jaune et sa section minimale est de 16 mm².",
  },
  {
    id: 18,
    categorie: "Sections",
    difficulte: "facile",
    question:
      "Quelle est la section minimale pratique d’un circuit avec uniquement des appareils d’éclairage ?",
    choices: ["0,75 mm²", "1 mm²", "1,5 mm²", "2,5 mm²"],
    answer: 2,
    explication:
      "En pratique, le guide indique 1,5 mm² pour un circuit avec uniquement des appareils d’éclairage.",
  },
  {
    id: 19,
    categorie: "Sections",
    difficulte: "facile",
    question:
      "Quelle est la section pratique d’un circuit avec uniquement des socles de prises de courant ?",
    choices: ["1,5 mm²", "2,5 mm²", "4 mm²", "6 mm²"],
    answer: 1,
    explication:
      "Le guide applique en pratique 2,5 mm² pour un circuit avec uniquement des socles de prises de courant.",
  },
  {
    id: 20,
    categorie: "Disjoncteurs",
    difficulte: "facile",
    question:
      "Quelle est l’intensité nominale maximale d’un disjoncteur pour un conducteur de 2,5 mm² ?",
    choices: ["16 A", "20 A", "25 A", "32 A"],
    answer: 1,
    explication:
      "Le tableau du guide donne 20 A maximum pour un disjoncteur protégeant un conducteur de 2,5 mm².",
  },
  {
    id: 21,
    categorie: "Disjoncteurs",
    difficulte: "moyen",
    question:
      "Quelle est l’intensité nominale maximale d’un disjoncteur pour un conducteur de 1,5 mm² ?",
    choices: ["10 A", "16 A", "20 A", "25 A"],
    answer: 1,
    explication:
      "Le tableau du guide indique 16 A maximum pour un disjoncteur sur un conducteur de 1,5 mm². Pour un fusible, ce serait 10 A.",
  },
  {
    id: 22,
    categorie: "Différentiels",
    difficulte: "facile",
    question:
      "Quel est le courant de fonctionnement maximal du différentiel général à l’origine de l’installation ?",
    choices: ["30 mA", "100 mA", "300 mA", "500 mA"],
    answer: 2,
    explication:
      "Le dispositif différentiel général doit avoir un courant de fonctionnement ne dépassant pas 300 mA.",
  },
  {
    id: 23,
    categorie: "Différentiels",
    difficulte: "facile",
    question:
      "Quel est le courant de fonctionnement maximal d’un différentiel subordonné pour l’éclairage ou les prises non dédiées ?",
    choices: ["10 mA", "30 mA", "100 mA", "300 mA"],
    answer: 1,
    explication:
      "Le différentiel subordonné doit avoir un courant de fonctionnement ne dépassant pas 30 mA.",
  },
  {
    id: 24,
    categorie: "Prises",
    difficulte: "facile",
    question:
      "Combien de socles de prises de courant simples ou multiples sont autorisés au maximum par circuit ?",
    choices: ["6", "8", "10", "12"],
    answer: 1,
    explication:
      "Le nombre de socles de prise de courant simples ou multiples est limité à huit par circuit.",
  },
  {
    id: 25,
    categorie: "Circuits dédiés",
    difficulte: "moyen",
    question:
      "Lequel de ces appareils doit obligatoirement être alimenté par un circuit exclusivement dédié ?",
    choices: [
      "Une lampe de chevet",
      "Un téléviseur",
      "Un lave-linge",
      "Une multiprise de bureau",
    ],
    answer: 2,
    explication:
      "Le lave-linge fait partie des appareils nécessitant un circuit exclusivement dédié.",
  },
  {
    id: 26,
    categorie: "Salle de bain",
    difficulte: "moyen",
    question:
      "Dans le cas d’une baignoire, à quelle distance du volume 1 se situe la limite du volume 2 ?",
    choices: ["0,30 m", "0,50 m", "0,60 m", "1,20 m"],
    answer: 2,
    explication:
      "Le volume 2 est situé à une distance de 0,60 m de la limite du volume 1.",
  },
  {
    id: 27,
    categorie: "Salle de bain",
    difficulte: "moyen",
    question:
      "Quel degré IP minimal est exigé pour du matériel dans le volume 1 d’une salle de bain ?",
    choices: ["IP20", "IP21", "IP44", "IP67"],
    answer: 2,
    explication:
      "Dans le volume 1, le matériel doit respecter au minimum IPX4 (souvent assimilé à IP44 en pratique).",
  },
  {
    id: 28,
    categorie: "Salle de bain",
    difficulte: "difficile",
    question:
      "Dans le volume 2, une prise est autorisée si elle est protégée par quel dispositif spécifique ?",
    choices: [
      "Différentiel 300 mA",
      "Différentiel 100 mA",
      "Différentiel 30 mA",
      "Différentiel 10 mA",
    ],
    answer: 3,
    explication:
      "Une prise en volume 2 est admise si elle est protégée par un différentiel très sensible de 10 mA ou un transformateur de séparation.",
  },
  {
    id: 29,
    categorie: "Photovoltaïque",
    difficulte: "moyen",
    question:
      "Quelle est la puissance maximale d’une installation photovoltaïque monophasée domestique ?",
    choices: ["3 kVA", "5 kVA", "7,4 kVA", "10 kVA"],
    answer: 1,
    explication: "La limite est fixée à 5 kVA en monophasé.",
  },
  {
    id: 30,
    categorie: "Photovoltaïque",
    difficulte: "moyen",
    question:
      "Quelle est la puissance maximale d’une installation photovoltaïque triphasée domestique ?",
    choices: ["5 kVA", "7 kVA", "10 kVA", "15 kVA"],
    answer: 2,
    explication: "La limite est fixée à 10 kVA en triphasé.",
  },
  {
    id: 31,
    categorie: "Borne de charge",
    difficulte: "moyen",
    question:
      "Comment doit être alimentée une borne de recharge pour véhicule électrique ?",
    choices: [
      "Circuit mixte",
      "Circuit partagé",
      "Circuit dédié",
      "Prise classique",
    ],
    answer: 2,
    explication:
      "Chaque borne doit être alimentée par un circuit exclusivement dédié.",
  },
  {
    id: 32,
    categorie: "Borne de charge",
    difficulte: "difficile",
    question:
      "Jusqu’à quel courant continu un différentiel type A fonctionne correctement ?",
    choices: ["3 mA", "6 mA", "10 mA", "30 mA"],
    answer: 1,
    explication:
      "Un différentiel type A est garanti jusqu’à 6 mA de courant continu.",
  },
  {
    id: 33,
    categorie: "Schémas",
    difficulte: "moyen",
    question:
      "Quels documents sont obligatoires pour une installation électrique domestique ?",
    choices: [
      "Plan architectural",
      "Schéma unifilaire seul",
      "Schéma unifilaire + plan de position",
      "Facture uniquement",
    ],
    answer: 2,
    explication: "Le RGIE impose le schéma unifilaire et le plan de position.",
  },
];
