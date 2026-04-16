import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "../../hooks/useWindowSize";

const COLUMNS = [
  {
    id: "A",
    color: "#e91e8c",
    cells: ["Parking", "Automobil", "Graza", "Podzemna"],
    answer: "garaza",
    displayAnswer: "GARAZA",
  },
  {
    id: "B",
    color: "#3b82f6",
    cells: ["Plata", "Osiguranje", "Ivana", "Posao"],
    answer: "ddor",
    displayAnswer: "DDOR",
  },
  {
    id: "C",
    color: "#f59e0b",
    cells: ["Decko", "Zaljubicu se sutra", "Backa Topola", "Telefon"],
    answer: "stefan",
    displayAnswer: "STEFAN",
  },
  {
    id: "D",
    color: "#10b981",
    cells: ["Torba", "2500e", "Moda", "Slicno kao DDOR"],
    answer: "dior",
    displayAnswer: "DIOR",
  },
];

const FINAL_ANSWER = "nina";

export default function Level4_Asocijacije({ onNext }) {
  const [revealed, setRevealed] = useState(() =>
    Object.fromEntries(COLUMNS.map((c) => [c.id, [false, false, false, false]]))
  );
  const [inputs, setInputs] = useState(() =>
    Object.fromEntries(COLUMNS.map((c) => [c.id, ""]))
  );
  const [solved, setSolved] = useState(() =>
    Object.fromEntries(COLUMNS.map((c) => [c.id, false]))
  );
  const [wrong, setWrong] = useState(() =>
    Object.fromEntries(COLUMNS.map((c) => [c.id, false]))
  );
  const [finalInput, setFinalInput] = useState("");
  const [finalSolved, setFinalSolved] = useState(false);
  const [finalWrong, setFinalWrong] = useState(false);
  const [celebration, setCelebration] = useState(false);
  const { width, height } = useWindowSize();
  const wrongTimers = useRef({});

  const allColsSolved = COLUMNS.every((c) => solved[c.id]);

  const gridCols = width < 640 ? 1 : width < 1024 ? 2 : 4;
  const gridMaxW = gridCols === 4 ? "min(700px, 98vw)" : gridCols === 2 ? "min(500px, 98vw)" : "min(340px, 98vw)";

  const flipCell = (colId, idx) => {
    if (solved[colId]) return;
    setRevealed((prev) => ({
      ...prev,
      [colId]: prev[colId].map((v, i) => (i === idx ? true : v)),
    }));
  };

  const checkColumn = (col) => {
    if (solved[col.id]) return;
    const val = inputs[col.id].trim().toLowerCase();
    if (val === col.answer) {
      setSolved((prev) => ({ ...prev, [col.id]: true }));
      // Reveal all cells
      setRevealed((prev) => ({
        ...prev,
        [col.id]: [true, true, true, true],
      }));
    } else {
      setWrong((prev) => ({ ...prev, [col.id]: true }));
      clearTimeout(wrongTimers.current[col.id]);
      wrongTimers.current[col.id] = setTimeout(
        () => setWrong((prev) => ({ ...prev, [col.id]: false })),
        800
      );
    }
  };

  const checkFinal = () => {
    if (finalInput.trim().toLowerCase() === FINAL_ANSWER) {
      setFinalSolved(true);
      setTimeout(() => setCelebration(true), 300);
    } else {
      setFinalWrong(true);
      setTimeout(() => setFinalWrong(false), 800);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center level-transition"
      style={{ padding: "60px 10px 20px" }}>

      {celebration && (
        <Confetti width={width} height={height} recycle={false} numberOfPieces={400}
          colors={["#ffd700", "#e91e8c", "#a855f7", "#fff", "#10b981"]} />
      )}

      <motion.p className="font-body text-pink-300 text-sm uppercase tracking-widest font-semibold mb-1"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        ✨ Nivo 4 ✨
      </motion.p>
      <motion.h2 className="font-display text-2xl md:text-3xl font-bold text-gradient mb-1 text-center"
        initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        Asocijacije 🔗
      </motion.h2>
      <motion.p className="font-body text-purple-300 text-sm mb-5 text-center"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        Tapni polje da ga otkriješ, pa pogodi vezu!
      </motion.p>

      {/* Responsive grid: 4col desktop, 2col tablet, 1col mobile */}
      <div className="grid gap-2 w-full" style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)`, maxWidth: gridMaxW }}>
        {COLUMNS.map((col) => (
          <div key={col.id} className="flex flex-col gap-2">
            {/* Column header */}
            <motion.div
              className="rounded-xl flex items-center justify-center font-display font-black text-lg"
              style={{
                height: 38,
                background: solved[col.id] ? col.color : `${col.color}33`,
                border: `2px solid ${col.color}66`,
                color: solved[col.id] ? "white" : col.color,
                transition: "background 0.4s",
              }}
              animate={solved[col.id] ? { scale: [1, 1.08, 1] } : {}}
              transition={{ duration: 0.4 }}
            >
              {col.id}
            </motion.div>

            {/* Cells */}
            {col.cells.map((cell, idx) => {
              const isRevealed = revealed[col.id][idx];
              return (
                <motion.button
                  key={idx}
                  onClick={() => flipCell(col.id, idx)}
                  className="rounded-xl flex items-center justify-center text-center font-body font-semibold"
                  style={{
                    height: "clamp(52px, 10vw, 72px)",
                    fontSize: "clamp(0.65rem, 2vw, 0.85rem)",
                    padding: "4px 6px",
                    background: isRevealed
                      ? solved[col.id]
                        ? `${col.color}33`
                        : `${col.color}22`
                      : "rgba(255,255,255,0.06)",
                    border: isRevealed
                      ? `2px solid ${col.color}66`
                      : "2px solid rgba(255,255,255,0.1)",
                    color: isRevealed ? "white" : "rgba(255,255,255,0.4)",
                    cursor: solved[col.id] ? "default" : isRevealed ? "default" : "pointer",
                    transition: "all 0.3s",
                  }}
                  whileTap={!isRevealed && !solved[col.id] ? { scale: 0.92 } : {}}
                >
                  {isRevealed ? cell : "?"}
                </motion.button>
              );
            })}

            {/* Column answer */}
            <AnimatePresence mode="wait">
              {solved[col.id] ? (
                <motion.div
                  key="solved"
                  className="rounded-xl flex items-center justify-center font-display font-bold"
                  style={{
                    height: 44,
                    background: col.color,
                    color: "white",
                    fontSize: "clamp(0.75rem, 2.5vw, 1rem)",
                  }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                >
                  ✓ {col.displayAnswer}
                </motion.div>
              ) : (
                <motion.div key="input" className="flex gap-1">
                  <input
                    className="flex-1 rounded-xl font-body text-center text-white outline-none"
                    style={{
                      height: 44,
                      fontSize: "clamp(0.7rem, 2vw, 0.9rem)",
                      background: wrong[col.id] ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.07)",
                      border: wrong[col.id]
                        ? "2px solid #ef4444"
                        : `2px solid ${col.color}44`,
                      padding: "0 6px",
                      transition: "background 0.2s, border 0.2s",
                      caretColor: col.color,
                    }}
                    placeholder="Veza?"
                    value={inputs[col.id]}
                    onChange={(e) => setInputs((prev) => ({ ...prev, [col.id]: e.target.value }))}
                    onKeyDown={(e) => e.key === "Enter" && checkColumn(col)}
                  />
                  <motion.button
                    className="rounded-xl font-body font-bold flex items-center justify-center"
                    style={{
                      width: 40,
                      height: 44,
                      background: `${col.color}33`,
                      border: `2px solid ${col.color}66`,
                      color: col.color,
                      fontSize: "1rem",
                      flexShrink: 0,
                    }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => checkColumn(col)}
                  >
                    →
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Final answer */}
      <AnimatePresence>
        {allColsSolved && !finalSolved && (
          <motion.div
            className="mt-6 flex flex-col items-center gap-3 w-full"
            style={{ maxWidth: "min(400px, 90vw)" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.4 }}
          >
            <p className="font-body text-yellow-300 font-bold text-sm uppercase tracking-widest">
              🌟 Šta sve ovo povezuje?
            </p>
            <div className="flex gap-2 w-full">
              <input
                className="flex-1 rounded-2xl font-display font-bold text-center text-white outline-none"
                style={{
                  height: 52,
                  fontSize: "1.1rem",
                  background: finalWrong ? "rgba(239,68,68,0.2)" : "rgba(255,215,0,0.1)",
                  border: finalWrong ? "2px solid #ef4444" : "2px solid rgba(255,215,0,0.4)",
                  caretColor: "#ffd700",
                  transition: "all 0.2s",
                }}
                placeholder="Konačno rešenje..."
                value={finalInput}
                onChange={(e) => setFinalInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && checkFinal()}
                autoFocus
              />
              <motion.button
                className="btn-primary font-body px-5"
                style={{ height: 52, borderRadius: 16 }}
                whileTap={{ scale: 0.95 }}
                onClick={checkFinal}
              >
                ✓
              </motion.button>
            </div>
          </motion.div>
        )}

        {finalSolved && (
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
          >
            <div
              className="font-display font-black mb-3 px-8 py-4 rounded-2xl"
              style={{
                fontSize: "clamp(2rem, 8vw, 3.5rem)",
                background: "linear-gradient(135deg, #ffd700, #e91e8c)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                border: "2px solid rgba(255,215,0,0.4)",
              }}
            >
              NINA 🎉
            </div>
            <p className="font-body text-purple-200 mb-6">Sve veze vode do tebe! 💕</p>
            <button className="btn-primary font-body" onClick={onNext}>
              Sledeći Nivo →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
