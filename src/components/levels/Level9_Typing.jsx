import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TYPING_TEXT } from "../../data/gameData";

export default function Level9_Typing({ onNext }) {
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const inputRef = useRef(null);

  const target = TYPING_TEXT;

  const handleChange = (e) => {
    const val = e.target.value;
    if (!started && val.length === 1) {
      setStarted(true);
      setStartTime(Date.now());
    }
    if (val.length <= target.length) {
      setInput(val);
    }
    if (val === target) {
      const elapsed = (Date.now() - startTime) / 1000 / 60;
      const words = target.split(" ").length;
      setWpm(Math.round(words / elapsed));
      let correct = 0;
      for (let i = 0; i < val.length; i++) {
        if (val[i] === target[i]) correct++;
      }
      setAccuracy(Math.round((correct / target.length) * 100));
    }
  };

  const handlePaste = (e) => e.preventDefault();

  const done = input === target;

  const reset = () => {
    setInput("");
    setStarted(false);
    setStartTime(null);
    setWpm(null);
    setAccuracy(null);
    inputRef.current?.focus();
  };

  const getGrade = () => {
    if (wpm >= 60) return { emoji: "⚡", text: "Munja si! WPM rekorder!" };
    if (wpm >= 40) return { emoji: "🚀", text: "Odlično! Brze prste imaš!" };
    if (wpm >= 20) return { emoji: "👍", text: "Solidno! Vežbaj još malo!" };
    return { emoji: "🐢", text: "Polako, ali sigurno! 😄" };
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-24 level-transition">
      <motion.h2
        className="font-display text-4xl font-bold text-gradient mb-2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Brzo Pisanje ⌨️
      </motion.h2>
      <p className="font-body text-purple-300 mb-8 text-center">
        Ukucaj poruku što brže možeš!
      </p>

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div
            key="typing"
            className="w-full max-w-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Target text */}
            <div
              className="card mb-6 p-6 font-body text-xl leading-relaxed tracking-wide"
              style={{ fontSize: "1.2rem", letterSpacing: "0.02em" }}
            >
              {target.split("").map((char, i) => {
                let color = "rgba(255,255,255,0.3)";
                if (i < input.length) {
                  color = input[i] === char ? "#22c55e" : "#ef4444";
                } else if (i === input.length) {
                  color = "#ffd700";
                }
                return (
                  <span
                    key={i}
                    style={{
                      color,
                      textDecoration: i === input.length ? "underline" : "none",
                      transition: "color 0.1s",
                    }}
                  >
                    {char}
                  </span>
                );
              })}
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="font-body text-xs text-purple-300">Napredak</span>
                <span className="font-body text-xs text-yellow-300 font-bold">
                  {Math.round((input.length / target.length) * 100)}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(to right, #e91e8c, #a855f7)" }}
                  animate={{ width: `${(input.length / target.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Lock indicator */}
            {input.length > 0 && (
              <motion.p
                className="font-body text-xs text-center mb-2"
                style={{ color: "rgba(255,255,255,0.3)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                🔒 Dugme se otključava tek kad je sve zeleno
              </motion.p>
            )}

            {/* Input */}
            <textarea
              ref={inputRef}
              autoFocus
              className="w-full font-body text-lg p-4 rounded-2xl outline-none resize-none"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(233,30,140,0.3)",
                color: "white",
                caretColor: "#ffd700",
              }}
              rows={3}
              value={input}
              onChange={handleChange}
              onPaste={handlePaste}
              placeholder="Počni da kucaš ovde..."
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />
          </motion.div>
        ) : (
          <motion.div
            key="done"
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", bounce: 0.4 }}
          >
            <div className="text-8xl mb-4">{getGrade().emoji}</div>
            <h3 className="font-display text-3xl font-bold text-gradient mb-2">Gotovo!</h3>
            <div className="flex gap-6 justify-center mb-4">
              <div className="text-center">
                <p className="font-display text-4xl font-bold text-yellow-300">{wpm}</p>
                <p className="font-body text-purple-300 text-sm">WPM</p>
              </div>
              <div className="text-center">
                <p className="font-display text-4xl font-bold text-green-400">{accuracy}%</p>
                <p className="font-body text-purple-300 text-sm">Tačnost</p>
              </div>
            </div>
            <p className="font-body text-purple-200 mb-8">{getGrade().text}</p>
            <div className="flex gap-4 justify-center">
              <button
                className="font-body px-6 py-3 rounded-full border border-pink-500/40 text-pink-300 hover:bg-pink-500/10 transition-all"
                onClick={reset}
              >
                Ponovi 🔄
              </button>
              <button className="btn-primary font-body" onClick={onNext}>
                Dalje →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
