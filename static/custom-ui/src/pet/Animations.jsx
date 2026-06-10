import React, { useEffect } from 'react';

// "+10 ❤️" floater. Drifts up and fades out over 1.4s.
export const FloatingPlus = ({ id, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 1400);
    return () => clearTimeout(t);
  }, [onDone]);
  const offset = (id % 5 - 2) * 24;
  return (
    <span className="floating-plus" style={{ '--offset': `${offset}px` }}>
      +10 ❤️
    </span>
  );
};

// Burst of hearts on feed. Five emojis with staggered animation delays.
export const Hearts = ({ visible }) => {
  if (!visible) return null;
  const hearts = ['💖', '💕', '✨', '🌟', '💞'];
  return (
    <div className="hearts">
      {hearts.map((h, i) => (
        <span key={i} className="heart" style={{ animationDelay: `${i * 80}ms` }}>
          {h}
        </span>
      ))}
    </div>
  );
};
