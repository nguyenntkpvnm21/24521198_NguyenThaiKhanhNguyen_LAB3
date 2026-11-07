import { memo } from 'react';
import styles from './GrandPiano88.module.css';

/**
 * One piano key. Props are primitives and the two callbacks are stable
 * (useCallback in the parent), so memo can skip re-rendering when
 * this key's own props did not change.
 */
export const PianoKey = memo(function PianoKey({
  midi,
  noteName,
  isBlack,
  isPressed,
  onNoteOn,
  onNoteOff,
}) {
  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) {
      e.preventDefault();
      onNoteOn(midi);
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onNoteOff(midi);
    }
  };

  const colorClass = isBlack ? styles.keyBlack : styles.keyWhite;
  const className = isPressed
    ? `${styles.key} ${colorClass} ${styles.keyPressed}`
    : `${styles.key} ${colorClass}`;

  return (
    <button
      type="button"
      className={className}
      aria-pressed={isPressed}
      onPointerDown={() => onNoteOn(midi)}
      onPointerUp={() => onNoteOff(midi)}
      onPointerLeave={() => onNoteOff(midi)}
      onPointerCancel={() => onNoteOff(midi)}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onBlur={() => onNoteOff(midi)}
    >
      <span className={styles.keyName}>{noteName}</span>
    </button>
  );
});