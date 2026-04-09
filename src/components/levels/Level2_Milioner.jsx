import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "../../hooks/useWindowSize";
import cekaImg from "../../assets/photos/ceka.jpeg";

const ESCAPE_TEXTS = [
  "Jesi ti retardirana?! 😱",
  "Sestro drži me! 🙈",
  "Sestro pašću ti! 😬",
  "Još maloooo... 😅",
  "Još jako majoooooo! 🏃💨",
];
const LOVE_TEXT = "Volim teeeee ❤️";

const ESCAPES_NEEDED = 5;
const IMG_SIZE = 90;

function randomPos(arenaW, arenaH, exclude = null) {
  const pad = IMG_SIZE + 24;
  for (let i = 0; i < 40; i++) {
    const x = pad + Math.random() * (arenaW - pad * 2);
    const y = pad + Math.random() * (arenaH - pad * 2);
    if (!exclude) return { x, y };
    const dx = x - exclude.x;
    const dy = y - exclude.y;
    if (Math.sqrt(dx * dx + dy * dy) > 150) return { x, y };
  }
  return { x: arenaW / 2, y: arenaH / 2 };
}

function MapBg({ w, h }) {
  return (
    <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>
      <rect width={w} height={h} fill="#1e0a3c" />
      <rect x={0} y={h * 0.45} width={w} height={h * 0.1} fill="#2a1650" />
      <rect x={w * 0.45} y={0} width={w * 0.1} height={h} fill="#2a1650" />
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={`rh${i}`} x={i * (w / 7) + 10} y={h * 0.495} width={w / 14} height={4} fill="rgba(255,215,0,0.3)" rx={2} />
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={`rv${i}`} x={w * 0.495} y={i * (h / 5) + 10} width={4} height={h / 10} fill="rgba(255,215,0,0.3)" rx={2} />
      ))}
      {Array.from({ length: 4 }, (_, i) => (
        <rect key={`p1${i}`} x={30 + i * 70} y={30} width={55} height={90} fill="none" stroke="rgba(233,30,140,0.25)" strokeWidth={1.5} rx={3} />
      ))}
      {Array.from({ length: 4 }, (_, i) => (
        <rect key={`p2${i}`} x={w - 330 + i * 70} y={h - 120} width={55} height={90} fill="none" stroke="rgba(233,30,140,0.25)" strokeWidth={1.5} rx={3} />
      ))}
      <rect x={w - 160} y={20} width={140} height={100} fill="#2d1155" stroke="rgba(168,85,247,0.4)" strokeWidth={2} rx={6} />
      <text x={w - 90} y={75} textAnchor="middle" fill="rgba(168,85,247,0.6)" fontSize={11} fontFamily="Poppins">ZGRADA</text>
      <rect x={20} y={h - 120} width={120} height={100} fill="#1a0a40" stroke="rgba(233,30,140,0.4)" strokeWidth={2} rx={6} />
      <rect x={30} y={h - 110} width={45} height={35} fill="#0d0620" stroke="rgba(233,30,140,0.3)" strokeWidth={1.5} rx={3} />
      <rect x={85} y={h - 110} width={45} height={35} fill="#0d0620" stroke="rgba(233,30,140,0.3)" strokeWidth={1.5} rx={3} />
      <text x={80} y={h - 40} textAnchor="middle" fill="rgba(233,30,140,0.6)" fontSize={11} fontFamily="Poppins">GARAŽA</text>
      {[[w * 0.3, h * 0.25], [w * 0.7, h * 0.25], [w * 0.3, h * 0.75], [w * 0.7, h * 0.75]].map(([cx, cy], i) => (
        <g key={`t${i}`}>
          <circle cx={cx} cy={cy} r={18} fill="rgba(16,185,129,0.2)" stroke="rgba(16,185,129,0.3)" strokeWidth={1} />
          <circle cx={cx} cy={cy} r={10} fill="rgba(16,185,129,0.15)" />
        </g>
      ))}
      <circle cx={w * 0.5} cy={h * 0.5} r={5} fill="#ffd700" opacity={0.7} />
    </svg>
  );
}

function SpeechBubble({ text, permanent }) {
  return (
    <motion.div
      key={text}
      initial={{ opacity: 0, scale: 0.7, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={permanent ? undefined : { opacity: 0, scale: 0.8, y: -4 }}
      transition={{ type: "spring", bounce: 0.5, duration: 0.3 }}
      style={{
        position: "absolute",
        bottom: IMG_SIZE + 10,
        left: "50%",
        transform: "translateX(-50%)",
        background: "white",
        color: "#1a0533",
        borderRadius: 12,
        padding: "6px 12px",
        fontSize: 12,
        fontWeight: 700,
        fontFamily: "Poppins, sans-serif",
        whiteSpace: "nowrap",
        boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
        zIndex: 20,
      }}
    >
      {text}
      <div style={{
        position: "absolute",
        bottom: -7,
        left: "50%",
        transform: "translateX(-50%)",
        width: 0,
        height: 0,
        borderLeft: "7px solid transparent",
        borderRight: "7px solid transparent",
        borderTop: "8px solid white",
      }} />
    </motion.div>
  );
}

const FLEE_RADIUS = 110;

export default function Level2_UhvatiCeku({ onNext }) {
  const arenaRef = useRef(null);
  const [arenaSize, setArenaSize] = useState({ w: 600, h: 400 });
  const [pos, setPos] = useState(null);
  const [escapes, setEscapes] = useState(0);
  const [caught, setCaught] = useState(false);
  const [celebration, setCelebration] = useState(false);
  const [started, setStarted] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const { width, height } = useWindowSize();
  const bubbleTimer = useRef(null);
  const lastEscape = useRef(0);

  // Detektuj touch vs mouse uredjaj
  const isTouch = typeof window !== "undefined" &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  useEffect(() => {
    const measure = () => {
      if (arenaRef.current) {
        const r = arenaRef.current.getBoundingClientRect();
        setArenaSize({ w: r.width, h: r.height });
        setPos(randomPos(r.width, r.height));
      }
    };
    if (started) {
      setTimeout(measure, 50);
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }
  }, [started]);

  // Desktop: flee on mouse proximity (samo dok nije canCatch)
  const handleMouseMove = (e) => {
    if (isTouch || !pos || caught || canCatch) return;
    const now = Date.now();
    if (now - lastEscape.current < 400) return;
    const rect = arenaRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const dx = mx - pos.x;
    const dy = my - pos.y;
    if (Math.sqrt(dx * dx + dy * dy) < FLEE_RADIUS) {
      lastEscape.current = now;
      triggerEscape();
    }
  };

  const triggerEscape = () => {
    setPos((prev) => randomPos(arenaSize.w, arenaSize.h, prev));
    setEscapes((c) => {
      const newEscapes = c + 1;
      setBubbleVisible(true);
      clearTimeout(bubbleTimer.current);
      bubbleTimer.current = setTimeout(() => setBubbleVisible(false), 1800);
      return newEscapes;
    });
  };

  const canCatch = escapes >= ESCAPES_NEEDED;

  const handleImageTap = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (caught) return;

    if (!canCatch) {
      // Na touch uređaju: tap = beg
      // Na desktopu: klik se ignoriše dok miš nije triggerovao 5 bekstava
      triggerEscape();
      return;
    } else {
      setCaught(true);
      setTimeout(() => setCelebration(true), 150);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20 level-transition">
      {celebration && (
        <>
          <Confetti width={width} height={height} recycle={false} numberOfPieces={400} colors={["#ffd700", "#e91e8c", "#a855f7", "#fff", "#10b981"]} />
          <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
            {["🎈", "🎉", "🎊", "💕", "🌸", "✨", "🎈", "🎊"].map((emoji, i) => (
              <motion.div
                key={i}
                className="absolute text-4xl"
                style={{ left: `${5 + i * 13}%`, bottom: -60 }}
                animate={{ y: "-110vh" }}
                transition={{ duration: 3 + i * 0.3, delay: i * 0.15, ease: "easeOut" }}
              >
                {emoji}
              </motion.div>
            ))}
          </div>
        </>
      )}

      <motion.p className="font-body text-pink-300 text-sm uppercase tracking-widest font-semibold mb-2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        ✨ Nivo 2 ✨
      </motion.p>
      <motion.h2 className="font-display text-3xl md:text-4xl font-bold text-gradient mb-1 text-center"
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        Uhvati Cekuuu! 🏃
      </motion.h2>
      <motion.p className="font-body text-purple-300 mb-3 text-center text-sm"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        {!started
          ? (isTouch ? "Tapni na Čeku da je uhvatiš... ako možeš! 😏" : "Priđi mišem Čeki... ako smeš! 😏")
          : canCatch
          ? (isTouch ? "🎯 Sada je možeš uhvatiti! Tapni je!" : "🎯 Sada je možeš uhvatiti! Klikni je!")
          : (isTouch
              ? `Tapni je! Još ${ESCAPES_NEEDED - escapes} bekstav${ESCAPES_NEEDED - escapes === 1 ? "" : "a"}...`
              : `Priđi joj! Još ${ESCAPES_NEEDED - escapes} bekstav${ESCAPES_NEEDED - escapes === 1 ? "" : "a"}...`)}
      </motion.p>

      {started && !caught && (
        <div className="flex gap-2 mb-3">
          {Array.from({ length: ESCAPES_NEEDED }, (_, i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full"
              animate={{ background: i < escapes ? "#22c55e" : "rgba(255,255,255,0.2)" }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      )}

      {!started ? (
        <motion.button
          className="btn-primary font-body text-lg mb-6"
          whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}
          onClick={() => setStarted(true)}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        >
          🗺️ Otvori Mapu!
        </motion.button>
      ) : (
        <motion.div
          ref={arenaRef}
          className="relative rounded-3xl overflow-hidden"
          style={{
            width: "min(650px, 95vw)",
            height: "min(420px, 60vw, 55vh)",
            border: canCatch && !caught ? "2px solid #ffd700" : "2px solid rgba(233,30,140,0.3)",
            boxShadow: canCatch && !caught ? "0 0 20px #ffd70055" : "none",
            transition: "border-color 0.4s, box-shadow 0.4s",
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          onMouseMove={handleMouseMove}
        >
          <MapBg w={arenaSize.w} h={arenaSize.h} />

          {pos && !caught && (
            <motion.div
              className="absolute"
              style={{
                left: pos.x - IMG_SIZE / 2,
                top: pos.y - IMG_SIZE / 2,
                width: IMG_SIZE,
                zIndex: 10,
                cursor: "pointer",
                touchAction: "manipulation",
              }}
              animate={{ left: pos.x - IMG_SIZE / 2, top: pos.y - IMG_SIZE / 2 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              onClick={handleImageTap}
              onTouchEnd={handleImageTap}
              whileTap={{ scale: 0.92 }}
            >
              {/* Speech bubble — escape texts */}
              <AnimatePresence>
                {bubbleVisible && escapes > 0 && escapes <= ESCAPE_TEXTS.length && (
                  <SpeechBubble key={`esc-${escapes}`} text={ESCAPE_TEXTS[escapes - 1]} />
                )}
              </AnimatePresence>

              {/* "Volim teeeee" bubble — permanent kad može da se uhvati */}
              <AnimatePresence>
                {canCatch && (
                  <SpeechBubble key="love" text={LOVE_TEXT} permanent />
                )}
              </AnimatePresence>

              <img
                src={cekaImg}
                alt="Čeka"
                draggable={false}
                style={{
                  width: IMG_SIZE,
                  height: IMG_SIZE,
                  objectFit: "cover",
                  borderRadius: "50%",
                  border: canCatch ? "3px solid #ffd700" : "3px solid #e91e8c",
                  boxShadow: canCatch ? "0 0 18px #ffd700, 0 0 40px #ffd70055" : "0 0 10px #e91e8c88",
                  display: "block",
                  userSelect: "none",
                }}
              />

              {canCatch && (
                <motion.div
                  className="absolute -top-2 -right-2 text-base"
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                  transition={{ duration: 0.7, repeat: Infinity }}
                >
                  🎯
                </motion.div>
              )}
            </motion.div>
          )}

          <AnimatePresence>
            {caught && (
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center z-20"
                style={{ background: "rgba(26,5,51,0.75)", backdropFilter: "blur(4px)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div className="text-7xl mb-2"
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.6, delay: 0.1 }}>
                  🎉
                </motion.div>
                <motion.p className="font-display text-2xl font-bold text-gradient"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}>
                  Uhvatila si je!
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence>
        {caught && (
          <motion.button
            className="btn-primary font-body mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, type: "spring" }}
            onClick={onNext}
          >
            Sledeći Nivo →
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
