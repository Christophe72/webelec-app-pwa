"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { ElementIcon } from "./element-icon";
import { exportToPng } from "./canvas-export";
import {
  createEmptyPlanDocument,
  countElements,
  linksForElement,
  makeLinkId,
  nextReference,
  runPlanChecks,
  touchPlan,
} from "./plan-domain";
import {
  CELL,
  ELEMENT_SIZE,
  GRID_H,
  GRID_W,
  SIDEBAR_ITEMS,
  type ElementType,
  type PlanDocument,
  type PlanElement,
  type PlanElementMeta,
} from "./types";
import styles from "./page.module.css";

function PositionedCell({
  x,
  y,
  rotation,
  className,
  onMouseDown,
  onClick,
  children,
}: {
  x: number;
  y: number;
  rotation: number;
  className: string;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.style.setProperty("--ex", `${x}px`);
      ref.current.style.setProperty("--ey", `${y}px`);
      ref.current.style.setProperty("--rot", `${rotation}deg`);
    }
  }, [x, y, rotation]);
  return (
    <div
      ref={ref}
      className={className}
      onMouseDown={onMouseDown}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

function GhostCell({
  x,
  y,
  className,
  children,
}: {
  x: number;
  y: number;
  className: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.style.setProperty("--gx", `${x}px`);
      ref.current.style.setProperty("--gy", `${y}px`);
    }
  }, [x, y]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

const LS_KEY = "webelec-plan-v2";

function snap(val: number, max: number, size: number): number {
  return Math.max(0, Math.min(Math.round(val / CELL) * CELL, max - size));
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

let idCounter = 0;
function newId() {
  return `el-${Date.now()}-${idCounter++}`;
}

function getDefaultMeta(type: ElementType): PlanElementMeta {
  switch (type) {
    case "prise":
      return { priseType: "simple", amperage: "16A", avecTerre: true };
    case "interrupteur":
      return { interrupteurType: "simple" };
    case "va_et_vient":
      return { interrupteurType: "va_et_vient" };
    case "point_lumineux":
      return { luminaireType: "plafond" };
    case "tableau":
      return { rangees: 2 };
    default:
      return {};
  }
}

export default function PlansPage() {
  const [doc, setDoc] = useState<PlanDocument>(() => createEmptyPlanDocument());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedLinkType, setSelectedLinkType] = useState<
    "commande" | "circuit"
  >("commande");
  const [linkTargetId, setLinkTargetId] = useState<string>("");

  const [draggingType, setDraggingType] = useState<ElementType | null>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  const [movingId, setMovingId] = useState<string | null>(null);
  const [moveOffset, setMoveOffset] = useState({ dx: 0, dy: 0 });

  const [movingBackground, setMovingBackground] = useState(false);
  const [backgroundOffset, setBackgroundOffset] = useState({ dx: 0, dy: 0 });

  const [zoom, setZoom] = useState(1);

  const gridRef = useRef<HTMLDivElement>(null);
  const gridViewportRef = useRef<HTMLDivElement>(null);
  const gridInnerRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  const selectedElement = useMemo(
    () => doc.elements.find((el) => el.id === selectedId) ?? null,
    [doc.elements, selectedId],
  );
  const checks = useMemo(() => runPlanChecks(doc), [doc]);
  const counters = useMemo(() => countElements(doc.elements), [doc.elements]);

  const setDocWithTouch = useCallback(
    (updater: (prev: PlanDocument) => PlanDocument) => {
      setDoc((prev) => touchPlan(updater(prev)));
    },
    [],
  );

  useLayoutEffect(() => {
    if (gridViewportRef.current) {
      gridViewportRef.current.style.setProperty("--zw", `${GRID_W * zoom}px`);
      gridViewportRef.current.style.setProperty("--zh", `${GRID_H * zoom}px`);
    }
    if (gridInnerRef.current) {
      gridInnerRef.current.style.setProperty("--zoom", String(zoom));
    }
  }, [zoom]);

  useLayoutEffect(() => {
    if (!backgroundRef.current || !doc.background?.src) return;
    backgroundRef.current.style.setProperty("--bgx", `${doc.background.x}px`);
    backgroundRef.current.style.setProperty("--bgy", `${doc.background.y}px`);
    backgroundRef.current.style.setProperty(
      "--bg-opacity",
      String(doc.background.opacity),
    );
    backgroundRef.current.style.setProperty(
      "--bg-url",
      `url('${doc.background.src}')`,
    );
  }, [doc.background]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      setCursor({ x: e.clientX, y: e.clientY });

      if (movingId && gridRef.current) {
        const rect = gridRef.current.getBoundingClientRect();
        const scrollLeft = gridRef.current.scrollLeft;
        const scrollTop = gridRef.current.scrollTop;
        const rawX =
          (e.clientX - rect.left + scrollLeft - moveOffset.dx) / (zoom || 1);
        const rawY =
          (e.clientY - rect.top + scrollTop - moveOffset.dy) / (zoom || 1);
        const nx = snap(rawX, GRID_W, ELEMENT_SIZE);
        const ny = snap(rawY, GRID_H, ELEMENT_SIZE);

        setDocWithTouch((prev) => ({
          ...prev,
          elements: prev.elements.map((el) =>
            el.id === movingId ? { ...el, x: nx, y: ny } : el,
          ),
        }));
      }

      if (movingBackground && gridRef.current && doc.background) {
        const rect = gridRef.current.getBoundingClientRect();
        const scrollLeft = gridRef.current.scrollLeft;
        const scrollTop = gridRef.current.scrollTop;
        const x =
          (e.clientX - rect.left + scrollLeft - backgroundOffset.dx) /
          (zoom || 1);
        const y =
          (e.clientY - rect.top + scrollTop - backgroundOffset.dy) /
          (zoom || 1);

        setDocWithTouch((prev) => ({
          ...prev,
          background: prev.background
            ? {
                ...prev.background,
                x: snap(x, GRID_W, 0),
                y: snap(y, GRID_H, 0),
              }
            : prev.background,
        }));
      }
    },
    [
      movingId,
      moveOffset,
      zoom,
      movingBackground,
      backgroundOffset,
      doc.background,
      setDocWithTouch,
    ],
  );

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (draggingType && gridRef.current) {
        const rect = gridRef.current.getBoundingClientRect();
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          const scrollLeft = gridRef.current.scrollLeft;
          const scrollTop = gridRef.current.scrollTop;
          const rawX =
            (e.clientX - rect.left + scrollLeft - ELEMENT_SIZE / 2) /
            (zoom || 1);
          const rawY =
            (e.clientY - rect.top + scrollTop - ELEMENT_SIZE / 2) / (zoom || 1);
          const nx = snap(rawX, GRID_W, ELEMENT_SIZE);
          const ny = snap(rawY, GRID_H, ELEMENT_SIZE);

          setDocWithTouch((prev) => {
            const id = newId();
            const el: PlanElement = {
              id,
              type: draggingType,
              x: nx,
              y: ny,
              rotation: 0,
              reference: nextReference(draggingType, prev.elements),
              piece: prev.rooms[0]?.name,
              meta: getDefaultMeta(draggingType),
            };
            setSelectedId(id);
            return { ...prev, elements: [...prev.elements, el] };
          });
        }
      }

      setDraggingType(null);
      setMovingId(null);
      setMovingBackground(false);
    },
    [draggingType, setDocWithTouch, zoom],
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  function handleSidebarDown(type: ElementType) {
    setDraggingType(type);
    setSelectedId(null);
  }

  function handleElementDown(e: React.MouseEvent, el: PlanElement) {
    e.stopPropagation();
    setSelectedId(el.id);
    if (gridRef.current) {
      const rect = gridRef.current.getBoundingClientRect();
      const scrollLeft = gridRef.current.scrollLeft;
      const scrollTop = gridRef.current.scrollTop;
      const elAbsX = el.x * zoom - scrollLeft + rect.left;
      const elAbsY = el.y * zoom - scrollTop + rect.top;
      setMoveOffset({
        dx: e.clientX - elAbsX,
        dy: e.clientY - elAbsY,
      });
      setMovingId(el.id);
    }
  }

  function handleBackgroundDown(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    if (!doc.background || doc.background.locked || !gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    const scrollLeft = gridRef.current.scrollLeft;
    const scrollTop = gridRef.current.scrollTop;
    const bgAbsX = doc.background.x * zoom - scrollLeft + rect.left;
    const bgAbsY = doc.background.y * zoom - scrollTop + rect.top;
    setBackgroundOffset({ dx: e.clientX - bgAbsX, dy: e.clientY - bgAbsY });
    setMovingBackground(true);
  }

  function handleGridClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      setSelectedId(null);
    }
  }

  const handleDelete = useCallback(() => {
    if (!selectedId) return;
    setDocWithTouch((prev) => ({
      ...prev,
      elements: prev.elements.filter((el) => el.id !== selectedId),
      links: prev.links.filter(
        (link) =>
          link.fromElementId !== selectedId && link.toElementId !== selectedId,
      ),
    }));
    setSelectedId(null);
  }, [selectedId, setDocWithTouch]);

  const handleRotateSelected = useCallback(() => {
    if (!selectedId) return;
    setDocWithTouch((prev) => ({
      ...prev,
      elements: prev.elements.map((el) =>
        el.id === selectedId
          ? { ...el, rotation: ((((el.rotation ?? 0) + 90) % 360) + 360) % 360 }
          : el,
      ),
    }));
  }, [selectedId, setDocWithTouch]);

  const handleDuplicate = useCallback(() => {
    if (!selectedElement) return;
    setDocWithTouch((prev) => {
      const cloneId = newId();
      const clone: PlanElement = {
        ...selectedElement,
        id: cloneId,
        x: clamp(selectedElement.x + CELL, 0, GRID_W - ELEMENT_SIZE),
        y: clamp(selectedElement.y + CELL, 0, GRID_H - ELEMENT_SIZE),
        reference: nextReference(selectedElement.type, prev.elements),
      };
      setSelectedId(cloneId);
      return { ...prev, elements: [...prev.elements, clone] };
    });
  }, [selectedElement, setDocWithTouch]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName)) {
        return;
      }

      if (!selectedId) return;

      if (e.key === "Delete") {
        e.preventDefault();
        handleDelete();
      }

      if (e.key.toLowerCase() === "r") {
        e.preventDefault();
        handleRotateSelected();
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") {
        e.preventDefault();
        handleDuplicate();
      }

      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        const dx =
          e.key === "ArrowLeft" ? -CELL : e.key === "ArrowRight" ? CELL : 0;
        const dy =
          e.key === "ArrowUp" ? -CELL : e.key === "ArrowDown" ? CELL : 0;
        setDocWithTouch((prev) => ({
          ...prev,
          elements: prev.elements.map((el) =>
            el.id !== selectedId
              ? el
              : {
                  ...el,
                  x: clamp(el.x + dx, 0, GRID_W - ELEMENT_SIZE),
                  y: clamp(el.y + dy, 0, GRID_H - ELEMENT_SIZE),
                },
          ),
        }));
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    handleDelete,
    handleDuplicate,
    handleRotateSelected,
    selectedId,
    setDocWithTouch,
  ]);

  function handleNew() {
    if (
      doc.elements.length > 0 &&
      !window.confirm("Effacer le plan actuel et repartir de zéro ?")
    ) {
      return;
    }
    setDoc(createEmptyPlanDocument());
    setSelectedId(null);
  }

  function handleSave() {
    localStorage.setItem(LS_KEY, JSON.stringify(doc));
  }

  function handleLoad() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) {
        alert("Aucun plan sauvegardé.");
        return;
      }

      const data = JSON.parse(raw) as PlanDocument | PlanElement[];
      if (Array.isArray(data)) {
        const migrated = createEmptyPlanDocument();
        setDoc({
          ...migrated,
          elements: data.map((el) => ({
            ...el,
            reference: nextReference(el.type, migrated.elements),
            rotation: el.rotation ?? 0,
          })),
        });
      } else {
        setDoc({
          ...createEmptyPlanDocument(),
          ...data,
          elements: (data.elements ?? []).map((el) => ({
            ...el,
            rotation: el.rotation ?? 0,
          })),
          links: data.links ?? [],
        });
      }
      setSelectedId(null);
    } catch {
      alert("Erreur lors du chargement.");
    }
  }

  function handleExportPng() {
    exportToPng(doc.elements);
  }

  function handleExportJson() {
    const blob = new Blob([JSON.stringify(doc, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.name || "plan"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleRecenter() {
    if (!gridRef.current) return;
    gridRef.current.scrollLeft =
      (GRID_W * zoom - gridRef.current.clientWidth) / 2;
    gridRef.current.scrollTop =
      (GRID_H * zoom - gridRef.current.clientHeight) / 2;
  }

  function updateSelectedElement(patch: Partial<PlanElement>) {
    if (!selectedId) return;
    setDocWithTouch((prev) => ({
      ...prev,
      elements: prev.elements.map((el) =>
        el.id === selectedId ? { ...el, ...patch } : el,
      ),
    }));
  }

  function updateSelectedMeta(patch: Partial<PlanElementMeta>) {
    if (!selectedId) return;
    setDocWithTouch((prev) => ({
      ...prev,
      elements: prev.elements.map((el) =>
        el.id === selectedId
          ? { ...el, meta: { ...(el.meta ?? {}), ...patch } }
          : el,
      ),
    }));
  }

  function addLink() {
    if (!selectedId || !linkTargetId || selectedId === linkTargetId) return;
    setDocWithTouch((prev) => {
      const exists = prev.links.some(
        (link) =>
          link.type === selectedLinkType &&
          ((link.fromElementId === selectedId &&
            link.toElementId === linkTargetId) ||
            (link.fromElementId === linkTargetId &&
              link.toElementId === selectedId)),
      );
      if (exists) return prev;
      return {
        ...prev,
        links: [
          ...prev.links,
          {
            id: makeLinkId(),
            fromElementId: selectedId,
            toElementId: linkTargetId,
            type: selectedLinkType,
          },
        ],
      };
    });
  }

  function removeLink(linkId: string) {
    setDocWithTouch((prev) => ({
      ...prev,
      links: prev.links.filter((link) => link.id !== linkId),
    }));
  }

  function handleBackgroundFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = String(reader.result ?? "");
      setDocWithTouch((prev) => ({
        ...prev,
        backgroundImage: src,
        background: {
          ...(prev.background ?? {
            opacity: 0.45,
            locked: true,
            x: 0,
            y: 0,
          }),
          src,
        },
      }));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  const selectedLinks = selectedId
    ? linksForElement(doc.links, selectedId)
    : [];

  const idToElement = useMemo(
    () => new Map(doc.elements.map((el) => [el.id, el])),
    [doc.elements],
  );

  return (
    <main className={styles.page}>
      <div className={styles.topBar}>
        <h1>{doc.name}</h1>
        <div className={styles.topActions}>
          <button className={styles.btn} onClick={handleNew} type="button">
            Nouveau
          </button>
          <button className={styles.btn} onClick={handleSave} type="button">
            Sauvegarder
          </button>
          <button className={styles.btn} onClick={handleLoad} type="button">
            Charger
          </button>
          <button
            className={styles.btn}
            onClick={handleExportPng}
            type="button"
          >
            Export PNG
          </button>
          <button
            className={styles.btn}
            onClick={handleExportJson}
            type="button"
          >
            Export JSON
          </button>
          <Link href="/" className={`${styles.btn} ${styles.btnDanger}`}>
            Quitter
          </Link>
        </div>
      </div>

      <div className={styles.body}>
        <aside className={styles.sidebar}>
          <p className={styles.sidebarTitle}>Symboles</p>
          {SIDEBAR_ITEMS.map((item) => (
            <div
              key={item.type}
              className={styles.sidebarItem}
              onMouseDown={() => handleSidebarDown(item.type)}
            >
              <ElementIcon type={item.type} size={22} />
              {item.label}
            </div>
          ))}

          <hr className={styles.sidebarDivider} />

          <p className={styles.sidebarTitle}>Édition</p>
          <button
            className={styles.btn}
            onClick={handleDuplicate}
            disabled={selectedId === null}
            type="button"
          >
            Dupliquer (Ctrl+D)
          </button>
          <button
            className={`${styles.btn} ${styles.btnDanger}`}
            onClick={handleDelete}
            disabled={selectedId === null}
            type="button"
          >
            Supprimer
          </button>
          <button
            className={styles.btn}
            onClick={handleRotateSelected}
            disabled={selectedId === null}
            type="button"
          >
            Pivoter 90°
          </button>

          <hr className={styles.sidebarDivider} />

          <p className={styles.sidebarTitle}>Zoom</p>
          <div className={styles.zoomRow}>
            <button
              className={styles.btn}
              onClick={() =>
                setZoom((z) => clamp(Number((z - 0.1).toFixed(2)), 0.5, 2))
              }
              type="button"
            >
              -
            </button>
            <span className={styles.zoomValue}>{Math.round(zoom * 100)}%</span>
            <button
              className={styles.btn}
              onClick={() =>
                setZoom((z) => clamp(Number((z + 0.1).toFixed(2)), 0.5, 2))
              }
              type="button"
            >
              +
            </button>
          </div>
          <button className={styles.btn} onClick={handleRecenter} type="button">
            Recentrer
          </button>

          <hr className={styles.sidebarDivider} />

          <p className={styles.sidebarTitle}>Fond de plan</p>
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            aria-label="Importer un fond de plan"
            onChange={handleBackgroundFileChange}
            className={styles.fileInput}
          />
          <label className={styles.inlineLabel}>
            Opacité
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={doc.background?.opacity ?? 0.45}
              onChange={(e) =>
                setDocWithTouch((prev) => ({
                  ...prev,
                  background: prev.background
                    ? { ...prev.background, opacity: Number(e.target.value) }
                    : prev.background,
                }))
              }
            />
          </label>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={doc.background?.locked ?? true}
              onChange={(e) =>
                setDocWithTouch((prev) => ({
                  ...prev,
                  background: prev.background
                    ? { ...prev.background, locked: e.target.checked }
                    : prev.background,
                }))
              }
            />
            Fond verrouillé
          </label>

          <hr className={styles.sidebarDivider} />

          <p className={styles.sidebarTitle}>Comptage</p>
          <div className={styles.metric}>Prises: {counters.prises}</div>
          <div className={styles.metric}>
            Interrupteurs: {counters.interrupteurs}
          </div>
          <div className={styles.metric}>Va-et-vient: {counters.vaEtVient}</div>
          <div className={styles.metric}>
            Points lumineux: {counters.pointsLumineux}
          </div>
          <div className={styles.metric}>RJ45: {counters.rj45}</div>
          <div className={styles.metric}>Tableaux: {counters.tableaux}</div>
          <div className={styles.metric}>
            Prises simples: {counters.prisesSimples}
          </div>
          <div className={styles.metric}>
            Prises doubles: {counters.prisesDoubles}
          </div>

          <hr className={styles.sidebarDivider} />

          <p className={styles.sidebarTitle}>Vérifications</p>
          <div className={styles.checkList}>
            {checks.length === 0 && (
              <p className={styles.checkOk}>Aucune alerte.</p>
            )}
            {checks.map((check) => (
              <button
                key={check.id}
                type="button"
                className={styles.checkItem}
                onClick={() =>
                  check.elementId && setSelectedId(check.elementId)
                }
              >
                ⚠ {check.message}
              </button>
            ))}
          </div>
        </aside>

        <div className={styles.grid} ref={gridRef} onClick={handleGridClick}>
          <div className={styles.gridViewport} ref={gridViewportRef}>
            <div className={styles.gridInner} ref={gridInnerRef}>
              {doc.background?.src && (
                <div
                  ref={backgroundRef}
                  className={styles.backgroundLayer}
                  onMouseDown={handleBackgroundDown}
                />
              )}

              <svg className={styles.linksLayer} width={GRID_W} height={GRID_H}>
                {doc.links.map((link) => {
                  const from = idToElement.get(link.fromElementId);
                  const to = idToElement.get(link.toElementId);
                  if (!from || !to) return null;
                  const x1 = from.x + ELEMENT_SIZE / 2;
                  const y1 = from.y + ELEMENT_SIZE / 2;
                  const x2 = to.x + ELEMENT_SIZE / 2;
                  const y2 = to.y + ELEMENT_SIZE / 2;
                  return (
                    <line
                      key={link.id}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      className={
                        link.type === "commande"
                          ? styles.commandLink
                          : styles.circuitLink
                      }
                    />
                  );
                })}
              </svg>

              {doc.elements.map((el) => (
                <PositionedCell
                  key={el.id}
                  x={el.x}
                  y={el.y}
                  rotation={el.rotation ?? 0}
                  className={
                    el.id === selectedId
                      ? `${styles.element} ${styles.elementSelected}`
                      : styles.element
                  }
                  onMouseDown={(e) => handleElementDown(e, el)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ElementIcon type={el.type} size={48} />
                  <span className={styles.elementRef}>{el.reference}</span>
                </PositionedCell>
              ))}
            </div>
          </div>
        </div>

        <aside className={styles.detailsPanel}>
          <p className={styles.sidebarTitle}>Détails</p>
          {!selectedElement && (
            <p className={styles.helperText}>
              Sélectionnez un symbole pour éditer ses propriétés.
            </p>
          )}

          {selectedElement && (
            <>
              <label className={styles.field}>
                Type
                <input type="text" value={selectedElement.type} readOnly />
              </label>
              <label className={styles.field}>
                Référence
                <input
                  type="text"
                  value={selectedElement.reference ?? ""}
                  onChange={(e) =>
                    updateSelectedElement({ reference: e.target.value })
                  }
                />
              </label>
              <label className={styles.field}>
                Libellé
                <input
                  type="text"
                  value={selectedElement.label ?? ""}
                  onChange={(e) =>
                    updateSelectedElement({ label: e.target.value })
                  }
                />
              </label>
              <label className={styles.field}>
                Pièce
                <select
                  value={selectedElement.piece ?? ""}
                  onChange={(e) =>
                    updateSelectedElement({ piece: e.target.value })
                  }
                >
                  <option value="">Non défini</option>
                  {doc.rooms.map((room) => (
                    <option key={room.id} value={room.name}>
                      {room.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className={styles.field}>
                Circuit
                <input
                  type="text"
                  value={selectedElement.circuit ?? ""}
                  onChange={(e) =>
                    updateSelectedElement({ circuit: e.target.value })
                  }
                />
              </label>
              <label className={styles.field}>
                Rotation
                <input
                  type="number"
                  step={90}
                  value={selectedElement.rotation ?? 0}
                  onChange={(e) =>
                    updateSelectedElement({
                      rotation: Number(e.target.value) || 0,
                    })
                  }
                />
              </label>
              <label className={styles.field}>
                Hauteur (cm)
                <input
                  type="number"
                  value={selectedElement.meta?.hauteur ?? ""}
                  onChange={(e) =>
                    updateSelectedMeta({
                      hauteur:
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value),
                    })
                  }
                />
              </label>

              {selectedElement.type === "prise" && (
                <>
                  <label className={styles.field}>
                    Prise simple/double
                    <select
                      value={selectedElement.meta?.priseType ?? "simple"}
                      onChange={(e) =>
                        updateSelectedMeta({
                          priseType: e.target.value as "simple" | "double",
                        })
                      }
                    >
                      <option value="simple">Simple</option>
                      <option value="double">Double</option>
                    </select>
                  </label>
                  <label className={styles.field}>
                    Intensité
                    <select
                      value={selectedElement.meta?.amperage ?? "16A"}
                      onChange={(e) =>
                        updateSelectedMeta({
                          amperage: e.target.value as
                            | "10A"
                            | "16A"
                            | "20A"
                            | "32A",
                        })
                      }
                    >
                      <option value="10A">10A</option>
                      <option value="16A">16A</option>
                      <option value="20A">20A</option>
                      <option value="32A">32A</option>
                    </select>
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={selectedElement.meta?.avecTerre ?? true}
                      onChange={(e) =>
                        updateSelectedMeta({ avecTerre: e.target.checked })
                      }
                    />
                    Avec terre
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={selectedElement.meta?.dediee ?? false}
                      onChange={(e) =>
                        updateSelectedMeta({ dediee: e.target.checked })
                      }
                    />
                    Ligne dédiée
                  </label>
                </>
              )}

              {(selectedElement.type === "interrupteur" ||
                selectedElement.type === "va_et_vient") && (
                <label className={styles.field}>
                  Type interrupteur
                  <select
                    value={selectedElement.meta?.interrupteurType ?? "simple"}
                    onChange={(e) =>
                      updateSelectedMeta({
                        interrupteurType: e.target.value as
                          | "simple"
                          | "va_et_vient"
                          | "permutateur",
                      })
                    }
                  >
                    <option value="simple">Simple allumage</option>
                    <option value="va_et_vient">Va-et-vient</option>
                    <option value="permutateur">Permutateur</option>
                  </select>
                </label>
              )}

              {selectedElement.type === "point_lumineux" && (
                <>
                  <label className={styles.field}>
                    Type luminaire
                    <select
                      value={selectedElement.meta?.luminaireType ?? "plafond"}
                      onChange={(e) =>
                        updateSelectedMeta({
                          luminaireType: e.target.value as
                            | "plafond"
                            | "applique",
                        })
                      }
                    >
                      <option value="plafond">Plafond</option>
                      <option value="applique">Applique</option>
                    </select>
                  </label>
                  <label className={styles.field}>
                    Puissance (W)
                    <input
                      type="number"
                      value={selectedElement.meta?.puissance ?? ""}
                      onChange={(e) =>
                        updateSelectedMeta({
                          puissance:
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value),
                        })
                      }
                    />
                  </label>
                </>
              )}

              {selectedElement.type === "tableau" && (
                <>
                  <label className={styles.field}>
                    Nombre de rangées
                    <input
                      type="number"
                      value={selectedElement.meta?.rangees ?? ""}
                      onChange={(e) =>
                        updateSelectedMeta({
                          rangees:
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value),
                        })
                      }
                    />
                  </label>
                  <label className={styles.field}>
                    Différentiel principal
                    <input
                      type="text"
                      value={selectedElement.meta?.differentielPrincipal ?? ""}
                      onChange={(e) =>
                        updateSelectedMeta({
                          differentielPrincipal: e.target.value,
                        })
                      }
                    />
                  </label>
                </>
              )}

              <hr className={styles.sidebarDivider} />
              <p className={styles.sidebarTitle}>Liens</p>

              <label className={styles.field}>
                Type de lien
                <select
                  value={selectedLinkType}
                  onChange={(e) =>
                    setSelectedLinkType(
                      e.target.value as "commande" | "circuit",
                    )
                  }
                >
                  <option value="commande">Commande</option>
                  <option value="circuit">Circuit</option>
                </select>
              </label>

              <label className={styles.field}>
                Cible
                <select
                  value={linkTargetId}
                  onChange={(e) => setLinkTargetId(e.target.value)}
                >
                  <option value="">Sélectionner...</option>
                  {doc.elements
                    .filter((el) => el.id !== selectedElement.id)
                    .map((el) => (
                      <option key={el.id} value={el.id}>
                        {el.reference ?? el.id}
                      </option>
                    ))}
                </select>
              </label>

              <button className={styles.btn} type="button" onClick={addLink}>
                Ajouter le lien
              </button>

              <div className={styles.linkList}>
                {selectedLinks.length === 0 && (
                  <p className={styles.helperText}>
                    Aucun lien sur cet élément.
                  </p>
                )}
                {selectedLinks.map((link) => {
                  const otherId =
                    link.fromElementId === selectedElement.id
                      ? link.toElementId
                      : link.fromElementId;
                  const other = doc.elements.find((el) => el.id === otherId);
                  return (
                    <div key={link.id} className={styles.linkItem}>
                      <span>
                        {link.type} → {other?.reference ?? otherId}
                      </span>
                      <button
                        type="button"
                        className={`${styles.btn} ${styles.btnDanger}`}
                        onClick={() => removeLink(link.id)}
                      >
                        Suppr.
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </aside>
      </div>

      {draggingType && (
        <GhostCell x={cursor.x} y={cursor.y} className={styles.ghost}>
          <ElementIcon type={draggingType} size={48} />
        </GhostCell>
      )}
    </main>
  );
}
