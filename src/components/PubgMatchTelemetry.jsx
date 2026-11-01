import { useEffect, useState } from 'react';
import { fetchKraftonPubgTelemetry } from './pubgTelemetryApi.js';
import styles from './PubgMatchTelemetry.module.css';

/** @typedef {'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'} ViewStatus */

export function PubgMatchTelemetry({ squadId = 'te' }) {
  const [result, setResult] = useState({ key: '', data: null, error: null });

  useEffect(() => {
    if (!squadId) return undefined;
    const controller = new AbortController();
    fetchKraftonPubgTelemetry(squadId, { signal: controller.signal })
      .then((payload) =>
        setResult({ key: squadId, data: payload, error: null }),
      )
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setResult({ key: squadId, data: null, error: err.message });
      });
    return () => controller.abort();
  }, [squadId]);

  /** @type {ViewStatus} */
  let status = 'SUCCESS';
  if (!squadId) status = 'IDLE';
  else if (result.key !== squadId) status = 'LOADING';
  else if (result.error !== null) status = 'ERROR';

  return (
    <section className={styles.telemetry} aria-labelledby="telemetry-heading">
      <h2 id="telemetry-heading">PVS Live Telemetry</h2>
      {status === 'IDLE' && <p>Radar idle</p>}
      {status === 'LOADING' && <p>Syncing KRAFTON Radar...</p>}
      {status === 'ERROR' && <p>Blue-Zone Link Lost: {result.error}</p>}
      {status === 'SUCCESS' && (
        <article className={styles.card}>
          <h3>
            {result.data.name} — Kills: {result.data.kills}
          </h3>
        </article>
      )}
    </section>
  );
}