import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ProgressBar from "./ProgressBar";
import StarsBg from "./StarsBg";

import Level1_Dobrodoslica from "./levels/Level1_Dobrodoslica";
import Level2_UhvatiCeku from "./levels/Level2_Milioner";
import Level3_Memory from "./levels/Level3_Memory";
import Level4_Baloni from "./levels/Level4_Baloni";
import Level5_RiggedSpin from "./levels/Level5_RiggedSpin";
import Level6_Scratch from "./levels/Level6_Scratch";
import Level7_Tockak from "./levels/Level7_Tockak";
import Level8_Puzzle from "./levels/Level8_Puzzle";
import Level9_Typing from "./levels/Level9_Typing";
import Level10_RiggedSpin2 from "./levels/Level10_RiggedSpin2";
import Level6_Seka from "./levels/Level6_Seka";
import Level11_Galerija from "./levels/Level11_Galerija";
import Level12_Finale from "./levels/Level12_Finale";

const LEVELS = [
  Level1_Dobrodoslica,
  Level2_UhvatiCeku,
  Level3_Memory,
  Level4_Baloni,
  Level5_RiggedSpin,
  Level6_Seka,
  Level7_Tockak,
  Level9_Typing,
  Level6_Scratch,
  Level11_Galerija,
  Level12_Finale,
];

export default function GameContainer({ onRestart }) {
  const [level, setLevel] = useState(1);

  const next = () => {
    setLevel((l) => Math.min(l + 1, LEVELS.length));
  };

  const CurrentLevel = LEVELS[level - 1];
  const isLast = level === LEVELS.length;

  return (
    <div className="min-h-screen relative">
      <StarsBg />
      <ProgressBar currentLevel={level} />
      <AnimatePresence mode="wait">
        <motion.div
          key={level}
          className="relative z-10"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
        >
          {isLast ? (
            <CurrentLevel onRestart={onRestart} />
          ) : (
            <CurrentLevel onNext={next} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
