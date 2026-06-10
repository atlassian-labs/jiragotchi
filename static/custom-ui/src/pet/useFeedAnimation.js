import { useState, useRef } from 'react';

// Owns all the visual feedback state for a "feed" action:
// - emoji bounce (~600ms)
// - hearts shower (~1400ms)
// - floating "+10 ❤️" indicators (multiple in flight if user spam-clicks)
//
// Exposes one trigger() call. The PetPanel never has to think about timeouts
// or which animation runs how long — that's all encapsulated here.

export function useFeedAnimation() {
  const [bouncing, setBouncing] = useState(false);
  const [hearts, setHearts] = useState(false);
  const [floaters, setFloaters] = useState([]);
  const counter = useRef(0);

  const trigger = () => {
    const id = ++counter.current;
    setFloaters((f) => [...f, id]);
    setBouncing(true);
    setHearts(true);
    setTimeout(() => setBouncing(false), 600);
    setTimeout(() => setHearts(false), 1400);
  };

  const removeFloater = (id) =>
    setFloaters((f) => f.filter((x) => x !== id));

  return { bouncing, hearts, floaters, trigger, removeFloater };
}
