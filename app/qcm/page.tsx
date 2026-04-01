"use client";

import { useState } from "react";
import { AppHeader } from "../app-header";
import { QUESTIONS } from "./questions";
import styles from "./page.module.css";

const LETTERS = ["A", "B", "C", "D"];

function getScoreNiveau(correct: number, total: number) {
  const pct = correct / total;
  if (pct >= 0.8) return "excellent";
  if (pct >= 0.5) return "bien";
  return "faible";
}

function getScoreLabel(correct: number, total: number) {
  const pct = correct / total;
  if (pct >= 0.8) return "Excellent — Maîtrise solide du RGIE";
  if (pct >= 0.5) return "Bien — Quelques points à revoir";
  return "À retravailler — Reprendre les bases RGIE";
}

export default function QcmPage() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUESTIONS.length).fill(null));
  const [finished, setFinished] = useState(false);

  const question = QUESTIONS[current];
  const answered = selected !== null;
  const isCorrect = selected === question.answer;

  function handleSelect(idx: number) {
    if (answered) return;
    setSelected(idx);
    const next = [...answers];
    next[current] = idx;
    setAnswers(next);
  }

  function handleNext() {
    if (current < QUESTIONS.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(answers[current + 1]);
    } else {
      setFinished(true);
    }
  }

  function handleRestart() {
    setCurrent(0);
    setSelected(null);
    setAnswers(Array(QUESTIONS.length).fill(null));
    setFinished(false);
  }

  const score = answers.filter((a, i) => a === QUESTIONS[i].answer).length;
  const niveau = getScoreNiveau(score, QUESTIONS.length);

  // ── Écran résultat ────────────────────────────────────
  if (finished) {
    return (
      <main className={styles.page}>
        <AppHeader />
        <div className={styles.container}>
          <div>
            <h1 className={styles.title}>QCM RGIE</h1>
            <p className={styles.subtitle}>Résultats</p>
          </div>

          <div className={styles.resultCard}>
            <div className={`${styles.resultScore} ${niveau === "excellent" ? styles.resultScoreExcellent : niveau === "bien" ? styles.resultScoreBien : styles.resultScoreFaible}`}>
              {score}/{QUESTIONS.length}
            </div>
            <div className={styles.resultLabel}>{getScoreLabel(score, QUESTIONS.length)}</div>
            <div className={styles.resultSub}>
              {score} bonne{score > 1 ? "s" : ""} réponse{score > 1 ? "s" : ""} sur {QUESTIONS.length} questions
            </div>

            <div className={styles.recapList}>
              {QUESTIONS.map((q, i) => {
                const ok = answers[i] === q.answer;
                return (
                  <div key={q.id} className={styles.recapItem}>
                    <span className={styles.recapIcon}>{ok ? "✅" : "❌"}</span>
                    <span className={styles.recapText}>
                      <strong>Q{i + 1}.</strong> {q.question.length > 70 ? q.question.slice(0, 70) + "…" : q.question}
                      {!ok && (
                        <> — <em>Réponse : {q.choices[q.answer]}</em></>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>

            <button type="button" onClick={handleRestart} className={styles.restartBtn}>
              Recommencer le QCM
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ── Écran question ────────────────────────────────────
  return (
    <main className={styles.page}>
      <AppHeader />
      <div className={styles.container}>
        <div>
          <h1 className={styles.title}>QCM RGIE</h1>
          <p className={styles.subtitle}>Testez vos connaissances du règlement général</p>
        </div>

        {/* Barre de progression */}
        <div className={styles.progressBar}>
          {QUESTIONS.map((_, i) => {
            let cls = styles.progressSeg;
            if (answers[i] !== null) {
              cls = answers[i] === QUESTIONS[i].answer ? styles.progressSegCorrect : styles.progressSegWrong;
            } else if (i === current) {
              cls = styles.progressSegActive;
            }
            return <div key={i} className={cls} />;
          })}
        </div>

        {/* Carte question — key force le re-render + animation au changement */}
        <div className={styles.card} key={current}>
          <div className={styles.qMeta}>
            <span className={styles.qCategorie}>{question.categorie}</span>
            <span className={styles.qCounter}>{current + 1} / {QUESTIONS.length}</span>
          </div>

          <p className={styles.question}>{question.question}</p>

          <div className={styles.choices}>
            {question.choices.map((choice, idx) => {
              let mod = "";
              if (answered) {
                if (idx === question.answer) mod = styles.choiceBtnCorrect;
                else if (idx === selected)   mod = styles.choiceBtnWrong;
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={answered}
                  onClick={() => handleSelect(idx)}
                  className={`${styles.choiceBtn} ${mod}`}
                >
                  <span className={styles.choiceLetter}>{LETTERS[idx]}</span>
                  {answered && (
                    <span className={styles.choiceIcon}>
                      {idx === question.answer ? "✓" : idx === selected ? "✕" : ""}
                    </span>
                  )}
                  {choice}
                </button>
              );
            })}
          </div>

          {answered && (
            <>
              <div className={styles.explication}>
                <strong>{isCorrect ? "✅ Correct — " : "❌ Incorrect — "}</strong>
                {question.explication}
              </div>
              <button type="button" onClick={handleNext} className={styles.nextBtn}>
                {current < QUESTIONS.length - 1 ? "Question suivante →" : "Voir les résultats"}
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
