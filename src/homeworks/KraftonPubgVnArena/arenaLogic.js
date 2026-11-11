import { CLAIM_WINDOW_MS } from './arenaData.js';

const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

/**
 * @param {number} amount
 * @returns {string} e.g. "1.200.000 ₫"
 */
export function formatVnd(amount) {
  return vndFormatter.format(amount);
}

/**
 * Formats a remaining time as mm:ss, rounded UP to whole seconds
 * so the display never shows 00:00 while time is still left.
 * @param {number} ms
 * @returns {string}
 */
export function formatCountdown(ms) {
  const totalSeconds = Math.ceil(Math.max(0, ms) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Derives the drop phase. Never stored in state.
 * @param {number} nowMs      server-aligned current time
 * @param {{ dropEpochMs: number }} crate
 * @param {number} stock      current (optimistic) stock
 * @returns {'WARMUP'|'AIRDROP_LIVE'|'LOOTED_OUT'|'EXPIRED'}
 */
export function getDropPhase(nowMs, crate, stock) {
  if (nowMs < crate.dropEpochMs) return 'WARMUP';
  if (stock <= 0) return 'LOOTED_OUT';
  if (nowMs >= crate.dropEpochMs + CLAIM_WINDOW_MS) return 'EXPIRED';
  return 'AIRDROP_LIVE';
}

const SORT_VALUE = {
  wwcd: (s) => s.wwcdCount,
  placement: (s) => s.placementPts,
  kills: (s) => s.killPts,
  total: (s) => s.placementPts + s.killPts,
};

/**
 * Filters by name and minimum kill points, then sorts descending.
 * Pure and immutable: uses toSorted, never mutates the input.
 * @param {Array<{ squadName: string, wwcdCount: number, placementPts: number, killPts: number }>} standings
 * @param {{ query: string, minKillPts: number | '', sortBy: 'wwcd'|'placement'|'kills'|'total' }} options
 */
export function getVisibleStandings(standings, { query, minKillPts, sortBy }) {
  const needle = query.trim().toLowerCase();
  const minKills = minKillPts === '' ? 0 : minKillPts;
  const valueOf = SORT_VALUE[sortBy] ?? SORT_VALUE.wwcd;
  return standings
    .filter(
      (s) => s.squadName.toLowerCase().includes(needle) && s.killPts >= minKills,
    )
    .toSorted(
      (a, b) => valueOf(b) - valueOf(a) || a.squadName.localeCompare(b.squadName),
    );
}