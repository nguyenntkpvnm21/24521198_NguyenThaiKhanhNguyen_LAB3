/** @typedef {{ midi: number, noteName: string, isBlack: boolean, freqHz: number }} Note */

export const MIDI_MIN = 21; // A0
export const MIDI_MAX = 108; // C8

const PITCH_CLASS_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const BLACK_PITCH_CLASSES = new Set([1, 3, 6, 8, 10]);

/** Equal temperament, A4 (MIDI 69) = 440 Hz. */
export function midiToFrequency(midi) {
  return 440 * 2 ** ((midi - 69) / 12);
}

export function midiToNoteName(midi) {
  const octave = Math.floor(midi / 12) - 1;
  return `${PITCH_CLASS_NAMES[midi % 12]}${octave}`;
}

export function isBlackKey(midi) {
  return BLACK_PITCH_CLASSES.has(midi % 12);
}

/** @returns {Note} */
function createNote(midi) {
  return {
    midi,
    noteName: midiToNoteName(midi),
    isBlack: isBlackKey(midi),
    freqHz: midiToFrequency(midi),
  };
}

/** All 88 keys, A0 (21) to C8 (108), generated once at module load. */
export const PIANO_NOTES = Array.from(
  { length: MIDI_MAX - MIDI_MIN + 1 },
  (_, i) => createNote(MIDI_MIN + i),
);