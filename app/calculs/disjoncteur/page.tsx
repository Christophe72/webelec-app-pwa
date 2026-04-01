"use client";

import { useState } from "react";
import { AppHeader } from "../../app-header";
import { evaluerInstallation } from "./engine";
import type {
  SectionCable,
  TypeCircuit,
  TypeReseau,
} from "./types";

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
  const [resultat, setResultat] = useState<EvaluationInstallation | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  function calculer() {
    const puissanceW = Number(form.puissanceW);
    const tensionV = Number(form.tensionV);
    const longueurCableM = Number(form.longueurCableM);

    if (
      !Number.isFinite(puissanceW) ||
      !Number.isFinite(tensionV) ||
      !Number.isFinite(longueurCableM)
    ) {
      setErreur("Entrer des valeurs numeriques valides.");
      setResultat(null);
      return;
    }

    if (puissanceW <= 0 || tensionV <= 0 || longueurCableM <= 0) {
      setErreur("Puissance, tension et longueur doivent etre superieures a 0.");
      setResultat(null);
      return;
    }

    const input = {
      puissanceW,
      tensionV,
      reseau: form.reseau,
      sectionMm2: form.sectionMm2,
      circuit: form.circuit,
      longueurCableM,
    };

    setErreur(null);
    setResultat(evaluerInstallation(input));
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-white">
      <AppHeader />

      <div className="mx-auto grid w-full max-w-3xl gap-4 px-4 py-8">
        <h1 className="text-2xl font-bold">Choix disjoncteur</h1>

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

          <button
            type="button"
            onClick={calculer}
            className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
          >
            Calculer
          </button>

          {erreur ? <p className="mt-2 text-sm text-red-600">{erreur}</p> : null}
        </section>

        {resultat ? (
          <section className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-2 text-xl font-semibold">Resultat</h2>
            <p>Intensite calculee: {resultat.intensiteCalculeeA.toFixed(2)} A</p>
            <p>Disjoncteur conseille: {resultat.disjoncteurConseilleA} A</p>
            <p>Limite RGIE: {resultat.disjoncteurMaxRgieA} A</p>
            <p>Chute de tension: {resultat.chuteTensionV.toFixed(2)} V</p>
            <p>
              Chute de tension (%): {resultat.chuteTensionPourcent.toFixed(2)}%
            </p>
            <p
              className={
                resultat.conforme ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400 font-semibold"
              }
            >
              Conforme: {resultat.conforme ? "Oui" : "Non"}
            </p>

            {/* <h3 className="mt-3 font-semibold">Messages</h3>
            <ul className="list-disc pl-5">
              {resultat.messages.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul> */}
          </section>
        ) : null}
      </div>
    </main>
  );
}
