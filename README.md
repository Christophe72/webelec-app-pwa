# WebElec

> Assistant electrique RGIE — application web progressive (PWA) utilisable
> sur chantier, en formation ou en bureau d'etudes.

---

## Pour qui ?

| Profil                       | Usage principal                                    |
| ---------------------------- | -------------------------------------------------- |
| Electricien terrain          | Diagnostic rapide, calcul de section cable         |
| Etudiant / apprenti          | QCM RGIE, calcul disjoncteur                       |
| Technicien / charge d'etudes | Plans electriques, export PNG / JSON               |
| Formateur                    | QCM personnalisable, demonstration des regles RGIE |

WebElec fonctionne **hors ligne** une fois installee en tant que PWA et ne
necessite aucun compte ni connexion serveur.

---

## Demarrage rapide

```bash
npm install
npm run dev
```

Puis ouvrir <http://localhost:3000> dans le navigateur.

---

## Modules

### Diagnostic electrique — `/diagnostic`

**A quoi ca sert ?**
Identifier la cause d'une panne ou d'une non-conformite en repondant a des
questions guidees.

**Deroulement :**

1. Choisissez le type de probleme dans le menu d'accueil.
1. Repondez aux questions affichees (Oui / Non).
1. L'arbre decisionnel retourne un resultat colore selon la gravite :
   - **OK** — installation conforme
   - **Info** — point de vigilance
   - **Avertissement** — intervention recommandee
   - **Danger** — intervention urgente
1. Utilisez **Precedent** / **Recommencer** pour naviguer dans l'historique.

> **Conseil terrain :** Commencez toujours par verifier la presence de tension
> avant de naviguer dans l'arbre — evite les faux positifs.

---

### Calcul de section de cable — `/section`

**A quoi ca sert ?**
Determiner la section minimale d'un cable selon les regles RGIE.

**Parametres d'entree :**

| Champ                   | Exemple                            |
| ----------------------- | ---------------------------------- |
| Puissance (W)           | 2 400 W                            |
| Tension (V)             | 230 V monophase                    |
| Longueur du circuit (m) | 15 m                               |
| Type de circuit         | Eclairage / Prises / Moteur        |
| Mode de pose            | Encastre / Sous conduit / Apparent |

**Resultats affiches :**

- Section recommandee (mm²)
- Chute de tension (%)
- Conformite RGIE (seuil 3 % eclairage — 5 % autres circuits)
- Conclusion (cable compatible ou non)

> **Astuce :** Pour un circuit de prises 16 A / 230 V sur 20 m pose encastre,
> la section calculee sera generalement 2,5 mm².

---

### Calcul disjoncteur — `/calculs/disjoncteur`

**A quoi ca sert ?**
Choisir le disjoncteur adapte a un circuit et verifier sa conformite RGIE.

**Parametres d'entree :**

| Champ                   | Exemple              |
| ----------------------- | -------------------- |
| Puissance installee (W) | 3 680 W              |
| Tension reseau (V)      | 230 V                |
| Section cable (mm²)     | 2,5 mm²              |
| Longueur circuit (m)    | 20 m                 |
| Type de reseau          | Monophase / Triphase |

**Resultats affiches :**

- Intensite d'emploi calculee (A)
- Disjoncteur conseille (calibre normalise)
- Chute de tension (%)
- Conformite RGIE et remarques

---

### QCM RGIE — `/qcm`

**A quoi ca sert ?**
S'entrainer aux questions d'examen RGIE ou tester ses connaissances
reglementaires.

**Deroulement :**

1. Les questions s'affichent une par une avec plusieurs reponses proposees.
1. Selectionnez la bonne reponse.
1. A la fin, un **score** et les corrections detaillees s'affichent.
1. Chaque question est accompagnee d'une **explication** justifiant la reponse.

> **Pour les formateurs :** Les questions sont definies dans
> `app/qcm/questions.ts` — il suffit d'editer ce fichier et de relancer le
> build pour ajouter ou modifier des questions.

---

### Plans electriques — `/plans`

**A quoi ca sert ?**
Dessiner un plan d'implantation electrique sur fond de plan, associer des
proprietes RGIE a chaque element, exporter en PNG ou JSON.

#### Interface

| Zone                    | Contenu                                   |
| ----------------------- | ----------------------------------------- |
| **Palette** (gauche)    | 7 symboles electriques a glisser-deposer  |
| **Canvas** (centre)     | Grille de dessin 2400 x 1600 px avec zoom |
| **Proprietes** (droite) | Details de l'element selectionne          |

#### Elements disponibles

| Symbole             | Reference auto  | Proprietes specifiques                 |
| ------------------- | --------------- | -------------------------------------- |
| Prise de courant    | PC-01, PC-02... | Type (simple / double), hauteur, terre |
| Interrupteur        | INT-01...       | Type (simple / double), hauteur        |
| Va-et-vient         | VAV-01...       | —                                      |
| Point lumineux      | PL-01...        | Type luminaire (spots, suspension...)  |
| Tableau electrique  | TAB-01...       | Rangees, differentiel principal        |
| Prise reseau RJ45   | RJ-01...        | —                                      |
| Boite de derivation | BD-01...        | —                                      |

#### Manipulations sur le canvas

| Action             | Comment                                     |
| ------------------ | ------------------------------------------- |
| Ajouter un element | Glisser depuis la palette vers le canvas    |
| Selectionner       | Clic sur l'element                          |
| Deplacer           | Glisser l'element sur la grille             |
| Supprimer          | Touche `Suppr` ou `Delete`                  |
| Rotation 90°       | Touche `R`                                  |
| Dupliquer          | `Ctrl + D`                                  |
| Deplacement fin    | Touches fleches (pas = 1 cellule de grille) |

#### Liens entre elements

Deux types de liens peuvent etre traces depuis le panneau Proprietes :

- **Commande** (trait ambre en pointilles) — ex. interrupteur vers luminaire
- **Circuit** (trait bleu continu) — ex. prise vers tableau

#### Fond de plan

1. Cliquez **Importer un fond** dans le panneau gauche.
1. Choisissez un fichier PNG ou JPG.
1. Ajustez l'opacite avec le curseur pour faire ressortir les symboles.
1. Verrouillez le fond pour eviter les deplacements accidentels.

#### Controles de coherence

Le panneau gauche affiche en continu les compteurs et les alertes :

- Elements sans piece d'affectation
- Interrupteur sans luminaire lie
- Luminaire sans interrupteur lie
- Prise sans circuit assigne
- Tableau sans circuit sortant
- Elements superposes sur la grille

#### Export

| Format   | Usage                                          |
| -------- | ---------------------------------------------- |
| **PNG**  | Plan visuel pour impression ou partage         |
| **JSON** | Sauvegarde complete — reimportation ulterieure |

---

## Raccourcis clavier — module Plans

| Touche             | Action                           |
| ------------------ | -------------------------------- |
| `Suppr` / `Delete` | Supprimer l'element selectionne  |
| `R`                | Pivoter de 90°                   |
| `Ctrl + D`         | Dupliquer                        |
| Fleches `↑ ↓ ← →`  | Deplacer d'une cellule de grille |

---

## FAQ terrain

**L'application fonctionne-t-elle sans connexion internet ?**
Oui, une fois installee en PWA (bouton Installer du navigateur), elle est
disponible hors ligne.

**Ou sont sauvegardes les plans ?**
Dans le `localStorage` du navigateur (cle `webelec-plan-v2`). Aucune donnee
ne transite par un serveur.

**Puis-je recuperer un plan sur un autre appareil ?**
Pas automatiquement. Exportez le plan en JSON depuis l'editeur et importez-le
sur l'autre appareil.

**Le calcul de section tient-il compte du facteur de simultaneite ?**
Non — le calcul est base sur la puissance totale declaree. Appliquez votre
propre coefficient de simultaneite si necessaire.

**Puis-je ajouter des questions au QCM ?**
Oui, en editant `app/qcm/questions.ts`, puis en relancant `npm run build`.

---

## Informations techniques

### Stack

- Next.js 16.2.2 (App Router, export statique)
- React 19.2.4 — TypeScript 5 — Tailwind CSS 4
- ESLint 9 + eslint-config-next

### Structure principale

```text
app/
  components/
  diagnostic/
  section/
  calculs/disjoncteur/
  qcm/
  plans/
    page.tsx
    plan-domain.ts
    types.ts
    canvas-export.ts
  layout.tsx
  manifest.ts
```

### Scripts

```bash
npm run dev    # Developpement
npm run build  # Build statique → out/
npm run start  # Serveur Next en mode production
npm run lint   # ESLint
```

### Deploiement

Le projet genere un dossier `out/` deployable sur tout hebergement statique
(Netlify, Vercel export, GitHub Pages, etc.).

**Prerequis :** Node.js LTS 20+, npm.

> Voir `AGENTS.md` pour les contraintes specifiques Next.js 16.
