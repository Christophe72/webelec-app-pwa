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

const nodes: DiagNode[] = [
  // ── ROOT ─────────────────────────────────────────────────────────────────
  {
    type: "question",
    id: "root",
    question: "Y a-t-il une coupure totale de courant dans le logement ?",
    hint: "Aucun appareil ne fonctionne, pas d'éclairage, compteur éteint.",
    yes: "q_panne_generale",
    no: "q_partiel",
  },

  // ── BRANCHE : PANNE GÉNÉRALE ─────────────────────────────────────────────
  {
    type: "question",
    id: "q_panne_generale",
    question: "Les voisins ou d'autres logements sont-ils également sans courant ?",
    yes: "r_reseau_ores",
    no: "q_disjoncteur_principal",
  },
  {
    type: "result",
    id: "r_reseau_ores",
    title: "Panne réseau de distribution",
    body: "La coupure provient du réseau public (ORES, Sibelga, RESA…). Votre installation est probablement saine.",
    actions: [
      "Contacter le gestionnaire de réseau : ORES 078 78 78 20 / Sibelga 02 549 43 43",
      "Ne pas tenter de manipuler le compteur ou les scellés.",
      "Patienter la remise en service.",
    ],
    severity: "info",
  },
  {
    type: "question",
    id: "q_disjoncteur_principal",
    question: "Le disjoncteur général (ou compteur) est-il en position déclenché (OFF) ?",
    hint: "Regardez le tableau principal : levier tombé, bouton rouge sorti, voyant rouge.",
    yes: "q_reenclenche_general",
    no: "q_differentiel_general",
  },
  {
    type: "question",
    id: "q_reenclenche_general",
    question: "Après réenclenchement du disjoncteur général, reste-t-il en position ON ?",
    yes: "r_surcharge_generale",
    no: "r_cc_general",
  },
  {
    type: "result",
    id: "r_surcharge_generale",
    title: "Surcharge ponctuelle",
    body: "Le disjoncteur a déclenché suite à une surcharge ou un pic de courant. Il est à nouveau en service.",
    actions: [
      "Identifier l'appareil à l'origine (démarrage moteur, four + chauffe-eau simultanés, etc.).",
      "Répartir les charges sur d'autres circuits si possible.",
      "Si le déclenchement se répète, faire contrôler le calibre du disjoncteur par un électricien.",
    ],
    severity: "ok",
  },
  {
    type: "result",
    id: "r_cc_general",
    title: "Court-circuit ou défaut grave — Danger",
    body: "Le disjoncteur général refuse de rester enclenché. Il y a probablement un court-circuit sérieux ou un défaut d'isolement majeur.",
    actions: [
      "Ne pas forcer le réenclenchement.",
      "Appeler immédiatement un électricien agréé.",
      "Vérifier qu'aucun appareil ne chauffe ou ne dégage de fumée.",
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
    question: "Après appui sur le levier du différentiel, reste-t-il enclenché ?",
    yes: "r_diff_ok",
    no: "q_isole_diff",
  },
  {
    type: "result",
    id: "r_diff_ok",
    title: "Différentiel réenclenché",
    body: "Le différentiel s'est réenclenché. Il avait probablement déclenché sur un courant de fuite transitoire.",
    actions: [
      "Tester le bouton TEST pour vérifier son bon fonctionnement.",
      "Surveiller : si le déclenchement se répète, faire rechercher une fuite d'isolement.",
      "Débrancher les appareils humides suspects (lave-linge, lave-vaisselle, chauffe-eau).",
    ],
    severity: "ok",
  },
  {
    type: "question",
    id: "q_isole_diff",
    question: "En débranchant TOUS les appareils, le différentiel reste-t-il enclenché ?",
    yes: "r_appareil_defectueux_diff",
    no: "r_fuite_cablage",
  },
  {
    type: "result",
    id: "r_appareil_defectueux_diff",
    title: "Appareil défectueux provoquant une fuite",
    body: "Un ou plusieurs appareils présentent un courant de fuite supérieur à 30 mA.",
    actions: [
      "Rebrancher les appareils un par un pour identifier le coupable.",
      "Ne plus utiliser l'appareil défectueux jusqu'à réparation ou remplacement.",
      "Si le problème persiste malgré tout, faire contrôler l'installation.",
    ],
    severity: "warning",
  },
  {
    type: "result",
    id: "r_fuite_cablage",
    title: "Défaut d'isolement sur le câblage",
    body: "Même sans appareil branché, le différentiel déclenche : la fuite est dans le câblage fixe.",
    actions: [
      "Ne pas utiliser l'installation.",
      "Appeler un électricien agréé pour une mesure d'isolement (mégohmètre).",
      "Cause possible : câble endommagé, humidité, rongeurs.",
    ],
    severity: "danger",
  },
  {
    type: "result",
    id: "r_appel_gestionnaire",
    title: "Problème côté compteur ou réseau",
    body: "Le tableau semble en ordre mais il n'y a pas de courant. Le problème se situe probablement en amont (compteur, branchement réseau).",
    actions: [
      "Contacter le gestionnaire de réseau : ORES 078 78 78 20 / Sibelga 02 549 43 43",
      "Ne jamais manipuler le compteur (propriété du gestionnaire).",
    ],
    severity: "info",
  },

  // ── BRANCHE : PANNE PARTIELLE ────────────────────────────────────────────
  {
    type: "question",
    id: "q_partiel",
    question: "La panne concerne-t-elle un seul circuit (ex. une pièce, un groupe de prises) ?",
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
    question: "Le différentiel associé à ce circuit a-t-il également déclenché ?",
    yes: "q_isoler_circuit",
    no: "q_reenclenche_circuit",
  },
  {
    type: "question",
    id: "q_isoler_circuit",
    question: "En débranchant tous les appareils du circuit, le différentiel reste-t-il enclenché ?",
    yes: "r_appareil_fuite_circuit",
    no: "r_fuite_cablage_circuit",
  },
  {
    type: "result",
    id: "r_appareil_fuite_circuit",
    title: "Appareil en fuite sur ce circuit",
    body: "Un appareil branché sur ce circuit présente un courant de fuite.",
    actions: [
      "Rebrancher les appareils un par un pour identifier le coupable.",
      "Mettre de côté l'appareil défectueux.",
      "Vérifier notamment : lave-linge, lave-vaisselle, chauffe-eau électrique, convecteurs humides.",
    ],
    severity: "warning",
  },
  {
    type: "result",
    id: "r_fuite_cablage_circuit",
    title: "Défaut d'isolement sur ce circuit",
    body: "La fuite est dans le câblage fixe de ce circuit (même sans appareil branché).",
    actions: [
      "Ne pas utiliser ce circuit.",
      "Faire mesurer l'isolement par un électricien agréé.",
      "Vérifier l'absence d'humidité, de travaux récents, de câble pincé.",
    ],
    severity: "danger",
  },
  {
    type: "question",
    id: "q_reenclenche_circuit",
    question: "Après réenclenchement, le disjoncteur de circuit reste-t-il en ON ?",
    yes: "r_surcharge_circuit",
    no: "r_cc_circuit",
  },
  {
    type: "result",
    id: "r_surcharge_circuit",
    title: "Surcharge sur ce circuit",
    body: "Le circuit était surchargé (trop d'appareils simultanément ou appareil défectueux).",
    actions: [
      "Réduire la charge sur ce circuit.",
      "Vérifier le calibre du disjoncteur vs la section du câble (RGIE Art. 4.3).",
      "Si récurrent, envisager la création d'un circuit supplémentaire.",
    ],
    severity: "ok",
  },
  {
    type: "result",
    id: "r_cc_circuit",
    title: "Court-circuit sur ce circuit",
    body: "Le disjoncteur refuse de rester enclenché : court-circuit probable.",
    actions: [
      "Débrancher tous les appareils du circuit.",
      "Réessayer — si ça tient, un appareil est en court-circuit interne.",
      "Si le disjoncteur saute encore sans appareil : câblage défectueux, appeler un électricien.",
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
    body: "Un fusible a sauté sur ce circuit. Il protège contre les surcharges et courts-circuits.",
    actions: [
      "Remplacer par un fusible de même calibre — JAMAIS supérieur.",
      "Si le fusible saute à nouveau : court-circuit ou surcharge persistante, appeler un électricien.",
      "Envisager la modernisation du tableau (disjoncteurs + différentiels, RGIE Art. 6).",
    ],
    severity: "warning",
  },
  {
    type: "result",
    id: "r_verif_connexions",
    title: "Vérifier les connexions au tableau",
    body: "Le disjoncteur n'est pas déclenché mais le circuit ne fonctionne pas : connexion desserrée ou coupure de câble.",
    actions: [
      "Faire vérifier les bornes du disjoncteur par un électricien (risque d'arc électrique).",
      "Ne pas intervenir soi-même sur le tableau sous tension.",
    ],
    severity: "warning",
  },

  // ── BRANCHE : TYPE DE PANNE (non général, non circuit unique) ────────────
  {
    type: "question",
    id: "q_type_panne",
    question: "La panne concerne-t-elle uniquement l'éclairage ?",
    yes: "q_eclairage",
    no: "q_prise",
  },

  // ── ÉCLAIRAGE ─────────────────────────────────────────────────────────────
  {
    type: "question",
    id: "q_eclairage",
    question: "L'ampoule est-elle grillée (filament cassé, noircie, LED éteinte) ?",
    yes: "r_remplacer_ampoule",
    no: "q_interrupteur",
  },
  {
    type: "result",
    id: "r_remplacer_ampoule",
    title: "Ampoule hors service",
    body: "L'ampoule est défectueuse.",
    actions: [
      "Remplacer l'ampoule par une de même culot et puissance adaptée au luminaire.",
      "Préférer les LED (économie d'énergie, longue durée de vie).",
      "Si la nouvelle ampoule ne fonctionne pas non plus, passer à la suite du diagnostic.",
    ],
    severity: "ok",
  },
  {
    type: "question",
    id: "q_interrupteur",
    question: "L'interrupteur clique-t-il normalement et sa DEL (si présente) fonctionne-t-elle ?",
    yes: "q_luminaire_connexion",
    no: "r_interrupteur_hs",
  },
  {
    type: "result",
    id: "r_interrupteur_hs",
    title: "Interrupteur défectueux",
    body: "L'interrupteur ne commute plus correctement.",
    actions: [
      "Couper le disjoncteur du circuit avant toute intervention.",
      "Remplacer l'interrupteur (vérifier la compatibilité variateur/LED si applicable).",
      "Faire réaliser l'opération par un électricien si vous n'êtes pas qualifié.",
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
    body: "Suite à une installation ou un déplacement, une connexion peut être mal serrée ou inversée.",
    actions: [
      "Couper le disjoncteur avant d'ouvrir le luminaire.",
      "Vérifier phase (brun), neutre (bleu), terre (vert/jaune) bien serrés dans le bornier.",
      "S'assurer que le luminaire est compatible avec le câblage existant.",
    ],
    severity: "warning",
  },
  {
    type: "result",
    id: "r_circuit_eclairage",
    title: "Défaut sur le circuit d'éclairage",
    body: "Ampoule et interrupteur semblent corrects : le problème vient du câblage du circuit.",
    actions: [
      "Vérifier le disjoncteur dédié à l'éclairage.",
      "Faire réaliser un diagnostic par un électricien agréé.",
    ],
    severity: "warning",
  },

  // ── PRISES ────────────────────────────────────────────────────────────────
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
    question: "La prise présente-t-elle des dommages visibles (brûlures, plastique fondu, traces noires) ?",
    yes: "r_prise_dangereuse",
    no: "q_prise_testeur",
  },
  {
    type: "result",
    id: "r_prise_dangereuse",
    title: "Prise endommagée — Danger immédiat",
    body: "Une prise brûlée ou fondue indique un arc électrique ou une surchauffe grave.",
    actions: [
      "Ne jamais utiliser cette prise.",
      "Couper le disjoncteur de ce circuit immédiatement.",
      "Appeler un électricien agréé d'urgence.",
      "Vérifier l'absence de départ de feu dans le mur.",
    ],
    severity: "danger",
  },
  {
    type: "question",
    id: "q_prise_testeur",
    question: "Avec un testeur de prise, la tension entre phase et neutre est-elle bien de ~230 V ?",
    hint: "Utilisez un testeur de tension ou un appareil connu fonctionnel.",
    yes: "r_prise_ok_appareil",
    no: "q_terre_prise",
  },
  {
    type: "result",
    id: "r_prise_ok_appareil",
    title: "La prise est sous tension — vérifier l'appareil",
    body: "La prise délivre bien 230 V. Le problème vient probablement de l'appareil branché.",
    actions: [
      "Tester l'appareil sur une autre prise fonctionnelle.",
      "Si l'appareil ne fonctionne toujours pas, il est défectueux.",
      "Vérifier le fusible interne de la fiche (sur certains appareils).",
    ],
    severity: "ok",
  },
  {
    type: "question",
    id: "q_terre_prise",
    question: "Y a-t-il tension entre phase et terre (testeur phase/terre positif) ?",
    yes: "r_neutre_coupure",
    no: "r_phase_absente",
  },
  {
    type: "result",
    id: "r_neutre_coupure",
    title: "Coupure du conducteur neutre",
    body: "La phase est présente mais le neutre est coupé. Situation potentiellement dangereuse (surtension possible).",
    actions: [
      "Ne pas utiliser le circuit.",
      "Faire réparer par un électricien agréé — risque de surtension sur d'autres circuits.",
      "Cause fréquente : borne desserrée au tableau ou dans une boîte de dérivation.",
    ],
    severity: "danger",
  },
  {
    type: "result",
    id: "r_phase_absente",
    title: "Phase absente sur la prise",
    body: "Ni la phase ni la tension ne sont présentes : le circuit est coupé en amont.",
    actions: [
      "Vérifier le disjoncteur correspondant au tableau.",
      "Rechercher une boîte de dérivation intermédiaire avec connexion défectueuse.",
      "Faire diagnostiquer par un électricien.",
    ],
    severity: "warning",
  },

  // ── AUTRE ─────────────────────────────────────────────────────────────────
  {
    type: "question",
    id: "q_autre_panne",
    question: "La panne est-elle apparue après des travaux ou une intervention récente ?",
    yes: "r_apres_travaux",
    no: "r_diagnostic_complet",
  },
  {
    type: "result",
    id: "r_apres_travaux",
    title: "Panne post-travaux",
    body: "La panne est survenue après une intervention : connexion oubliée, câble pincé ou court-circuit accidentel.",
    actions: [
      "Contacter l'entreprise ayant réalisé les travaux.",
      "Vérifier toutes les boîtes de dérivation ouvertes lors des travaux.",
      "Faire réaliser un contrôle de conformité RGIE si l'installation a été modifiée.",
    ],
    severity: "warning",
  },
  {
    type: "result",
    id: "r_diagnostic_complet",
    title: "Diagnostic approfondi nécessaire",
    body: "La panne ne correspond pas aux cas courants. Un diagnostic complet de l'installation est recommandé.",
    actions: [
      "Faire appel à un électricien agréé pour un diagnostic complet.",
      "Demander une mesure d'isolement et un contrôle du tableau.",
      "Si l'installation a plus de 25 ans, envisager un contrôle de conformité RGIE.",
    ],
    severity: "info",
  },
];

export const TREE: Record<string, DiagNode> = Object.fromEntries(
  nodes.map((n) => [n.id, n])
);

export const ROOT_ID = "root";
