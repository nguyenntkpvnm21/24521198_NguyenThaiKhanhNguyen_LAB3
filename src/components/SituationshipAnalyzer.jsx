import { useEffect, useId, useState } from 'react';
import styles from './SituationshipAnalyzer.module.css';
import {
  ACTIONS,
  PHASES,
  createSignal,
  getScore,
  isRedFlag,
  transition,
} from './situationshipLogic.js';
import { waitForReply } from './replyWait.js';

const GHOST_DELAY_MS = 5000;

const PHASE_LABELS = {
  [PHASES.FRIENDS]: 'Bạn bè',
  [PHASES.DATING_NO_LOVE]: 'Hẹn hò nhưng không yêu',
  [PHASES.OFFICIAL_LOVE]: 'Chính thức',
  [PHASES.GHOSTED_EXIT]: 'Đã thoát (ghosted)',
};

const ACTOR_LABELS = { EM: 'Em', AI_DO: 'Ai Đó' };

const PHASE_BUTTONS = [
  { action: ACTIONS.START_DATING, label: 'Bắt đầu hẹn hò' },
  { action: ACTIONS.COMMIT, label: 'Xác nhận yêu' },
  { action: ACTIONS.GHOST, label: 'Dừng lại' },
  { action: ACTIONS.RESET, label: 'Làm lại' },
];

const toFieldValue = (e) => {
  const n = e.target.valueAsNumber;
  return Number.isNaN(n) ? '' : n;
};
const isPositive = (n) => Number.isFinite(n) && n > 0;
const formatScore = (n) => Math.round(n * 100) / 100;

function getStatusText(phase, redFlag) {
  if (phase === PHASES.GHOSTED_EXIT) return 'Đã thoát khỏi mối quan hệ.';
  if (phase === PHASES.OFFICIAL_LOVE) return 'Đã chính thức yêu nhau.';
  if (phase === PHASES.FRIENDS) return 'Đang là bạn bè.';
  if (redFlag) return 'Red flag: điểm của Em thấp hơn Ai Đó.';
  return 'Ổn định.';
}

export function SituationshipAnalyzer() {
  const headingId = useId();
  const emStepsId = useId();
  const emMultiplierId = useId();
  const rivalStepsId = useId();
  const rivalMultiplierId = useId();

  const [phase, setPhase] = useState(PHASES.DATING_NO_LOVE);
  const [signals, setSignals] = useState([]);
  const [pendingPingId, setPendingPingId] = useState(null);
  const [emSteps, setEmSteps] = useState(100);
  const [emMultiplier, setEmMultiplier] = useState(0.1);
  const [rivalSteps, setRivalSteps] = useState(1);
  const [rivalMultiplier, setRivalMultiplier] = useState(50);

  // Derived state: computed in render, no useEffect, no extra state.
  const emScore = getScore(signals, 'EM');
  const rivalScore = getScore(signals, 'AI_DO');
  const redFlag = isRedFlag(phase, emScore, rivalScore);
  const isEmInputValid = isPositive(emSteps) && isPositive(emMultiplier);
  const isRivalInputValid = isPositive(rivalSteps) && isPositive(rivalMultiplier);
  const isDating = phase === PHASES.DATING_NO_LOVE;
  const isWaiting = isDating && pendingPingId !== null;

  // Ghosting timer: starts for each unanswered Em ping, aborted by cleanup.
  useEffect(() => {
    if (phase !== PHASES.DATING_NO_LOVE || pendingPingId === null) {
      return undefined;
    }
    const controller = new AbortController();
    waitForReply(GHOST_DELAY_MS, controller.signal)
      .then(() => {
        setPhase((prev) => transition(prev, ACTIONS.GHOST));
        setPendingPingId(null);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        throw err;
      });
    return () => controller.abort();
  }, [phase, pendingPingId]);

  const handleEmTry = () => {
    if (!isEmInputValid) return;
    const signal = createSignal('EM', emSteps, emMultiplier);
    setSignals((prev) => [...prev, signal]);
    setPendingPingId(signal.id);
  };

  const handleRivalReply = () => {
    if (!isRivalInputValid) return;
    const signal = createSignal('AI_DO', rivalSteps, rivalMultiplier);
    setSignals((prev) => [...prev, signal]);
    setPendingPingId(null);
  };

  const handlePhaseAction = (action) => {
    setPhase((prev) => transition(prev, action));
    setPendingPingId(null);
    if (action === ACTIONS.RESET) setSignals([]);
  };

  return (
    <article className={styles.card} aria-labelledby={headingId}>
      <header className={styles.header}>
        <h2 id={headingId}>Situationship Analyzer</h2>
        <p className={styles.phase}>Phase: {PHASE_LABELS[phase]}</p>
      </header>

      <output className={styles.status} role="status" aria-live="polite">
        {getStatusText(phase, redFlag)}
      </output>
      {isWaiting && <p>Đang chờ hồi đáp (5 giây)...</p>}

      <form
        className={styles.controls}
        aria-label="Effort signals"
        onSubmit={(e) => e.preventDefault()}
      >
        <p className={styles.field}>
          <label htmlFor={emStepsId}>Em: số bước</label>
          <input
            id={emStepsId}
            type="number"
            min="0"
            step="any"
            value={emSteps}
            onChange={(e) => setEmSteps(toFieldValue(e))}
          />
        </p>
        <p className={styles.field}>
          <label htmlFor={emMultiplierId}>Em: hệ số</label>
          <input
            id={emMultiplierId}
            type="number"
            min="0"
            step="any"
            value={emMultiplier}
            onChange={(e) => setEmMultiplier(toFieldValue(e))}
          />
        </p>
        <p className={styles.field}>
          <label htmlFor={rivalStepsId}>Ai Đó: số bước</label>
          <input
            id={rivalStepsId}
            type="number"
            min="0"
            step="any"
            value={rivalSteps}
            onChange={(e) => setRivalSteps(toFieldValue(e))}
          />
        </p>
        <p className={styles.field}>
          <label htmlFor={rivalMultiplierId}>Ai Đó: hệ số</label>
          <input
            id={rivalMultiplierId}
            type="number"
            min="0"
            step="any"
            value={rivalMultiplier}
            onChange={(e) => setRivalMultiplier(toFieldValue(e))}
          />
        </p>
      </form>

      <ul className={styles.actions}>
        <li>
          <button
            type="button"
            className={styles.button}
            disabled={!isDating || !isEmInputValid}
            onClick={handleEmTry}
          >
            Em cố
          </button>
        </li>
        <li>
          <button
            type="button"
            className={styles.button}
            disabled={!isDating || !isRivalInputValid}
            onClick={handleRivalReply}
          >
            Ai Đó đáp lại
          </button>
        </li>
        {PHASE_BUTTONS.map(({ action, label }) => (
          <li key={action}>
            <button
              type="button"
              className={styles.button}
              disabled={transition(phase, action) === phase}
              onClick={() => handlePhaseAction(action)}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>

      <dl className={styles.scores}>
        <dt>Em</dt>
        <dd>{formatScore(emScore)}</dd>
        <dt>Ai Đó</dt>
        <dd>{formatScore(rivalScore)}</dd>
      </dl>

      {signals.length === 0 ? (
        <p>Chưa có tín hiệu.</p>
      ) : (
        <ul className={styles.log} aria-label="Signal log">
          {signals.map((s) => (
            <li key={s.id} className={styles.logItem}>
              {ACTOR_LABELS[s.actor]}: {s.steps} × {s.multiplier}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}