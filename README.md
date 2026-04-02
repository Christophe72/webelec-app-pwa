# WebElec

Assistant electrique RGIE en PWA, construit avec Next.js App Router.

L'application regroupe plusieurs modules metier pour aider au diagnostic, au calcul et a la preparation de plans electriques.

## Sommaire

- Presentation
- Fonctionnalites
- Stack technique
- Prerequis
- Installation et demarrage
- Scripts disponibles
- Build et deploiement
- Architecture du projet
- Donnees et persistance
- Qualite et bonnes pratiques
- Limites actuelles

## Presentation

WebElec est une application web orientee terrain et apprentissage RGIE.

Elle propose:

- un diagnostic guide,
- des calculateurs electriques,
- un QCM RGIE,
- un module plans interactif avec export.

## Fonctionnalites

### 1) Diagnostic

- Route: /diagnostic
- Outil de depannage sous forme d'arbre decisionnel.
- Navigation avec historique des reponses et retour aux etapes precedentes.
- Resultats classes par niveau de severite avec actions recommandees.

### 2) Calcul section cable

- Route: /section
- Calcul de section selon puissance, tension, longueur, type de reseau, type de circuit et mode de pose.
- Affichage de chute de tension, conformite et conclusion.

### 3) Calcul disjoncteur

- Route: /calculs/disjoncteur
- Evaluation d'installation avec proposition de disjoncteur conseille.
- Prend en compte section, type de circuit, reseau, longueur et puissance.

### 4) QCM RGIE

- Route: /qcm
- Questionnaire a choix multiple avec score final.
- Corrections et explications question par question.

### 5) Plans electriques

- Route: /plans
- Editeur visuel avec drag and drop de symboles.
- Proprietes dynamiques par element (reference, piece, circuit, meta).
- Liens entre elements (commande/circuit), controles de coherence et comptage automatique.
- Fond de plan image (PNG/JPG), zoom, rotation, duplication, export PNG/JSON.

## Stack technique

- Next.js 16.2.2 (App Router)
- React 19.2.4
- TypeScript 5
- Tailwind CSS 4
- ESLint 9 + eslint-config-next

## Prerequis

- Node.js LTS recent (recommande: 20+)
- npm (ou equivalent)

## Installation et demarrage

1. Installer les dependances:

```bash
npm install
```

1. Lancer le serveur de developpement:

```bash
npm run dev
```

1. Ouvrir l'application:

- <http://localhost:3000>

## Scripts disponibles

```bash
npm run dev    # Lancement en developpement
npm run build  # Build de production
npm run start  # Serveur Next en mode production
npm run lint   # Verification ESLint
```

## Build et deploiement

Le projet est configure en export statique via Next.js:

- output: export
- trailingSlash: true
- images.unoptimized: true

Implications:

- Le resultat est exportable en site statique.
- Le dossier de sortie genere est out/.
- Peut etre heberge sur n'importe quel hebergement statique.

Build de production:

```bash
npm run build
```

## Architecture du projet

Structure principale:

```text
app/
  components/
    image-menu.tsx
    main-menu-items.ts
  diagnostic/
    page.tsx
    tree.ts
  section/
    page.tsx
    engine.ts
    types.ts
  calculs/disjoncteur/
    page.tsx
    engine.ts
    rules.ts
    types.ts
  qcm/
    page.tsx
    questions.ts
  plans/
    page.tsx
    plan-domain.ts
    types.ts
    canvas-export.ts
  layout.tsx
  manifest.ts
```

Points importants:

- Interface en francais (lang=fr).
- Gestion du theme clair/sombre avec persistance locale.
- Manifest PWA defini dans app/manifest.ts.

## Donnees et persistance

- Pas de backend ni base de donnees dans cette version.
- Les etats interactifs sont geres cote client.
- Le module plans persiste les documents via localStorage.

## Qualite et bonnes pratiques

- TypeScript strict pour fiabiliser le code.
- ESLint pour maintenir une base propre.
- App Router Next.js 16: tenir compte des evolutions et deprecations (voir AGENTS.md).

## Limites actuelles

- Pas de synchronisation multi-utilisateur.
- Pas de stockage serveur des plans.
- Pas de suite de tests automatisee (scripts de test non definis actuellement).

## Roadmap suggeree

- Ajouter des tests unitaires sur les moteurs de calcul.
- Ajouter un stockage distant pour les plans.
- Ajouter export PDF/rapport pour le module plans.
- Etendre les controles de coherence vers des regles RGIE plus avancees.
