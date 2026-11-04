import styles from './DrumMachine.module.css';

/**
 * @param {{
 *   pad: { id: string, keyLabel: string, label: string },
 *   isActive: boolean,
 *   onPress: (padId: string) => void,
 *   onRelease: (padId: string) => void,
 * }} props
 */
export function DrumPad({ pad, isActive, onPress, onRelease }) {
  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) {
      e.preventDefault();
      onPress(pad.id);
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onRelease(pad.id);
    }
  };

  return (
    <button
      type="button"
      className={isActive ? `${styles.pad} ${styles.padActive}` : styles.pad}
      aria-pressed={isActive}
      aria-keyshortcuts={pad.keyLabel}
      onPointerDown={() => onPress(pad.id)}
      onPointerUp={() => onRelease(pad.id)}
      onPointerLeave={() => onRelease(pad.id)}
      onPointerCancel={() => onRelease(pad.id)}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onBlur={() => onRelease(pad.id)}
    >
      <span className={styles.padKey}>{pad.keyLabel}</span>
      <span className={styles.padName}>{pad.label}</span>
    </button>
  );
}