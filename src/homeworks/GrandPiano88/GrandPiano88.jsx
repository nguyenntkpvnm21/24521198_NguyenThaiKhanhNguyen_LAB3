import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { NoteQueue } from './NoteQueue.js';
import { PianoKey } from './PianoKey.jsx';
import { PolyphonicSynth } from './PolyphonicSynth.js';
import { PIANO_NOTES } from './pianoKeys.js';
import { playSequence } from './playSequence.js';
import styles from './GrandPiano88.module.css';

const NOTE_BY_MIDI = new Map(PIANO_NOTES.map((note) => [note.midi, note]));
const SPEEDS = [0.5, 1, 2];

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
  const speedId = useId();
  const synthRef = useRef(null);
  const recorderRef = useRef(null);
  const abortRef = useRef(null);
  const [pressedMidis, setPressedMidis] = useState(() => new Set());
  const [mode, setMode] = useState('IDLE');
  const [recording, setRecording] = useState([]);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    const synth = new PolyphonicSynth();
    synthRef.current = synth;
    return () => {
      // Unmount: cancel every scheduled replay promise, then silence and free audio.
      abortRef.current?.abort();
      abortRef.current = null;
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

  const handlePlay = () => {
    if (recording.length === 0) return;
    const controller = new AbortController();
    abortRef.current = controller;
    setMode('PLAYING');
    playSequence(recording, {
      speed,
      signal: controller.signal,
      onNoteOn: handleNoteOn,
      onNoteOff: handleNoteOff,
    }).then(() => {
      // Only the replay that is still current may reset the mode.
      if (abortRef.current === controller) {
        abortRef.current = null;
        setMode('IDLE');
      }
    });
  };

  const handleStopSequence = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    synthRef.current?.allNotesOff();
    setPressedMidis(new Set());
    setMode('IDLE');
  };

  const handleSpeedChange = (e) => {
    const next = Number(e.target.value);
    if (!Number.isNaN(next)) setSpeed(next);
  };

  let statusText = `Recorded notes: ${recording.length}`;
  if (mode === 'RECORDING') statusText = 'Recording... play some keys';
  if (mode === 'PLAYING') {
    statusText = `Playing ${recording.length} notes at ${speed}x`;
  }

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
          <button
            type="button"
            className={styles.button}
            disabled={mode !== 'IDLE' || recording.length === 0}
            onClick={handlePlay}
          >
            Play
          </button>
          <button
            type="button"
            className={styles.button}
            disabled={mode !== 'PLAYING'}
            onClick={handleStopSequence}
          >
            Stop Sequence
          </button>
        </p>
        <p className={styles.field}>
          <label htmlFor={speedId}>Speed</label>
          <select
            id={speedId}
            value={speed}
            disabled={mode !== 'IDLE'}
            onChange={handleSpeedChange}
          >
            {SPEEDS.map((s) => (
              <option key={s} value={s}>
                {s}x
              </option>
            ))}
          </select>
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