import { motion } from "framer-motion";
import StarsBg from "./StarsBg";
import photo1 from "../assets/photos/landing1.jpeg";
import photo2 from "../assets/photos/landing2.jpeg";
import photo3 from "../assets/photos/landing3.jpeg";

const PHOTOS = [
  { id: 1, src: photo1 },
  { id: 2, src: photo2 },
  { id: 3, src: photo3 },
];

export default function LandingPage({ onStart }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4">
      <StarsBg />

      <div className="relative z-10 flex flex-col items-center text-center gap-8 py-20">
        {/* Photos row */}
        <motion.div
          className="flex gap-4 mb-2"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {PHOTOS.map((p, i) => (
            <motion.div
              key={p.id}
              className="rounded-2xl overflow-hidden shadow-2xl"
              style={{
                width: i === 1 ? 200 : 160,
                height: i === 1 ? 260 : 210,
                border: "2px solid rgba(233,30,140,0.4)",
                flexShrink: 0,
              }}
              animate={{ y: [0, i % 2 === 0 ? -8 : 8, 0] }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <img
                src={p.src}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Title */}
        <div>
          <motion.p
            className="text-pink-300 font-body font-semibold text-sm tracking-[0.3em] uppercase mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            ✨ Srećan Rodjendan ✨
          </motion.p>
          <motion.h1
            className="font-display font-black leading-none mb-2"
            style={{ fontSize: "clamp(3rem, 10vw, 6rem)" }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3, type: "spring", bounce: 0.4 }}
          >
            <span className="text-gradient">Nina</span>
          </motion.h1>
          <motion.div
            className="flex items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="h-px flex-1 max-w-16" style={{ background: "linear-gradient(to right, transparent, #e91e8c)" }} />
            <span className="text-yellow-300 font-display text-2xl font-bold">18 godina</span>
            <div className="h-px flex-1 max-w-16" style={{ background: "linear-gradient(to left, transparent, #e91e8c)" }} />
          </motion.div>
        </div>

        {/* Subtitle */}

        {/* CTA Button */}
        <motion.button
          className="btn-primary font-body text-xl mt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, type: "spring" }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
          onClick={onStart}
        >
          🎮 Kreni Igru →
        </motion.button>

        {/* Emoji strip */}
        <motion.div
          className="flex gap-4 text-3xl mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          {["🎂", "🎉", "💕", "🌸", "✨", "🎊", "👑", "🦋"].map((e, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
            >
              {e}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
