"use client";

import { useState, useMemo } from "react";
import { ImageMenu } from "../../components/image-menu";
import { MAIN_MENU_ITEMS } from "../../components/main-menu-items";
import { evaluerInstallation } from "./engine";
import type { SectionCable, TypeCircuit, TypeReseau } from "./types";
type EvaluationInstallation = ReturnType<typeof evaluerInstallation>;

type FormState = {
  puissanceW: string;
  tensionV: string;
  longueurCableM: string;
  reseau: TypeReseau;
  sectionMm2: SectionCable;
  circuit: TypeCircuit;
};

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
    <label className="grid gap-1 text-sm">
      {label}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => adjust(-step)}
          className="h-9 w-9 rounded-md border border-gray-300 bg-white text-base font-semibold
                     hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
          aria-label={`Diminuer ${label}`}
        >
          -
        </button>

        <input
          type="number"
          min={min}
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-2 py-1
                     [appearance:textfield] [-moz-appearance:textfield]
                     [&::-webkit-inner-spin-button]:appearance-none
                     [&::-webkit-outer-spin-button]:appearance-none
                     dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />

        <button
          type="button"
          onClick={() => adjust(step)}
          className="h-9 w-9 rounded-md border border-gray-300 bg-white text-base font-semibold
                     hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
          aria-label={`Augmenter ${label}`}
        >
          +
        </button>
      </div>
    </label>
  );
}

export default function DisjoncteurPage() {
  const [form, setForm] = useState<FormState>({
    puissanceW: "3500",
    tensionV: "230",
    longueurCableM: "25",
    reseau: "monophase",
    sectionMm2: 2.5,
    circuit: "prises",
  });
  const resultat = useMemo<EvaluationInstallation | null>(() => {
    const puissanceW = Number(form.puissanceW);
    const tensionV = Number(form.tensionV);
    const longueurCableM = Number(form.longueurCableM);
    if (
      !Number.isFinite(puissanceW) ||
      !Number.isFinite(tensionV) ||
      !Number.isFinite(longueurCableM) ||
      puissanceW <= 0 ||
      tensionV <= 0 ||
      longueurCableM <= 0
    )
      return null;
    return evaluerInstallation({
      puissanceW,
      tensionV,
      reseau: form.reseau,
      sectionMm2: form.sectionMm2,
      circuit: form.circuit,
      longueurCableM: Number(form.longueurCableM),
    });
  }, [form]);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-white">
      <div className="mx-auto grid w-full max-w-3xl gap-4 px-4 py-8">
        <h1 className="text-2xl font-bold">Choix disjoncteur</h1>

        <ImageMenu
          items={MAIN_MENU_ITEMS}
          delayStartMs={120}
          delayStepMs={80}
        />

        <section className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
            <NumberField
              label="Puissance (W)"
              value={form.puissanceW}
              min={1}
              step={100}
              onChange={(next) =>
                setForm((prev) => ({ ...prev, puissanceW: next }))
              }
            />

            <NumberField
              label="Tension (V)"
              value={form.tensionV}
              min={1}
              step={10}
              onChange={(next) =>
                setForm((prev) => ({ ...prev, tensionV: next }))
              }
            />

            <NumberField
              label="Longueur cable (m)"
              value={form.longueurCableM}
              min={1}
              step={1}
              onChange={(next) =>
                setForm((prev) => ({ ...prev, longueurCableM: next }))
              }
            />

            <label className="grid gap-1 text-sm">
              Type reseau
              <select
                value={form.reseau}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    reseau: e.target.value as TypeReseau,
                  }))
                }
                className="w-full rounded-md border border-gray-300 px-2 py-1
                         dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="monophase">Monophase</option>
                <option value="triphase">Triphase</option>
              </select>
            </label>

            <label className="grid gap-1 text-sm">
              Section cable (mm²)
              <select
                value={String(form.sectionMm2)}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    sectionMm2: Number(e.target.value) as SectionCable,
                  }))
                }
                className="w-full rounded-md border border-gray-300 px-2 py-1
                         dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="0.75">0.75</option>
                <option value="1.5">1.5</option>
                <option value="2.5">2.5</option>
                <option value="4">4</option>
                <option value="6">6</option>
                <option value="10">10</option>
                <option value="16">16</option>
                <option value="25">25</option>
                <option value="35">35</option>
                <option value="50">50</option>
                <option value="70">70</option>
              </select>
            </label>

            <label className="grid gap-1 text-sm">
              Type circuit
              <select
                value={form.circuit}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    circuit: e.target.value as TypeCircuit,
                  }))
                }
                className="w-full rounded-md border border-gray-300 px-2 py-1
                         dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="eclairage">Eclairage</option>
                <option value="prises">Prises</option>
                <option value="mixte">Mixte</option>
                <option value="specifique">Specifique</option>
              </select>
            </label>
          </div>
        </section>

        {resultat ? (
          <section className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-3 text-xl font-semibold">Résultat</h2>

            {/* Disjoncteur conseillé — mis en avant */}
            <div className="mb-4 rounded-xl border-2 border-blue-500 bg-blue-50 px-5 py-4 dark:bg-blue-950 dark:border-blue-400">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-1">
                Disjoncteur conseillé
              </p>
              <p className="text-4xl font-extrabold text-blue-700 dark:text-blue-300 leading-none">
                {resultat.disjoncteurConseilleA} A
              </p>
              <p className="mt-1 text-xs text-blue-500 dark:text-blue-400">
                Limite RGIE : {resultat.disjoncteurMaxRgieA} A
              </p>
            </div>

            {/* Autres métriques */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3">
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
                  Intensité calculée
                </p>
                <p className="text-lg font-bold">
                  {resultat.intensiteCalculeeA.toFixed(2)} A
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 dark:bg-gray-800 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
                  Chute de tension
                </p>
                <p className="text-lg font-bold">
                  {resultat.chuteTensionV.toFixed(2)} V
                </p>
                <p className="text-xs text-gray-500">
                  {resultat.chuteTensionPourcent.toFixed(2)} %
                </p>
              </div>

              <div
                className={`rounded-lg px-4 py-3 ${resultat.conforme ? "bg-green-50 dark:bg-green-950" : "bg-red-50 dark:bg-red-950"}`}
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
                  Conformité RGIE
                </p>
                <p
                  className={`text-lg font-bold ${resultat.conforme ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}
                >
                  {resultat.conforme ? "✓ Conforme" : "✕ Non conforme"}
                </p>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
