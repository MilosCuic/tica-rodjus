import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SIZE = 3;
const TILES = SIZE * SIZE;

function createSolved() {
  return Array.from({ length: TILES }, (_, i) => i);
}

function shuffle(arr) {
  const a = [...arr];
  // Perform random valid moves to ensure solvability
  let blank = a.indexOf(0);
  for (let i = 0; i < 200; i++) {
    const neighbors = getNeighbors(blank);
    const next = neighbors[Math.floor(Math.random() * neighbors.length)];
    [a[blank], a[next]] = [a[next], a[blank]];
    blank = next;
  }
  return a;
}

function getNeighbors(i) {
  const neighbors = [];
  const row = Math.floor(i / SIZE);
  const col = i % SIZE;
  if (row > 0) neighbors.push(i - SIZE);
  if (row < SIZE - 1) neighbors.push(i + SIZE);
  if (col > 0) neighbors.push(i - 1);
  if (col < SIZE - 1) neighbors.push(i + 1);
  return neighbors;
}

const EMOJIS = ["🎂", "🎉", "💕", "🌸", "✨", "🦋", "🎊", "👑"];

export default function Level8_Puzzle({ onNext }) {
  const [tiles, setTiles] = useState(() => shuffle(createSolved()));
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const solved = createSolved();
  const isSolved = (t) => t.every((v, i) => v === solved[i]);

  const move = useCallback((i) => {
    const blank = tiles.indexOf(0);
    if (!getNeighbors(blank).includes(i)) return;
    const next = [...tiles];
    [next[blank], next[i]] = [next[i], next[blank]];
    setTiles(next);
    setMoves((m) => m + 1);
    if (isSolved(next)) setWon(true);
  }, [tiles]);

  const reset = () => {
    setTiles(shuffle(createSolved()));
    setMoves(0);
    setWon(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-24 level-transition">
      <motion.h2
        className="font-display text-4xl font-bold text-gradient mb-2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Puzzle 🧩
      </motion.h2>
      <p className="font-body text-purple-300 mb-1 text-center">
        Složi pločice u red od 1 do 8!
      </p>
      <p className="font-body text-purple-400 text-sm mb-2 text-center">
        Klikni pločicu koja je <span className="text-yellow-300 font-semibold">pored praznog mesta</span> da je pomeriš tamo.
      </p>
      <p className="font-body text-yellow-300 font-semibold mb-8">Potezi: {moves}</p>

      <AnimatePresence mode="wait">
        {!won ? (
          <motion.div
            key="board"
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {tiles.map((val, i) => (
              <motion.button
                key={val}
                onClick={() => move(i)}
                className="rounded-2xl flex items-center justify-center font-display font-black select-none"
                style={{
                  width: 90,
                  height: 90,
                  fontSize: val === 0 ? "0" : "2.8rem",
                  background: val === 0
                    ? "rgba(255,255,255,0.03)"
                    : `linear-gradient(135deg, ${["#e91e8c","#a855f7","#3b82f6","#10b981","#f59e0b","#ef4444","#8b5cf6","#06b6d4"][val % 8]}66, ${["#e91e8c","#a855f7","#3b82f6","#10b981","#f59e0b","#ef4444","#8b5cf6","#06b6d4"][val % 8]}22)`,
                  border: val === 0
                    ? "2px dashed rgba(255,255,255,0.08)"
                    : "2px solid rgba(255,255,255,0.15)",
                  cursor: val === 0 ? "default" : "pointer",
                }}
                whileHover={val !== 0 ? { scale: 1.06 } : {}}
                whileTap={val !== 0 ? { scale: 0.93 } : {}}
                layout
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                {val !== 0 ? EMOJIS[val - 1] : ""}
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="won"
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", bounce: 0.4 }}
          >
            <div className="text-8xl mb-4">🧩</div>
            <h3 className="font-display text-3xl font-bold text-gradient mb-3">Rešeno!</h3>
            <p className="font-body text-purple-200 mb-6">Za {moves} poteza. Majstor si!</p>
            <div className="flex gap-4 justify-center">
              <button
                className="font-body px-6 py-3 rounded-full border border-pink-500/40 text-pink-300 hover:bg-pink-500/10 transition-all"
                onClick={reset}
              >
                Ponovi 🔄
              </button>
              <button className="btn-primary font-body" onClick={onNext}>
                Sledeći →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!won && (
        <button
          className="mt-6 font-body text-sm text-purple-400 hover:text-purple-200 transition-colors"
          onClick={reset}
        >
          Resetuj 🔄
        </button>
      )}
    </div>
  );
}
