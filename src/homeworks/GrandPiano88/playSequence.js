import { NoteQueue } from './NoteQueue.js';

/**
 * Resolve after `ms`, or reject with the signal's reason as soon as it aborts.
 * The timer is always cleared, so an abort leaves nothing scheduled.
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
    const timerId = setTimeout(
      () => {
        signal.removeEventListener('abort', onAbort);
        resolve();
      },
      Math.max(0, ms),
    );
    signal.addEventListener('abort', onAbort, { once: true });
  });
}

/**
 * Replay recorded notes in FIFO order at the given speed (0.5, 1 or 2).
 * @param {{ midi: number, freqHz: number, durationMs: number, deltaMs: number }[]} events
 * @param {{
 *   speed?: number,
 *   signal: AbortSignal,
 *   onNoteOn: (midi: number, freqHz: number) => void,
 *   onNoteOff: (midi: number) => void,
 * }} options
 * @returns {Promise<boolean>} true when finished, false when aborted
 */
export async function playSequence(
  events,
  { speed = 1, signal, onNoteOn, onNoteOff },
) {
  const queue = NoteQueue.from(events);
  const releases = [];
  const startedAt = performance.now();
  let offsetMs = 0;

  try {
    while (queue.size > 0) {
      const event = queue.dequeue();
      // Absolute timeline: waiting errors do not accumulate between notes.
      offsetMs += event.deltaMs / speed;
      await wait(startedAt + offsetMs - performance.now(), signal);
      onNoteOn(event.midi, event.freqHz);
      releases.push(
        wait(event.durationMs / speed, signal).then(
          () => onNoteOff(event.midi),
          () => {}, // aborted: the caller silences the oscillators
        ),
      );
    }
    await Promise.all(releases);
    return !signal.aborted;
  } catch (error) {
    if (signal.aborted) return false;
    throw error;
  }
}