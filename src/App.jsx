import { useState } from 'react';
import { DeveloperCard } from './components/DeveloperCard.jsx';
import { ScientistDirectory } from './components/ScientistDirectory.jsx';
import { PubgMatchTelemetry } from './components/PubgMatchTelemetry.jsx';
import { DrumMachine } from './homeworks/DrumMachine/DrumMachine.jsx';
import { GrandPiano88 } from './homeworks/GrandPiano88/GrandPiano88.jsx';
import styles from './App.module.css';

function LabExercises() {
  return (
    <>
      <DeveloperCard />
      <ScientistDirectory />
      <PubgMatchTelemetry />
    </>
  );
}

const VIEWS = [
  {
    id: 'lab',
    label: 'Lab exercises',
    title: 'Developer Profile',
    hash: '',
    Content: LabExercises,
  },
  {
    id: 'drum',
    label: 'Drum Kit (HW1)',
    title: 'Production Studio',
    hash: '#drum',
    Content: DrumMachine,
  },
  {
    id: 'piano',
    label: 'Grand Piano 88 (HW2)',
    title: 'Piano Studio',
    hash: '#piano',
    Content: GrandPiano88,
  },
];

const VIEW_BY_ID = new Map(VIEWS.map((v) => [v.id, v]));
const VIEW_BY_HASH = new Map(VIEWS.map((v) => [v.hash, v]));

function readViewFromHash() {
  return VIEW_BY_HASH.get(window.location.hash)?.id ?? 'lab';
}

export function App() {
  const [viewId, setViewId] = useState(readViewFromHash);
  const activeView = VIEW_BY_ID.get(viewId);
  const ActiveContent = activeView.Content;

  const handleViewChange = (nextViewId) => {
    setViewId(nextViewId);
    const { pathname, search } = window.location;
    const { hash } = VIEW_BY_ID.get(nextViewId);
    window.history.replaceState(null, '', `${pathname}${search}${hash}`);
  };

  return (
    <main>
      <h1>{activeView.title}</h1>
      <nav aria-label="Views">
        <ul className={styles.viewSwitch}>
          {VIEWS.map((v) => (
            <li key={v.id}>
              <button
                type="button"
                className={styles.viewButton}
                aria-pressed={viewId === v.id}
                onClick={() => handleViewChange(v.id)}
              >
                {v.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <ActiveContent />
    </main>
  );
}