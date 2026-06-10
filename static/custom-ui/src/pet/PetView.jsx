import React from 'react';
import { happinessToEmoji, happinessToLabel } from '../happiness.js';
import { FloatingPlus, Hearts } from './Animations.jsx';

// Pure presentation. Given a pet + animation state, render the panel.
// No data fetching, no event handlers (beyond the feed button click).

export default function PetView({ pet, loading, animation, onFeed }) {
  const emoji = loading ? '🥚' : happinessToEmoji(pet.happiness);
  const label = loading ? 'Hatching…' : happinessToLabel(pet.happiness);
  const moodClass = pet.happiness <= 20 ? 'mood-sad'
                  : pet.happiness >= 80 ? 'mood-happy'
                  : 'mood-neutral';

  return (
    <div className={`container compact ${moodClass}`}>
      <div className="pet-pane compact">
        <div className="stage compact">
          <Hearts visible={animation.hearts} />
          <div className="emoji-wrap">
            <span className={`emoji compact ${animation.bouncing ? 'bouncing' : 'idle'}`}>
              {emoji}
            </span>
            {animation.floaters.map((id) => (
              <FloatingPlus key={id} id={id} onDone={() => animation.removeFloater(id)} />
            ))}
          </div>
        </div>

        <div className="mood-label compact">{label}</div>
        <div className="bar compact">
          <div className="bar-fill" style={{ width: `${pet.happiness}%` }} />
        </div>
        <p className="happy-num compact">{pet.happiness} <span className="muted">/ 100</span></p>

        <button className="feed compact" onClick={onFeed}>🍖 Feed pet</button>
      </div>
    </div>
  );
}
