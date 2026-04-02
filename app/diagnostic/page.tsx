"use client";
/**
 * Diagnostic Page Component
 *
 * A guided troubleshooting tool that walks users through a decision tree to diagnose issues.
 *
 * @component
 * @returns {JSX.Element} A full-screen diagnostic interface with:
 *   - Header with navigation controls (back button, restart option)
 *   - Progress bar showing diagnostic progress
 *   - History list of previous answers for quick navigation
 *   - Dynamic content area displaying either:
 *     - Question cards with yes/no answers
 *     - Result cards with severity level, title, description, and recommended actions
 *   - Footer with diagnostic summary and restart button (result pages only)
 *
 * @example
 * ```tsx
 * <DiagnosticPage />
 * ```
 *
 * Features:
 * - Tree-based navigation through diagnostic questionnaire
 * - Jump back to previous steps via history
 * - Color-coded severity levels (ok, info, warning, danger)
 * - Responsive single-column layout
 * - French language interface
 *
 * State Management:
 * - `currentId`: Current node in the diagnostic tree
 * - `history`: Array of user answers and navigation path
 */

import { useState } from "react";
import { ImageMenu } from "../components/image-menu";
import { MAIN_MENU_ITEMS } from "../components/main-menu-items";
import {
  TREE,
  ROOT_ID,
  type DiagNode,
  type QuestionNode,
  type ResultNode,
  type Severity,
} from "./tree";

// ─── Types ────────────────────────────────────────────────────────────────────

type HistoryEntry = { nodeId: string; answer: "yes" | "no" };

// ─── Config ───────────────────────────────────────────────────────────────────

const SEVERITY_CONFIG: Record<
  Severity,
  {
    cardBg: string;
    border: string;
    badgeBg: string;
    icon: string;
    label: string;
  }
> = {
  ok: {
    cardBg: "bg-green-50 dark:bg-green-950",
    border: "border-green-300 dark:border-green-800",
    badgeBg: "bg-green-600",
    icon: "✓",
    label: "Résolu",
  },
  info: {
    cardBg: "bg-blue-50 dark:bg-blue-950",
    border: "border-blue-300 dark:border-blue-800",
    badgeBg: "bg-blue-500",
    icon: "ℹ",
    label: "Info",
  },
  warning: {
    cardBg: "bg-amber-50 dark:bg-amber-950",
    border: "border-amber-300 dark:border-amber-800",
    badgeBg: "bg-amber-500",
    icon: "⚠",
    label: "Attention",
  },
  danger: {
    cardBg: "bg-red-50 dark:bg-red-950",
    border: "border-red-300 dark:border-red-800",
    badgeBg: "bg-red-600",
    icon: "✕",
    label: "Danger",
  },
};

const ANSWER_CONFIG = {
  yes: { bg: "bg-green-600", label: "O" },
  no: { bg: "bg-red-600", label: "N" },
};

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ done, total }: { done: number; total: number }) {
  const segments = Math.max(total, done + 3);
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: segments }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full ${i < done ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-800"}`}
        />
      ))}
    </div>
  );
}

// ─── History list ─────────────────────────────────────────────────────────────

function HistoryList({
  history,
  onJump,
}: {
  history: HistoryEntry[];
  onJump: (index: number) => void;
}) {
  if (history.length === 0) return null;

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-xs font-semibold tracking-widest text-gray-400 dark:text-gray-600 uppercase px-1">
        Étapes — appuyer pour revenir
      </p>
      {history.map((entry, i) => {
        const node = TREE[entry.nodeId] as QuestionNode;
        const badge = ANSWER_CONFIG[entry.answer];
        return (
          <button
            key={i}
            onClick={() => onJump(i)}
            className="flex items-center gap-3 text-left rounded-xl px-3 py-2.5
                       bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800 transition-colors"
          >
            <span
              className={`shrink-0 w-7 h-7 rounded-full ${badge.bg} text-white text-xs font-bold flex items-center justify-center`}
            >
              {badge.label}
            </span>
            <span className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 leading-snug">
              {node.question}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Question card ────────────────────────────────────────────────────────────

function QuestionCard({
  node,
  onAnswer,
}: {
  node: QuestionNode;
  onAnswer: (a: "yes" | "no") => void;
}) {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-5
                    bg-white border border-gray-200
                    dark:bg-gray-900 dark:border-gray-800"
    >
      <p className="text-lg font-semibold leading-snug text-gray-900 dark:text-white">
        {node.question}
      </p>
      {node.hint && (
        <p
          className="text-sm italic pl-3 border-l-2
                      text-gray-400 border-gray-300
                      dark:text-gray-500 dark:border-gray-700"
        >
          {node.hint}
        </p>
      )}
      <div className="flex gap-3 pt-1">
        <button
          onClick={() => onAnswer("yes")}
          className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold py-3 transition-all"
        >
          Oui
        </button>
        <button
          onClick={() => onAnswer("no")}
          className="flex-1 rounded-xl font-semibold py-3 active:scale-95 transition-all
                     bg-gray-100 hover:bg-gray-200 text-gray-800
                     dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
        >
          Non
        </button>
      </div>
    </div>
  );
}

// ─── Result card ──────────────────────────────────────────────────────────────

function ResultCard({ node }: { node: ResultNode }) {
  const s = SEVERITY_CONFIG[node.severity];

  return (
    <div className="flex flex-col gap-3">
      {/* Severity badge above card */}
      <div className="flex items-center gap-2 px-1">
        <span
          className={`w-6 h-6 rounded-full ${s.badgeBg} text-white text-xs font-bold flex items-center justify-center`}
        >
          {s.icon}
        </span>
        <span
          className="text-xs font-semibold tracking-widest uppercase
                         text-gray-500 dark:text-gray-400"
        >
          {s.label}
        </span>
      </div>

      {/* Card */}
      <div
        className={`rounded-2xl border p-6 flex flex-col gap-4 ${s.border} ${s.cardBg}`}
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {node.title}
        </h2>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          {node.body}
        </p>

        <div className="flex flex-col gap-2 pt-1">
          <p
            className="text-xs font-semibold tracking-widest uppercase
                        text-gray-400 dark:text-gray-500"
          >
            Actions recommandées
          </p>
          <ol
            className="flex flex-col gap-2 list-decimal list-inside
                         marker:text-gray-400 dark:marker:text-gray-500"
          >
            {node.actions.map((action, i) => (
              <li
                key={i}
                className="text-sm leading-relaxed text-gray-700 dark:text-gray-200"
              >
                {action}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DiagnosticPage() {
  const [currentId, setCurrentId] = useState(ROOT_ID);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const node: DiagNode = TREE[currentId];
  const isResult = node.type === "result";

  function answer(a: "yes" | "no") {
    if (node.type !== "question") return;
    setHistory((h) => [...h, { nodeId: currentId, answer: a }]);
    setCurrentId(a === "yes" ? node.yes : node.no);
  }

  function restart() {
    setCurrentId(ROOT_ID);
    setHistory([]);
  }

  function jumpTo(index: number) {
    const entry = history[index];
    setHistory((h) => h.slice(0, index));
    setCurrentId(entry.nodeId);
  }

  return (
    <main
      className="min-h-screen flex flex-col
                     bg-gray-50 text-gray-900
                     dark:bg-gray-950 dark:text-white"
    >
      {/* ── Sous-header diagnostic ── */}
      <header
        className="flex items-center justify-between px-4 py-3
                         border-b border-gray-100 dark:border-gray-900"
      >
        {history.length > 0 ? (
          <button
            onClick={() => jumpTo(history.length - 1)}
            aria-label="Étape précédente"
            className="w-9 h-9 flex items-center justify-center rounded-full transition-colors
                       bg-gray-100 hover:bg-gray-200 text-gray-600
                       dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300"
          >
            ←
          </button>
        ) : (
          <div className="w-9" />
        )}

        <div className="flex flex-col items-center gap-0.5">
          <span className="font-bold text-sm text-gray-900 dark:text-white">
            Recherche de panne
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            Diagnostic guidé
          </span>
        </div>

        <div className="w-9" />
      </header>

      {/* ── Content ── */}
      <div className="flex-1 flex flex-col gap-5 px-4 py-6 w-full max-w-3xl mx-auto">
        <ImageMenu
          items={MAIN_MENU_ITEMS}
          delayStartMs={120}
          delayStepMs={90}
        />
        <ProgressBar done={history.length} total={history.length + 3} />
        <button
          onClick={restart}
          className="self-end text-xs transition-colors
                     text-gray-400 hover:text-gray-700
                     dark:text-gray-500 dark:hover:text-white"
        >
          Recommencer
        </button>

        <HistoryList history={history} onJump={jumpTo} />

        {node.type === "question" ? (
          <QuestionCard node={node} onAnswer={answer} />
        ) : (
          <ResultCard node={node} />
        )}

        {/* ── Footer (result only) ── */}
        {isResult && (
          <div className="flex flex-col items-center gap-4 mt-2">
            <p className="text-sm text-gray-400 dark:text-gray-600">
              Diagnostic en {history.length} étape
              {history.length > 1 ? "s" : ""}
            </p>
            <button
              onClick={restart}
              className="w-full rounded-xl font-semibold py-3.5 active:scale-95 transition-all
                         bg-gray-200 hover:bg-gray-300 text-gray-800
                         dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
            >
              Nouveau diagnostic
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
