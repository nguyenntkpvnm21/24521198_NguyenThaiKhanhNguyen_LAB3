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

// Telex IME (UniKey) can swallow the physical keydown and inject synthetic
// ones whose e.code is '' and whose e.key is the composed letter. Map those
// letters back to the physical key that produced them.
const COMPOSED_LETTER_TO_CODE = new Map([
  ['đ', 'KeyD'],
  ['â', 'KeyA'],
  ['ă', 'KeyW'],
  ['ư', 'KeyW'],
  ['ơ', 'KeyW'],
]);

function isTypingTarget(target) {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  if (target instanceof HTMLInputElement) {
    return !NON_TEXT_INPUT_TYPES.has(target.type);
  }
  return TEXT_ENTRY_TAGS.includes(target.tagName);
}

function resolveCode(e) {
  if (e.code) return e.code;
  if (typeof e.key !== 'string' || e.key.length !== 1) return '';
  const letter = e.key.toLowerCase();
  return COMPOSED_LETTER_TO_CODE.get(letter) ?? `Key${letter.toUpperCase()}`;
}

/**
 * Global drum shortcuts via KeyboardEvent.code, with a fallback to e.key when
 * a Vietnamese IME (UniKey) sends synthetic events with an empty e.code.
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
      const pad = padMap.get(resolveCode(e));
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