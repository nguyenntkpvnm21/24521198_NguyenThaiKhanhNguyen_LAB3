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

- [ ] Task H2.1: Add HW2 WBS and contract (docs)
- [ ] Task H2.2: Add GrandPiano88 CSS module scaffold (CSS only, class names from contract)
- [ ] Task H2.3: Generate the 88 notes algorithmically (pianoKeys.js: MIDI 21-108, frequency, note name, isBlack)
- [ ] Task H2.4: PolyphonicSynth voice pool with click-free ADSR (noteOn, noteOff, master gain, lazy AudioContext)
- [ ] Task H2.5: FIFO voice stealing at 8 voices, allNotesOff and idempotent dispose
- [ ] Task H2.6: PianoKey with React.memo, pointer and keyboard (Enter/Space) handling
- [ ] Task H2.7: GrandPiano88 component: render 88 keys, stable callbacks, synth lifecycle
- [ ] Task H2.8: Mount GrandPiano88 in App as a separate view via #piano
- [ ] Task H2.9: Keyboard layout CSS (white and black keys, scroll container)
- [ ] Task H2.10: NoteQueue (FIFO) for recorded notes
- [ ] Task H2.11: Record notes into the FIFO queue (Record / Stop Recording)
- [ ] Task H2.12: Abortable playSequence engine with 0.5x / 1x / 2x speed
- [ ] Task H2.13: Transport UI: Play, Stop Sequence, speed select, mode state machine, abort on stop and unmount
- [ ] Task H2.14: Sustain toggle so 9 simultaneous notes can be demonstrated with a mouse
- [ ] Task H2.15: Responsive 375px CSS, focus ring and reduced motion
- [ ] Task H2.16: Verify (Profiler isolation, forbidden scan, lint, build, Lighthouse)
- [ ] Task H2.17: Add AI_FAILURE_AUDIT entries for real HW2 failures only
- [ ] Task H2.18: Mark HW2 tasks done and update contract (as built)
- [ ] Task H2.19: Push to GitHub and tag hw2-done

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