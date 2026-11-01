   import { DeveloperCard } from './components/DeveloperCard.jsx';
   import { ScientistDirectory } from './components/ScientistDirectory.jsx';
   import { PubgMatchTelemetry } from './components/PubgMatchTelemetry.jsx';

   export function App() {
     return (
       <main>
         <h1>Developer Profile</h1>
         <DeveloperCard />
         <ScientistDirectory />
         <PubgMatchTelemetry />
       </main>
     );
   }