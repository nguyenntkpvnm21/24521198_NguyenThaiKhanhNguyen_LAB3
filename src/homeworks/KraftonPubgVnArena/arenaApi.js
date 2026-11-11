import { SERVER_SKEW_MS } from './arenaData.js';

const SERVER_TIME_DELAY_MS = 300;
const CLAIM_DELAY_MS = 800;

/** Module counter: makes the 409 on 'last-crate' deterministic (first claim only). */
let lastCrateClaimCount = 0;

/**
 * Abortable delay. Rejects with signal.reason (an AbortError) on abort
 * and clears its timer.
 * @param {number} ms
 * @param {AbortSignal} signal
 * @returns {Promise<void>}
 */
function wait(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(signal.reason);
      return;
    }
    const onAbort = () => {
      clearTimeout(timerId);
      reject(signal.reason);
    };
    const timerId = setTimeout(() => {
      signal.removeEventListener('abort', onAbort);
      resolve();
    }, Math.max(0, ms));
    signal.addEventListener('abort', onAbort, { once: true });
  });
}

/**
 * Simulates one request for the server clock offset.
 * @param {{ signal: AbortSignal }} options
 * @returns {Promise<number>} offset in ms to add to Date.now()
 */
export async function fetchServerOffset({ signal }) {
  await wait(SERVER_TIME_DELAY_MS, signal);
  return SERVER_SKEW_MS;
}

/**
 * Simulates claiming a crate.
 * Rejects with error.status === 409 and message 'Looted Out' on the FIRST claim
 * of 'last-crate' only. Rejects with an AbortError when the signal aborts.
 * @param {string} crateId
 * @param {string} claimId
 * @param {{ signal: AbortSignal }} options
 * @returns {Promise<{ claimId: string }>}
 */
export async function claimCrate(crateId, claimId, { signal }) {
  await wait(CLAIM_DELAY_MS, signal);
  if (crateId === 'last-crate') {
    lastCrateClaimCount += 1;
    if (lastCrateClaimCount === 1) {
      const error = new Error('Looted Out');
      error.status = 409;
      throw error;
    }
  }
  return { claimId };
}