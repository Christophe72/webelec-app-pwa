import type {
  PlanDocument,
  PlanElement,
  PlanElementType,
  PlanLink,
} from "./types";

const DEFAULT_ROOMS = [
  "Cuisine",
  "Salon",
  "Chambre 1",
  "Salle de bain",
  "Garage",
] as const;

const PREFIX_BY_TYPE: Record<PlanElementType, string> = {
  prise: "PC",
  interrupteur: "INT",
  va_et_vient: "VAV",
  point_lumineux: "PL",
  tableau: "TAB",
  rj45: "RJ",
  boite_derivation: "BD",
};

export type PlanCheck = {
  id: string;
  message: string;
  elementId?: string;
};

export function createEmptyPlanDocument(): PlanDocument {
  const now = new Date().toISOString();
  return {
    id: `plan-${Date.now()}`,
    name: "Nouveau plan",
    createdAt: now,
    updatedAt: now,
    rooms: DEFAULT_ROOMS.map((name, idx) => ({ id: `room-${idx + 1}`, name })),
    elements: [],
    links: [],
    background: {
      src: "",
      opacity: 0.45,
      locked: true,
      x: 0,
      y: 0,
    },
  };
}

export function touchPlan(doc: PlanDocument): PlanDocument {
  return { ...doc, updatedAt: new Date().toISOString() };
}

export function nextReference(
  type: PlanElementType,
  elements: PlanElement[],
): string {
  const prefix = PREFIX_BY_TYPE[type];
  const highest = elements.reduce((acc, el) => {
    if (!el.reference?.startsWith(`${prefix}-`)) return acc;
    const n = Number(el.reference.slice(prefix.length + 1));
    if (Number.isNaN(n)) return acc;
    return Math.max(acc, n);
  }, 0);
  return `${prefix}-${String(highest + 1).padStart(2, "0")}`;
}

export function countElements(elements: PlanElement[]) {
  const byType = {
    prises: 0,
    interrupteurs: 0,
    pointsLumineux: 0,
    rj45: 0,
    tableaux: 0,
    boitesDerivation: 0,
    vaEtVient: 0,
  };

  let prisesSimples = 0;
  let prisesDoubles = 0;

  for (const el of elements) {
    if (el.type === "prise") {
      byType.prises += 1;
      if (el.meta?.priseType === "double") prisesDoubles += 1;
      else prisesSimples += 1;
    }
    if (el.type === "interrupteur") byType.interrupteurs += 1;
    if (el.type === "point_lumineux") byType.pointsLumineux += 1;
    if (el.type === "rj45") byType.rj45 += 1;
    if (el.type === "tableau") byType.tableaux += 1;
    if (el.type === "boite_derivation") byType.boitesDerivation += 1;
    if (el.type === "va_et_vient") byType.vaEtVient += 1;
  }

  return {
    ...byType,
    prisesSimples,
    prisesDoubles,
  };
}

function hasCommandeLink(links: PlanLink[], elementId: string): boolean {
  return links.some(
    (link) =>
      link.type === "commande" &&
      (link.fromElementId === elementId || link.toElementId === elementId),
  );
}

function hasCircuitLink(links: PlanLink[], elementId: string): boolean {
  return links.some(
    (link) =>
      link.type === "circuit" &&
      (link.fromElementId === elementId || link.toElementId === elementId),
  );
}

export function runPlanChecks(doc: PlanDocument): PlanCheck[] {
  const checks: PlanCheck[] = [];
  const { elements, links } = doc;

  for (const el of elements) {
    if (!el.piece) {
      checks.push({
        id: `no-room-${el.id}`,
        elementId: el.id,
        message: `${el.reference ?? el.id} sans pièce associée`,
      });
    }

    if (
      (el.type === "interrupteur" || el.type === "va_et_vient") &&
      !hasCommandeLink(links, el.id)
    ) {
      checks.push({
        id: `switch-no-light-${el.id}`,
        elementId: el.id,
        message: `${el.reference ?? el.id} sans point lumineux associé`,
      });
    }

    if (el.type === "point_lumineux" && !hasCommandeLink(links, el.id)) {
      checks.push({
        id: `light-no-switch-${el.id}`,
        elementId: el.id,
        message: `${el.reference ?? el.id} non commandé`,
      });
    }

    if (el.type === "prise" && !el.circuit && !hasCircuitLink(links, el.id)) {
      checks.push({
        id: `socket-no-circuit-${el.id}`,
        elementId: el.id,
        message: `${el.reference ?? el.id} sans circuit associé`,
      });
    }

    if (el.type === "tableau" && !hasCircuitLink(links, el.id)) {
      checks.push({
        id: `board-no-circuit-${el.id}`,
        elementId: el.id,
        message: `${el.reference ?? el.id} sans circuit lié`,
      });
    }
  }

  const seenByPos = new Map<string, PlanElement[]>();
  for (const el of elements) {
    const key = `${el.x}:${el.y}`;
    const bucket = seenByPos.get(key) ?? [];
    bucket.push(el);
    seenByPos.set(key, bucket);
  }

  for (const bucket of seenByPos.values()) {
    if (bucket.length <= 1) continue;
    for (const el of bucket) {
      checks.push({
        id: `overlap-${el.id}`,
        elementId: el.id,
        message: `${el.reference ?? el.id} superposé à un autre élément`,
      });
    }
  }

  return checks;
}

export function linksForElement(
  links: PlanLink[],
  elementId: string,
): PlanLink[] {
  return links.filter(
    (link) =>
      link.fromElementId === elementId || link.toElementId === elementId,
  );
}

export function makeLinkId(): string {
  return `ln-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
