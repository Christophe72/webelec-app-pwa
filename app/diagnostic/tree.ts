export type Severity = "ok" | "info" | "warning" | "danger";

export type ResultNode = {
  type: "result";
  id: string;
  title: string;
  body: string;
  actions: string[];
  severity: Severity;
};

export type QuestionNode = {
  type: "question";
  id: string;
  question: string;
  hint?: string;
  yes: string;
  no: string;
};

export type DiagNode = QuestionNode | ResultNode;

export const nodes: DiagNode[] = [
  {
    type: "question",
    id: "root",
    question: "Y a-t-il une coupure totale de courant dans le logement ?",
    hint: "Aucun appareil ne fonctionne, pas d'éclairage, compteur éteint.",
    yes: "q_panne_generale",
    no: "q_partiel",
  },

  {
    type: "question",
    id: "q_panne_generale",
    question:
      "Les voisins ou d'autres logements sont-ils également sans courant ?",
    yes: "r_reseau_ores",
    no: "q_disjoncteur_principal",
  },
  {
    type: "result",
    id: "r_reseau_ores",
    title: "Panne réseau de distribution",
    body: "La coupure provient probablement du réseau public (ORES, Sibelga, RESA…). Votre installation est probablement saine.",
    actions: [
      "Vérifier si la panne touche aussi le voisinage ou les parties communes.",
      "Contacter le gestionnaire de réseau pour confirmation.",
      "Ne jamais manipuler le compteur ni les scellés.",
      "Attendre le rétablissement de l’alimentation.",
    ],
    severity: "info",
  },
  {
    type: "question",
    id: "q_disjoncteur_principal",
    question:
      "Le disjoncteur général (ou compteur) est-il en position déclenchée (OFF) ?",
    hint: "Regardez le tableau principal : levier tombé, bouton rouge sorti ou voyant rouge.",
    yes: "q_reenclenche_general",
    no: "q_differentiel_general",
  },
  {
    type: "question",
    id: "q_reenclenche_general",
    question:
      "Après réenclenchement du disjoncteur général, reste-t-il en position ON ?",
    yes: "r_surcharge_generale",
    no: "r_cc_general",
  },
  {
    type: "result",
    id: "r_surcharge_generale",
    title: "Surcharge ponctuelle",
    body: "Le disjoncteur a probablement déclenché suite à une surcharge ou à un pic de courant. Il est à nouveau en service.",
    actions: [
      "Identifier les appareils qui fonctionnaient au moment du déclenchement.",
      "Éviter de relancer en même temps les gros consommateurs.",
      "Surveiller si le déclenchement se reproduit dans les heures ou les jours suivants.",
      "Faire contrôler l’installation si le problème revient.",
    ],
    severity: "ok",
  },
  {
    type: "result",
    id: "r_cc_general",
    title: "Court-circuit ou défaut grave — Danger",
    body: "Le disjoncteur général refuse de rester enclenché. Il y a probablement un court-circuit sérieux ou un défaut d'isolement majeur.",
    actions: [
      "Ne pas insister sur le réenclenchement.",
      "Laisser l’installation hors tension.",
      "Vérifier à distance s’il y a une odeur, de la fumée ou un échauffement anormal.",
      "Faire intervenir un électricien sans délai.",
    ],
    severity: "danger",
  },
  {
    type: "question",
    id: "q_differentiel_general",
    question: "Le différentiel principal (bouton TEST) est-il déclenché ?",
    hint: "Sur certains tableaux, le différentiel est séparé du disjoncteur. Cherchez un interrupteur avec bouton TEST.",
    yes: "q_diff_reenclenche",
    no: "r_appel_gestionnaire",
  },
  {
    type: "question",
    id: "q_diff_reenclenche",
    question: "Après réenclenchement du différentiel, reste-t-il enclenché ?",
    yes: "r_diff_ok",
    no: "q_isole_diff",
  },
  {
    type: "result",
    id: "r_diff_ok",
    title: "Différentiel réenclenché",
    body: "Le différentiel s'est réenclenché. Il a probablement déclenché sur un courant de fuite transitoire.",
    actions: [
      "Réenclencher et vérifier que le courant revient normalement.",
      "Débrancher par précaution les appareils humides ou suspects.",
      "Surveiller si le différentiel retombe à nouveau.",
      "Faire contrôler une fuite d’isolement si le défaut se répète.",
    ],
    severity: "ok",
  },
  {
    type: "question",
    id: "q_isole_diff",
    question:
      "En débranchant tous les appareils, le différentiel reste-t-il enclenché ?",
    yes: "r_appareil_defectueux_diff",
    no: "r_fuite_cablage",
  },
  {
    type: "result",
    id: "r_appareil_defectueux_diff",
    title: "Appareil défectueux provoquant une fuite",
    body: "Un ou plusieurs appareils provoquent probablement une fuite de courant.",
    actions: [
      "Laisser tous les appareils débranchés.",
      "Rebrancher les appareils un par un.",
      "Identifier celui qui fait retomber le différentiel.",
      "Retirer l’appareil suspect du service jusqu’à réparation ou remplacement.",
    ],
    severity: "warning",
  },
  {
    type: "result",
    id: "r_fuite_cablage",
    title: "Défaut d'isolement sur le câblage",
    body: "Même sans appareil branché, le différentiel déclenche : la fuite se situe probablement dans le câblage fixe.",
    actions: [
      "Laisser le circuit ou l’installation hors tension.",
      "Ne plus utiliser les prises ou points concernés.",
      "Faire réaliser une mesure d’isolement par un électricien.",
      "Signaler si le problème est apparu après de l’humidité, des travaux ou un perçage.",
    ],
    severity: "danger",
  },
  {
    type: "result",
    id: "r_appel_gestionnaire",
    title: "Problème côté compteur ou réseau",
    body: "Le tableau semble en ordre mais il n'y a pas de courant. Le problème se situe probablement en amont (compteur, branchement réseau).",
    actions: [
      "Vérifier que les appareils du tableau paraissent en position normale.",
      "Contacter le gestionnaire de réseau pour signaler l’absence d’alimentation.",
      "Ne pas ouvrir ni manipuler le compteur.",
      "Attendre les consignes ou l’intervention du gestionnaire.",
    ],
    severity: "info",
  },

  {
    type: "question",
    id: "q_partiel",
    question:
      "La panne concerne-t-elle un seul circuit (ex. une pièce, un groupe de prises) ?",
    yes: "q_disjoncteur_circuit",
    no: "q_type_panne",
  },

  {
    type: "question",
    id: "q_disjoncteur_circuit",
    question: "Le disjoncteur de ce circuit est-il déclenché au tableau ?",
    hint: "Repérez le disjoncteur étiqueté correspondant à la zone en panne.",
    yes: "q_diff_circuit",
    no: "q_fusible",
  },
  {
    type: "question",
    id: "q_diff_circuit",
    question:
      "Le différentiel associé à ce circuit a-t-il également déclenché ?",
    yes: "q_isoler_circuit",
    no: "q_reenclenche_circuit",
  },
  {
    type: "question",
    id: "q_isoler_circuit",
    question:
      "En débranchant tous les appareils du circuit, le différentiel reste-t-il enclenché ?",
    yes: "r_appareil_fuite_circuit",
    no: "r_fuite_cablage_circuit",
  },
  {
    type: "result",
    id: "r_appareil_fuite_circuit",
    title: "Appareil en fuite sur ce circuit",
    body: "Un appareil branché sur ce circuit provoque probablement une fuite de courant.",
    actions: [
      "Débrancher tous les appareils du circuit.",
      "Réenclencher la protection.",
      "Rebrancher les appareils un par un.",
      "Mettre de côté l’appareil qui provoque le déclenchement.",
    ],
    severity: "warning",
  },
  {
    type: "result",
    id: "r_fuite_cablage_circuit",
    title: "Défaut d'isolement sur ce circuit",
    body: "La fuite se situe probablement dans le câblage fixe de ce circuit, même sans appareil branché.",
    actions: [
      "Laisser ce circuit coupé.",
      "Ne plus utiliser les prises, luminaires ou appareils reliés à ce départ.",
      "Faire contrôler le câblage par mesure d’isolement.",
      "Préciser s’il y a eu de l’humidité, une fixation murale ou des travaux récents.",
    ],
    severity: "danger",
  },
  {
    type: "question",
    id: "q_reenclenche_circuit",
    question:
      "Après réenclenchement, le disjoncteur de circuit reste-t-il en position ON ?",
    yes: "r_surcharge_circuit",
    no: "r_cc_circuit",
  },
  {
    type: "result",
    id: "r_surcharge_circuit",
    title: "Surcharge sur ce circuit",
    body: "Le circuit était probablement surchargé (trop d'appareils simultanément ou appareil défectueux).",
    actions: [
      "Débrancher une partie des appareils du circuit.",
      "Éviter l’utilisation simultanée des gros consommateurs sur ce départ.",
      "Tester à nouveau avec une charge réduite.",
      "Prévoir un contrôle si la surcharge revient régulièrement.",
    ],
    severity: "ok",
  },
  {
    type: "result",
    id: "r_cc_circuit",
    title: "Court-circuit sur ce circuit",
    body: "Le disjoncteur refuse de rester enclenché : un court-circuit est probable.",
    actions: [
      "Débrancher tous les appareils reliés au circuit.",
      "Réessayer une seule fois le réenclenchement.",
      "Si le disjoncteur retombe encore, laisser le circuit coupé.",
      "Faire rechercher le défaut sur le câblage ou l’appareillage.",
    ],
    severity: "danger",
  },
  {
    type: "question",
    id: "q_fusible",
    question: "Le tableau comporte-t-il des fusibles (à vis ou à cartouche) ?",
    hint: "Anciennes installations : fusibles en porcelaine ou boîtes à cartouche.",
    yes: "q_fusible_grille",
    no: "r_verif_connexions",
  },
  {
    type: "question",
    id: "q_fusible_grille",
    question: "Un fusible est-il fondu ou la cartouche est-elle grillée ?",
    yes: "r_remplacer_fusible",
    no: "r_verif_connexions",
  },
  {
    type: "result",
    id: "r_remplacer_fusible",
    title: "Fusible fondu",
    body: "Un fusible a sauté sur ce circuit. Il protège contre les surcharges et les courts-circuits.",
    actions: [
      "Remplacer uniquement par un fusible de même calibre.",
      "Ne jamais monter un calibre supérieur.",
      "Remettre le circuit en service et observer le comportement.",
      "Si le fusible saute à nouveau, faire rechercher une surcharge ou un court-circuit.",
    ],
    severity: "warning",
  },
  {
    type: "result",
    id: "r_verif_connexions",
    title: "Vérifier les connexions au tableau",
    body: "Le disjoncteur n'est pas déclenché mais le circuit ne fonctionne pas : connexion desserrée ou coupure de câble.",
    actions: [
      "Ne pas intervenir dans le tableau sous tension.",
      "Faire contrôler les serrages et connexions par un électricien.",
      "Signaler précisément quelle zone ou quel usage est concerné.",
      "Demander aussi un contrôle des boîtes et dérivations si nécessaire.",
    ],
    severity: "warning",
  },

  {
    type: "question",
    id: "q_type_panne",
    question: "La panne concerne-t-elle uniquement l'éclairage ?",
    yes: "q_eclairage",
    no: "q_prise",
  },

  {
    type: "question",
    id: "q_eclairage",
    question:
      "L'ampoule est-elle grillée (filament cassé, noircie, LED éteinte) ?",
    yes: "r_remplacer_ampoule",
    no: "q_interrupteur",
  },
  {
    type: "result",
    id: "r_remplacer_ampoule",
    title: "Ampoule hors service",
    body: "L'ampoule est défectueuse.",
    actions: [
      "Remplacer l’ampoule par un modèle compatible.",
      "Vérifier le bon culot et la bonne tension.",
      "Tester à nouveau le point lumineux.",
      "Si cela ne fonctionne toujours pas, poursuivre le diagnostic.",
    ],
    severity: "ok",
  },
  {
    type: "question",
    id: "q_interrupteur",
    question:
      "L'interrupteur clique-t-il normalement et sa DEL (si présente) fonctionne-t-elle ?",
    yes: "q_luminaire_connexion",
    no: "r_interrupteur_hs",
  },
  {
    type: "result",
    id: "r_interrupteur_hs",
    title: "Interrupteur défectueux",
    body: "L'interrupteur ne commute plus correctement.",
    actions: [
      "Couper le circuit concerné avant toute intervention.",
      "Ne pas démonter l’appareillage sous tension.",
      "Remplacer l’interrupteur par un modèle équivalent.",
      "Faire intervenir un électricien si vous n’êtes pas qualifié.",
    ],
    severity: "warning",
  },
  {
    type: "question",
    id: "q_luminaire_connexion",
    question: "Le luminaire a-t-il été récemment installé ou déplacé ?",
    yes: "r_verif_cablage_luminaire",
    no: "r_circuit_eclairage",
  },
  {
    type: "result",
    id: "r_verif_cablage_luminaire",
    title: "Vérifier le câblage du luminaire",
    body: "Suite à une installation ou à un déplacement, une connexion peut être mal serrée ou inversée.",
    actions: [
      "Couper le disjoncteur du circuit avant ouverture.",
      "Contrôler les connexions dans le bornier du luminaire.",
      "Vérifier que les conducteurs sont bien serrés et à la bonne place.",
      "Tester le luminaire après remise en place.",
    ],
    severity: "warning",
  },
  {
    type: "result",
    id: "r_circuit_eclairage",
    title: "Défaut sur le circuit d'éclairage",
    body: "L'ampoule et l'interrupteur semblent corrects : le problème vient probablement du câblage du circuit.",
    actions: [
      "Vérifier si d’autres points lumineux du même circuit fonctionnent.",
      "Repérer le disjoncteur ou le départ concerné.",
      "Laisser hors tension en cas de doute sur le câblage.",
      "Faire contrôler le circuit par un électricien.",
    ],
    severity: "warning",
  },

  {
    type: "question",
    id: "q_prise",
    question: "La panne concerne-t-elle une ou plusieurs prises de courant ?",
    yes: "q_prise_visible",
    no: "q_autre_panne",
  },
  {
    type: "question",
    id: "q_prise_visible",
    question:
      "La prise présente-t-elle des dommages visibles (brûlures, plastique fondu, traces noires) ?",
    yes: "r_prise_dangereuse",
    no: "q_prise_testeur",
  },
  {
    type: "result",
    id: "r_prise_dangereuse",
    title: "Prise endommagée — Danger immédiat",
    body: "Une prise brûlée ou fondue indique un arc électrique ou une surchauffe grave.",
    actions: [
      "Ne plus utiliser cette prise immédiatement.",
      "Couper le circuit concerné au tableau.",
      "Vérifier l’absence d’odeur, de fumée ou d’échauffement du mur.",
      "Faire remplacer la prise sans délai.",
    ],
    severity: "danger",
  },
  {
    type: "question",
    id: "q_prise_testeur",
    question:
      "Avec un testeur de prise, la tension entre phase et neutre est-elle bien d’environ 230 V ?",
    hint: "Utilisez un testeur de tension ou un appareil connu comme fonctionnel.",
    yes: "r_prise_ok_appareil",
    no: "q_terre_prise",
  },
  {
    type: "result",
    id: "r_prise_ok_appareil",
    title: "La prise est sous tension — vérifier l'appareil",
    body: "La prise délivre bien environ 230 V. Le problème vient probablement de l'appareil branché.",
    actions: [
      "Tester l’appareil sur une autre prise connue comme fonctionnelle.",
      "Tester un autre appareil sur cette prise.",
      "Écarter l’appareil s’il ne fonctionne nulle part.",
      "Vérifier aussi l’état du cordon ou de la fiche.",
    ],
    severity: "ok",
  },
  {
    type: "question",
    id: "q_terre_prise",
    question:
      "Y a-t-il une tension entre phase et terre (test phase/terre positif) ?",
    yes: "r_neutre_coupure",
    no: "r_phase_absente",
  },
  {
    type: "result",
    id: "r_neutre_coupure",
    title: "Coupure du conducteur neutre",
    body: "La phase est présente mais le neutre est coupé. Situation potentiellement dangereuse (surtension possible).",
    actions: [
      "Ne plus utiliser ce circuit.",
      "Débrancher les appareils sensibles reliés à cette ligne.",
      "Laisser le dépannage à un électricien.",
      "Signaler qu’une coupure de neutre est suspectée.",
    ],
    severity: "danger",
  },
  {
    type: "result",
    id: "r_phase_absente",
    title: "Phase absente sur la prise",
    body: "Ni la phase ni la tension ne sont présentes : le circuit est probablement coupé en amont.",
    actions: [
      "Vérifier le départ correspondant au tableau.",
      "Identifier si une seule prise ou toute une ligne est concernée.",
      "Faire contrôler une éventuelle coupure ou dérivation défectueuse.",
      "Ne pas démonter la prise sous tension ni à l’aveugle.",
    ],
    severity: "warning",
  },

  {
    type: "question",
    id: "q_autre_panne",
    question:
      "La panne est-elle apparue après des travaux ou une intervention récente ?",
    yes: "r_apres_travaux",
    no: "r_diagnostic_complet",
  },
  {
    type: "result",
    id: "r_apres_travaux",
    title: "Panne post-travaux",
    body: "La panne est survenue après une intervention : connexion oubliée, câble pincé ou court-circuit accidentel.",
    actions: [
      "Contacter d’abord l’entreprise ou la personne ayant réalisé l’intervention.",
      "Ne pas refermer ou modifier plusieurs points au hasard.",
      "Lister ce qui a été touché pendant les travaux.",
      "Demander un contrôle ciblé des zones modifiées.",
    ],
    severity: "warning",
  },
  {
    type: "result",
    id: "r_diagnostic_complet",
    title: "Diagnostic approfondi nécessaire",
    body: "La panne ne correspond pas aux cas courants. Un diagnostic complet de l'installation est recommandé.",
    actions: [
      "Faire intervenir un électricien pour un contrôle méthodique.",
      "Décrire précisément les symptômes observés.",
      "Signaler si la panne est aléatoire, partielle ou liée à certains usages.",
      "Demander un contrôle du tableau, des protections et de l’isolement si nécessaire.",
    ],
    severity: "info",
  },
];

export const TREE: Record<string, DiagNode> = Object.fromEntries(
  nodes.map((n) => [n.id, n]),
);

export const ROOT_ID = "root";
