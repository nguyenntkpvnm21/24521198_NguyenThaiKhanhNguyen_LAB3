import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { CrateCard } from './CrateCard.jsx';
import { Leaderboard } from './Leaderboard.jsx';
import { claimCrate, fetchServerOffset } from './arenaApi.js';
import {
  SERVER_SKEW_MS,
  SQUAD_STANDINGS,
  createDemoDrops,
} from './arenaData.js';
import styles from './KraftonPubgVnArena.module.css';

const IDLE_CLAIM = { status: 'IDLE', message: '' };

export function KraftonPubgVnArena() {
  const headingId = useId();
  const [drops] = useState(() => createDemoDrops(Date.now() + SERVER_SKEW_MS));
  const [stocks, setStocks] = useState(() =>
    Object.fromEntries(drops.map((d) => [d.id, d.remainingStock])),
  );
  const [claims, setClaims] = useState(() =>
    Object.fromEntries(drops.map((d) => [d.id, IDLE_CLAIM])),
  );
  const [serverOffsetMs, setServerOffsetMs] = useState(0);

  const claimAbortRef = useRef(null);
  const inFlightRef = useRef(new Map());

  useEffect(() => {
    const controller = new AbortController();
    claimAbortRef.current = controller;
    fetchServerOffset({ signal: controller.signal })
      .then((offset) => setServerOffsetMs(offset))
      .catch((err) => {
        if (err.name === 'AbortError') return;
        // Any other failure keeps the local clock (offset 0).
      });
    return () => controller.abort();
  }, []);

  const handleClaim = useCallback((crateId) => {
    const inFlight = inFlightRef.current;
    if (inFlight.has(crateId)) return;

    const claimId = crypto.randomUUID();
    inFlight.set(crateId, claimId);

    setStocks((prev) => ({ ...prev, [crateId]: prev[crateId] - 1 }));
    setClaims((prev) => ({
      ...prev,
      [crateId]: { status: 'PENDING', message: 'Claiming...' },
    }));

    const rollback = (message, status) => {
      setStocks((prev) => ({ ...prev, [crateId]: prev[crateId] + 1 }));
      setClaims((prev) => ({ ...prev, [crateId]: { status, message } }));
    };

    claimCrate(crateId, claimId, { signal: claimAbortRef.current.signal })
      .then(() => {
        setClaims((prev) => ({
          ...prev,
          [crateId]: { status: 'SUCCESS', message: 'Claimed successfully' },
        }));
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        if (err.status === 409) {
          rollback('Looted Out (409): stock restored', 'CONFLICT');
        } else {
          rollback('Claim failed: stock restored', 'CONFLICT');
        }
      })
      .finally(() => {
        inFlight.delete(crateId);
      });
  }, []);

  return (
    <section className={styles.arena} aria-labelledby={headingId}>
      <h2 id={headingId}>PVS Finals Ticket and G-Coin Crate Arena</h2>
      <ul className={styles.crateList} aria-label="Crate drops">
        {drops.map((crate) => (
          <li key={crate.id}>
            <CrateCard
              crate={crate}
              stock={stocks[crate.id]}
              claim={claims[crate.id]}
              serverOffsetMs={serverOffsetMs}
              onClaim={handleClaim}
            />
          </li>
        ))}
      </ul>
      <Leaderboard standings={SQUAD_STANDINGS} />
    </section>
  );
}