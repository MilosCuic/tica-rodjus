import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "../../hooks/useWindowSize";
import oldImg from "../../assets/photos/old_as_fuck.jpeg";

const OPTIONS = [
  { id: "A", text: "Previše, moja Slavice 👵" },
  { id: "B", text: "18 🎂" },
  { id: "C", text: "Manje nego Teodora 😏" },
  { id: "D", text: "Premalo za penziju 💼" },
];

export default function Level7_Pitanje({ onNext }) {
  const [selected, setSelected] = useState(null);
  const { width, height } = useWindowSize();

  const handleSelect = (id) => {
    if (selected) return;
    setSelected(id);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 level-transition"
      style={{ paddingTop: 64, paddingBottom: 72 }}>

      {selected && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={300}
          colors={["#ffd700", "#e91e8c", "#a855f7", "#ffffff"]}
        />
      )}

      <motion.p
        className="font-body text-pink-300 text-sm uppercase tracking-widest mb-3 font-semibold"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      >
        ✨ Nivo 7 ✨
      </motion.p>

      <AnimatePresence mode="wait">
        {!selected ? (
          <motion.div
            key="question"
            className="w-full flex flex-col items-center gap-5"
            style={{ maxWidth: "min(580px, 95vw)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Question */}
            <div
              className="card w-full text-center py-7 px-6"
              style={{ border: "1px solid rgba(233,30,140,0.3)", background: "rgba(233,30,140,0.08)" }}
            >
              <p className="font-display text-2xl md:text-3xl font-bold text-white leading-snug">
                Koliko Nina puni godina? 🤔
              </p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-3 w-full">
              {OPTIONS.map((opt) => (
                <motion.button
                  key={opt.id}
                  className="card flex items-center gap-3 text-left"
                  style={{ border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer" }}
                  whileHover={{ scale: 1.03, background: "rgba(233,30,140,0.15)", borderColor: "rgba(233,30,140,0.4)" }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleSelect(opt.id)}
                >
                  <span
                    className="font-display font-bold text-lg w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(233,30,140,0.25)", color: "#ffd700" }}
                  >
                    {opt.id}
                  </span>
                  <span className="font-body text-sm text-purple-100 leading-snug">
                    {opt.text}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            className="flex flex-col items-center gap-5 w-full"
            style={{ maxWidth: "min(580px, 95vw)" }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", bounce: 0.4 }}
          >
            <motion.p
              className="font-display text-2xl font-bold text-gradient text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Sve je tačno! 🎉
            </motion.p>

            <motion.div
              className="rounded-3xl overflow-hidden shadow-2xl"
              style={{
                width: "min(420px, 90vw)",
                border: "3px solid rgba(233,30,140,0.5)",
                boxShadow: "0 0 40px rgba(233,30,140,0.3)",
              }}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", bounce: 0.4, delay: 0.3 }}
            >
              <img
                src={oldImg}
                alt=""
                style={{ width: "100%", display: "block", objectFit: "cover" }}
              />
            </motion.div>

            <motion.button
              className="btn-primary font-body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
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
