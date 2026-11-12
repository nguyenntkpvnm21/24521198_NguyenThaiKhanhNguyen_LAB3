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
- [x] Task H1.1: WBS and contract for Production Studio Drum Kit (docs commit)
- [x] Task H1.2: CSS Module scaffold with agreed class names (CSS only)
- [x] Task H1.3: Pad map keyed by e.code (data only)
- [x] Task H1.4: Web Audio drum synth engine (no audio files)
- [x] Task H1.5: useDrumKeyboard hook (e.code, repeat guard, input isolation, cleanup)
- [x] Task H1.6: DrumPad button with aria-pressed
- [x] Task H1.7: DrumMachine with active pads and hit log output
- [x] Task H1.8: Decibel meter with AnalyserNode
- [x] Task H1.9: Keyboard shortcuts toggle (WCAG 2.1.4)
- [x] Task H1.10: Mount DrumMachine in App as a separate view
- [x] Task H1.11: CSS layout, responsive 375px, focus ring, reduced motion (CSS only)
- [x] Task H1.12: Verification (Lighthouse, Accessibility tree, grep, lint) and AI failure notes
- [x] Task H1.13: Push to GitHub and tag hw1-done
- [x] Task H1.14: Handle UniKey synthetic key events (empty e.code fallback)
- [x] Task H1.15: Do not block shortcuts when focus is on a checkbox or button
- [x] Task H1.16: Ignore IME synthetic events and recover swallowed keydown from physical keyup
- [x] Task H1.17: Keep a pad visually active for a minimum duration
- [x] Task H1.18: Open the Drum Kit view directly via #drum (Lighthouse audit target)
- [x] Task H1.19: Session name text field (proves shortcuts pause while typing)

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
 * CSS Module classes: drumMachine, field, pads, pad, padActive, padKey,
 *        padName, meterGroup, meter, log, logList, logItem
 * Headings: section h2 via aria-labelledby, h3 for sub-sections, no h1, no div
 */
```

### HW1 contract amendments (as built)
- Extra classes in App.module.css: viewSwitch, viewButton (view switch in App).
- Hook ignores events with empty e.code (IME synthetic) and recovers a swallowed keydown from keyup.
- Input isolation: text-entry fields only; checkbox, radio and buttons do not block shortcuts.
- A pad stays visually active for at least 120 ms (MIN_ACTIVE_MS).
- Extra state: sessionName (text field proving input isolation).
- App opens the Drum Kit view when the URL hash is #drum.

# Work Breakdown Structure (Homework 2)

- [x] Task H2.1: Add HW2 WBS and contract (docs)
- [x] Task H2.2: Add GrandPiano88 CSS module scaffold (CSS only, class names from contract)
- [x] Task H2.3: Generate the 88 notes algorithmically (pianoKeys.js: MIDI 21-108, frequency, note name, isBlack)
- [x] Task H2.4: PolyphonicSynth voice pool with click-free ADSR (noteOn, noteOff, master gain, lazy AudioContext)
- [x] Task H2.5: FIFO voice stealing at 8 voices, allNotesOff and idempotent dispose
- [x] Task H2.6: PianoKey with React.memo, pointer and keyboard (Enter/Space) handling
- [x] Task H2.7: GrandPiano88 component: render 88 keys, stable callbacks, synth lifecycle
- [x] Task H2.8: Mount GrandPiano88 in App as a separate view via #piano
- [x] Task H2.9: Keyboard layout CSS (white and black keys, scroll container)
- [x] Task H2.10: NoteQueue (FIFO) for recorded notes
- [x] Task H2.11: Record notes into the FIFO queue (Record / Stop Recording)
- [x] Task H2.12: Abortable playSequence engine with 0.5x / 1x / 2x speed
- [x] Task H2.13: Transport UI: Play, Stop Sequence, speed select, mode state machine, abort on stop and unmount
- [x] Task H2.14: Sustain toggle so 9 simultaneous notes can be demonstrated with a mouse
- [x] Task H2.15: Responsive 375px CSS, focus ring and reduced motion
- [x] Task H2.16: Verify (Profiler isolation, forbidden scan, lint, build, Lighthouse)
- [x] Task H2.17: Add AI_FAILURE_AUDIT entries for real HW2 failures only (no entry added: no real AI failure was observed in HW2)
- [x] Task H2.18: Mark HW2 tasks done and update contract (as built)
- [x] Task H2.19: Push to GitHub and tag hw2-done

* RULE: Never prompt AI with more than 1 sub-task at a time.
* RULE: Commits contain JSX/JS only or CSS only, never both.

## HW2 contract

```js
// src/homeworks/GrandPiano88/pianoKeys.js
/** @typedef {{ midi: number, noteName: string, isBlack: boolean, freqHz: number }} Note */
// MIDI_MIN = 21 (A0), MIDI_MAX = 108 (C8). midiToFrequency(midi) = 440 * 2 ** ((midi - 69) / 12).
// PIANO_NOTES: Note[] generated once at module level with Array.from (52 white + 36 black).
// Note name = pitch class + octave, octave = Math.floor(midi / 12) - 1 (A0, C#4, C8).

// src/homeworks/GrandPiano88/PolyphonicSynth.js  (class, as in the slide; plain JS engine, not a component)
// new PolyphonicSynth(maxVoices = 8)
//   noteOn(midi, freqHz) -> { started: boolean, stolenMidi: number | null }
//   noteOff(midi)        -> boolean            (idempotent: unknown midi returns false)
//   allNotesOff()        -> number[]           (released midi list)
//   dispose()            -> void               (safe to call twice)
//   voices: Map<number, { osc, gain }>         (insertion order = FIFO)
// ADSR: attack 0.01s, decay 0.08s, sustain 0.7 of peak, release 0.04s
//       (exponential ramp to 0.0001 before osc.stop()). Master gain keeps 8 voices below 1.0.
// AudioContext is created lazily on the first noteOn and resumed if suspended.

// src/homeworks/GrandPiano88/NoteQueue.js
// class NoteQueue: enqueue(item), dequeue(), peek(), size, clear(), toArray(), static from(items)

// src/homeworks/GrandPiano88/playSequence.js
/** @typedef {{ midi: number, freqHz: number, durationMs: number, deltaMs: number }} RecordedNote */
// playSequence(events, { speed, signal, onNoteOn, onNoteOff }) -> Promise<boolean>
//   resolves true when finished, false when aborted. Never rejects on abort.
//   Builds a fresh NoteQueue from events and dequeues in FIFO order.
//   Waits use an absolute timeline (performance.now) so delays do not accumulate drift.
//   Every timer is cleared when signal aborts.

// src/homeworks/GrandPiano88/PianoKey.jsx
// PianoKey = memo(function PianoKey({ midi, noteName, isBlack, isPressed, onNoteOn, onNoteOff }))
//   Only primitive props. onNoteOn and onNoteOff are stable (useCallback).
//   <button type="button" aria-pressed>, name from visible text <span>{noteName}</span>.
//   Pointer: down -> onNoteOn; up, leave, cancel, blur -> onNoteOff.
//   Keyboard: Enter / Space keydown (not repeat) -> onNoteOn; keyup -> onNoteOff.

// src/homeworks/GrandPiano88/GrandPiano88.jsx
// GrandPiano88() has no props.
// State: pressedMidis: ReadonlySet<number> (new Set on every update),
//        mode: 'IDLE' | 'RECORDING' | 'PLAYING', recording: RecordedNote[],
//        speed: 0.5 | 1 | 2, sustain: boolean.
// Refs: synthRef, recorderRef (null when not recording), abortRef (AbortController).
// Derived in render: isPressed = pressedMidis.has(midi). No useEffect for derived state.
// Cleanup: unmount aborts the controller, then synth.dispose().
// Controls: Record, Stop Recording, Play, Stop Sequence (buttons), Speed (select with label and useId),
//           Sustain (checkbox with label and useId), <output> for recorded note count.

// CSS classes (GrandPiano88.module.css):
// grandPiano, controls, field, transport, button, status,
// keyboard, keyItem, whiteItem, blackItem, key, keyWhite, keyBlack, keyPressed, keyName
// Layout: keyboard is a horizontally scrollable <ul>; black key <li> has zero width and its
// button is centered on the boundary between two white keys. No inline style, no hardcoded hex.
```

### HW2 contract amendments (as built)

- Engine files live in `src/homeworks/GrandPiano88/` next to the component, not in `src/audio/` as in the slide sample.
- `PolyphonicSynth`: the slide sample calls `this.noteOff()` but never defines it. Added `noteOff`, a master gain (0.5), attack/decay/sustain/release, `allNotesOff` and `dispose`. `noteOn` returns `{ started, stolenMidi }` so the UI can clear the key that was stolen.
- `PianoKey`: added `onPointerLeave`, `onPointerCancel`, `onBlur` and Enter/Space handlers. The slide sample only has pointer down/up, which cannot be used with a keyboard.
- Task H2.14 (Sustain checkbox) goes beyond the slide. A mouse cannot hold 9 keys at once, so Sustain is the only way to demonstrate FIFO voice stealing on desktop. Record and Play are disabled while Sustain is on, and `handleNoteOff` reads it through `sustainRef` so the callback stays stable for `React.memo`.
- `playSequence`: note starts follow an absolute timeline from `performance.now()` (no accumulated drift); each release is timed from the note's actual start (`durationMs / speed`).
- Layout: black keys are zero-width list items whose buttons are absolutely positioned, so no inline styles are needed.
- Forbidden-pattern scan: `keypress` became `keypress(?!ed)` because the class name `keyPressed` matched the case-insensitive pattern.
- Known limitations: 88 keys are 88 Tab stops (no roving tabindex), and dragging across keys does not glissando because each key needs its own press.

# Work Breakdown Structure (Homework 3)

- [x] Task H3.1: Add HW3 WBS and contract (docs)
- [x] Task H3.2: Add KraftonPubgVnArena CSS module scaffold (CSS only, class names from contract)
- [x] Task H3.3: Add arena data: three crate drops and four squad standings (data only)
- [x] Task H3.4: Add pure helpers: formatVnd, formatCountdown, getDropPhase, getVisibleStandings
- [x] Task H3.5: Add usePubgAirdropTimer as in the slide, then run lint and record real findings
- [x] Task H3.5a: Fix exhaustive-deps warning in usePubgAirdropTimer (lint fix)
- [x] Task H3.5b: Return nowMs from usePubgAirdropTimer so EXPIRED can be derived
- [x] Task H3.6: Add simulated API: abortable wait, fetchServerOffset, claimCrate with deterministic 409
- [x] Task H3.7: Add CrateCard: countdown, derived phase, VND price, stock, claim button
- [x] Task H3.8: Add Leaderboard: name filter, min kill points, sort select, derived with toSorted
- [x] Task H3.9: Add KraftonPubgVnArena shell: render crates and leaderboard, load server offset with AbortController
- [x] Task H3.10: Mount KraftonPubgVnArena in App as a separate view via #arena
- [x] Task H3.11: Optimistic claim, 409 rollback and in-flight claimId lock
- [x] Task H3.12: Responsive 375px CSS, focus ring and reduced motion (CSS only)
- [x] Task H3.13: Verify (background tab resync, 409 rollback, double click, Lighthouse, forbidden scan, lint, build)
- [x] Task H3.13a: Show the phase label after a successful claim so LOOTED_OUT is visible (fix)
- [x] Task H3.14: Add AI_FAILURE_AUDIT entries for real HW3 failures only (one entry added: #06)
- [x] Task H3.15: Mark HW3 tasks done and update contract (as built)
- [x] Task H3.16: Push to GitHub and tag hw3-done

* RULE: Never prompt AI with more than 1 sub-task at a time.
* RULE: Commits contain JSX/JS only or CSS only, never both.

## HW3 contract

```js
// All files live in src/homeworks/KraftonPubgVnArena/ (no virtual list: only 3 crates and 4 squads).

// arenaData.js
/** @typedef {'WARMUP'|'AIRDROP_LIVE'|'LOOTED_OUT'|'EXPIRED'} DropPhase */
/** @typedef {{ id: string, title: string, priceVnd: number, remainingStock: number, dropEpochMs: number }} PubgCrateDrop */
/** @typedef {{ squadId: 'te'|'ces'|'roy'|'agg', squadName: string, wwcdCount: number, placementPts: number, killPts: number }} PubgVnSquadStanding */
// CLAIM_WINDOW_MS = 120000. SERVER_SKEW_MS = 1500 (simulated server clock ahead of the local clock).
// createDemoDrops(serverNowMs): PubgCrateDrop[]
//   'vip-pass'    'PVS Finals VIP Pass + 5,000 G-Coin', stock 5,  drops at serverNowMs + 30000
//   'gcoin-crate' 'G-Coin Contraband Crate',            stock 20, drops at serverNowMs + 20000
//   'last-crate'  'Limited Contraband Crate (last one)', stock 1, drops at serverNowMs + 20000
// SQUAD_STANDINGS: PubgVnSquadStanding[]  (The Expendables, Cerberus Esports, Roy Esports, AGG; invented demo numbers)

// arenaLogic.js (pure functions, no React)
// formatVnd(n) = Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
// formatCountdown(ms) -> 'mm:ss' (rounded up to whole seconds)
// getDropPhase(nowMs, crate, stock) -> DropPhase
//   nowMs < dropEpochMs -> WARMUP; else stock <= 0 -> LOOTED_OUT;
//   else nowMs >= dropEpochMs + CLAIM_WINDOW_MS -> EXPIRED; else AIRDROP_LIVE.
// getVisibleStandings(standings, { query, minKillPts, sortBy }) -> filter by name + killPts, then toSorted
//   sortBy: 'wwcd' | 'placement' | 'kills' | 'total' (total = placementPts + killPts), all descending,
//   ties broken by squadName.localeCompare. minKillPts: number | '' ('' treated as 0).

// usePubgAirdropTimer.js
// usePubgAirdropTimer(targetEpochMs, serverOffsetMs = 0) -> { nowMs, remainingMs, isLive }
//   nowMs = Date.now() + serverOffsetMs, re-read every 200 ms AND immediately on visibilitychange (tab visible).
//   remainingMs = Math.max(0, targetEpochMs - nowMs). isLive = remainingMs === 0 (slide meaning, not a phase).
//   Cleanup: clearInterval + removeEventListener('visibilitychange').

// arenaApi.js
// wait(ms, signal): abortable delay (same pattern as playSequence).
// fetchServerOffset({ signal }) -> Promise<number>   resolves SERVER_SKEW_MS after 300 ms
// claimCrate(crateId, claimId, { signal }) -> Promise<{ claimId: string }>
//   resolves after 800 ms; rejects with error.status === 409 and message 'Looted Out' on the FIRST claim of
//   'last-crate' only (module counter, deterministic); rejects with AbortError when signal aborts.

// CrateCard.jsx: props { crate, stock, claim, serverOffsetMs, onClaim }
//   claim: { status: 'IDLE'|'PENDING'|'SUCCESS'|'CONFLICT', message: string }
//   Calls usePubgAirdropTimer(crate.dropEpochMs, serverOffsetMs); phase = getDropPhase(nowMs, crate, stock).
//   <time> shows the countdown (no aria-live). One <output aria-live="polite" aria-atomic="true"> shows the
//   claim message or the phase label, so it only changes on phase or claim changes.
//   Claim button: type="button", disabled unless phase === 'AIRDROP_LIVE' and claim.status !== 'PENDING'.

// Leaderboard.jsx: props { standings }. State: query, minKillPts: number | '', sortBy. Visible rows derived in render,
//   no useEffect. useId labels for the search input, min kill points input and sort select. <table> with <caption>,
//   scrollable region inside its own container. Result count in <output role="status" aria-live="polite">.

// KraftonPubgVnArena.jsx: no props.
// State: drops (createDemoDrops, lazy init, never mutated), stocks: Record<id, number>,
//        claims: Record<id, { status, message }>, serverOffsetMs: number (default 0).
// Refs: abortRef (AbortController for the mount effect), inFlightRef (Map<crateId, claimId>, synchronous lock).
// Effect (deps []): AbortController, fetchServerOffset, ignore AbortError, cleanup = abort.
// handleClaim(crateId): return if inFlightRef.has(crateId); claimId = crypto.randomUUID(); set lock;
//   optimistic: setStocks(prev => ({ ...prev, [id]: prev[id] - 1 })), claims PENDING;
//   on success -> SUCCESS; on error.status === 409 -> rollback with the functional form
//   setStocks(prev => ({ ...prev, [id]: prev[id] + 1 })) and CONFLICT; AbortError -> ignore;
//   finally -> inFlightRef.delete(crateId). Handlers never read stale state.

// CSS classes (KraftonPubgVnArena.module.css):
// arena, panel, crateList, crate, crateTitle, details, countdown, stock, status, claimButton,
// filters, field, tableScroll, table, rank
// Headings: section h2 via aria-labelledby, h3 per crate and leaderboard, no h1, no div, key={crate.id} / key={squadId}.
```

### HW3 contract amendments (as built)

- No virtual list: the slide mentions the Slide 22 Virtual Scroller only as the idea's origin; there are only 3 crates and 4 squads.
- Hook and engine files live in `src/homeworks/KraftonPubgVnArena/` (not `src/hooks/` as in the slide sample).
- Squad ids are `te | ces | roy | agg`. The slide contract lists `ge` but names Roy Esports and AGG, so Roy Esports uses `roy`. Standings numbers are invented demo data.
- `usePubgAirdropTimer`: the slide version triggered a real lint warning (`react-hooks/exhaustive-deps`, missing `calcRemaining`; screenshot in the submission PDF). The built hook keeps only the local clock in state, derives `nowMs` and `remainingMs` in render, and returns `nowMs` so `EXPIRED` can be derived. `isLive` keeps the slide meaning (remaining is 0) and is not a phase.
- The slide says "monotonic" but uses `Date.now()`, a wall clock. `serverOffsetMs` is a simulated one-time offset (+1500 ms). Changing the system clock during a drop would shift the countdown.
- Phase is derived by `getDropPhase`, never stored. Claim window is 2 minutes; the three drops open 20 to 30 seconds after the page loads.
- The 409 is deterministic: only the first claim of `last-crate` per page load returns 409 (module counter), so a reload is needed to see it again. Switching views does not reset it.
- Double click is blocked by two layers: the disabled button while PENDING and a synchronous `inFlightRef` Map keyed by crate id holding the `claimId`.
- Rollback and claim updates use the functional form of `setState`; `AbortError` is ignored.
- Leaderboard "kill-feed filter" was not described in the slide. Built as name search, Min Kill Points (`number | ''`) and a sort select, all derived in render with `toSorted`.
- Task H3.5a/b were fixed in one commit because both change the same hook.
- Real failure found by testing: the LOOTED_OUT label was hidden after a claim (task H3.13a, audit #06).

# Work Breakdown Structure (Bonus)

- [x] Task B.1: Add Bonus WBS and contract (docs)
- [x] Task B.2: Add SituationshipAnalyzer CSS Module scaffold with all contract class names (CSS only)
- [x] Task B.3: Add pure phase constants and transition(phase, action) in situationshipLogic.js
- [x] Task B.4: Add pure helpers createSignal, getScore, isRedFlag in situationshipLogic.js
- [x] Task B.5: Add abortable waitForReply(ms, signal) in replyWait.js
- [x] Task B.6: Add SituationshipAnalyzer with phase FSM, signal inputs and immutable signal log (commit: feat(fsm): model HenHoKhongYeu state machine)
- [x] Task B.7: Mount SituationshipAnalyzer in App as view #bonus
- [x] Task B.8: Add derived red-flag output and ghosting timer with AbortController cleanup (commit: feat(ui): add derived red-flag meter & ghosting cleanup)
- [x] Task B.9: Add responsive 375px layout, focus ring and reduced motion (CSS only)
- [x] Task B.10: Verify (Node check, StrictMode, abort cases, Lighthouse, forbidden scan, lint, build)
- [x] Task B.11: Document amendments (and audit entries only for real failures)
- [x] Task B.12: Mark Bonus tasks done and update contract
- [ ] Task B.13: Push to GitHub and tag bonus-done

* RULE: Never prompt AI with more than 1 sub-task at a time.
* RULE: Commits contain JSX/JS only or CSS only, never both.

## Bonus contract

Files: `src/components/SituationshipAnalyzer.jsx`, `SituationshipAnalyzer.module.css`,
`situationshipLogic.js` (pure, no React), `replyWait.js`. View `#bonus` in App.

Decisions:
- Phase set follows the slide code block (the slide description lists a different set).
- Initial phase is DATING_NO_LOVE, as in the slide component.
- Default signals: Em 100 steps x 0.1, Ai Do 1 step x 50. Score = sum of steps x multiplier.
- One FSM value `phase`; no isDating / isLoved booleans.

```js
/**
 * @typedef {'FRIENDS' | 'DATING_NO_LOVE' | 'OFFICIAL_LOVE' | 'GHOSTED_EXIT'} RelationshipPhase
 * @typedef {'START_DATING' | 'COMMIT' | 'GHOST' | 'RESET'} PhaseAction
 * @typedef {'EM' | 'AI_DO'} EffortActor
 *
 * @typedef {Object} EffortSignal
 * @property {string} id            crypto.randomUUID(), used as React key
 * @property {EffortActor} actor
 * @property {number} steps
 * @property {number} multiplier
 */

/*
 * FSM transition table (any other pair returns the same phase):
 *   FRIENDS        --START_DATING--> DATING_NO_LOVE
 *   DATING_NO_LOVE --COMMIT--------> OFFICIAL_LOVE
 *   DATING_NO_LOVE --GHOST---------> GHOSTED_EXIT
 *   GHOSTED_EXIT   --RESET---------> FRIENDS
 */

/** @returns {RelationshipPhase} */
export function transition(phase, action) {}

/** @returns {EffortSignal} */
export function createSignal(actor, steps, multiplier) {}

/** Sum of steps * multiplier for one actor. @returns {number} */
export function getScore(signals, actor) {}

/** phase === 'DATING_NO_LOVE' && emScore < rivalScore. @returns {boolean} */
export function isRedFlag(phase, emScore, rivalScore) {}

/** Resolves after ms, rejects with signal.reason on abort. @returns {Promise<void>} */
export function waitForReply(ms, signal) {}

/*
 * Component state (useState):
 *   phase: RelationshipPhase             (initial 'DATING_NO_LOVE')
 *   signals: EffortSignal[]              (immutable log, [...prev, signal])
 *   pendingPingId: string | null         (id of the unanswered Em signal)
 *   emSteps, emMultiplier, rivalSteps, rivalMultiplier: number | ''
 * Derived in render (no useEffect, no extra state):
 *   emScore, rivalScore, redFlag, isEmInputValid, isRivalInputValid
 *
 * Effect (deps: phase, pendingPingId):
 *   if phase !== 'DATING_NO_LOVE' or pendingPingId === null: return
 *   new AbortController(); waitForReply(5000, signal)
 *     .then(() => setPhase((p) => transition(p, 'GHOST')))
 *     .catch(ignore AbortError)
 *   cleanup: controller.abort()
 * Abort cases: Ai Do replies, a new Em ping, Dung lai (GHOST), RESET, unmount.
 *
 * <output role="status" aria-live="polite">: short text only when
 * redFlag or phase changes. Every input has label htmlFor from useId().
 *
 * CSS Module classes: card, header, phase, controls, field, actions,
 * button, scores, status, log, logItem
 */
```

### Bonus contract amendments (as built)

- Phase names follow the slide's type contract:
  FRIENDS, DATING_NO_LOVE, OFFICIAL_LOVE, and GHOSTED_EXIT.
  The initial phase is DATING_NO_LOVE.

- Only transitions in the agreed FSM table are accepted.
  Other phase/action pairs preserve the current phase.
  OFFICIAL_LOVE has no outgoing transition in this version.

- Relationship status is stored in one phase value.
  UI checks such as isDating and isWaiting are derived values,
  not independently stored relationship booleans.

- Signal inputs initially contain Em: 100 steps x 0.1 and
  Ai Do: 1 step x 50, following the slide's component formula.
  The action log starts empty, so both scores initially equal zero.
  Each score is the sum of steps x multiplier for that actor.

- Signal entries are created in event handlers with
  crypto.randomUUID() and frozen with Object.freeze().
  The log is updated immutably using spread syntax.
  createSignal generates an ID and is not strictly deterministic.
  transition, getScore, and isRedFlag are pure deterministic helpers.

- Numeric fields use valueAsNumber and preserve an empty field as ''.
  Signal buttons require finite positive steps and multipliers.

- Scores and the red-flag condition are computed during render.
  The warning applies only in DATING_NO_LOVE when emScore < rivalScore.
  The UI presents numeric scores and a textual status indicator;
  no separate HTML meter element is used.

- The status uses output with role="status" and aria-live="polite".
  Waiting feedback and the signal log remain outside the live region.
  All signal inputs have labels associated through useId().

- Ghosting starts only after an Em signal is submitted.
  Editing an input alone does not start or restart the timer.
  A new Em signal replaces pendingPingId and restarts the 5-second wait.

- waitForReply is an abortable timeout simulation, not a network request.
  Completion represents an unanswered message reaching its deadline.
  The phase then transitions to GHOSTED_EXIT.

- An Ai Do reply cancels the pending wait and adds its effort signal.
  It does not automatically transition to OFFICIAL_LOVE.
  Mutual commitment is represented by the separate COMMIT action.

- Effect cleanup aborts the pending wait when its dependencies change
  or the component unmounts. Abort clears the timer; the abort listener
  is removed on normal completion or consumed once on cancellation.
  AbortError is ignored as an expected cancellation outcome.

- GHOSTED_EXIT changes the phase without unmounting the analyzer.
  Switching to another App view unmounts it.
  Cleanup releases resources; JavaScript garbage collection cannot
  be forced or guaranteed by a phase change.

- StrictMode is enabled in development. Its extra mount-time effect
  check occurs while pendingPingId is initially null.
  It does not imply two active timers for every Em signal.

- Styling uses CSS Modules and existing CSS custom properties.
  The layout starts with one column, supports a 375px viewport,
  and provides visible keyboard focus and 44px minimum control heights.
  Button transitions run only with prefers-reduced-motion: no-preference.

- Verification passed: Node checks, browser cases from B.8,
  responsive and keyboard checks, forbidden-pattern scans,
  lint, and production build.
  Lighthouse Accessibility and Best Practices both scored 100
  in Desktop and Mobile modes.

- No new Bonus AI failure was reported during these checks.
  Existing audit entries are preserved.