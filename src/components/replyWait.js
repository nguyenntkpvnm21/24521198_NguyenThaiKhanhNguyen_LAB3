/**
 * Resolves after `ms`. Rejects with `signal.reason` when aborted, either
 * before the call or while waiting. Timer and listener are always cleaned up.
 * @param {number} ms
 * @param {AbortSignal} signal
 * @returns {Promise<void>}
 */
export function waitForReply(ms, signal) {
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