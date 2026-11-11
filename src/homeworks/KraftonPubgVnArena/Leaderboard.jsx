import { useId, useState } from 'react';
import { getVisibleStandings } from './arenaLogic.js';
import styles from './KraftonPubgVnArena.module.css';

const SORT_OPTIONS = [
  { value: 'wwcd', label: 'WWCD' },
  { value: 'placement', label: 'Placement Points' },
  { value: 'kills', label: 'Kill Points' },
  { value: 'total', label: 'Total Points' },
];

const SORT_VALUES = new Set(SORT_OPTIONS.map((o) => o.value));

/**
 * @param {Object} props
 * @param {Array<{ squadId: string, squadName: string, wwcdCount: number, placementPts: number, killPts: number }>} props.standings
 */
export function Leaderboard({ standings }) {
  const headingId = useId();
  const queryId = useId();
  const minKillId = useId();
  const sortId = useId();
  const [query, setQuery] = useState('');
  const [minKillPts, setMinKillPts] = useState('');
  const [sortBy, setSortBy] = useState('wwcd');

  const visible = getVisibleStandings(standings, { query, minKillPts, sortBy });

  const handleMinKillChange = (e) => {
    const value = e.target.valueAsNumber;
    setMinKillPts(Number.isNaN(value) ? '' : value);
  };

  const handleSortChange = (e) => {
    const next = e.target.value;
    if (SORT_VALUES.has(next)) setSortBy(next);
  };

  return (
    <section className={styles.panel} aria-labelledby={headingId}>
      <h3 id={headingId}>PVS Leaderboard</h3>
      <form
        className={styles.filters}
        role="search"
        onSubmit={(e) => e.preventDefault()}
      >
        <p className={styles.field}>
          <label htmlFor={queryId}>Squad name</label>
          <input
            id={queryId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </p>
        <p className={styles.field}>
          <label htmlFor={minKillId}>Min Kill Points</label>
          <input
            id={minKillId}
            type="number"
            min="0"
            value={minKillPts}
            onChange={handleMinKillChange}
          />
        </p>
        <p className={styles.field}>
          <label htmlFor={sortId}>Sort by</label>
          <select id={sortId} value={sortBy} onChange={handleSortChange}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </p>
      </form>
      <output role="status" aria-live="polite" className={styles.status}>
        Showing {visible.length} of {standings.length} squads
      </output>
      <section className={styles.tableScroll} aria-label="Leaderboard table">
        <table className={styles.table}>
          <caption>Vietnam squads, sorted descending</caption>
          <thead>
            <tr>
              <th scope="col">Squad</th>
              <th scope="col" className={styles.rank}>WWCD</th>
              <th scope="col" className={styles.rank}>Placement</th>
              <th scope="col" className={styles.rank}>Kills</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((s) => (
              <tr key={s.squadId}>
                <th scope="row">{s.squadName}</th>
                <td className={styles.rank}>{s.wwcdCount}</td>
                <td className={styles.rank}>{s.placementPts}</td>
                <td className={styles.rank}>{s.killPts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </section>
  );
}