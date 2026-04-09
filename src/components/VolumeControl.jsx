import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function VolumeControl({ audioRef }) {
  const [volume, setVolume] = useState(50);
  const [muted, setMuted] = useState(false);
  const [showSlider, setShowSlider] = useState(false);

  useEffect(() => {
    if (audioRef?.current) {
      audioRef.current.volume = muted ? 0 : volume / 100;
    }
  }, [volume, muted, audioRef]);

  const toggleMute = () => {
    setMuted((prev) => !prev);
  };

  const handleVolumeChange = (e) => {
    const newVol = parseInt(e.target.value, 10);
    setVolume(newVol);
    if (newVol > 0 && muted) setMuted(false);
  };

  return (
    <motion.div
      className="fixed top-16 left-4 z-50 flex items-center gap-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      onMouseEnter={() => setShowSlider(true)}
      onMouseLeave={() => setShowSlider(false)}
    >
      {/* Mute/Unmute button */}
      <motion.button
        onClick={toggleMute}
        className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
        style={{
          background: "rgba(168,85,247,0.2)",
          border: "1px solid rgba(168,85,247,0.4)",
          backdropFilter: "blur(8px)",
        }}
        whileHover={{ scale: 1.1, background: "rgba(168,85,247,0.3)" }}
        whileTap={{ scale: 0.95 }}
      >
        <span style={{ fontSize: "1.2rem" }}>
          {muted ? "🔇" : volume > 50 ? "🔊" : volume > 0 ? "🔉" : "🔈"}
        </span>
      </motion.button>

      {/* Volume slider */}
      <AnimatePresence>
        {showSlider && (
          <motion.div
            className="flex items-center gap-2 px-3 py-2 rounded-full"
            style={{
              background: "rgba(26,5,51,0.85)",
              border: "1px solid rgba(168,85,247,0.3)",
              backdropFilter: "blur(8px)",
            }}
            initial={{ opacity: 0, x: -10, width: 0 }}
            animate={{ opacity: 1, x: 0, width: "auto" }}
            exit={{ opacity: 0, x: -10, width: 0 }}
            transition={{ duration: 0.2 }}
          >
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
              style={{
                width: 100,
                height: 4,
                background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${volume}%, rgba(255,255,255,0.2) ${volume}%, rgba(255,255,255,0.2) 100%)`,
                borderRadius: 2,
                outline: "none",
                cursor: "pointer",
                WebkitAppearance: "none",
              }}
            />
            <span
              className="font-body text-xs text-purple-300 font-semibold"
              style={{ minWidth: 28, textAlign: "right" }}
            >
              {volume}%
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #a855f7;
          cursor: pointer;
          box-shadow: 0 0 8px rgba(168,85,247,0.6);
        }
        .volume-slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #a855f7;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 8px rgba(168,85,247,0.6);
        }
      `}</style>
    </motion.div>
  );
}
