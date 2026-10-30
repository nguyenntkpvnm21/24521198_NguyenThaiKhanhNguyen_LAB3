# UIT S3T - LAB 3 AI GOVERNANCE RULES (.cursorrules)
1. STACK: React 19 + Vite + ES2024 (Builds on Lab 2).
2. NO LEGACY APIS: Ban class extends React.Component,
   ReactDOM.render, defaultProps, keyCode, window.alert.
3. ZERO DIV-SOUP: Use <main>, <section>, <article>,
   <header>, <dl>, <dt>, <dd>, <figure>, <output>.
4. A11Y FORMS: Pair every <input>/<select> with
   <label htmlFor={id}> using React 19 useId().
5. STATE HYGIENE: Immutable updates only. Never sync
   derived filter/sort state inside useEffect.
6. EFFECT CLEANUP: Every timer, listener, or fetch in
   useEffect MUST return a cleanup / AbortController.