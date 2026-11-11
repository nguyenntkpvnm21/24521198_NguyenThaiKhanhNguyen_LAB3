# AI_FAILURE_AUDIT.md

Log of defects introduced by AI-generated output and caught during review.
Entries are added as they are found across Lab 3.

## Failure #01: JSX and CSS mixed in one commit (non-atomic commit plan)

- **Prompt**: Asked an AI assistant for a step-by-step guide to build Exercise 1
  (DeveloperCard + SkillBadge) from the lab slides.
- **AI output**: The first guide planned a single commit that both added
  `className={styles.xxx}` to `DeveloperCard.jsx` and wrote the matching rules
  in `DeveloperCard.module.css`.
- **Bug**: This violates the Lab 1 atomic-commit rule, which states that commits
  combining CSS with HTML/JS score 0 points. It also made the planned history
  harder to verify, because one commit would carry two unrelated concerns.
- **Detection method**: Cross-checked the AI's plan against the Lab 1 and Lab 2
  slides (atomic commit rules, WBS, no hardcoded hex values) before executing it.
  Note: the faulty plan was never run, so there is no DevTools evidence for this
  entry. The evidence is the plan itself versus the slide rules.
- **Engineering fix**: Split the work so that structure and CSS never share a
  commit:
  - `e8f75cd` `feat(ex1): implement semantic DeveloperCard and SkillBadge`
    (JSX, CSS Module import and `className` hooks only)
  - `44bd325`, `e6e2274`, `535dad5` (CSS-only `style(ex1)` commits)
- **Related defects found in the same review**:
  - Colour tokens were declared on `.card` with hardcoded hex values inside
    rules; fixed by moving all tokens to `:root` in `index.css`.
  - `aria-label` was placed on `<dl>` elements, which can trigger Lighthouse
    warnings; removed (kept only on `<ul>`).
  - A planned commit imported `DeveloperCard` before the file existed, which
    would break the build; reordered so every commit builds.

    ## Failure #02: Empty number input coerced to 0 (Exercise 2, Min IQ filter)

- **Prompt**: Task 2.6 of the Ex2 WBS (one task only): add a Min IQ numeric
  filter that reads `e.target.valueAsNumber`.
- **AI output**: The handler followed the reference pattern from the Lab 3
  slide and stored `0` whenever the value was not a number:
  ```js
  const handleMinIqChange = (e) => {
    const value = e.target.valueAsNumber;
    setMinIq(Number.isNaN(value) ? 0 : value);
  };
  ```
- **Bug**: When the field is cleared, `valueAsNumber` is `NaN`, so the handler
  stores `0`. The input is controlled, so React renders `0` back into the field
  and the next digits are appended to it: typing `195`, clearing the field and
  typing `211` shows `0211`. The state cannot tell an empty field apart from a
  real `0`.
- **Detection method**: Manual edge-case test (clear the field, then type
  again). Lint and the happy path (typing a number once) did not reveal it.
- **DevTools proof**: Screenshot of the page showing `0211` in the Min IQ field
  (`ex2-bug-miniq-0211.png`, included in the Lab 3 PDF). A React DevTools
  screenshot of the `minIq` state was not captured before the fix.
- **Engineering fix (commit `fc81ee9`)**: Keep the state as `number | ''`. The
  handler stores `''` when `Number.isNaN(value)`, and the filter derives
  `const minIqThreshold = minIq === '' ? 0 : minIq` during render, so there is
  still no `useEffect` and no extra state. The faulty version was caught before
  it was committed, so the fix ships inside
  `feat(ex2): add search, IQ filter & toSorted`.
- **Verification after fix**: Repeated 195, clear, 211. The field stays empty
  after clearing (all 6 people visible) and shows `211` afterwards (empty
  list). `npm run lint` is clean.
- **Lesson**: Never map an empty or invalid reading to a valid value (`0`) in
  the `onChange` of a controlled number input. Keep "empty" as its own state
  and convert it only where the value is used.

  ## Failure #03: setState called synchronously inside useEffect (Exercise 3)
- **Prompt**: "Implement PubgMatchTelemetry with a 4-state machine and
  AbortController, following the reference contract."
- **AI output**: The effect started with `setView({ status: 'LOADING', ... })`
  before calling the fetch function, copied from the reference pattern.
- **Bug**: Setting state synchronously in an effect schedules an extra render
  right after commit (a cascading render). The LOADING status is a pure function
  of "the settled result does not match the current request", so it should be
  derived during render and not written into state.
- **Detection method**: `npm run lint` reported
  `react(set-state-in-effect): Calling setState synchronously within an effect
  can trigger cascading renders` at PubgMatchTelemetry.jsx:12.
- **DevTools proof**: ex3-lint-setstate-before.png (lint output before the fix).
  No Profiler render count was captured before the fix, so none is claimed.
- **Engineering fix (commit 99d6541)**: Stored only the last settled result with
  a request key, derived IDLE/LOADING/ERROR/SUCCESS during render, and kept the
  effect for the network call and `controller.abort()` cleanup only.
- **Verification after fix**: ex3-lint-setstate-after.png shows 0 warnings;
  switching squads on Slow 3G still shows the skeleton and `(canceled)` for
  stale requests.
- **Lesson**: Do not copy "set LOADING at the start of an effect". If a value
  can be computed from state and props, derive it during render.

  ## Failure #04: IME (UniKey) breaks e.code shortcuts and ghost-triggers pads (HW1)

- **Prompt**: "Implement useDrumKeyboard(padMap, onTriggerPad, isEnabled) with
  e.code, an e.repeat guard and input isolation, as in the HW1 contract."
- **AI output**: A window keydown listener reading padMap.get(e.code),
  commented as "IME-safe". A first patch added an e.key fallback that
  turned events with e.code === '' into pad hits.
- **Bug**: With Vietnamese Telex IME (UniKey) on, the physical keydown is
  swallowed and replaced by synthetic events (code "", a marker character,
  Backspaces, re-typed letters). The first version dropped hits (only the
  first D worked). The e.key fallback fixed D but replayed a typed "a" after
  "s", so pressing A then S logged Kick, Kick, Snare. After the final fix,
  pads triggered only by a keyup never lit up, because aria-pressed went
  true and false inside one React batch.
- **Detection method**: Manual test with UniKey on, plus a temporary
  keydown/keyup logger in the Console printing code, key and repeat.
- **DevTools proof**: Console screenshots of the raw event stream (events
  with code "" and Backspace between the physical events), and a Hit log
  screenshot showing Kick, Kick, Snare after pressing A then S once each.
  Both are in the submission PDF.
- **Engineering fix (commit 06d6f54)**: Ignore every event whose e.code is
  empty. Track physical keydowns in a Set and trigger the pad from keyup
  when its keydown was swallowed. Earlier attempt: 22e7903 (e.key fallback,
  which introduced the ghost hit). Visual feedback: 3a84868 (a pad stays
  active for at least 120 ms).
- **Verification after fix**: With UniKey on, A then S gives exactly two
  hits, and D, A, W pressed five times each give five hits; with UniKey off
  every press gives one hit.
- **Lesson**: A spec claiming e.code is IME-safe is not proof. Test with the
  real IME, log the raw events before patching, and never design a fallback
  from the symptom of a single key.

  ## Failure #05: Shortcuts blocked after clicking a checkbox (HW1)

- **Prompt**: "Implement useDrumKeyboard(padMap, onTriggerPad, isEnabled) with
  e.code, an e.repeat guard and input isolation, as in the HW1 contract."
- **AI output**: An isolation guard that ignores every event whose target
  tag is INPUT, TEXTAREA or SELECT, copied from the slide's reference hook.
- **Bug**: A checkbox is also an INPUT. After toggling the "Keyboard
  shortcuts" checkbox with the mouse, focus stayed on it, so every drum key
  was ignored even though the checkbox was checked.
- **Detection method**: Manual test: toggle the checkbox off and on with the
  mouse, then press A, S and D.
- **DevTools proof**: Screenshot of the Hit log not gaining any row after
  pressing A, S and D while the checkbox had focus (in the submission PDF).
- **Engineering fix (commit f51eae0)**: Only text-entry fields block the
  shortcuts: textarea, select, contentEditable and input types that accept
  text. Checkbox, radio, button and similar input types no longer block.
- **Verification after fix**: With the checkbox focused, A and S play; typing
  in the Session name field still plays nothing.
- **Lesson**: Matching on tag name alone is too coarse for form controls.
  Decide by whether the focused element accepts typed text.

  ## Failure #06: Phase label hidden after a claim (HW3)

- **Prompt**: Task H3.7: build CrateCard showing countdown, price, stock,
  a derived DropPhase and a Claim button, with one polite output for the
  claim message or the phase label.
- **AI output**: statusText was chosen with
  `claim.status === 'IDLE' ? PHASE_LABELS[phase] : claim.message`.
- **Bug**: After the first claim, claim.status never returns to 'IDLE', so
  the output always shows the claim message and never the phase label. The
  derived LOOTED_OUT phase was computed correctly (stock 0, button
  disabled) but users could not see it, so one of the four DropPhase
  states was invisible in the UI.
- **Detection method**: Manual test after reload: claimed the last crate
  twice (first claim returns the deterministic 409, second succeeds).
  Compared the visible text with the phase expected by the contract.
- **DevTools proof**: A screenshot of the crate card after the second claim
  (stock 0, Claim button disabled, status text only "Claimed
  successfully") is in the submission PDF.
- **Engineering fix (commit 7a4c524)**: Append the phase label to the
  message when the claim succeeded and the phase is LOOTED_OUT or EXPIRED.
  The label is not added while the claim is PENDING, because the optimistic
  stock of 0 would briefly read as "Looted out" before a 409 restores it.
- **Verification after fix**: Reloaded and repeated the two claims. The
  first shows the 409 message with stock restored to 1; the second shows
  "Claimed successfully. Looted out". A screenshot is in the submission
  PDF.
- **Lesson**: A status line built from only one source of truth (claim
  state) can hide a state derived from another (phase). Test every value of
  the derived enum in the real UI, not only that the derivation is correct.