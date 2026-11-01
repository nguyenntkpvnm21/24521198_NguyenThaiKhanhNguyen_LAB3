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
- [ ] Task 3.1: WBS and contract for PubgMatchTelemetry (docs commit)
- [ ] Task 3.2: CSS Module scaffold with agreed class names (CSS only)
- [ ] Task 3.3: Simulated telemetry API with 35% packet loss and abort support
- [ ] Task 3.4: State machine view (IDLE, LOADING, SUCCESS, ERROR) with fetch effect and AbortController cleanup (mandatory commit 1)
- [ ] Task 3.4a: Derive view state during render to avoid setState in effect (lint fix)
- [ ] Task 3.5: Squad selector with aria-pressed buttons
- [ ] Task 3.6: Success view with squad stats in a semantic dl
- [ ] Task 3.7: Skeleton loader with aria-busy and fixed 220px height
- [ ] Task 3.8: Error alert with role=alert and Reconnect Satellite Retry button (mandatory commit 2 covers 3.5 to 3.8)
- [ ] Task 3.9: Mount PubgMatchTelemetry in App
- [ ] Task 3.10: CSS layout, skeleton pulse animation, then responsive 375px (CSS only)
- [ ] Task 3.11: Verification (Slow 3G, canceled requests, CLS, grep, lint) and AI failure notes
- [ ] Task 3.12: Push to GitHub and tag ex3-done

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
 * PubgMatchTelemetry props: { squadId? = 'te' }
 * State: result { key, data, error } (key = squadId, plus retryTick once retry exists)
 * view: ViewState is derived in render: IDLE if squadId is empty, LOADING if result.key differs from the request key, ERROR if result.error is set, else SUCCESS
 * Effect deps: [squadId, retryTick]; cleanup = controller.abort()
 * Retry button label: 'Reconnect Satellite Retry'
 * CSS Module classes: telemetry, selector, selectorButton, skeleton, alert, card, stats
 * Headings: section h2 via aria-labelledby, result h3, no h1, no div
 */
```