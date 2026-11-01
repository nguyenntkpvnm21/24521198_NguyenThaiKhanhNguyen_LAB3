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