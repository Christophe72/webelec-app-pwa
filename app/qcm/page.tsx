"use client";

import { useEffect, useState } from "react";
import { ImageMenu } from "../components/image-menu";
import { MAIN_MENU_ITEMS } from "../components/main-menu-items";
import { QUESTIONS } from "./questions";
import styles from "./page.module.css";

const LETTERS = ["A", "B", "C", "D"];
type QuizMode = "entrainement" | "examen";

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

function getDifficultyLabel(difficulte: "facile" | "moyen" | "difficile") {
  if (difficulte === "facile") return "Facile";
  if (difficulte === "moyen") return "Moyen";
  return "Difficile";
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function formatDuration(totalSeconds: number) {
  const safe = Math.max(0, totalSeconds);
  const m = Math.floor(safe / 60)
    .toString()
    .padStart(2, "0");
  const s = (safe % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function QcmPage() {
  const [mode, setMode] = useState<QuizMode>("entrainement");
  const [seuilReussite, setSeuilReussite] = useState(60);
  const [examMinutes, setExamMinutes] = useState(10);
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(QUESTIONS.length).fill(null),
  );
  const [finished, setFinished] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const question = QUESTIONS[current];
  const selected = answers[current];
  const answered = selected !== null;
  const showImmediateCorrection = mode === "entrainement" && answered;
  const lockChoices = mode === "entrainement" && answered;

  function handleSelect(idx: number) {
    if (lockChoices) return;
    const next = [...answers];
    next[current] = idx;
    setAnswers(next);
  }

  function handleNext() {
    if (!answered) return;

    if (current < QUESTIONS.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      setFinished(true);
    }
  }

  function handleRestart() {
    setStarted(false);
    setCurrent(0);
    setAnswers(Array(QUESTIONS.length).fill(null));
    setFinished(false);
    setElapsedSeconds(0);
    setSecondsLeft(null);
  }

  function handleStart() {
    setStarted(true);
    setCurrent(0);
    setAnswers(Array(QUESTIONS.length).fill(null));
    setFinished(false);
    setElapsedSeconds(0);
    setSecondsLeft(mode === "examen" ? examMinutes * 60 : null);
  }

  const score = answers.filter((a, i) => a === QUESTIONS[i].answer).length;
  const niveau = getScoreNiveau(score, QUESTIONS.length);
  const scorePct = Math.round((score / QUESTIONS.length) * 100);
  const reussi = scorePct >= seuilReussite;
  const statsParDifficulte = {
    facile: QUESTIONS.filter((q) => q.difficulte === "facile").length,
    moyen: QUESTIONS.filter((q) => q.difficulte === "moyen").length,
    difficile: QUESTIONS.filter((q) => q.difficulte === "difficile").length,
  };
  const scoreParDifficulte = {
    facile: QUESTIONS.filter(
      (q, i) => q.difficulte === "facile" && answers[i] === q.answer,
    ).length,
    moyen: QUESTIONS.filter(
      (q, i) => q.difficulte === "moyen" && answers[i] === q.answer,
    ).length,
    difficile: QUESTIONS.filter(
      (q, i) => q.difficulte === "difficile" && answers[i] === q.answer,
    ).length,
  };

  useEffect(() => {
    if (!started || finished) return;

    const interval = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);

      if (mode === "examen") {
        setSecondsLeft((prev) => {
          if (prev === null) return prev;
          if (prev <= 1) {
            window.clearInterval(interval);
            setFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => window.clearInterval(interval);
  }, [finished, mode, started]);

  if (!started) {
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
            <div>
              <h1 className={styles.title}>QCM RGIE</h1>
              <p className={styles.subtitle}>
                Choisissez votre mode puis lancez la session
              </p>
            </div>

            <div className={styles.startCard}>
              <h2 className={styles.startTitle}>Mode de session</h2>

              <div className={styles.modeRow}>
                <button
                  type="button"
                  onClick={() => setMode("entrainement")}
                  className={`${styles.modeBtn} ${mode === "entrainement" ? styles.modeBtnActive : ""}`}
                >
                  Entrainement
                </button>
                <button
                  type="button"
                  onClick={() => setMode("examen")}
                  className={`${styles.modeBtn} ${mode === "examen" ? styles.modeBtnActive : ""}`}
                >
                  Examen
                </button>
              </div>

              <div className={styles.modeDesc}>
                {mode === "entrainement"
                  ? "Correction immédiate avec explication après chaque réponse."
                  : "Aucune correction pendant l'épreuve. Résultats détaillés à la fin."}
              </div>

              <div className={styles.configRow}>
                <label className={styles.configField}>
                  Seuil de réussite (%)
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={seuilReussite}
                    onChange={(e) =>
                      setSeuilReussite(
                        clamp(Number(e.target.value) || 0, 0, 100),
                      )
                    }
                    className={styles.numberInput}
                  />
                </label>

                {mode === "examen" && (
                  <label className={styles.configField}>
                    Durée examen (minutes)
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={examMinutes}
                      onChange={(e) =>
                        setExamMinutes(
                          clamp(Number(e.target.value) || 1, 1, 120),
                        )
                      }
                      className={styles.numberInput}
                    />
                  </label>
                )}
              </div>

              <button
                type="button"
                onClick={handleStart}
                className={styles.startBtn}
              >
                Commencer le QCM
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── Écran résultat ────────────────────────────────────
  if (finished) {
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
            <div>
              <h1 className={styles.title}>QCM RGIE</h1>
              <p className={styles.subtitle}>Résultats</p>
            </div>

            <div className={styles.resultCard}>
              <div
                className={`${styles.resultScore} ${niveau === "excellent" ? styles.resultScoreExcellent : niveau === "bien" ? styles.resultScoreBien : styles.resultScoreFaible}`}
              >
                {score}/{QUESTIONS.length}
              </div>
              <div className={styles.resultPct}>{scorePct}%</div>
              <div
                className={`${styles.resultStatus} ${reussi ? styles.resultStatusSuccess : styles.resultStatusFail}`}
              >
                {reussi
                  ? `Réussi (seuil ${seuilReussite}%)`
                  : `À revoir (seuil ${seuilReussite}%)`}
              </div>
              <div className={styles.resultLabel}>
                {getScoreLabel(score, QUESTIONS.length)}
              </div>
              <div className={styles.resultSub}>
                {score} bonne{score > 1 ? "s" : ""} réponse
                {score > 1 ? "s" : ""} sur {QUESTIONS.length} questions
              </div>
              <div className={styles.modePill}>
                Mode: {mode === "entrainement" ? "Entrainement" : "Examen"}
              </div>
              <div className={styles.resultSub}>
                Temps total: {formatDuration(elapsedSeconds)}
              </div>

              <div className={styles.statsGrid}>
                <div className={styles.statBox}>
                  <span>Facile</span>
                  <strong>
                    {scoreParDifficulte.facile}/{statsParDifficulte.facile}
                  </strong>
                </div>
                <div className={styles.statBox}>
                  <span>Moyen</span>
                  <strong>
                    {scoreParDifficulte.moyen}/{statsParDifficulte.moyen}
                  </strong>
                </div>
                <div className={styles.statBox}>
                  <span>Difficile</span>
                  <strong>
                    {scoreParDifficulte.difficile}/
                    {statsParDifficulte.difficile}
                  </strong>
                </div>
              </div>

              <div className={styles.recapList}>
                {QUESTIONS.map((q, i) => {
                  const ok = answers[i] === q.answer;
                  const userAnswer =
                    answers[i] !== null
                      ? q.choices[answers[i] as number]
                      : "Aucune réponse";
                  return (
                    <div key={q.id} className={styles.recapItem}>
                      <span className={styles.recapIcon}>
                        {ok ? "✅" : "❌"}
                      </span>
                      <span className={styles.recapText}>
                        <strong>Q{i + 1}.</strong> {q.question}
                        <br />
                        <small>
                          Votre réponse: {userAnswer} — Réponse attendue:{" "}
                          {q.choices[q.answer]}
                        </small>
                        <br />
                        <em>Explication: {q.explication}</em>
                      </span>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleRestart}
                className={styles.restartBtn}
              >
                Recommencer le QCM
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── Écran question ────────────────────────────────────
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
          <div>
            <h1 className={styles.title}>QCM RGIE</h1>
            <p className={styles.subtitle}>
              Testez vos connaissances du règlement général
            </p>
          </div>

          {/* Barre de progression */}
          <div className={styles.progressBar}>
            {QUESTIONS.map((_, i) => {
              let cls = styles.progressSeg;
              if (answers[i] !== null) {
                if (mode === "entrainement") {
                  cls =
                    answers[i] === QUESTIONS[i].answer
                      ? styles.progressSegCorrect
                      : styles.progressSegWrong;
                } else {
                  cls = styles.progressSegAnswered;
                }
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
              <span
                className={`${styles.qDifficulty} ${question.difficulte === "facile" ? styles.qDifficultyEasy : question.difficulte === "moyen" ? styles.qDifficultyMedium : styles.qDifficultyHard}`}
              >
                {getDifficultyLabel(question.difficulte)}
              </span>
              {mode === "examen" && secondsLeft !== null && (
                <span className={styles.timerPill}>
                  {formatDuration(secondsLeft)}
                </span>
              )}
              <span className={styles.qCounter}>
                {current + 1} / {QUESTIONS.length}
              </span>
            </div>

            <p className={styles.question}>{question.question}</p>

            <div className={styles.choices}>
              {question.choices.map((choice, idx) => {
                let mod = "";
                if (showImmediateCorrection) {
                  if (idx === question.answer) mod = styles.choiceBtnCorrect;
                  else if (idx === selected) mod = styles.choiceBtnWrong;
                } else if (mode === "examen" && idx === selected) {
                  mod = styles.choiceBtnSelected;
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={lockChoices}
                    onClick={() => handleSelect(idx)}
                    className={`${styles.choiceBtn} ${mod}`}
                  >
                    <span className={styles.choiceLetter}>{LETTERS[idx]}</span>
                    {showImmediateCorrection && (
                      <span className={styles.choiceIcon}>
                        {idx === question.answer
                          ? "✓"
                          : idx === selected
                            ? "✕"
                            : ""}
                      </span>
                    )}
                    <span>{choice}</span>
                    {mode === "examen" && idx === selected && (
                      <span className={styles.choiceSelectedTag}>
                        Votre choix
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {showImmediateCorrection && (
              <div className={styles.explication}>{question.explication}</div>
            )}

            <button
              type="button"
              onClick={handleNext}
              disabled={!answered}
              className={styles.nextBtn}
            >
              {current < QUESTIONS.length - 1
                ? "Question suivante"
                : "Terminer"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
