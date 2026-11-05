import { useState } from 'react';
import { DeveloperCard } from './components/DeveloperCard.jsx';
import { ScientistDirectory } from './components/ScientistDirectory.jsx';
import { PubgMatchTelemetry } from './components/PubgMatchTelemetry.jsx';
import { DrumMachine } from './homeworks/DrumMachine/DrumMachine.jsx';
import styles from './App.module.css';

const VIEWS = [
  { id: 'lab', label: 'Lab exercises' },
  { id: 'drum', label: 'Drum Kit (HW1)' },
];

function readViewFromHash() {
  return window.location.hash === '#drum' ? 'drum' : 'lab';
}

export function App() {
  const [view, setView] = useState(readViewFromHash);

  const handleViewChange = (nextView) => {
    setView(nextView);
    const { pathname, search } = window.location;
    const hash = nextView === 'drum' ? '#drum' : '';
    window.history.replaceState(null, '', `${pathname}${search}${hash}`);
  };

  return (
    <main>
      <h1>{view === 'lab' ? 'Developer Profile' : 'Production Studio'}</h1>
      <nav aria-label="Views">
        <ul className={styles.viewSwitch}>
          {VIEWS.map((v) => (
            <li key={v.id}>
              <button
                type="button"
                className={styles.viewButton}
                aria-pressed={view === v.id}
                onClick={() => handleViewChange(v.id)}
              >
                {v.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      {view === 'lab' ? (
        <>
          <DeveloperCard />
          <ScientistDirectory />
          <PubgMatchTelemetry />
        </>
      ) : (
        <DrumMachine />
      )}
    </main>
  );
}