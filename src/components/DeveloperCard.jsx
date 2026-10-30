import { Fragment } from 'react';
import { SkillBadge } from './SkillBadge.jsx';

const toLabel = (key) => key.replace(/([A-Z])/g, ' $1');

export function DeveloperCard({
  fullName = 'Tran Vinh Khiem',
  role = 'Senior Systems Architect • UIT S3T',
  profile = { firstName: 'Khiem', lastName: 'Tran', age: 30 },
  metrics = { commits: 512, vdomNodes: 0, a11yScore: 100 },
    skills = [
    { id: 'sk-1', name: 'React 19 Fiber', tier: 'Core' },
    { id: 'sk-2', name: 'Semantic HTML', tier: 'Core' },
    { id: 'sk-3', name: 'Web Audio API', tier: 'Awareness' },
    ],
}) {
  return (
    <article aria-label={fullName}>
      <header>
        <hgroup>
          <h2>{fullName}</h2>
          <p>{role}</p>
        </hgroup>
      </header>
      <dl>
        {Object.entries(profile).map(([k, v]) => (
          <Fragment key={k}>
            <dt>{toLabel(k)}</dt>
            <dd>{v}</dd>
          </Fragment>
        ))}
      </dl>
      <dl>
        {Object.entries(metrics).map(([k, v]) => (
          <Fragment key={k}>
            <dt>{toLabel(k)}</dt>
            <dd>{v}</dd>
          </Fragment>
        ))}
      </dl>
           <ul aria-label="Engineered Skills">
       {skills.map((s) => (
         <SkillBadge key={s.id} name={s.name} tier={s.tier} />
       ))}
     </ul>
    </article>
  );
}