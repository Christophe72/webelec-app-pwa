import type { ImageMenuItem } from "./image-menu";

export const MAIN_MENU_ITEMS: ImageMenuItem[] = [
  {
    href: "/diagnostic",
    label: "Diagnostic",
    imageSrc: "/menu/diagnostic.svg",
    imageAlt: "Icône diagnostic",
  },
  {
    href: "/section",
    label: "Section câble",
    imageSrc: "/menu/section.svg",
    imageAlt: "Icône section câble",
  },
  {
    href: "/calculs/disjoncteur",
    label: "Disjoncteur",
    imageSrc: "/menu/disjoncteur.svg",
    imageAlt: "Icône disjoncteur",
  },
  {
    href: "/qcm",
    label: "QCM RGIE",
    imageSrc: "/menu/qcm.svg",
    imageAlt: "Icône questionnaire",
  },
  // {
  //   href: "/visite",
  //   label: "Visite de chantier",
  //   imageSrc: "/menu/visite.svg",
  //   imageAlt: "Icône visite de chantier",
  // },
  {
    href: "/",
    label: "Quitter",
    imageSrc: "/menu/quitter.svg",
    imageAlt: "Icône quitter",
  },
];
