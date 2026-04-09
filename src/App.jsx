import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LandingPage from "./components/LandingPage";
import GameContainer from "./components/GameContainer";

export default function App() {
  const [started, setStarted] = useState(false);

  return (
    <div className="min-h-screen">
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
