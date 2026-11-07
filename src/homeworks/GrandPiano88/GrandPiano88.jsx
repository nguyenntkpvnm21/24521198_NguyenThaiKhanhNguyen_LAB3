import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { NoteQueue } from './NoteQueue.js';
import { PianoKey } from './PianoKey.jsx';
import { PolyphonicSynth } from './PolyphonicSynth.js';
import { PIANO_NOTES } from './pianoKeys.js';
import styles from './GrandPiano88.module.css';

const NOTE_BY_MIDI = new Map(PIANO_NOTES.map((note) => [note.midi, note]));

/*
 * Recorder state lives in a ref, not in React state: it changes on every note
 * and never affects what is rendered. Notes are enqueued in FIFO order.
 */
function createRecorder() {
  return { queue: new NoteQueue(), lastStartAt: null, open: new Map() };
}

function recordNoteStart(recorder, midi, freqHz, now) {
  const deltaMs =
    recorder.lastStartAt === null ? 0 : Math.round(now - recorder.lastStartAt);
  const event = { midi, freqHz, durationMs: 0, deltaMs };
  recorder.lastStartAt = now;
  recorder.queue.enqueue(event);
  recorder.open.set(midi, { event, startedAt: now });
}

function recordNoteEnd(recorder, midi, now) {
  const entry = recorder.open.get(midi);
  if (!entry) return;
  entry.event.durationMs = Math.round(now - entry.startedAt);
  recorder.open.delete(midi);
}

function closeOpenNotes(recorder, now) {
  for (const midi of [...recorder.open.keys()]) {
    recordNoteEnd(recorder, midi, now);
  }
}

export function GrandPiano88() {
  const headingId = useId();
  const sequencerId = useId();
  const synthRef = useRef(null);
  const recorderRef = useRef(null);
  const [pressedMidis, setPressedMidis] = useState(() => new Set());
  const [mode, setMode] = useState('IDLE');
  const [recording, setRecording] = useState([]);

  useEffect(() => {
    const synth = new PolyphonicSynth();
    synthRef.current = synth;
    return () => {
      synth.dispose();
      synthRef.current = null;
    };
  }, []);

  // Stable callbacks (empty deps): they read the synth and recorder from refs and
  // update state with the functional form, so React.memo on PianoKey can skip renders.
  const handleNoteOn = useCallback((midi) => {
    const note = NOTE_BY_MIDI.get(midi);
    const synth = synthRef.current;
    if (!note || !synth) return;
    const { started, stolenMidi } = synth.noteOn(midi, note.freqHz);
    if (!started) return;
    const recorder = recorderRef.current;
    if (recorder) {
      const now = performance.now();
      if (stolenMidi !== null) recordNoteEnd(recorder, stolenMidi, now);
      recordNoteStart(recorder, midi, note.freqHz, now);
    }
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
    const recorder = recorderRef.current;
    if (recorder) recordNoteEnd(recorder, midi, performance.now());
    setPressedMidis((prev) => {
      if (!prev.has(midi)) return prev;
      const next = new Set(prev);
      next.delete(midi);
      return next;
    });
  }, []);

  const handleRecordStart = () => {
    recorderRef.current = createRecorder();
    setRecording([]);
    setMode('RECORDING');
  };

  const handleRecordStop = () => {
    const recorder = recorderRef.current;
    if (!recorder) return;
    closeOpenNotes(recorder, performance.now());
    recorderRef.current = null;
    setRecording(recorder.queue.toArray().map((event) => ({ ...event })));
    setMode('IDLE');
  };

  const statusText =
    mode === 'RECORDING'
      ? 'Recording... play some keys'
      : `Recorded notes: ${recording.length}`;

  return (
    <section className={styles.grandPiano} aria-labelledby={headingId}>
      <h2 id={headingId}>88-Key Grand Piano</h2>
      <section className={styles.controls} aria-labelledby={sequencerId}>
        <h3 id={sequencerId}>Sequencer</h3>
        <p className={styles.transport}>
          <button
            type="button"
            className={styles.button}
            disabled={mode !== 'IDLE'}
            onClick={handleRecordStart}
          >
            Record
          </button>
          <button
            type="button"
            className={styles.button}
            disabled={mode !== 'RECORDING'}
            onClick={handleRecordStop}
          >
            Stop Recording
          </button>
        </p>
        <output className={styles.status} aria-live="polite" aria-atomic="true">
          {statusText}
        </output>
      </section>
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