import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LandingPage from "./components/LandingPage";
import GameContainer from "./components/GameContainer";
import bgMusic from "./assets/music/MALI PARADAJZ - SRECAN RODJENDAN  LIGU LIGU  Decije pesme  Pesmice za decu  Rodjendanska pesma.mp3";

export default function App() {
  const [started, setStarted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current && started) {
      audioRef.current.play().catch(() => {});
    }
  }, [started]);

  return (
    <div className="min-h-screen">
      <audio ref={audioRef} src={bgMusic} loop preload="auto" />
      <AnimatePresence mode="wait">
        {!started ? (
          <motion.div
            key="landing"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.4 }}
          >
            <LandingPage onStart={() => setStarted(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <GameContainer onRestart={() => setStarted(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
