import { useEffect } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "../../hooks/useWindowSize";
import { GIFT, FINALE_MESSAGE } from "../../data/gameData";

const SIGNATORIES = ["❤️❤️❤️ Marina ❤️❤️❤️"];

export default function Level12_Finale({ onRestart }) {
  const { width, height } = useWindowSize();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-24 level-transition text-center relative overflow-hidden">
      <Confetti
        width={width}
        height={height}
        recycle={true}
        numberOfPieces={180}
        colors={["#ffd700", "#e91e8c", "#a855f7", "#ffffff", "#10b981"]}
      />

      {/* Fireworks effect */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none text-4xl"
          style={{
            left: `${10 + i * 12}%`,
            top: `${15 + (i % 3) * 20}%`,
          }}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeOut",
          }}
        >
          {["🎆", "🎇", "✨", "🌟", "💫", "⭐", "🎉", "🎊"][i]}
        </motion.div>
      ))}

      <div className="relative z-10 max-w-lg">
        <motion.div
          className="text-8xl mb-6"
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          🎂
        </motion.div>

        <motion.h1
          className="font-display font-black mb-3"
          style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)" }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring", bounce: 0.4 }}
        >
          <span className="text-gradient">Srećan Rodjendan!</span>
        </motion.h1>

        <motion.div
          className="font-display text-2xl font-bold text-yellow-300 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Nina 🎊 18 godina
        </motion.div>

        <motion.div
          className="card mb-6 py-6 px-8"
          style={{ border: "1px solid rgba(233,30,140,0.4)", background: "rgba(233,30,140,0.08)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <p className="font-body text-purple-100 text-base leading-relaxed">
            {FINALE_MESSAGE}
          </p>
        </motion.div>

        {/* Gift reminder */}
        {/* <motion.div
          className="card mb-6 py-5 px-8"
          style={{ border: "1px solid rgba(255,215,0,0.4)", background: "rgba(255,215,0,0.06)" }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, type: "spring" }}
        >
          <p className="font-body text-yellow-300 text-sm uppercase tracking-widest mb-3 font-semibold">
            Tvoj poklon 🎁
          </p>
          <div className="flex flex-col gap-2">
            <p className="font-display text-2xl font-bold" style={{ color: "#ffd700" }}>
              💰 150e
            </p>
            <p className="font-display text-2xl font-bold" style={{ color: "#ffd700" }}>
              🛍️ Zara vaučer
            </p>
          </div>
        </motion.div> */}

        {/* Signatories */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          {SIGNATORIES.map((s, i) => (
            <span
              key={i}
              className="font-body text-sm px-4 py-2 rounded-full"
              style={{
                background: "rgba(168,85,247,0.15)",
                border: "1px solid rgba(168,85,247,0.3)",
                color: "#c084fc",
              }}
            >
              {s}
            </span>
          ))}
        </motion.div>

        <motion.button
          className="font-body px-8 py-3 rounded-full text-purple-300 transition-all"
          style={{ border: "1px solid rgba(168,85,247,0.3)", background: "rgba(168,85,247,0.1)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          whileHover={{ scale: 1.04, background: "rgba(168,85,247,0.2)" }}
          whileTap={{ scale: 0.96 }}
          onClick={onRestart}
        >
          Igraj Ponovo 🔄
        </motion.button>
      </div>
    </div>
  );
}
