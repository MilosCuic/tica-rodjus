import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "../../hooks/useWindowSize";

const MESSAGE = "Zara vaučer na 6000din!! 🛍️";
const BIG_EMOJI = "🎁";

export default function Level6_Scratch({ onNext }) {
  const canvasRef = useRef(null);
  const [scratched, setScratched] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const isDrawing = useRef(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Silver scratch layer
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, "#6b21a8");
    grad.addColorStop(0.5, "#a855f7");
    grad.addColorStop(1, "#7c3aed");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Text on scratch layer
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.font = "bold 18px Poppins, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Grebi ovde! 🪙", canvas.width / 2, canvas.height / 2 - 10);
    ctx.fillText("✨✨✨", canvas.width / 2, canvas.height / 2 + 20);
  }, []);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const scratch = (e) => {
    if (!isDrawing.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getPos(e, canvas);
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fill();
    checkScratched(canvas);
  };

  const checkScratched = (canvas) => {
    const ctx = canvas.getContext("2d");
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 128) transparent++;
    }
    const pct = (transparent / (data.length / 4)) * 100;
    setScratched(Math.min(100, Math.round(pct)));
    if (pct > 70) setRevealed(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-24 level-transition">
      {revealed && (
        <>
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={350}
            confettiSource={{ x: 0, y: 0, w: width, h: 0 }}
            colors={["#ffd700", "#e91e8c", "#a855f7", "#ffffff", "#10b981"]}
          />
          <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
            {["🎆", "🎇", "✨", "🌟", "💫", "🎉", "🎊", "🎆"].map((e, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{ left: `${5 + i * 13}%`, bottom: -40, fontSize: "2.5rem" }}
                animate={{ y: "-110vh", opacity: [1, 1, 0] }}
                transition={{ duration: 2.5 + i * 0.2, delay: i * 0.1, ease: "easeOut" }}
              >
                {e}
              </motion.div>
            ))}
          </div>
        </>
      )}
      <motion.h2
        className="font-display text-4xl font-bold text-gradient mb-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Greb greb sledeću nagradu 🪙
      </motion.h2>

      <div className="relative" style={{ width: "min(340px, 90vw)", height: 220 }}>
        {/* Hidden content underneath */}
        <div
          className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center gap-4"
          style={{ background: "linear-gradient(135deg, #1a0533, #3d0a2d)" }}
        >
          <div className="text-6xl">{BIG_EMOJI}</div>
          <p
            className="font-display font-black text-center px-4 leading-tight"
            style={{
              fontSize: "clamp(1.2rem, 5vw, 1.7rem)",
              background: "linear-gradient(135deg, #ffd700, #e91e8c)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {MESSAGE}
          </p>
        </div>

        {/* Scratch overlay */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 rounded-3xl"
          style={{ width: "100%", height: "100%", touchAction: "none", cursor: "crosshair" }}
          onMouseDown={() => (isDrawing.current = true)}
          onMouseUp={() => (isDrawing.current = false)}
          onMouseLeave={() => (isDrawing.current = false)}
          onMouseMove={scratch}
          onTouchStart={(e) => { isDrawing.current = true; }}
          onTouchEnd={() => (isDrawing.current = false)}
          onTouchMove={scratch}
        />
      </div>

      {/* Progress */}
      <div className="mt-5 w-full max-w-xs">
        <div className="flex justify-between mb-1">
          <span className="font-body text-xs text-purple-300">Ogrebano</span>
          <span className="font-body text-xs text-yellow-300 font-bold">{scratched}%</span>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(to right, #e91e8c, #a855f7)" }}
            animate={{ width: `${scratched}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>

      <AnimatePresence>
        {revealed && (
          <motion.button
            className="btn-primary font-body mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring" }}
            onClick={onNext}
          >
            Sledeći Nivo →
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
