import { useEffect, useId, useState } from 'react';
import { CrateCard } from './CrateCard.jsx';
import { Leaderboard } from './Leaderboard.jsx';
import { fetchServerOffset } from './arenaApi.js';
import {
  SERVER_SKEW_MS,
  SQUAD_STANDINGS,
  createDemoDrops,
} from './arenaData.js';
import styles from './KraftonPubgVnArena.module.css';

const IDLE_CLAIM = { status: 'IDLE', message: '' };

// Placeholder until Task H3.11 adds the optimistic claim handler.
const handleClaimPlaceholder = () => {};

export function KraftonPubgVnArena() {
  const headingId = useId();
  const [drops] = useState(() => createDemoDrops(Date.now() + SERVER_SKEW_MS));
  const [stocks] = useState(() =>
    Object.fromEntries(drops.map((d) => [d.id, d.remainingStock])),
  );
  const [claims] = useState(() =>
    Object.fromEntries(drops.map((d) => [d.id, IDLE_CLAIM])),
  );
  const [serverOffsetMs, setServerOffsetMs] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    fetchServerOffset({ signal: controller.signal })
      .then((offset) => setServerOffsetMs(offset))
      .catch((err) => {
        if (err.name === 'AbortError') return;
        // Any other failure keeps the local clock (offset 0).
      });
    return () => controller.abort();
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
              onClaim={handleClaimPlaceholder}
            />
          </li>
        ))}
      </ul>
      <Leaderboard standings={SQUAD_STANDINGS} />
    </section>
  );
}