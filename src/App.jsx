import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LandingPage from "./components/LandingPage";
import GameContainer from "./components/GameContainer";
import VolumeControl from "./components/VolumeControl";
import bgMusic from "./assets/music/MALI PARADAJZ - SRECAN RODJENDAN  LIGU LIGU  Decije pesme  Pesmice za decu  Rodjendanska pesma.mp3";

export default function App() {
  const [started, setStarted] = useState(false);
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const gainNodeRef = useRef(null);

  const handleStart = async () => {
    setStarted(true);
    
    // Kreiraj Web Audio API context
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();
    audioContextRef.current = audioCtx;

    // Fetch i dekoduj audio
    const response = await fetch(bgMusic);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

    // Kreiraj source i gain node
    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.loop = true;

    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.1; // Početna jačina 10%

    source.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    sourceRef.current = source;
    gainNodeRef.current = gainNode;

    source.start(0);
  };

  return (
    <div className="min-h-screen">
      {started && <VolumeControl gainNodeRef={gainNodeRef} />}
      <AnimatePresence mode="wait">
        {!started ? (
          <motion.div
            key="landing"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.4 }}
          >
            <LandingPage onStart={handleStart} />
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
