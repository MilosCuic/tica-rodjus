import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import seka1 from "../../assets/photos/seka1.jpeg";
import seka2 from "../../assets/photos/seka2.jpeg";
import seka3 from "../../assets/photos/seka3.jpeg";

const HEARTS = ["❤️", "💕", "💖", "💗", "💓", "💝", "🩷", "💞"];

function FloatingHearts() {
  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {HEARTS.map((h, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${8 + i * 12}%`,
            bottom: -40,
            fontSize: `${1.5 + Math.random()}rem`,
          }}
          initial={{ y: 0, opacity: 1, rotate: Math.random() * 20 - 10 }}
          animate={{ y: "-110vh", opacity: [1, 1, 0], rotate: Math.random() * 40 - 20 }}
          transition={{ duration: 2.5 + Math.random(), delay: i * 0.12, ease: "easeOut" }}
        >
          {h}
        </motion.div>
      ))}
    </div>
  );
}

function PhotoFrame({ src, fallbackEmoji, alt }) {
  return (
    <motion.div
      className="rounded-3xl overflow-hidden shadow-2xl"
      style={{
        width: "min(320px, 85vw)",
        height: "min(360px, 55vh)",
        border: "3px solid rgba(233,30,140,0.5)",
        boxShadow: "0 0 40px rgba(233,30,140,0.25)",
        background: src ? "transparent" : "linear-gradient(135deg, #2d1155, #3d0a2d)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      initial={{ opacity: 0, scale: 0.85, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", bounce: 0.4, duration: 0.5 }}
    >
      {src ? (
        <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      ) : (
        <span style={{ fontSize: "5rem" }}>{fallbackEmoji}</span>
      )}
    </motion.div>
  );
}

export default function Level6_Seka({ onNext }) {
  const [stage, setStage] = useState("punch"); // punch | kissPrompt | kiss | done
  const [punching, setPunching] = useState(false);
  const [showHearts, setShowHearts] = useState(false);

  const handlePunch = () => {
    if (punching) return;
    setPunching(true);
    setTimeout(() => {
      setPunching(false);
      setStage("kissPrompt");
    }, 900);
  };

  const handleKiss = () => {
    setShowHearts(true);
    setTimeout(() => setStage("done"), 400);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 level-transition"
      style={{ paddingTop: 64, paddingBottom: 72, gap: 24 }}
    >
      {showHearts && <FloatingHearts />}

      <motion.p
        className="font-body text-pink-300 text-sm uppercase tracking-widest font-semibold"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      >
        ✨ Nivo 6 ✨
      </motion.p>

      <AnimatePresence mode="wait">

        {/* STAGE 1: Udari seku */}
        {stage === "punch" && (
          <motion.div
            key="punch"
            className="flex flex-col items-center gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.35 }}
          >
            <motion.h2
              className="font-display text-3xl md:text-4xl font-bold text-gradient text-center"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
            >
              Udari seku jednom! 👊
            </motion.h2>

            <PhotoFrame src={seka1} fallbackEmoji="👩" alt="Seka" />

            {/* Boxing glove button */}
            <motion.button
              onClick={handlePunch}
              disabled={punching}
              className="relative flex items-center justify-center"
              style={{
                width: 100, height: 100,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #e91e8c, #a855f7)",
                boxShadow: "0 0 30px #e91e8c88",
                fontSize: "3rem",
                border: "none",
                cursor: punching ? "default" : "pointer",
              }}
              whileHover={!punching ? { scale: 1.1 } : {}}
              whileTap={!punching ? { scale: 0.88 } : {}}
              animate={punching ? {
                x: [0, 60, -10, 0],
                rotate: [0, -15, 5, 0],
                scale: [1, 1.3, 0.95, 1],
              } : {}}
              transition={punching ? { duration: 0.5, ease: "easeInOut" } : {}}
            >
              🥊
              {punching && (
                <motion.span
                  className="absolute"
                  style={{ fontSize: "2rem", top: -10, right: -10 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  💥
                </motion.span>
              )}
            </motion.button>

            <p className="font-body text-purple-400 text-sm">Tapni rukavicu!</p>
          </motion.div>
        )}

        {/* STAGE 2: Seka2 + Poljubi seku */}
        {stage === "kissPrompt" && (
          <motion.div
            key="kissPrompt"
            className="flex flex-col items-center gap-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", bounce: 0.3 }}
          >
            <motion.h2
              className="font-display text-3xl md:text-4xl font-bold text-gradient text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Auuu! 😲
            </motion.h2>

            <PhotoFrame src={seka2} fallbackEmoji="😲" alt="Seka reakcija" />

            <motion.button
              onClick={handleKiss}
              className="btn-primary font-body text-xl flex items-center gap-3"
              style={{ padding: "14px 32px", fontSize: "1.2rem" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, type: "spring" }}
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.95 }}
            >
              💋 Poljubi seku!
            </motion.button>
          </motion.div>
        )}

        {/* STAGE 3: Seka3 + srca + dalje */}
        {stage === "done" && (
          <motion.div
            key="done"
            className="flex flex-col items-center gap-6"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.5 }}
          >
            <motion.h2
              className="font-display text-3xl md:text-4xl font-bold text-gradient text-center"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            >
              Volimo te Tijana! 💕
            </motion.h2>

            <PhotoFrame src={seka3} fallbackEmoji="🥰" alt="Seka srećna" />

            <motion.button
              className="btn-primary font-body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={onNext}
            >
              Sledeći Nivo →
            </motion.button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
