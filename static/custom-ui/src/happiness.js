// Mirror of src/shared/happiness.js — duplicated here because Custom UI
// can't import from outside its bundle.

export const FEED_AMOUNT = 10;
export const MAX_HAPPINESS = 100;
export const MIN_HAPPINESS = 0;
export const INITIAL_HAPPINESS = 50;

export function happinessToEmoji(happiness) {
  if (happiness <= 20) return '😴';
  if (happiness <= 40) return '😢';
  if (happiness <= 60) return '😐';
  if (happiness <= 80) return '🙂';
  if (happiness < 100) return '😄';
  return '🥰';
}

export function happinessToLabel(happiness) {
  if (happiness <= 20) return 'Neglected';
  if (happiness <= 40) return 'Sad';
  if (happiness <= 60) return 'Meh';
  if (happiness <= 80) return 'Content';
  if (happiness < 100) return 'Happy';
  return 'Overjoyed!';
}
