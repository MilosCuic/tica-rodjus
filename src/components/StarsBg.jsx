import { useMemo } from "react";

export default function StarsBg() {
  const stars = useMemo(() =>
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 2.5 + 1,
      duration: `${Math.random() * 3 + 2}s`,
      delay: `${Math.random() * 4}s`,
    })), []);

  const balloons = useMemo(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      left: `${10 + i * 15}%`,
      duration: `${6 + Math.random() * 4}s`,
      delay: `${Math.random() * 5}s`,
      size: `${1.5 + Math.random()}rem`,
      emoji: ["🎈", "🎉", "🎊", "💕", "🌸", "✨"][i],
    })), []);

  return (
    <div className="stars-bg">
      {stars.map((s) => (
        <div
          key={s.id}
          className="star"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            "--duration": s.duration,
            "--delay": s.delay,
          }}
        />
      ))}
      {balloons.map((b) => (
        <div
          key={b.id}
          className="balloon"
          style={{
            left: b.left,
            "--duration": b.duration,
            "--delay": b.delay,
            "--size": b.size,
          }}
        >
          {b.emoji}
        </div>
      ))}
    </div>
  );
}
