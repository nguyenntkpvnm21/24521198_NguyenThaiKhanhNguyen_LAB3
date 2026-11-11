import { useEffect, useState } from 'react';

const TICK_MS = 200;

/**
 * Countdown based on an absolute target time, not on counting ticks.
 * The state holds only the local clock; nowMs and remainingMs are derived in render.
 * @param {number} targetEpochMs
 * @param {number} [serverOffsetMs]
 * @returns {{ nowMs: number, remainingMs: number, isLive: boolean }}
 */
export function usePubgAirdropTimer(targetEpochMs, serverOffsetMs = 0) {
  const [localNowMs, setLocalNowMs] = useState(() => Date.now());

  useEffect(() => {
    const syncClock = () => setLocalNowMs(Date.now());
    const timerId = window.setInterval(syncClock, TICK_MS);
    const onWake = () => {
      if (document.visibilityState === 'visible') syncClock();
    };
    document.addEventListener('visibilitychange', onWake);
    return () => {
      window.clearInterval(timerId);
      document.removeEventListener('visibilitychange', onWake);
    };
  }, []);

  const nowMs = localNowMs + serverOffsetMs;
  const remainingMs = Math.max(0, targetEpochMs - nowMs);
  return { nowMs, remainingMs, isLive: remainingMs === 0 };
}