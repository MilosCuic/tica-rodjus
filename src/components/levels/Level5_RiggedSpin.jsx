import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SPINNER_OPTIONS_1, WINNING_INDEX_1 } from "../../data/gameData";
import Confetti from "react-confetti";
import { useWindowSize } from "../../hooks/useWindowSize";
import {
  resumeAudio,
  startSpinnerTicks,
  stopSpinnerTicks,
  playWinChime,
} from "../../utils/sfx";
import prizeImg from "../../assets/photos/level5.jpeg";

const COLORS = [
  "#e91e8c", "#a855f7", "#3b82f6", "#10b981",
  "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4",
];

// Podeli tekst na 2 reda što prirodnije
function splitLabel(text) {
  const words = text.split(" ");
  if (words.length === 1) return [text];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

export default function Level5_RiggedSpin({ onNext }) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const { width, height } = useWindowSize();
  const options = SPINNER_OPTIONS_1;
  const winIdx = WINNING_INDEX_1;
  const segAngle = 360 / options.length;

  const spin = async () => {
    if (spinning || revealed) return;
    await resumeAudio();
    setSpinning(true);
    startSpinnerTicks(4500);
    const fullSpins = 5 + Math.floor(Math.random() * 3);
    const winAngle = 360 - (winIdx * segAngle + segAngle / 2);
    const target = rotation + fullSpins * 360 + ((winAngle - rotation % 360 + 360) % 360);
    setRotation(target);
    setTimeout(() => {
      stopSpinnerTicks();
      setSpinning(false);
      setRevealed(true);
      playWinChime();
    }, 4500);
  };

  const WHEEL_SIZE = "min(440px, 82vw, 72vh)";
  const isMobile = width < 640;

  useEffect(() => () => stopSpinnerTicks(), []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 level-transition"
      style={{ paddingTop: 64, paddingBottom: 72 }}>

      {revealed && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={400}
          confettiSource={{ x: 0, y: 0, w: width, h: 0 }}
          colors={["#ffd700", "#e91e8c", "#a855f7", "#ffffff", "#10b981"]}
        />
      )}

      <motion.p
        className="font-body text-sm text-pink-300 uppercase tracking-widest mb-5 font-semibold"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      >
        ✨ Nivo 5 — Vreme je za nagradu!! 🎰
      </motion.p>

      {/* Wheel + button layout: row on desktop, column on mobile */}
      <div className="flex items-center gap-6" style={{ flexDirection: isMobile ? "column" : "row" }}>

        {/* Wheel ili slika nagrada */}
        <AnimatePresence mode="wait">
          {!revealed ? (
            <motion.div
              key="wheel"
              className="relative flex items-center justify-center flex-shrink-0"
              style={{ width: WHEEL_SIZE, height: WHEEL_SIZE }}
              exit={{ scale: 0.8, opacity: 0, rotate: 20 }}
              transition={{ duration: 0.4 }}
            >
          {/* Needle */}
          <div className="absolute z-20" style={{
            top: -10, left: "50%", transform: "translateX(-50%)",
            width: 0, height: 0,
            borderLeft: "15px solid transparent",
            borderRight: "15px solid transparent",
            borderTop: "36px solid #ffd700",
            filter: "drop-shadow(0 3px 8px #ffd700bb)",
          }} />

          <motion.svg
            width="100%" height="100%"
            viewBox="0 0 280 280"
            animate={{ rotate: rotation }}
            transition={spinning ? { duration: 4.5, ease: [0.2, 0.9, 0.4, 1] } : { duration: 0 }}
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
                    stroke="#1a0533" strokeWidth={2}
                  />
                  {(() => {
                    const lines = splitLabel(opt);
                    const lineH = 9;
                    const offsetY = lines.length === 1 ? 0 : -lineH / 2;
                    return (
                      <text
                        textAnchor="middle"
                        fill={isWin ? "#1a0533" : "white"}
                        fontSize={8}
                        fontWeight="bold"
                        transform={`rotate(${midAngle + 90}, ${tx}, ${ty})`}
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {lines.map((line, li) => (
                          <tspan
                            key={li}
                            x={tx}
                            y={ty + offsetY + li * lineH}
                          >
                            {line}
                          </tspan>
                        ))}
                      </text>
                    );
                  })()}
                </g>
              );
            })}
            <circle cx={140} cy={140} r={16} fill="#1a0533" stroke="#ffd700" strokeWidth={3} />
          </motion.svg>
            </motion.div>
          ) : (
            <motion.div
              key="prize-image"
              className="relative flex items-center justify-center flex-shrink-0 rounded-3xl overflow-hidden"
              style={{ 
                width: WHEEL_SIZE, 
                height: WHEEL_SIZE,
                border: "3px solid #ffd700",
                boxShadow: "0 0 40px rgba(255,215,0,0.4)",
              }}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
            >
              <img
                src={prizeImg}
                alt="Nagrada"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right side — spin btn or result */}
        <div className="flex flex-col items-center gap-4" style={{ minWidth: 120 }}>
          <AnimatePresence mode="wait">
            {!revealed ? (
              <motion.button
                key="spin-btn"
                className="btn-primary font-body"
                style={{ fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)", padding: "12px 20px", writingMode: "horizontal-tb" }}
                onClick={spin}
                disabled={spinning}
                whileHover={!spinning ? { scale: 1.06 } : {}}
                whileTap={!spinning ? { scale: 0.96 } : {}}
                style={spinning
                  ? { opacity: 0.6, cursor: "not-allowed", padding: "12px 20px" }
                  : { padding: "12px 20px" }}
                exit={{ opacity: 0 }}
              >
                {spinning ? "🎰 Vrti se..." : "🎰 Zavrti!"}
              </motion.button>
            ) : (
              <motion.div
                key="result"
                className="flex flex-col items-center gap-3 text-center"
                initial={{ opacity: 0, scale: 0.7, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.3 }}
              >
                <div className="text-5xl">🎉</div>
                <p className="font-body text-pink-300 text-xs uppercase tracking-widest font-semibold">
                  Čestitamo!
                </p>
                <p
                  className="font-display font-black"
                  style={{
                    fontSize: "clamp(1.4rem, 4.5vw, 2.2rem)",
                    background: "linear-gradient(135deg, #ffd700, #e91e8c)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    lineHeight: 1.3,
                  }}
                >
                  Najbolja proslava rođendana! 🎂
                </p>
                <motion.button
                  className="btn-primary font-body"
                  style={{ fontSize: "1rem", padding: "10px 18px" }}
                  onClick={onNext}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.96 }}
                >
                  Nastavi →
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
