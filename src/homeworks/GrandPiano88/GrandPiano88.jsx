import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { PianoKey } from './PianoKey.jsx';
import { PolyphonicSynth } from './PolyphonicSynth.js';
import { PIANO_NOTES } from './pianoKeys.js';
import styles from './GrandPiano88.module.css';

const NOTE_BY_MIDI = new Map(PIANO_NOTES.map((note) => [note.midi, note]));

export function GrandPiano88() {
  const headingId = useId();
  const synthRef = useRef(null);
  const [pressedMidis, setPressedMidis] = useState(() => new Set());

  useEffect(() => {
    const synth = new PolyphonicSynth();
    synthRef.current = synth;
    return () => {
      synth.dispose();
      synthRef.current = null;
    };
  }, []);

  // Stable callbacks (empty deps): they read the synth from a ref and update
  // state with the functional form, so React.memo on PianoKey can skip renders.
  const handleNoteOn = useCallback((midi) => {
    const note = NOTE_BY_MIDI.get(midi);
    const synth = synthRef.current;
    if (!note || !synth) return;
    const { started, stolenMidi } = synth.noteOn(midi, note.freqHz);
    if (!started) return;
    setPressedMidis((prev) => {
      const next = new Set(prev);
      next.add(midi);
      if (stolenMidi !== null) next.delete(stolenMidi);
      return next;
    });
  }, []);

  const handleNoteOff = useCallback((midi) => {
    const synth = synthRef.current;
    if (!synth || !synth.noteOff(midi)) return;
    setPressedMidis((prev) => {
      if (!prev.has(midi)) return prev;
      const next = new Set(prev);
      next.delete(midi);
      return next;
    });
  }, []);

  return (
    <section className={styles.grandPiano} aria-labelledby={headingId}>
      <h2 id={headingId}>88-Key Grand Piano</h2>
      <ul className={styles.keyboard} aria-label="Piano keys">
        {PIANO_NOTES.map((note) => (
          <li
            key={note.midi}
            className={`${styles.keyItem} ${note.isBlack ? styles.blackItem : styles.whiteItem}`}
          >
            <PianoKey
              midi={note.midi}
              noteName={note.noteName}
              isBlack={note.isBlack}
              isPressed={pressedMidis.has(note.midi)}
              onNoteOn={handleNoteOn}
              onNoteOff={handleNoteOff}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}