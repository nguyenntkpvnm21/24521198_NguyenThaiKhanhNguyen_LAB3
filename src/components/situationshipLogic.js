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