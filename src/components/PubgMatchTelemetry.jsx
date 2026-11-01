import { useEffect, useState } from 'react';
import {
  PUBG_VN_SQUADS,
  fetchKraftonPubgTelemetry,
} from './pubgTelemetryApi.js';
import styles from './PubgMatchTelemetry.module.css';

/** @typedef {'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'} ViewStatus */

/**
 * Live telemetry radar for one PVS squad. The view status is derived during
 * render from the last settled result; the effect only talks to the network
 * and aborts the in-flight request on cleanup.
 * @param {{ squadId?: string, onSquadChange?: (id: string) => void }} props
 */
export function PubgMatchTelemetry({ squadId = 'te', onSquadChange }) {
  const [activeId, setActiveId] = useState(squadId);
  const [retryTick, setRetryTick] = useState(0);
  const [result, setResult] = useState({ key: '', data: null, error: null });

  const requestKey = `${activeId}#${retryTick}`;

  useEffect(() => {
    if (!activeId) return undefined;
    const key = `${activeId}#${retryTick}`;
    const controller = new AbortController();
    fetchKraftonPubgTelemetry(activeId, { signal: controller.signal })
      .then((payload) => setResult({ key, data: payload, error: null }))
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setResult({ key, data: null, error: err.message });
      });
    return () => controller.abort();
  }, [activeId, retryTick]);

  const handleSelect = (id) => {
    setActiveId(id);
    onSquadChange?.(id);
  };

  /** @type {ViewStatus} */
  let status = 'SUCCESS';
  if (!activeId) status = 'IDLE';
  else if (result.key !== requestKey) status = 'LOADING';
  else if (result.error !== null) status = 'ERROR';

  return (
    <section className={styles.telemetry} aria-labelledby="telemetry-heading">
      <h2 id="telemetry-heading">PVS Live Telemetry</h2>

      <ul className={styles.selector} aria-label="Select squad">
        {PUBG_VN_SQUADS.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              className={styles.selectorButton}
              aria-pressed={s.id === activeId}
              onClick={() => handleSelect(s.id)}
            >
              {s.name}
            </button>
          </li>
        ))}
      </ul>

      {status === 'IDLE' && <p>Radar idle. Pick a squad.</p>}

      {status === 'LOADING' && (
        <section
          className={styles.skeleton}
          aria-busy="true"
          aria-label="Loading telemetry"
        >
          <p>Syncing KRAFTON Radar...</p>
        </section>
      )}

      {status === 'ERROR' && (
        <section className={styles.alert} role="alert">
          <p>Blue-Zone Link Lost: {result.error}</p>
          <button type="button" onClick={() => setRetryTick((t) => t + 1)}>
            Reconnect Satellite Retry
          </button>
        </section>
      )}

      {status === 'SUCCESS' && (
        <article className={styles.card} aria-live="polite">
          <h3>
            {result.data.name} — Kills: {result.data.kills}
          </h3>
          <dl className={styles.stats}>
            <dt>Map</dt>
            <dd>{result.data.map}</dd>
            <dt>Phase</dt>
            <dd>{result.data.phase}</dd>
            <dt>Alive</dt>
            <dd>{result.data.alive}</dd>
            <dt>WWCD probability</dt>
            <dd>{result.data.wwcdProb}</dd>
            <dt>Status</dt>
            <dd>{result.data.status}</dd>
          </dl>
        </article>
      )}
    </section>
  );
}