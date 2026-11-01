import { useId, useState } from 'react';
import styles from './ScientistDirectory.module.css';

/** @typedef {{ id: string, name: string, age: number, iq: number }} Scientist */
/** @typedef {'iq-desc' | 'age-asc'} SortKey */

/** @type {Scientist[]} */
const SMART_PEOPLE = [
  { id: 'sp-1', name: 'Johann Goethe', age: 82, iq: 210 },
  { id: 'sp-2', name: 'Albert Einstein', age: 76, iq: 205 },
  { id: 'sp-3', name: 'Leonardo da Vinci', age: 67, iq: 180 },
  { id: 'sp-4', name: 'Isaac Newton', age: 84, iq: 190 },
  { id: 'sp-5', name: 'James Maxwell', age: 48, iq: 190 },
  { id: 'sp-6', name: 'William Sidis', age: 46, iq: 200 },
];

const DEFAULT_MIN_IQ = 160;
const DEFAULT_SORT = 'iq-desc';
const BLOCKED_MIN_IQ_KEYS = ['e', 'E', '+', '-'];

const COMPARATORS = {
  'iq-desc': (a, b) => b.iq - a.iq,
  'age-asc': (a, b) => a.age - b.age,
};

export function ScientistDirectory({ initialData = SMART_PEOPLE }) {
  const queryId = useId();
  const minIqId = useId();
  const sortId = useId();
  const [people, setPeople] = useState(initialData);
  const [query, setQuery] = useState('');
  const [minIq, setMinIq] = useState(DEFAULT_MIN_IQ);
  const [sortBy, setSortBy] = useState(DEFAULT_SORT);

  const handleMinIqChange = (e) => {
    const value = e.target.valueAsNumber;
    setMinIq(Number.isNaN(value) ? '' : value);
  };

  const handleMinIqKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (BLOCKED_MIN_IQ_KEYS.includes(e.key)) e.preventDefault();
  };

  const handleDelete = (id) => {
    setPeople((prev) => prev.filter((p) => p.id !== id));
  };

  const handleReset = () => {
    setPeople(initialData);
    setQuery('');
    setMinIq(DEFAULT_MIN_IQ);
    setSortBy(DEFAULT_SORT);
  };

  const normalizedQuery = query.trim().toLowerCase();
  const minIqThreshold = minIq === '' ? 0 : minIq;
  const visible = people
    .filter(
      (p) =>
        p.name.toLowerCase().includes(normalizedQuery) &&
        p.iq >= minIqThreshold,
    )
    .toSorted(COMPARATORS[sortBy]);

  return (
    <section className={styles.directory} aria-labelledby="directory-heading">
      <h2 id="directory-heading">Pioneer Directory</h2>
      <form
        className={styles.filters}
        role="search"
        onSubmit={(e) => e.preventDefault()}
      >
        <p className={styles.field}>
          <label htmlFor={queryId}>Name</label>
          <input
            id={queryId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </p>
        <p className={styles.field}>
          <label htmlFor={minIqId}>Min IQ</label>
          <input
            id={minIqId}
            type="number"
            min="0"
            value={minIq}
            onChange={handleMinIqChange}
            onKeyDown={handleMinIqKeyDown}
          />
        </p>
        <p className={styles.field}>
          <label htmlFor={sortId}>Sort by</label>
          <select
            id={sortId}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="iq-desc">IQ (high to low)</option>
            <option value="age-asc">Age (young to old)</option>
          </select>
        </p>
        <p className={styles.actions}>
          <button type="button" onClick={handleReset}>
            Reset
          </button>
        </p>
      </form>
      <output className={styles.status} role="status" aria-live="polite">
        Found {visible.length} {visible.length === 1 ? 'pioneer' : 'pioneers'}
      </output>
      <ul className={styles.list}>
        {visible.map((p) => (
          <li key={p.id} className={styles.item}>
            {p.name} (age {p.age}) — IQ {p.iq}{' '}
            <button
              type="button"
              className={styles.deleteButton}
              aria-label={`Delete ${p.name}`}
              onClick={() => handleDelete(p.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}