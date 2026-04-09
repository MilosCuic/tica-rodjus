import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "../../hooks/useWindowSize";
import img1 from "../../assets/photos/quiz1_1.jpeg";
import img2 from "../../assets/photos/quiz1_2.jpeg";
import img3 from "../../assets/photos/quiz1_3.jpeg";
import img4 from "../../assets/photos/quiz1_4.jpeg";

const OPTIONS = [
  { id: 1, src: img1 },
  { id: 2, src: img2 },
  { id: 3, src: img3 },
  { id: 4, src: img4 },
];
const CORRECT_ID = 3;

export default function Level1_Dobrodoslica({ onNext }) {
  const [wrongIds, setWrongIds] = useState([]); // slike koje su pogrešno kliknute
  const [answered, setAnswered] = useState(false);
  const { width, height } = useWindowSize();

  const handleSelect = (id) => {
    if (answered) return;
    if (id === CORRECT_ID) {
      setAnswered(true);
    } else {
      // Dodaj u wrong listu ako već nije tu
      setWrongIds((prev) => prev.includes(id) ? prev : [...prev, id]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-24 level-transition relative">
      {/* Konfeti vatromet kad je tačno */}
      {answered && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={350}
          colors={["#ffd700", "#e91e8c", "#a855f7", "#ffffff", "#10b981"]}
        />
      )}

      {/* Lebdeći baloni kad je tačno */}
      {answered && (
        <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
          {["🎈", "🎉", "🎊", "💕", "🌸", "✨"].map((emoji, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl"
              style={{ left: `${10 + i * 16}%`, bottom: -60 }}
              animate={{ y: "-110vh" }}
              transition={{ duration: 3 + Math.random() * 2, delay: i * 0.2, ease: "easeOut" }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>
      )}
      <motion.p
        className="font-body text-pink-300 text-sm uppercase tracking-widest font-semibold mb-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        ✨ Nivo 1 ✨
      </motion.p>
      <motion.h2
        className="font-display text-3xl md:text-4xl font-bold text-gradient mb-2 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Pronađi malog od garaže!
      </motion.h2>
      <motion.p
        className="font-body text-purple-300 mb-10 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Koja slika je tačna? 🔍
      </motion.p>

      {/* 2x2 grid */}
      <motion.div
        className="grid grid-cols-2 gap-4 mb-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        {OPTIONS.map((opt) => {
          const isWrong = wrongIds.includes(opt.id);
          const isRight = opt.id === CORRECT_ID;
          const isCorrectAndDone = answered && isRight;

          let borderColor = "rgba(255,255,255,0.12)";
          if (isCorrectAndDone) borderColor = "#22c55e";
          else if (isWrong) borderColor = "#ef4444";

          return (
            <motion.button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              className="relative rounded-2xl overflow-hidden"
              style={{
                width: "min(200px, 44vw)",
                height: "min(200px, 44vw)",
                border: `3px solid ${borderColor}`,
                cursor: answered ? "default" : "pointer",
                transition: "border-color 0.3s",
              }}
              whileHover={!answered && !isWrong ? { scale: 1.04 } : {}}
              whileTap={!answered ? { scale: 0.96 } : {}}
              // Shake animacija svaki put kad se pogreši
              animate={isWrong && !answered ? {
                x: [0, -10, 10, -8, 8, -4, 4, 0],
              } : {}}
              transition={isWrong && !answered ? {
                duration: 0.45,
                ease: "easeInOut",
              } : {}}
            >
              <img
                src={opt.src}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              {/* Crveni overlay za pogrešne */}
              {isWrong && !answered && (
                <div
                  className="absolute inset-0"
                  style={{ background: "rgba(239,68,68,0.25)", border: "3px solid #ef4444", borderRadius: "inherit" }}
                />
              )}
              {/* Zeleni overlay kad je tačna */}
              <AnimatePresence>
                {isCorrectAndDone && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ background: "rgba(34,197,94,0.35)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <span className="text-4xl">✅</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Feedback + next */}
      <AnimatePresence>
        {answered && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.4 }}
          >
            <p className="font-display text-2xl font-bold mb-2">
              <span className="text-green-400">Tačno! Bravo! 🎉</span>
            </p>
            <p className="font-body text-purple-300 mb-6 text-sm">
              {wrongIds.length === 0
                ? "Na prvi pokušaj! Idemo dalje... 🌟"
                : `Posle ${wrongIds.length} pogrešn${wrongIds.length === 1 ? "og" : "ih"} pokušaj${wrongIds.length === 1 ? "a" : "a"}! Ali si uspela! 😄`}
            </p>
            <button className="btn-primary font-body" onClick={onNext}>
              Sledeći Nivo →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
