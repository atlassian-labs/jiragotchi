// 👀 This is the demo file — the storage calls live in usePet.js.
//
// PetPanel is intentionally tiny: it composes three hooks and a view.
// All the React state, animation timeouts, and CSS classes are tucked
// behind those helpers so we can focus on the storage story.

import React from 'react';
import { usePet } from '../pet/usePet.js';
import { useFeedAnimation } from '../pet/useFeedAnimation.js';
import PetView from '../pet/PetView.jsx';

export default function PetPanel() {
  const { pet, loading, error, feed } = usePet();
  const animation = useFeedAnimation();

  const handleFeed = () => {
    animation.trigger();
    feed();
  };

  return (
    <>
      {error && <div className="container compact"><div className="error">⚠️ {error}</div></div>}
      <PetView
        pet={pet}
        loading={loading}
        animation={animation}
        onFeed={handleFeed}
      />
    </>
  );
}
