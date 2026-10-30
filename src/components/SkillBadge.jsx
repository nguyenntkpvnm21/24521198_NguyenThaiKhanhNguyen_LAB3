   import styles from './SkillBadge.module.css';

   export function SkillBadge({ name, tier = 'Core' }) {
     return (
       <li className={styles.badge}>
         {name} <span className={styles.tier}>{tier}</span>
       </li>
     );
   }