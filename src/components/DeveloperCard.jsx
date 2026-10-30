   export function DeveloperCard({
     fullName = 'Tran Vinh Khiem',
     role = 'Senior Systems Architect • UIT S3T',
   }) {
     return (
       <article aria-label={fullName}>
         <header>
           <hgroup>
             <h2>{fullName}</h2>
             <p>{role}</p>
           </hgroup>
         </header>
       </article>
     );
   }