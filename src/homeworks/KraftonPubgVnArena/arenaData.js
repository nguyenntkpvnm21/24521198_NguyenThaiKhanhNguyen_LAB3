/**
 * @typedef {'WARMUP'|'AIRDROP_LIVE'|'LOOTED_OUT'|'EXPIRED'} DropPhase
 *
 * @typedef {Object} PubgCrateDrop
 * @property {string} id
 * @property {string} title
 * @property {number} priceVnd
 * @property {number} remainingStock
 * @property {number} dropEpochMs
 *
 * @typedef {Object} PubgVnSquadStanding
 * @property {'te'|'ces'|'roy'|'agg'} squadId
 * @property {string} squadName
 * @property {number} wwcdCount
 * @property {number} placementPts
 * @property {number} killPts
 */

/** How long a drop can be claimed after it opens (2 minutes, short for demos). */
export const CLAIM_WINDOW_MS = 120000;

/** Simulated server clock that runs ahead of the local clock. */
export const SERVER_SKEW_MS = 1500;

/**
 * Builds the demo drops relative to the server time at page load.
 * Returns a new array each call; callers never mutate it.
 * @param {number} serverNowMs
 * @returns {PubgCrateDrop[]}
 */
export function createDemoDrops(serverNowMs) {
  return [
    {
      id: 'vip-pass',
      title: 'PVS Finals VIP Pass + 5,000 G-Coin',
      priceVnd: 1200000,
      remainingStock: 5,
      dropEpochMs: serverNowMs + 30000,
    },
    {
      id: 'gcoin-crate',
      title: 'G-Coin Contraband Crate',
      priceVnd: 150000,
      remainingStock: 20,
      dropEpochMs: serverNowMs + 20000,
    },
    {
      id: 'last-crate',
      title: 'Limited Contraband Crate (last one)',
      priceVnd: 99000,
      remainingStock: 1,
      dropEpochMs: serverNowMs + 20000,
    },
  ];
}

/** Invented demo numbers, not real tournament results. */
/** @type {PubgVnSquadStanding[]} */
export const SQUAD_STANDINGS = [
  { squadId: 'te', squadName: 'The Expendables', wwcdCount: 4, placementPts: 96, killPts: 88 },
  { squadId: 'ces', squadName: 'Cerberus Esports', wwcdCount: 3, placementPts: 104, killPts: 71 },
  { squadId: 'roy', squadName: 'Roy Esports', wwcdCount: 2, placementPts: 81, killPts: 93 },
  { squadId: 'agg', squadName: 'AGG', wwcdCount: 2, placementPts: 77, killPts: 64 },
];