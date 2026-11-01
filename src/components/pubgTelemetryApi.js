/** @typedef {{ id: string, name: string, map: string, phase: string, alive: number, kills: number, wwcdProb: string, status: string }} Squad */

/** @type {Squad[]} */
export const PUBG_VN_SQUADS = [
  { id: 'ces', name: 'Cerberus Esports', map: 'Erangel', phase: 'Phase 6',
    alive: 4, kills: 14, wwcdProb: '68%', status: 'In Safe Zone' },
  { id: 'te', name: 'The Expendables', map: 'Miramar', phase: 'Phase 7',
    alive: 4, kills: 18, wwcdProb: '82%', status: 'Holding High Ground' },
  { id: 'ge', name: 'Genius Esports', map: 'Taego', phase: 'Phase 5',
    alive: 3, kills: 9, wwcdProb: '41%', status: 'Rotating Blue Zone' },
];

const PACKET_LOSS_RATE = 0.35;
const EXTRA_LATENCY_MS = 800;

function createAbortError() {
  const error = new Error('Telemetry request aborted');
  error.name = 'AbortError';
  return error;
}

function delay(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(createAbortError());
      return;
    }
    const timerId = window.setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    function onAbort() {
      window.clearTimeout(timerId);
      reject(createAbortError());
    }
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

/**
 * Simulated satellite telemetry call.
 * @param {string} squadId
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<Squad>}
 */
export async function fetchKraftonPubgTelemetry(squadId, { signal } = {}) {
  const response = await fetch(`/telemetry-ping.json?squad=${squadId}`, {
    signal,
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(`Satellite link returned ${response.status}`);
  }
  await delay(EXTRA_LATENCY_MS, signal);
  if (Math.random() < PACKET_LOSS_RATE) {
    throw new Error('Packet loss over the Blue Zone, telemetry timed out');
  }
  const squad = PUBG_VN_SQUADS.find((s) => s.id === squadId);
  if (!squad) {
    throw new Error(`Unknown squad: ${squadId}`);
  }
  return squad;
}