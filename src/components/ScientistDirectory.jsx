import styles from './ScientistDirectory.module.css';

/** @typedef {{ id: string, name: string, age: number, iq: number }} Scientist */

/** @type {Scientist[]} */
const SMART_PEOPLE = [
  { id: 'sp-1', name: 'Johann Goethe', age: 82, iq: 210 },
  { id: 'sp-2', name: 'Albert Einstein', age: 76, iq: 205 },
  { id: 'sp-3', name: 'Leonardo da Vinci', age: 67, iq: 180 },
  { id: 'sp-4', name: 'Isaac Newton', age: 84, iq: 190 },
  { id: 'sp-5', name: 'James Maxwell', age: 48, iq: 190 },
  { id: 'sp-6', name: 'William Sidis', age: 46, iq: 200 },
];

export function ScientistDirectory({ initialData = SMART_PEOPLE }) {
  return (
    <section className={styles.directory} aria-labelledby="directory-heading">
      <h2 id="directory-heading">Pioneer Directory</h2>
      <ul className={styles.list}>
        {initialData.map((p) => (
          <li key={p.id} className={styles.item}>
            {p.name} (age {p.age}) — IQ {p.iq}
          </li>
        ))}
      </ul>
    </section>
  );
}