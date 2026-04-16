import { motion } from "framer-motion";

const TOTAL_LEVELS = 11;

export default function ProgressBar({ currentLevel }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center gap-3"
      style={{ background: "rgba(26,5,51,0.85)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      <span className="font-body text-xs text-pink-300 whitespace-nowrap font-semibold">
        Nivo {currentLevel}/{TOTAL_LEVELS}
      </span>
      <div className="flex gap-1.5 flex-1">
        {Array.from({ length: TOTAL_LEVELS }, (_, i) => {
          const levelNum = i + 1;
          const isDone = levelNum < currentLevel;
          const isActive = levelNum === currentLevel;
          return (
            <motion.div
              key={i}
              className="h-2 rounded-full flex-1"
              animate={{
                backgroundColor: isDone ? "#e91e8c" : isActive ? "#ffd700" : "rgba(255,255,255,0.15)",
                boxShadow: isActive ? "0 0 8px #ffd700" : isDone ? "0 0 4px #e91e8c66" : "none",
              }}
              transition={{ duration: 0.4, delay: i * 0.03 }}
            />
          );
        })}
      </div>
      <span className="text-xs text-yellow-300 font-bold font-body whitespace-nowrap">
        🎂 Nina!
      </span>
    </div>
  );
}
