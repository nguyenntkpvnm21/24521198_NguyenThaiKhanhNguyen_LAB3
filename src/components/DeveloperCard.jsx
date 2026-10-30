   import { Fragment, useId, useState } from 'react';
   import { SkillBadge } from './SkillBadge.jsx';
   import styles from './DeveloperCard.module.css';

   const toLabel = (key) => key.replace(/([A-Z])/g, ' $1');

   function getInitials(name) {
     const words = name.trim().split(/\s+/);
     const first = words[0]?.[0] ?? '';
     const last = words.length > 1 ? words[words.length - 1][0] : '';
     return (first + last).toUpperCase();
   }

   export function DeveloperCard({
     fullName = 'Tran Vinh Khiem',
     role = 'Senior Systems Architect • UIT S3T',
     avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240',
     profile = { firstName: 'Khiem', lastName: 'Tran', age: 30 },
     metrics = { commits: 512, vdomNodes: 0, a11yScore: 100 },
     skills = [
       { id: 'sk-1', name: 'React 19 Fiber', tier: 'Core' },
       { id: 'sk-2', name: 'Semantic HTML', tier: 'Core' },
       { id: 'sk-3', name: 'Web Audio API', tier: 'Awareness' },
     ],
   }) {
     const headingId = useId();
     const [imgFailed, setImgFailed] = useState(false);

     return (
       <article className={styles.card} aria-labelledby={headingId}>
         <header className={styles.header}>
           {imgFailed ? (
             <span
               className={styles.initials}
               role="img"
               aria-label={`Avatar of ${fullName}`}
             >
               {getInitials(fullName)}
             </span>
           ) : (
             <img
               className={styles.avatar}
               src={avatarUrl}
               alt={`Avatar of ${fullName}`}
               width="64"
               height="64"
               decoding="async"
               onError={() => setImgFailed(true)}
             />
           )}
           <hgroup>
             <h2 id={headingId} className={styles.title}>{fullName}</h2>
             <p className={styles.role}>{role}</p>
           </hgroup>
         </header>

         <dl className={styles.profile}>
           {Object.entries(profile).map(([k, v]) => (
             <Fragment key={k}>
               <dt>{toLabel(k)}</dt>
               <dd>{v}</dd>
             </Fragment>
           ))}
         </dl>

         <dl className={styles.metrics}>
           {Object.entries(metrics).map(([k, v]) => (
             <Fragment key={k}>
               <dt>{toLabel(k)}</dt>
               <dd>{v}</dd>
             </Fragment>
           ))}
         </dl>

         <ul className={styles.skills} aria-label="Engineered Skills">
           {skills.map((s) => (
             <SkillBadge key={s.id} name={s.name} tier={s.tier} />
           ))}
         </ul>
       </article>
     );
   }