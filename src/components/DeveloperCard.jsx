import { Fragment } from 'react';

const toLabel = (key) => key.replace(/([A-Z])/g, ' $1');

export function DeveloperCard({
  fullName = 'Tran Vinh Khiem',
  role = 'Senior Systems Architect • UIT S3T',
  profile = { firstName: 'Khiem', lastName: 'Tran', age: 30 },
  metrics = { commits: 512, vdomNodes: 0, a11yScore: 100 },
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
    </article>
  );
}