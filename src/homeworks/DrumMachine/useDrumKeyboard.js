import { useEffect } from 'react';

const TEXT_ENTRY_TAGS = ['TEXTAREA', 'SELECT'];
const NON_TEXT_INPUT_TYPES = new Set([
  'checkbox',
  'radio',
  'button',
  'submit',
  'reset',
  'range',
  'color',
  'file',
  'image',
]);

function isTypingTarget(target) {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  if (target instanceof HTMLInputElement) {
    return !NON_TEXT_INPUT_TYPES.has(target.type);
  }
  return TEXT_ENTRY_TAGS.includes(target.tagName);
}

function isShortcutBlocked(e) {
  return e.ctrlKey || e.metaKey || e.altKey || isTypingTarget(e.target);
}

/**
 * Global drum shortcuts via KeyboardEvent.code.
 *
 * Vietnamese IMEs (UniKey) inject synthetic events whose e.code is '' (marker
 * chars, Backspaces, re-typed letters) and may swallow the physical keydown.
 * So: synthetic events are ignored, and if a physical keyup arrives without
 * its physical keydown, the hit is recovered from the keyup.
 *
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

    // Physical keys whose keydown reached the page since their last keyup.
    const seenDown = new Set();

    const onKeyDown = (e) => {
      if (!e.code || e.repeat) return;
      seenDown.add(e.code);
      if (isShortcutBlocked(e)) return;
      const pad = padMap.get(e.code);
      if (!pad) return;
      e.preventDefault();
      onTriggerPad(pad.id);
    };

    const onKeyUp = (e) => {
      if (!e.code) return;
      const keydownArrived = seenDown.delete(e.code);
      const pad = padMap.get(e.code);
      if (!pad) return;
      if (!keydownArrived && !isShortcutBlocked(e)) {
        onTriggerPad(pad.id);
      }
      onReleasePad?.(pad.id);
    };

    const onWindowBlur = () => {
      seenDown.clear();
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