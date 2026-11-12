/**
 * @typedef {'FRIENDS' | 'DATING_NO_LOVE' | 'OFFICIAL_LOVE' | 'GHOSTED_EXIT'} RelationshipPhase
 * @typedef {'START_DATING' | 'COMMIT' | 'GHOST' | 'RESET'} PhaseAction
 */

export const PHASES = Object.freeze({
  FRIENDS: 'FRIENDS',
  DATING_NO_LOVE: 'DATING_NO_LOVE',
  OFFICIAL_LOVE: 'OFFICIAL_LOVE',
  GHOSTED_EXIT: 'GHOSTED_EXIT',
});

export const ACTIONS = Object.freeze({
  START_DATING: 'START_DATING',
  COMMIT: 'COMMIT',
  GHOST: 'GHOST',
  RESET: 'RESET',
});

/*
 * FSM transition table (any other pair returns the same phase):
 *   FRIENDS        --START_DATING--> DATING_NO_LOVE
 *   DATING_NO_LOVE --COMMIT--------> OFFICIAL_LOVE
 *   DATING_NO_LOVE --GHOST---------> GHOSTED_EXIT
 *   GHOSTED_EXIT   --RESET---------> FRIENDS
 */
const TRANSITIONS = new Map([
  [PHASES.FRIENDS, new Map([[ACTIONS.START_DATING, PHASES.DATING_NO_LOVE]])],
  [
    PHASES.DATING_NO_LOVE,
    new Map([
      [ACTIONS.COMMIT, PHASES.OFFICIAL_LOVE],
      [ACTIONS.GHOST, PHASES.GHOSTED_EXIT],
    ]),
  ],
  [PHASES.GHOSTED_EXIT, new Map([[ACTIONS.RESET, PHASES.FRIENDS]])],
]);

/**
 * Pure FSM step. An invalid (phase, action) pair returns the same phase.
 * @param {RelationshipPhase} phase
 * @param {PhaseAction} action
 * @returns {RelationshipPhase}
 */
export function transition(phase, action) {
  return TRANSITIONS.get(phase)?.get(action) ?? phase;
}

/**
 * @typedef {'EM' | 'AI_DO'} EffortActor
 *
 * @typedef {Object} EffortSignal
 * @property {string} id
 * @property {EffortActor} actor
 * @property {number} steps
 * @property {number} multiplier
 */

/**
 * Builds one immutable log entry. The id is used as React key.
 * @param {EffortActor} actor
 * @param {number} steps
 * @param {number} multiplier
 * @returns {EffortSignal}
 */
export function createSignal(actor, steps, multiplier) {
  return Object.freeze({
    id: crypto.randomUUID(),
    actor,
    steps,
    multiplier,
  });
}

/**
 * Sum of steps * multiplier for one actor.
 * @param {readonly EffortSignal[]} signals
 * @param {EffortActor} actor
 * @returns {number}
 */
export function getScore(signals, actor) {
  return signals
    .filter((s) => s.actor === actor)
    .reduce((total, s) => total + s.steps * s.multiplier, 0);
}

/**
 * Red flag only while still in DATING_NO_LOVE and Em is behind.
 * @param {RelationshipPhase} phase
 * @param {number} emScore
 * @param {number} rivalScore
 * @returns {boolean}
 */
export function isRedFlag(phase, emScore, rivalScore) {
  return phase === PHASES.DATING_NO_LOVE && emScore < rivalScore;
}