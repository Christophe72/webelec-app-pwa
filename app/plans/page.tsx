"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { ElementIcon } from "./element-icon";
import { exportToPng } from "./canvas-export";
import {
  CELL,
  ELEMENT_SIZE,
  GRID_W,
  GRID_H,
  SIDEBAR_ITEMS,
  type ElementType,
  type PlacedElement,
} from "./types";
import styles from "./page.module.css";

// ── Helper components (positionnement via CSS custom props + ref) ──────────
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

const LS_KEY = "webelec-plan";

function snap(val: number, max: number, size: number): number {
  return Math.max(0, Math.min(Math.round(val / CELL) * CELL, max - size));
}

let idCounter = 0;
function newId() {
  return `el-${Date.now()}-${idCounter++}`;
}

export default function PlansPage() {
  const [elements, setElements] = useState<PlacedElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Drag depuis la sidebar
  const [draggingType, setDraggingType] = useState<ElementType | null>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  // Déplacement d'un élément déjà posé
  const [movingId, setMovingId] = useState<string | null>(null);
  const [moveOffset, setMoveOffset] = useState({ dx: 0, dy: 0 });

  const gridRef = useRef<HTMLDivElement>(null);

  // ── Mouse move global ────────────────────────────────────
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      setCursor({ x: e.clientX, y: e.clientY });

      if (movingId && gridRef.current) {
        const rect = gridRef.current.getBoundingClientRect();
        const scrollLeft = gridRef.current.scrollLeft;
        const scrollTop = gridRef.current.scrollTop;
        const rawX = e.clientX - rect.left + scrollLeft - moveOffset.dx;
        const rawY = e.clientY - rect.top + scrollTop - moveOffset.dy;
        const nx = snap(rawX, GRID_W, ELEMENT_SIZE);
        const ny = snap(rawY, GRID_H, ELEMENT_SIZE);
        setElements((prev) =>
          prev.map((el) => (el.id === movingId ? { ...el, x: nx, y: ny } : el)),
        );
      }
    },
    [movingId, moveOffset],
  );

  // ── Mouse up global ──────────────────────────────────────
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
          const rawX = e.clientX - rect.left + scrollLeft - ELEMENT_SIZE / 2;
          const rawY = e.clientY - rect.top + scrollTop - ELEMENT_SIZE / 2;
          const nx = snap(rawX, GRID_W, ELEMENT_SIZE);
          const ny = snap(rawY, GRID_H, ELEMENT_SIZE);
          const id = newId();
          setElements((prev) => [
            ...prev,
            { id, type: draggingType, x: nx, y: ny, rotation: 0 },
          ]);
          setSelectedId(id);
        }
      }
      setDraggingType(null);
      setMovingId(null);
    },
    [draggingType],
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // ── Handlers ─────────────────────────────────────────────
  function handleSidebarDown(type: ElementType) {
    setDraggingType(type);
    setSelectedId(null);
  }

  function handleElementDown(e: React.MouseEvent, el: PlacedElement) {
    e.stopPropagation();
    setSelectedId(el.id);
    if (gridRef.current) {
      const rect = gridRef.current.getBoundingClientRect();
      const scrollLeft = gridRef.current.scrollLeft;
      const scrollTop = gridRef.current.scrollTop;
      const elAbsX = el.x - scrollLeft + rect.left;
      const elAbsY = el.y - scrollTop + rect.top;
      setMoveOffset({
        dx: e.clientX - elAbsX,
        dy: e.clientY - elAbsY,
      });
      setMovingId(el.id);
    }
  }

  function handleGridClick(e: React.MouseEvent<HTMLDivElement>) {
    // Désélection uniquement si on clique le fond de la grille.
    if (e.target === e.currentTarget) {
      setSelectedId(null);
    }
  }

  function handleDelete() {
    if (!selectedId) return;
    setElements((prev) => prev.filter((el) => el.id !== selectedId));
    setSelectedId(null);
  }

  function handleRotateSelected() {
    if (!selectedId) return;
    setElements((prev) =>
      prev.map((el) =>
        el.id === selectedId
          ? { ...el, rotation: ((((el.rotation ?? 0) + 90) % 360) + 360) % 360 }
          : el,
      ),
    );
  }

  function handleNew() {
    if (elements.length > 0 && !window.confirm("Effacer le plan actuel ?"))
      return;
    setElements([]);
    setSelectedId(null);
  }

  function handleSave() {
    localStorage.setItem(LS_KEY, JSON.stringify(elements));
  }

  function handleLoad() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) {
        alert("Aucun plan sauvegardé.");
        return;
      }
      const data = JSON.parse(raw) as PlacedElement[];
      setElements(
        data.map((el) => ({
          ...el,
          rotation: el.rotation ?? 0,
        })),
      );
      setSelectedId(null);
    } catch {
      alert("Erreur lors du chargement.");
    }
  }

  function handleExportPng() {
    exportToPng(elements);
  }

  // ── Render ────────────────────────────────────────────────
  return (
    <main className={styles.page}>
      {/* Barre du haut */}
      <div className={styles.topBar}>
        <h1>Plan électrique</h1>
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
          <Link href="/" className={`${styles.btn} ${styles.btnDanger}`}>
            Quitter
          </Link>
        </div>
      </div>

      {/* Corps */}
      <div className={styles.body}>
        {/* Barre latérale */}
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
        </aside>

        {/* Grille */}
        <div className={styles.grid} ref={gridRef} onClick={handleGridClick}>
          <div className={styles.gridInner}>
            {elements.map((el) => (
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
              </PositionedCell>
            ))}
          </div>
        </div>
      </div>

      {/* Ghost du drag */}
      {draggingType && (
        <GhostCell x={cursor.x} y={cursor.y} className={styles.ghost}>
          <ElementIcon type={draggingType} size={48} />
        </GhostCell>
      )}
    </main>
  );
}
