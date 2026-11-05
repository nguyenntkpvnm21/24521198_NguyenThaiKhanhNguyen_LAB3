import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { DrumPad } from './DrumPad.jsx';
import { useDrumKeyboard } from './useDrumKeyboard.js';
import { DRUM_PADS, PAD_BY_CODE } from './drumPads.js';
import { createDrumSynth } from './drumSynth.js';
import styles from './DrumMachine.module.css';

const MAX_HITS = 8;
const PAD_BY_ID = new Map(DRUM_PADS.map((pad) => [pad.id, pad]));

export function DrumMachine() {
  const headingId = useId();
  const synthRef = useRef(null);
  const [activePadIds, setActivePadIds] = useState([]);
  const [hits, setHits] = useState([]);

  useEffect(() => {
    synthRef.current = createDrumSynth();
    return () => {
      synthRef.current?.dispose();
      synthRef.current = null;
    };
  }, []);

  const handlePress = useCallback((padId) => {
    const pad = PAD_BY_ID.get(padId);
    if (!pad || !synthRef.current) return;
    synthRef.current.trigger(padId);
    setActivePadIds((prev) => (prev.includes(padId) ? prev : [...prev, padId]));
    setHits((prev) =>
      [
        { id: crypto.randomUUID(), padId, text: `${pad.label} (${pad.keyLabel})` },
        ...prev,
      ].slice(0, MAX_HITS),
    );
  }, []);

  const handleRelease = useCallback((padId) => {
    setActivePadIds((prev) =>
      prev.includes(padId) ? prev.filter((id) => id !== padId) : prev,
    );
  }, []);

  useDrumKeyboard(PAD_BY_CODE, handlePress, true, handleRelease);

  const latestHit = hits[0]?.text ?? 'No hits yet';

  return (
    <section className={styles.drumMachine} aria-labelledby={headingId}>
      <h2 id={headingId}>Studio Drum Kit</h2>
      <ul className={styles.pads}>
        {DRUM_PADS.map((pad) => (
          <li key={pad.id}>
            <DrumPad
              pad={pad}
              isActive={activePadIds.includes(pad.id)}
              onPress={handlePress}
              onRelease={handleRelease}
            />
          </li>
        ))}
      </ul>
      <section className={styles.log} aria-labelledby={`${headingId}-log`}>
        <h3 id={`${headingId}-log`}>Hit log</h3>
        <output aria-live="polite" aria-atomic="true">
          Last hit: {latestHit}
        </output>
        <ol className={styles.logList}>
          {hits.map((hit) => (
            <li key={hit.id} className={styles.logItem}>
              {hit.text}
            </li>
          ))}
        </ol>
      </section>
    </section>
  );
}