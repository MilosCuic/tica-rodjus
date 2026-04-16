import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import f1 from "../../assets/photos/final_1.jpeg";
import f2 from "../../assets/photos/final_2.jpeg";
import f3 from "../../assets/photos/final_3.jpeg";
import f4 from "../../assets/photos/final_4.jpeg";
import f5 from "../../assets/photos/final_5.jpeg";
import f6 from "../../assets/photos/final_6.jpeg";
import f7 from "../../assets/photos/final_7.jpeg";
import f8 from "../../assets/photos/final_8.jpeg";
import f9 from "../../assets/photos/final_9.jpeg";
import f10 from "../../assets/photos/final_10.jpeg";
import f11 from "../../assets/photos/final_11.jpeg";
import f12 from "../../assets/photos/final_12.jpeg";

const PHOTOS = [
  { src: f1, caption: "Budeš najbolji lash and lift artist 💅" },
  { src: f2, caption: "Putuješ na egzotična mesta 🌴" },
  { src: f3, caption: "Uvek praviš čiz 📸" },
  { src: f4, caption: "Lepo ručaš 🍽️" },
  { src: f5, caption: "Uvek budeš u udobnoj obući 👟" },
  { src: f6, caption: "Se lepo naspavaš 😴" },
  { src: f7, caption: "Uvek dobiješ termin kod tete 💇‍♀️" },
  { src: f8, caption: "Ti uvek bude toplo 🔥" },
  { src: f9, caption: "Pomažeš babi 👵" },
  { src: f10, caption: "I naravno dedi 👴" },
  { src: f11, caption: "Putuješ samo prvom klasom ✈️" },
  { src: f12, caption: "I uživaš u svakom danu!!!! 🌟✨" },
];

export default function Level11_Galerija({ onNext }) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const touchStartX = useRef(null);

  const goTo = (idx) => {
    if (idx === active) return;
    setDirection(idx > active ? 1 : -1);
    setActive(idx);
  };

  const prev = () => active > 0 && goTo(active - 1);
  const next = () => active < PHOTOS.length - 1 && goTo(active + 1);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  const photo = PHOTOS[active];
  const isLast = active === PHOTOS.length - 1;

  return (
    <div
      className="flex flex-col level-transition"
      style={{ height: "100vh", paddingTop: 50 }}
    >
      {/* "Zelimo ti da" header */}
      <motion.div
        className="text-center px-4 flex-shrink-0"
        style={{ paddingTop: 4, paddingBottom: 4 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="font-display text-2xl font-bold text-gradient">
          Želimo ti da...
        </h2>
      </motion.div>

      {/* Full-screen photo */}
      <div
        className="relative flex-1 overflow-hidden"
        style={{ minHeight: 0 }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={active}
            custom={direction}
            className="absolute inset-0"
            variants={{
              enter: (d) => ({ x: d * 80, opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (d) => ({ x: -d * 80, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            {photo.src ? (
              <div className="w-full h-full flex items-center justify-center" style={{ background: "#0d0620" }}>
                <img
                  src={photo.src}
                  alt=""
                  style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }}
                />
              </div>
            ) : (
              /* Placeholder dok nema slika */
              <div
                className="w-full h-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${
                    ["#2d1155","#1a0a3d","#3d0a2d","#0a2d3d","#1a3d0a",
                     "#3d2d0a","#2d0a3d","#0a3d1a","#3d1a0a","#0a1a3d","#1a0533"][active]
                  }, #1a0533)`,
                }}
              >
                <span style={{ fontSize: "6rem" }}>
                  {["💪","🌴","🌟","🍽️","🥂","😴","💇‍♀️","😭","🤗","😄","🏊‍♀️"][active]}
                </span>
              </div>
            )}

            {/* Caption overlay at bottom */}
            <div
              className="absolute bottom-0 left-0 right-0 px-6 py-5"
              style={{
                background: "linear-gradient(to top, rgba(26,5,51,0.95) 0%, rgba(26,5,51,0.6) 60%, transparent 100%)",
              }}
            >
              <motion.p
                className="font-display font-bold text-white text-center leading-snug"
                style={{ fontSize: "clamp(1.1rem, 4vw, 1.6rem)" }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                key={active}
              >
                {photo.caption}
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <div
        className="flex-shrink-0 flex flex-col items-center gap-1 px-4"
        style={{ paddingTop: 6, paddingBottom: 8, background: "rgba(26,5,51,0.95)", borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Arrow nav + dots */}
        <div className="flex items-center gap-3">
          <button
            onClick={prev}
            disabled={active === 0}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all font-bold"
            style={{
              background: active === 0 ? "rgba(255,255,255,0.04)" : "rgba(233,30,140,0.2)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: active === 0 ? "rgba(255,255,255,0.2)" : "#e91e8c",
              cursor: active === 0 ? "not-allowed" : "pointer",
            }}
          >
            ←
          </button>

          {/* Dots */}
          <div className="flex gap-1.5 flex-wrap justify-center" style={{ maxWidth: 260 }}>
            {PHOTOS.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="rounded-full transition-all"
                style={{
                  width: i === active ? 20 : 7,
                  height: 7,
                  background: i === active ? "#e91e8c" : i < active ? "rgba(233,30,140,0.4)" : "rgba(255,255,255,0.2)",
                }}
              />
            ))}
          </div>

          <button
            onClick={next}
            disabled={isLast}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all font-bold"
            style={{
              background: isLast ? "rgba(255,255,255,0.04)" : "rgba(233,30,140,0.2)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: isLast ? "rgba(255,255,255,0.2)" : "#e91e8c",
              cursor: isLast ? "not-allowed" : "pointer",
            }}
          >
            →
          </button>
        </div>

        <p className="font-body text-purple-400 text-xs">
          {active + 1} / {PHOTOS.length}
        </p>

        <AnimatePresence>
          {isLast && (
            <motion.button
              className="btn-primary font-body"
              style={{ padding: "10px 28px" }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring" }}
              onClick={onNext}
            >
              Finale! 🎊
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
