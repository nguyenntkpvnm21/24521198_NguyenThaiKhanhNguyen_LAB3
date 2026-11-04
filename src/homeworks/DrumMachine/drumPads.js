/**
 * @typedef {Object} DrumPad
 * @property {string} id
 * @property {string} code
 * @property {string} keyLabel
 * @property {string} label
 */

/** @type {DrumPad[]} */
export const DRUM_PADS = [
  { id: 'crash', code: 'KeyW', keyLabel: 'W', label: 'Crash' },
  { id: 'kick', code: 'KeyA', keyLabel: 'A', label: 'Kick' },
  { id: 'snare', code: 'KeyS', keyLabel: 'S', label: 'Snare' },
  { id: 'clap', code: 'KeyD', keyLabel: 'D', label: 'Clap' },
  { id: 'hihat-closed', code: 'KeyJ', keyLabel: 'J', label: 'Hi-hat closed' },
  { id: 'hihat-open', code: 'KeyK', keyLabel: 'K', label: 'Hi-hat open' },
  { id: 'tom', code: 'KeyL', keyLabel: 'L', label: 'Tom' },
];

/** @type {Map<string, DrumPad>} */
export const PAD_BY_CODE = new Map(DRUM_PADS.map((pad) => [pad.code, pad]));