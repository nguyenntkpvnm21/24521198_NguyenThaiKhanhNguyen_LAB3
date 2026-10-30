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