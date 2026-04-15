"use client";

import { useState, useMemo } from "react";
import { ImageMenu } from "../components/image-menu";
import { MAIN_MENU_ITEMS } from "../components/main-menu-items";
import { calculerSection } from "./engine";
import type { ModePose, TypeCircuit, TypeReseau } from "./types";
import styles from "./page.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

type FormState = {
  puissanceW: string;
  tensionV: string;
  longueurCableM: string;
  temperatureC: string;
  reseau: TypeReseau;
  circuit: TypeCircuit;
  modePose: ModePose;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getChuteStatut(pct: number, circuit: TypeCircuit) {
  const limite = circuit === "eclairage" ? 3 : 5;
  if (pct <= limite * 0.8) return "ok";
  if (pct <= limite) return "limite";
  return "ko";
}

function getVerdict(conforme: boolean, chutePct: number, circuit: TypeCircuit) {
  const chuteStatut = getChuteStatut(chutePct, circuit);
  if (!conforme) return "ko";
  if (chuteStatut === "limite") return "limite";
  return "ok";
}

function getConclusionTexte(verdict: "ok" | "limite" | "ko"): string {
  if (verdict === "ok")
    return "Installation correcte. Section adaptée et chute de tension acceptable selon le RGIE.";
  if (verdict === "limite")
    return "Chute de tension proche de la limite. Envisager d'augmenter la section ou de réduire la longueur.";
  return "Section insuffisante ou chute de tension trop élevée. Revoir le dimensionnement avant mise en œuvre.";
}

function getTensionParDefaut(reseau: TypeReseau) {
  return reseau === "monophase" ? "230" : "400";
}

function isCoherent(reseau: TypeReseau, tensionV: string) {
  const t = Number(tensionV);
  if (reseau === "monophase") return t >= 200 && t <= 260;
  // Triphasé BE : 3×230 V (tension simple) ou 3×400 V (tension composée)
  return (t >= 200 && t <= 260) || (t >= 360 && t <= 440);
}

// ─── Composant NumberField ────────────────────────────────────────────────────

type NumberFieldProps = {
  label: string;
  value: string;
  step: number;
  min: number;
  onChange: (next: string) => void;
};

function NumberField({ label, value, step, min, onChange }: NumberFieldProps) {
  function adjust(delta: number) {
    const current = Number(value);
    const base = Number.isFinite(current) ? current : min;
    const next = Math.max(min, base + delta);
    const decimals = Number.isInteger(step) ? 0 : 2;
    onChange(next.toFixed(decimals));
  }

  return (
    <label className={styles.fieldLabel}>
      {label}
      <div className={styles.fieldRow}>
        <button
          type="button"
          onClick={() => adjust(-step)}
          className={styles.stepBtn}
          aria-label={`Diminuer ${label}`}
        >
          −
        </button>
        <input
          type="number"
          min={min}
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={styles.fieldInput}
        />
        <button
          type="button"
          onClick={() => adjust(step)}
          className={styles.stepBtn}
          aria-label={`Augmenter ${label}`}
        >
          +
        </button>
      </div>
    </label>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SectionPage() {
  const [form, setForm] = useState<FormState>({
    puissanceW: "3500",
    tensionV: "230",
    longueurCableM: "25",
    temperatureC: "30",
    reseau: "monophase",
    circuit: "prises",
    modePose: "B1",
  });

  function handleReseauChange(next: TypeReseau) {
    setForm((prev) => ({
      ...prev,
      reseau: next,
      tensionV: getTensionParDefaut(next),
    }));
  }

  const resultat = useMemo(() => {
    const puissanceW = Number(form.puissanceW);
    const tensionV = Number(form.tensionV);
    const longueurCableM = Number(form.longueurCableM);
    const temperatureC = Number(form.temperatureC);
    if (
      !Number.isFinite(puissanceW) ||
      !Number.isFinite(tensionV) ||
      !Number.isFinite(longueurCableM) ||
      !Number.isFinite(temperatureC) ||
      puissanceW <= 0 ||
      tensionV <= 0 ||
      longueurCableM <= 0
    )
      return null;
    return calculerSection({
      puissanceW,
      tensionV,
      longueurCableM,
      temperatureC,
      reseau: form.reseau,
      circuit: form.circuit,
      modePose: form.modePose,
    });
  }, [form]);

  const incoherent = !isCoherent(form.reseau, form.tensionV);

  const verdict = resultat
    ? getVerdict(resultat.conforme, resultat.chuteTensionPourcent, form.circuit)
    : null;

  const chuteStatut = resultat
    ? getChuteStatut(resultat.chuteTensionPourcent, form.circuit)
    : null;

  const MODE_POSE_LABELS: Record<ModePose, string> = {
    A1: "Encastré en paroi isolante",
    B1: "Conduit en saillie",
    B2: "Conduit encastré",
    C: "Fixé sur paroi",
    E: "À l'air libre",
  };

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.menuWrap}>
            <ImageMenu
              items={MAIN_MENU_ITEMS}
              delayStartMs={120}
              delayStepMs={80}
              orientation="vertical"
            />
          </div>
        </aside>

        <div className={styles.container}>
          <h1 className={styles.title}>Calcul de section de câble</h1>

          {/* ── Formulaire ── */}
          <div className={styles.card}>
            <div className={styles.fieldGrid}>
              <NumberField
                label="Puissance (W)"
                value={form.puissanceW}
                min={1}
                step={100}
                onChange={(v) => setForm((p) => ({ ...p, puissanceW: v }))}
              />

              <label className={styles.fieldLabel}>
                Type réseau
                <select
                  value={form.reseau}
                  onChange={(e) =>
                    handleReseauChange(e.target.value as TypeReseau)
                  }
                  className={styles.fieldSelect}
                >
                  <option value="monophase">Monophasé</option>
                  <option value="triphase">Triphasé</option>
                </select>
              </label>

              <label className={styles.fieldLabel}>
                Tension (V)
                <input
                  type="number"
                  min={1}
                  value={form.tensionV}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, tensionV: e.target.value }))
                  }
                  className={`${styles.fieldInput} ${styles.fieldInputCompact}`}
                />
              </label>

              <NumberField
                label="Longueur câble (m)"
                value={form.longueurCableM}
                min={1}
                step={1}
                onChange={(v) => setForm((p) => ({ ...p, longueurCableM: v }))}
              />

              <NumberField
                label="Température (°C)"
                value={form.temperatureC}
                min={-20}
                step={1}
                onChange={(v) => setForm((p) => ({ ...p, temperatureC: v }))}
              />

              <label className={styles.fieldLabel}>
                Type circuit
                <select
                  value={form.circuit}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      circuit: e.target.value as TypeCircuit,
                    }))
                  }
                  className={styles.fieldSelect}
                >
                  <option value="eclairage">Éclairage</option>
                  <option value="prises">Prises</option>
                  <option value="mixte">Mixte</option>
                  <option value="specifique">Spécifique</option>
                </select>
              </label>

              <label className={styles.fieldLabel}>
                Mode de pose
                <select
                  value={form.modePose}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      modePose: e.target.value as ModePose,
                    }))
                  }
                  className={styles.fieldSelect}
                >
                  <option value="A1">A1 — Paroi isolante</option>
                  <option value="B1">B1 — Conduit saillie</option>
                  <option value="B2">B2 — Conduit encastré</option>
                  <option value="C">C — Sur paroi</option>
                  <option value="E">E — Air libre</option>
                </select>
                <span className={styles.poseNote}>
                  {MODE_POSE_LABELS[form.modePose]} · pris en compte dans le
                  calcul thermique
                </span>
              </label>
            </div>

            {/* Warning incohérence tension/réseau */}
            {incoherent && (
              <div className={`${styles.warning} ${styles.warningSpaced}`}>
                ⚠️ Tension inhabituelle pour un réseau{" "}
                {form.reseau === "monophase"
                  ? "monophasé (230 V)"
                  : "triphasé (400 V)"}
                . Vérifier la valeur.
              </div>
            )}
          </div>

          {/* ── Résultats ── */}
          {resultat && verdict && chuteStatut && (
            <div className={styles.resultat}>
              {/* 1. Verdict principal */}
              <div
                className={`${styles.verdict} ${styles[`verdict--${verdict}`]}`}
              >
                <span className={styles.verdictIcon}>
                  {verdict === "ok" ? "✅" : verdict === "limite" ? "⚠️" : "❌"}
                </span>
                <div>
                  <div className={styles.verdictLabel}>
                    {verdict === "ok"
                      ? "Conforme RGIE"
                      : verdict === "limite"
                        ? "Conforme — Limite"
                        : "Non conforme"}
                  </div>
                  <div className={styles.verdictSub}>
                    Section {resultat.sectionRecommandee} mm² ·{" "}
                    {resultat.intensiteCalculeeA.toFixed(1)} A calculés
                  </div>
                </div>
              </div>

              {/* 2. Métriques */}
              <div className={styles.metricsGrid}>
                <div className={styles.metric}>
                  <div className={styles.metricLabel}>Intensité calculée</div>
                  <div className={styles.metricValue}>
                    {resultat.intensiteCalculeeA.toFixed(2)} A
                  </div>
                </div>

                <div className={`${styles.metric} ${styles.metricSection}`}>
                  <div className={styles.metricLabel}>Section recommandée</div>
                  <div
                    className={`${styles.metricValue} ${styles.metricSectionValue}`}
                  >
                    {resultat.sectionRecommandee} mm²
                  </div>
                  <div className={styles.metricSub}>
                    Capacité : {resultat.capaciteSectionA} A
                  </div>
                </div>

                <div className={styles.metric}>
                  <div className={styles.metricLabel}>Chute de tension</div>
                  <div
                    className={`${styles.metricValue} ${styles[`chute--${chuteStatut}`]}`}
                  >
                    {resultat.chuteTensionPourcent.toFixed(2)}%
                  </div>
                  <div className={styles.metricSub}>
                    {resultat.chuteTensionV.toFixed(2)} V ·{" "}
                    {chuteStatut === "ok"
                      ? "✓ OK"
                      : chuteStatut === "limite"
                        ? "⚠ Limite"
                        : "✕ Trop élevée"}
                  </div>
                </div>

                <div className={styles.metric}>
                  <div className={styles.metricLabel}>Capacité section</div>
                  <div className={styles.metricValue}>
                    {resultat.capaciteSectionA} A
                  </div>
                  <div className={styles.metricSub}>
                    Réserve :{" "}
                    {(
                      resultat.capaciteSectionA - resultat.intensiteCalculeeA
                    ).toFixed(1)}{" "}
                    A
                  </div>
                </div>
              </div>

              {/* 3. Conclusion métier */}
              <div
                className={`${styles.conclusion} ${styles[`conclusion--${verdict}`]}`}
              >
                {getConclusionTexte(verdict)}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
