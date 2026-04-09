import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import m1 from "../../assets/photos/memory1.jpeg";
import m2 from "../../assets/photos/memory2.jpeg";
import m3 from "../../assets/photos/memory3.jpeg";
import m4 from "../../assets/photos/memory4.jpeg";
import m5 from "../../assets/photos/memory5.jpeg";
import m6 from "../../assets/photos/memory6.jpeg";
import m7 from "../../assets/photos/memory7.jpeg";
import m8 from "../../assets/photos/memory8.jpeg";

const IMAGES = [m1, m2, m3, m4, m5, m6, m7, m8];
const FALLBACK_EMOJIS = ["🎂", "🎉", "💕", "🌸", "✨", "🦋", "🎊", "👑"];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildCards() {
  const pairs = IMAGES.map((src, i) => ({ src, emoji: FALLBACK_EMOJIS[i], pairId: i }));
  return shuffle([...pairs, ...pairs].map((p, i) => ({
    id: i,
    src: p.src,
    emoji: p.emoji,
    pairId: p.pairId,
    flipped: false,
    matched: false,
  })));
}

export default function Level3_Memory({ onNext }) {
  const [cards, setCards] = useState(buildCards);
  const [selected, setSelected] = useState([]);
  const [won, setWon] = useState(false);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (selected.length === 2) {
      setLocked(true);
      const [a, b] = selected;
      if (cards[a].pairId === cards[b].pairId) {
        setCards((prev) =>
          prev.map((c, i) => (i === a || i === b ? { ...c, matched: true } : c))
        );
        setSelected([]);
        setLocked(false);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) => (i === a || i === b ? { ...c, flipped: false } : c))
          );
          setSelected([]);
          setLocked(false);
        }, 900);
      }
    }
  }, [selected]);

  useEffect(() => {
    if (cards.length > 0 && cards.every((c) => c.matched)) setWon(true);
  }, [cards]);

  const flip = (i) => {
    if (locked || cards[i].flipped || cards[i].matched || selected.length === 2) return;
    setCards((prev) => prev.map((c, idx) => idx === i ? { ...c, flipped: true } : c));
    setSelected((s) => [...s, i]);
  };

  const reset = () => {
    setCards(buildCards());
    setSelected([]);
    setWon(false);
    setLocked(false);
  };

  const COLORS = [
    "#e91e8c", "#a855f7", "#3b82f6", "#10b981",
    "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4",
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center level-transition"
      style={{ padding: "60px 12px 16px" }}
    >
      <motion.p
        className="font-body text-pink-300 text-sm uppercase tracking-widest font-semibold mb-1"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      >
        ✨ Nivo 3 ✨
      </motion.p>
      <motion.p
        className="font-body text-purple-300 mb-5 text-center text-base"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
      >
        Pronađi sve parove! 🃏
      </motion.p>

      <AnimatePresence mode="wait">
        {!won ? (
          <motion.div
            key="grid"
            className="grid gap-3 w-full"
            style={{ gridTemplateColumns: "repeat(4, 1fr)", maxWidth: "min(680px, 98vw)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {cards.map((card, i) => (
              <motion.button
                key={card.id}
                onClick={() => flip(i)}
                className="rounded-2xl overflow-hidden cursor-pointer select-none relative"
                style={{
                  width: "100%",
                  aspectRatio: "1 / 1",
                  border: card.matched
                    ? "2px solid rgba(34,197,94,0.6)"
                    : card.flipped
                    ? `2px solid ${COLORS[card.pairId]}`
                    : "2px solid rgba(255,255,255,0.08)",
                  background: !card.flipped && !card.matched
                    ? "rgba(255,255,255,0.06)"
                    : "transparent",
                }}
                whileTap={!card.flipped && !card.matched ? { scale: 0.93 } : {}}
              >
                <AnimatePresence mode="wait">
                  {card.flipped || card.matched ? (
                    <motion.div
                      key="front"
                      className="w-full h-full"
                      initial={{ rotateY: 90 }}
                      animate={{ rotateY: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {card.src ? (
                        <img
                          src={card.src}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                            filter: card.matched ? "brightness(0.85)" : "none",
                          }}
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{
                            background: card.matched
                              ? `${COLORS[card.pairId]}33`
                              : `${COLORS[card.pairId]}22`,
                            fontSize: "clamp(1.6rem, 5vw, 2.4rem)",
                          }}
                        >
                          {card.emoji}
                        </div>
                      )}
                      {card.matched && (
                        <div
                          className="absolute inset-0 flex items-center justify-center"
                          style={{ background: "rgba(34,197,94,0.25)" }}
                        >
                          <span style={{ fontSize: "clamp(1.2rem, 4vw, 1.8rem)" }}>✅</span>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="back"
                      className="w-full h-full flex items-center justify-center"
                      initial={{ rotateY: -90 }}
                      animate={{ rotateY: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ fontSize: "clamp(1.4rem, 5vw, 2rem)" }}
                    >
                      🎴
                    </motion.div>
                  )}
                </AnimatePresence>
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
            <div className="text-8xl mb-4">🎉</div>
            <h3 className="font-display text-3xl font-bold text-gradient mb-3">Bravo!</h3>
            <p className="font-body text-purple-200 mb-6">Pronašla si sve parove!</p>
            <div className="flex gap-4 justify-center">
              <button
                className="font-body px-6 py-3 rounded-full border border-pink-500/40 text-pink-300 hover:bg-pink-500/10 transition-all"
                onClick={reset}
              >
                Ponovi 🔄
              </button>
              <button className="btn-primary font-body" onClick={onNext}>
                Dalje →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
