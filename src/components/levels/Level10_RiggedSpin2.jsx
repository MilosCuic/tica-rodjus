import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SPINNER_OPTIONS_2, WINNING_INDEX_2, GIFT } from "../../data/gameData";
import Confetti from "react-confetti";
import { useWindowSize } from "../../hooks/useWindowSize";

const COLORS = [
  "#ffd700", "#e91e8c", "#10b981", "#3b82f6",
  "#a855f7", "#f59e0b", "#06b6d4", "#ef4444",
];

export default function Level10_RiggedSpin2({ onNext }) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [stage, setStage] = useState("intro"); // intro | spin | result
  const { width, height } = useWindowSize();

  const options = SPINNER_OPTIONS_2;
  const winIdx = WINNING_INDEX_2;
  const segAngle = 360 / options.length;

  const spin = () => {
    if (spinning || revealed) return;
    setSpinning(true);
    setStage("spin");

    const fullSpins = 6 + Math.floor(Math.random() * 4);
    const winAngle = 360 - (winIdx * segAngle + segAngle / 2);
    const target = rotation + fullSpins * 360 + ((winAngle - rotation % 360 + 360) % 360);
    setRotation(target);

    setTimeout(() => {
      setSpinning(false);
      setRevealed(true);
      setStage("result");
    }, 5500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-24 level-transition">
      {revealed && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          colors={["#ffd700", "#e91e8c", "#a855f7", "#ffffff"]}
        />
      )}

      <motion.div
        className="font-body text-sm text-yellow-300 uppercase tracking-widest mb-2 font-semibold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        🏆 Nivo 10 — Velika Potvrda 🏆
      </motion.div>

      <AnimatePresence mode="wait">
        {stage === "intro" && (
          <motion.div
            key="intro"
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
          >
            <div className="text-7xl mb-4">🎰</div>
            <h2 className="font-display text-4xl font-bold text-gradient mb-4">
              Još Jedna Šansa!
            </h2>
            <p className="font-body text-purple-200 mb-3 max-w-md text-center text-lg">
              Pre finalnog iznenađenja...
            </p>
            <p className="font-body text-pink-300 mb-8 max-w-sm text-center">
              Ako i ovaj točak ispadne na isto — to mora biti sudbina! 🌟
            </p>
            <motion.button
              className="btn-primary font-body text-xl"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setStage("wheel")}
            >
              Pokaži mi točak! →
            </motion.button>
          </motion.div>
        )}

        {(stage === "wheel" || stage === "spin") && (
          <motion.div
            key="wheel"
            className="flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2 className="font-display text-3xl font-bold text-gradient mb-6 text-center">
              Zavrti i Sazna! 🎰
            </h2>

            <div className="relative flex items-center justify-center mb-8" style={{ width: 300, height: 300 }}>
              <div
                className="absolute z-20"
                style={{
                  top: -8,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 0,
                  height: 0,
                  borderLeft: "14px solid transparent",
                  borderRight: "14px solid transparent",
                  borderTop: "32px solid #ffd700",
                  filter: "drop-shadow(0 3px 10px #ffd700cc)",
                }}
              />
              <motion.svg
                width={280}
                height={280}
                viewBox="0 0 280 280"
                animate={{ rotate: rotation }}
                transition={spinning ? { duration: 5.5, ease: [0.15, 0.85, 0.35, 1] } : { duration: 0 }}
              >
                <circle cx={140} cy={140} r={138} fill="#1a0533" />
                {options.map((opt, i) => {
                  const startAngle = i * segAngle - 90;
                  const endAngle = startAngle + segAngle;
                  const r = 130;
                  const toRad = (d) => (d * Math.PI) / 180;
                  const x1 = 140 + r * Math.cos(toRad(startAngle));
                  const y1 = 140 + r * Math.sin(toRad(startAngle));
                  const x2 = 140 + r * Math.cos(toRad(endAngle));
                  const y2 = 140 + r * Math.sin(toRad(endAngle));
                  const midAngle = startAngle + segAngle / 2;
                  const tx = 140 + 85 * Math.cos(toRad(midAngle));
                  const ty = 140 + 85 * Math.sin(toRad(midAngle));
                  const isWin = i === winIdx;
                  return (
                    <g key={i}>
                      <path
                        d={`M140,140 L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`}
                        fill={isWin ? "#ffd700" : COLORS[i % COLORS.length]}
                        stroke="#1a0533"
                        strokeWidth={2}
                      />
                      <text
                        x={tx}
                        y={ty}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={isWin ? "#1a0533" : "white"}
                        fontSize={9}
                        fontWeight="bold"
                        transform={`rotate(${midAngle + 90}, ${tx}, ${ty})`}
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {opt.length > 10 ? opt.slice(0, 10) + "…" : opt}
                      </text>
                    </g>
                  );
                })}
                <circle cx={140} cy={140} r={16} fill="#1a0533" stroke="#ffd700" strokeWidth={3} />
              </motion.svg>
            </div>

            <motion.button
              className="btn-primary font-body text-xl"
              onClick={spin}
              disabled={spinning}
              whileHover={!spinning ? { scale: 1.06 } : {}}
              whileTap={!spinning ? { scale: 0.96 } : {}}
              style={spinning ? { opacity: 0.6, cursor: "not-allowed" } : {}}
            >
              {spinning ? "🎰 Vrti se... sudbina odlučuje..." : "🎰 Zavrti Sudbinu!"}
            </motion.button>
          </motion.div>
        )}

        {stage === "result" && (
          <motion.div
            key="result"
            className="text-center max-w-lg"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.3 }}
          >
            <motion.div
              className="text-8xl mb-4"
              animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              🎁
            </motion.div>
            <p className="font-body text-yellow-300 text-sm uppercase tracking-widest mb-2 font-semibold">
              Neverovantno! Opet isti poklon!
            </p>
            <p className="font-body text-purple-300 mb-4">
              Dva różita točka, ista nagrada — ovo nije slučajnost... ovo je
            </p>
            <h3
              className="font-display font-black mb-3"
              style={{
                fontSize: "clamp(2rem, 7vw, 4rem)",
                background: "linear-gradient(135deg, #ffd700, #e91e8c, #a855f7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {GIFT}
            </h3>
            <p className="font-body text-pink-200 text-lg mb-8">Sudbina je odlučila! 🌟</p>
            <motion.button
              className="btn-primary font-body text-xl"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              onClick={onNext}
            >
              Finale! 🎊
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
