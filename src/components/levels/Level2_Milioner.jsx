import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "../../hooks/useWindowSize";
import tetaImg from "../../assets/photos/ceka.jpeg"; // Placeholder - zameni sa tetom

const ESCAPE_TEXTS = [
  "Termini su popunjeni! 🙅‍♀️",
  "Nema šanse danas! 😅",
  "Možda sutra? 🤷‍♀️",
  "Ma sada će teta tebi preko reda! 😉",
];
const FINAL_TEXT = "Evo ga! Termin za tebe! ✨";

const ESCAPES_NEEDED = 4;
const IMG_SIZE = 120;
const IMG_SIZE_MOBILE = 100;

// Za mobilni: 4 fiksne pozicije (stolice u ćoškovima)
function getMobilePositions(arenaW, arenaH) {
  const pad = 60;
  return [
    { x: pad, y: pad },                          // Gore levo
    { x: arenaW - pad, y: pad },                 // Gore desno
    { x: pad, y: arenaH - pad },                 // Dole levo
    { x: arenaW - pad, y: arenaH - pad },        // Dole desno
  ];
}

// Za desktop: random pozicije
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

// Frizerski salon pozadina - sketch style
function SalonBg({ w, h, isMobile }) {
  return (
    <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>
      {/* Gradient background */}
      <defs>
        <linearGradient id="salonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#1a0533", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#2d1155", stopOpacity: 1 }} />
        </linearGradient>
        <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="rgba(233,30,140,0.1)" />
        </pattern>
      </defs>
      
      <rect width={w} height={h} fill="url(#salonGrad)" />
      <rect width={w} height={h} fill="url(#dots)" />

      {/* Podloga - tile pattern */}
      {Array.from({ length: Math.ceil(w / 60) }, (_, i) => (
        <line key={`fl${i}`} x1={i * 60} y1={h * 0.85} x2={i * 60} y2={h} stroke="rgba(168,85,247,0.15)" strokeWidth={1.5} />
      ))}
      
      {/* Zidovi */}
      <rect x={20} y={h * 0.1} width={w - 40} height={h * 0.75} fill="rgba(45,17,85,0.3)" stroke="rgba(168,85,247,0.4)" strokeWidth={2} rx={8} />

      {isMobile ? (
        // MOBILE: 4 stolice u ćoškovima
        <>
          {[
            { x: 60, y: 60 },           // Gore levo
            { x: w - 60, y: 60 },       // Gore desno
            { x: 60, y: h - 60 },       // Dole levo
            { x: w - 60, y: h - 60 },   // Dole desno
          ].map((pos, i) => (
            <g key={`chair${i}`}>
              {/* Ogledalo */}
              <rect 
                x={pos.x - 30} 
                y={pos.y - 60} 
                width={60} 
                height={50} 
                fill="rgba(233,30,140,0.15)" 
                stroke="#e91e8c" 
                strokeWidth={2.5} 
                rx={6}
              />
              <rect 
                x={pos.x - 25} 
                y={pos.y - 55} 
                width={50} 
                height={40} 
                fill="rgba(168,85,247,0.2)" 
                stroke="rgba(255,255,255,0.3)" 
                strokeWidth={1} 
                rx={4}
              />
              {/* Stolica */}
              <rect 
                x={pos.x - 20} 
                y={pos.y + 5} 
                width={40} 
                height={35} 
                fill="rgba(233,30,140,0.3)" 
                stroke="rgba(233,30,140,0.6)" 
                strokeWidth={2.5} 
                rx={4}
              />
              <line 
                x1={pos.x} 
                y1={pos.y + 40} 
                x2={pos.x} 
                y2={pos.y + 55} 
                stroke="rgba(233,30,140,0.7)" 
                strokeWidth={5} 
                strokeLinecap="round"
              />
            </g>
          ))}
          
          {/* Centralna dekoracija */}
          <circle cx={w / 2} cy={h / 2} r={25} fill="rgba(255,215,0,0.15)" stroke="#ffd700" strokeWidth={2} />
          <text x={w / 2} y={h / 2 + 6} textAnchor="middle" fill="#ffd700" fontSize={28} fontFamily="Arial">
            💇‍♀️
          </text>
        </>
      ) : (
        // DESKTOP: 3 ogledala kao pre
        <>
          {[0.2, 0.5, 0.8].map((xPos, i) => {
            const x = w * xPos;
            const mirrorW = Math.min(w * 0.18, 110);
            const mirrorH = Math.min(h * 0.35, 140);
            const y = h * 0.25;
            return (
              <g key={`mirror${i}`}>
                <rect 
                  x={x - mirrorW / 2} 
                  y={y} 
                  width={mirrorW} 
                  height={mirrorH} 
                  fill="rgba(233,30,140,0.15)" 
                  stroke="#e91e8c" 
                  strokeWidth={3} 
                  rx={8}
                />
                <rect 
                  x={x - mirrorW / 2 + 5} 
                  y={y + 5} 
                  width={mirrorW - 10} 
                  height={mirrorH - 10} 
                  fill="rgba(168,85,247,0.2)" 
                  stroke="rgba(255,255,255,0.3)" 
                  strokeWidth={1} 
                  rx={5}
                />
                <line 
                  x1={x - mirrorW / 2 + 10} 
                  y1={y + 15} 
                  x2={x - mirrorW / 2 + 25} 
                  y2={y + 35} 
                  stroke="rgba(255,255,255,0.4)" 
                  strokeWidth={2} 
                  strokeLinecap="round"
                />
                <rect 
                  x={x - 18} 
                  y={y + mirrorH + 10} 
                  width={36} 
                  height={45} 
                  fill="rgba(233,30,140,0.25)" 
                  stroke="rgba(233,30,140,0.5)" 
                  strokeWidth={2} 
                  rx={4}
                />
                <line 
                  x1={x} 
                  y1={y + mirrorH + 55} 
                  x2={x} 
                  y2={y + mirrorH + 75} 
                  stroke="rgba(233,30,140,0.6)" 
                  strokeWidth={4} 
                  strokeLinecap="round"
                />
              </g>
            );
          })}

          {/* Polica sa proizvodima */}
          <g>
            <rect x={w - 140} y={30} width={120} height={80} fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.4)" strokeWidth={2} rx={4} />
            {[0, 1, 2, 3].map(i => (
              <rect 
                key={`bottle${i}`} 
                x={w - 130 + i * 28} 
                y={45} 
                width={20} 
                height={45} 
                fill="rgba(16,185,129,0.3)" 
                stroke="rgba(16,185,129,0.6)" 
                strokeWidth={1.5} 
                rx={2}
              />
            ))}
          </g>

          {/* Makaze i cetkice */}
          <g>
            <line x1={35} y1={50} x2={55} y2={70} stroke="#ffd700" strokeWidth={3} strokeLinecap="round" />
            <line x1={55} y1={50} x2={35} y2={70} stroke="#ffd700" strokeWidth={3} strokeLinecap="round" />
            <circle cx={45} cy={60} r={3} fill="#ffd700" />
            {[0, 1, 2].map(i => (
              <g key={`brush${i}`}>
                <line 
                  x1={70 + i * 15} 
                  y1={45} 
                  x2={70 + i * 15} 
                  y2={75} 
                  stroke="rgba(168,85,247,0.6)" 
                  strokeWidth={2.5} 
                  strokeLinecap="round"
                />
                <circle cx={70 + i * 15} cy={42} r={4} fill="rgba(233,30,140,0.5)" />
              </g>
            ))}
          </g>

          {/* Sijalice */}
          {[0.25, 0.5, 0.75].map((xPos, i) => {
            const x = w * xPos;
            return (
              <g key={`light${i}`}>
                <circle cx={x} cy={20} r={8} fill="rgba(255,215,0,0.3)" stroke="#ffd700" strokeWidth={2} />
                <circle cx={x} cy={20} r={4} fill="#ffd700" opacity={0.6} />
                <line x1={x} y1={28} x2={x} y2={h * 0.4} stroke="rgba(255,215,0,0.1)" strokeWidth={30} />
              </g>
            );
          })}
        </>
      )}

      {/* Dekorativni elementi */}
      <text x={w / 2} y={h * 0.92} textAnchor="middle" fill="rgba(233,30,140,0.4)" fontSize={isMobile ? 11 : 14} fontFamily="Poppins" fontWeight="700">
        💇‍♀️ Salon Ljepote 💅
      </text>
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
        padding: "8px 14px",
        fontSize: 13,
        fontWeight: 700,
        fontFamily: "Poppins, sans-serif",
        whiteSpace: "nowrap",
        boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
        zIndex: 20,
        maxWidth: "200px",
        textAlign: "center",
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

export default function Level2_ZakaziTermin({ onNext }) {
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
  const mobilePositionsRef = useRef([]);
  const usedIndicesRef = useRef([]);

  // Detektuj touch vs mouse uredjaj
  const isTouch = typeof window !== "undefined" &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  const isMobile = width < 768;

  useEffect(() => {
    const measure = () => {
      if (arenaRef.current) {
        const r = arenaRef.current.getBoundingClientRect();
        setArenaSize({ w: r.width, h: r.height });
        
        if (isMobile) {
          mobilePositionsRef.current = getMobilePositions(r.width, r.height);
          setPos(mobilePositionsRef.current[0]); // Start sa prvom stolicom
        } else {
          setPos(randomPos(r.width, r.height));
        }
      }
    };
    if (started) {
      setTimeout(measure, 50);
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }
  }, [started, isMobile]);

  // Desktop: flee on mouse proximity (samo dok nije canCatch)
  const handleMouseMove = (e) => {
    if (isTouch || !pos || caught || canCatch || isMobile) return;
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
    if (isMobile) {
      // Mobilni: biraj sledeću neiskorišćenu stolicu
      const availableIndices = [0, 1, 2, 3].filter(i => !usedIndicesRef.current.includes(i));
      if (availableIndices.length === 0) {
        usedIndicesRef.current = [];
      }
      const nextIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
      usedIndicesRef.current.push(nextIndex);
      setPos(mobilePositionsRef.current[nextIndex]);
    } else {
      // Desktop: random pozicija kao pre
      setPos((prev) => randomPos(arenaSize.w, arenaSize.h, prev));
    }
    
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
      triggerEscape();
      return;
    } else {
      setCaught(true);
      setTimeout(() => setCelebration(true), 150);
    }
  };

  const currentImgSize = isMobile ? IMG_SIZE_MOBILE : IMG_SIZE;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20 level-transition">
      {celebration && (
        <>
          <Confetti width={width} height={height} recycle={false} numberOfPieces={400} colors={["#ffd700", "#e91e8c", "#a855f7", "#fff", "#10b981"]} />
          <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
            {["💇‍♀️", "✨", "💕", "🎉", "💅", "🌸", "💖", "✂️"].map((emoji, i) => (
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
        Zakaži Termin! 💇‍♀️
      </motion.h2>
      <motion.p className="font-body text-purple-300 mb-3 text-center text-sm"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        {!started
          ? (isTouch ? "Tapni na tetu da zakažeš termin... 💅" : "Priđi tetki da zakažeš termin... 💅")
          : canCatch
          ? (isTouch ? "🎯 Sada možeš da zakažeš! Tapni!" : "🎯 Sada možeš da zakažeš! Klikni!")
          : (isTouch
              ? `Tapni je! Još ${ESCAPES_NEEDED - escapes}...`
              : `Priđi joj! Još ${ESCAPES_NEEDED - escapes}...`)}
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
          💇‍♀️ Uđi u Salon!
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
          <SalonBg w={arenaSize.w} h={arenaSize.h} isMobile={isMobile} />

          {pos && !caught && (
            <motion.div
              className="absolute"
              style={{
                left: pos.x - currentImgSize / 2,
                top: pos.y - currentImgSize / 2,
                width: currentImgSize,
                zIndex: 10,
                cursor: "pointer",
                touchAction: "manipulation",
              }}
              animate={{ left: pos.x - currentImgSize / 2, top: pos.y - currentImgSize / 2 }}
              transition={isMobile ? { 
                type: "spring", 
                stiffness: 200, 
                damping: 18 
              } : { 
                type: "spring", 
                stiffness: 280, 
                damping: 22 
              }}
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

              {/* "Evo ga! Termin za tebe!" bubble — permanent kad može da se uhvati */}
              <AnimatePresence>
                {canCatch && (
                  <SpeechBubble key="final" text={FINAL_TEXT} permanent />
                )}
              </AnimatePresence>

              <img
                src={tetaImg}
                alt="Teta frizerka"
                draggable={false}
                style={{
                  width: currentImgSize,
                  height: currentImgSize,
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
                  💇‍♀️
                </motion.div>
              )}
            </motion.div>
          )}

          <AnimatePresence>
            {caught && (
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center z-20"
                style={{ background: "rgba(26,5,51,0.85)", backdropFilter: "blur(4px)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div className="text-7xl mb-2"
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.6, delay: 0.1 }}>
                  💇‍♀️
                </motion.div>
                <motion.p className="font-display text-2xl font-bold text-gradient"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}>
                  Zakazano! ✨
                </motion.p>
                <motion.p className="font-body text-purple-200 text-sm mt-2"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}>
                  Čeka te teta! 💕
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
