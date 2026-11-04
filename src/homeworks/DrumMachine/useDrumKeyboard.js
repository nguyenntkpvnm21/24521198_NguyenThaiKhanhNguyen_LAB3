import { useEffect } from 'react';

const TEXT_ENTRY_TAGS = ['INPUT', 'TEXTAREA', 'SELECT'];

function isTypingTarget(target) {
  return (
    target instanceof HTMLElement &&
    (TEXT_ENTRY_TAGS.includes(target.tagName) || target.isContentEditable)
  );
}

/**
 * Global drum shortcuts via KeyboardEvent.code (IME-safe).
 * onTriggerPad / onReleasePad must be stable (useCallback) and padMap must be
 * defined outside the component, otherwise the listeners are re-attached on
 * every render.
 *
 * @param {Map<string, {id: string, code: string}>} padMap
 * @param {(padId: string) => void} onTriggerPad
 * @param {boolean} [isEnabled]
 * @param {(padId: string) => void} [onReleasePad]
 */
export function useDrumKeyboard(
  padMap,
  onTriggerPad,
  isEnabled = true,
  onReleasePad,
) {
  useEffect(() => {
    if (!isEnabled) return undefined;

    const onKeyDown = (e) => {
      if (e.repeat) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (isTypingTarget(e.target)) return;
      const pad = padMap.get(e.code);
      if (!pad) return;
      e.preventDefault();
      onTriggerPad(pad.id);
    };

    const onKeyUp = (e) => {
      const pad = padMap.get(e.code);
      if (pad) onReleasePad?.(pad.id);
    };

    const onWindowBlur = () => {
      for (const pad of padMap.values()) {
        onReleasePad?.(pad.id);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onWindowBlur);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onWindowBlur);
    };
  }, [padMap, onTriggerPad, onReleasePad, isEnabled]);
}