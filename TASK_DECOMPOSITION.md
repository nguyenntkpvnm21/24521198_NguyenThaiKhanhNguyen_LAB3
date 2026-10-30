# Work Breakdown Structure (Exercise 1)
- [ ] Task 1.1: Clean boilerplate, mount StrictMode
- [ ] Task 1.2: Design tokens & reset (CSS)
- [ ] Task 1.3: DeveloperCard scaffold (article + header)
- [ ] Task 1.4: Profile & metrics dl
- [ ] Task 1.5: SkillBadge + skills list
- [ ] Task 1.6: Avatar https + fallback initials
- [ ] Task 1.7: Final semantic pass (mandatory commit 1)
- [ ] Task 1.8: CSS layout, then responsive 375px (mandatory commit 2)

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