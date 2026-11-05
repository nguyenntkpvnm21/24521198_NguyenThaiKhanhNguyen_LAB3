# Work Breakdown Structure (Exercise 1)
- [x] Task 1.1: Clean boilerplate, mount StrictMode
- [x] Task 1.2: Design tokens & reset (CSS)
- [x] Task 1.3: DeveloperCard scaffold (article + header)
- [x] Task 1.4: Profile & metrics dl
- [x] Task 1.5: SkillBadge + skills list
- [x] Task 1.6: Avatar https + fallback initials
- [x] Task 1.7: Final semantic pass (mandatory commit 1)
- [x] Task 1.8: CSS layout, then responsive 375px (mandatory commit 2)

* RULE: Never prompt AI with more than 1 sub-task at a time.

## Props contract
```js
/** @typedef {{ id: string, name: string, tier: 'Core'|'Awareness'|'Later' }} Skill */
/** DeveloperCard props (all optional, ES6 defaults):
 *  fullName: string
 *  role: string
 *  avatarUrl: string            // https only
 *  profile: { firstName: string, lastName: string, age: number }
 *  metrics: Record<string, string | number>
 *  skills: Skill[]
 *  SkillBadge props: { name: string, tier?: string }
 */
```

# Work Breakdown Structure (Exercise 2)
- [x] Task 2.1: WBS and contract for ScientistDirectory (docs commit)
- [x] Task 2.2: CSS Module scaffold with agreed class names (CSS only)
- [x] Task 2.3: Normalize smartPeople schema with stable IDs (mandatory commit 1)
- [x] Task 2.4: Mount ScientistDirectory in App
- [x] Task 2.5: Case-insensitive name search with useId label
- [x] Task 2.6: Min IQ filter with valueAsNumber and useId label
- [x] Task 2.7: Sort select and toSorted pipeline (mandatory commit 2 covers 2.5 to 2.7)
- [x] Task 2.8: Immutable delete per person
- [x] Task 2.9: Reset restores data, query, minIq and sortBy
- [x] Task 2.10: Live result count in output role=status (mandatory commit 3 covers 2.8 to 2.10)
- [x] Task 2.11: CSS layout, then responsive 375px (CSS only)
- [x] Task 2.12: Verification (Profiler, Accessibility tree, grep, lint) and AI failure notes
- [x] Task 2.13: Push to GitHub and tag ex2-done
- [x] Task 2.14: Block e, E, + and - keys in the Min IQ input (hardening)

* RULE: Never prompt AI with more than 1 sub-task at a time.
* RULE: Mandatory commits contain JSX/JS only. CSS goes in its own commits (2.2, 2.11).

## Ex2 contract
```js
/** @typedef {{ id: string, name: string, age: number, iq: number }} Scientist */
/** @typedef {'iq-desc' | 'age-asc'} SortKey */

/** ScientistDirectory props: initialData?: Scientist[] (default SMART_PEOPLE) */
/** State (only independent inputs):
 *  people: Scientist[]   query: string   minIq: number | '' (default 160, '' while the input is empty, treated as 0 when filtering)   sortBy: SortKey (default 'iq-desc')
 *  Derived in render, no useEffect: visible = people.filter(name + iq).toSorted(sortBy)
 *  Handlers: delete = setPeople(prev => prev.filter(p => p.id !== id))
 *            reset  = setPeople(initialData) + query '' + minIq 160 + sortBy 'iq-desc'
 *  SMART_PEOPLE is declared before the component and never mutated.
 *  CSS Module classes: directory, filters, field, actions, status, list, item, deleteButton
 *  Headings: section h2 (aria-labelledby), no h1, no div, key={p.id}
 */
```

# Work Breakdown Structure (Exercise 3)
- [x] Task 3.1: WBS and contract for PubgMatchTelemetry (docs commit)
- [x] Task 3.2: CSS Module scaffold with agreed class names (CSS only)
- [x] Task 3.3: Simulated telemetry API with 35% packet loss and abort support
- [x] Task 3.4: State machine view (IDLE, LOADING, SUCCESS, ERROR) with fetch effect and AbortController cleanup (mandatory commit 1)
- [x] Task 3.4a: Derive view state during render to avoid setState in effect (lint fix)
- [x] Task 3.5: Squad selector with aria-pressed buttons
- [x] Task 3.6: Success view with squad stats in a semantic dl
- [x] Task 3.7: Skeleton loader with aria-busy and fixed 220px height
- [x] Task 3.8: Error alert with role=alert and Reconnect Satellite Retry button (mandatory commit 2 covers 3.5 to 3.8)
- [x] Task 3.9: Mount PubgMatchTelemetry in App (done inside mandatory commit 1)
- [x] Task 3.10: CSS layout, skeleton pulse animation, then responsive 375px (CSS only)
- [x] Task 3.11: Verification (Slow 3G, canceled requests, CLS, grep, lint) and AI failure notes
- [x] Task 3.12: Push to GitHub and tag ex3-done

* RULE: Never prompt AI with more than 1 sub-task at a time.
* RULE: Mandatory commits contain JSX/JS only. CSS goes in its own commits (3.2, 3.10).

## Ex3 contract
```js
/**
 * @typedef {Object} Squad
 * @property {string} id            'ces' | 'te' | 'ge'
 * @property {string} name
 * @property {string} map
 * @property {string} phase
 * @property {number} alive
 * @property {number} kills
 * @property {string} wwcdProb
 * @property {string} status
 *
 * @typedef {'IDLE'|'LOADING'|'SUCCESS'|'ERROR'} ViewStatus
 * @typedef {{ status: ViewStatus, data: Squad|null, error: string|null }} ViewState
 *
 * fetchKraftonPubgTelemetry(squadId, { signal }) -> Promise<Squad>
 *   - resolves after a simulated delay, fails randomly 35% of the time
 *   - rejects with error.name === 'AbortError' when signal aborts
 *   - clears its timer when aborted
 *
 * PubgMatchTelemetry props: { squadId? = 'te', onSquadChange? }
 * State: activeId, retryTick, result { key, data, error }; key = `${activeId}#${retryTick}`
 * view: ViewState is derived in render: IDLE if activeId is empty, LOADING if result.key differs from the request key, ERROR if result.error is set, else SUCCESS
 * Effect deps: [squadId, retryTick]; cleanup = controller.abort()
 * Retry button label: 'Reconnect Satellite Retry'
 * CSS Module classes: telemetry, selector, selectorButton, skeleton, alert, card, stats
 * Headings: section h2 via aria-labelledby, result h3, no h1, no div
 */
```

# Work Breakdown Structure (Homework 1)
- [ ] Task H1.1: WBS and contract for Production Studio Drum Kit (docs commit)
- [ ] Task H1.2: CSS Module scaffold with agreed class names (CSS only)
- [ ] Task H1.3: Pad map keyed by e.code (data only)
- [ ] Task H1.4: Web Audio drum synth engine (no audio files)
- [ ] Task H1.5: useDrumKeyboard hook (e.code, repeat guard, input isolation, cleanup)
- [ ] Task H1.6: DrumPad button with aria-pressed
- [ ] Task H1.7: DrumMachine with active pads and hit log output
- [ ] Task H1.8: Decibel meter with AnalyserNode
- [ ] Task H1.9: Keyboard shortcuts toggle (WCAG 2.1.4)
- [ ] Task H1.10: Mount DrumMachine in App as a separate view
- [ ] Task H1.11: CSS layout, responsive 375px, focus ring, reduced motion (CSS only)
- [ ] Task H1.12: Verification (Lighthouse, Accessibility tree, grep, lint) and AI failure notes
- [ ] Task H1.13: Push to GitHub and tag hw1-done
- [ ] Task H1.14: Handle UniKey synthetic key events (empty e.code fallback)
- [ ] Task H1.15: Do not block shortcuts when focus is on a checkbox or button
- [ ] Task H1.16: Ignore IME synthetic events and recover swallowed keydown from physical keyup

* RULE: Never prompt AI with more than 1 sub-task at a time.
* RULE: Commits contain JSX/JS only or CSS only, never both.

## HW1 contract
```js
/**
 * @typedef {Object} DrumPad
 * @property {string} id         stable id, e.g. 'kick'
 * @property {string} code       KeyboardEvent.code, e.g. 'KeyA'
 * @property {string} keyLabel   text on the pad, e.g. 'A'
 * @property {string} label      accessible name, e.g. 'Kick'
 *
 * @typedef {Object} HitEntry
 * @property {string} id         crypto.randomUUID()
 * @property {string} padId
 * @property {string} text       e.g. 'Kick (A)'
 *
 * useDrumKeyboard(padMap: Map<string, DrumPad>, onTriggerPad: (padId) => void,
 *                 isEnabled = true, onReleasePad?: (padId) => void)
 * DrumSynth: { trigger(padId): boolean, getLevelDb(): number, dispose(): void }
 * State: activePadIds: string[] (immutable), hits: HitEntry[] (max 8, newest first),
 *        shortcutsEnabled: boolean (default true)
 * Meter: AnalyserNode RMS in dB (floor -60), written to a ref in a rAF loop,
 *        cleanup = cancelAnimationFrame; no per-frame setState
 * Live region: one <output aria-live="polite" aria-atomic="true"> with the latest hit;
 *        the history <ol> is NOT live
 * CSS Module classes: drumMachine, controls, field, pads, pad, padActive, padKey,
 *        padName, meterGroup, meter, log, logList, logItem
 * Headings: section h2 via aria-labelledby, h3 for sub-sections, no h1, no div
 */
```