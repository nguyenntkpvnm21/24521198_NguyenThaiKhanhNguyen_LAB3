import { useId } from 'react';
import { usePubgAirdropTimer } from './usePubgAirdropTimer.js';
import { formatCountdown, formatVnd, getDropPhase } from './arenaLogic.js';
import styles from './KraftonPubgVnArena.module.css';

const PHASE_LABELS = {
  WARMUP: 'Drop opens soon',
  AIRDROP_LIVE: 'Airdrop live: claim now',
  LOOTED_OUT: 'Looted out',
  EXPIRED: 'Claim window closed',
};

/**
 * @param {Object} props
 * @param {{ id: string, title: string, priceVnd: number, dropEpochMs: number }} props.crate
 * @param {number} props.stock           current (optimistic) stock
 * @param {{ status: 'IDLE'|'PENDING'|'SUCCESS'|'CONFLICT', message: string }} props.claim
 * @param {number} props.serverOffsetMs
 * @param {(crateId: string) => void} props.onClaim
 */
export function CrateCard({
  crate,
  stock,
  claim,
  serverOffsetMs = 0,
  onClaim,
}) {
  const headingId = useId();
  const { nowMs, remainingMs } = usePubgAirdropTimer(
    crate.dropEpochMs,
    serverOffsetMs,
  );
  const phase = getDropPhase(nowMs, crate, stock);
  const canClaim = phase === 'AIRDROP_LIVE' && claim.status !== 'PENDING';
  const isClosed = phase === 'LOOTED_OUT' || phase === 'EXPIRED';
  let statusText = PHASE_LABELS[phase];
  if (claim.status !== 'IDLE') {
    statusText =
      claim.status === 'SUCCESS' && isClosed
        ? `${claim.message}. ${PHASE_LABELS[phase]}`
        : claim.message;
  }
  return (
    <article className={styles.crate} aria-labelledby={headingId}>
      <h3 id={headingId} className={styles.crateTitle}>
        {crate.title}
      </h3>
      <dl className={styles.details}>
        <dt>Price</dt>
        <dd>{formatVnd(crate.priceVnd)}</dd>
        <dt>Stock</dt>
        <dd className={styles.stock}>{stock}</dd>
        <dt>Drop in</dt>
        <dd>
          <time
            className={styles.countdown}
            dateTime={`PT${Math.ceil(remainingMs / 1000)}S`}
          >
            {formatCountdown(remainingMs)}
          </time>
        </dd>
      </dl>
      <output className={styles.status} aria-live="polite" aria-atomic="true">
        {statusText}
      </output>
      <button
        type="button"
        className={styles.claimButton}
        disabled={!canClaim}
        aria-describedby={headingId}
        onClick={() => onClaim(crate.id)}
      >
        Claim
      </button>
    </article>
  );
}