import Button from '../../shared/components/Button.jsx';
import { DEFAULT_CHILD_ID } from '../../shared/data/childGameSettings.js';

// Placeholder: the real dashboard comes later.
export default function ParentDashboardPlaceholder() {
  return (
    <div className="flex flex-col items-start gap-6">
      <h1 className="text-3xl font-extrabold">Parent dashboard</h1>
      <Button to={`/adult/children/${DEFAULT_CHILD_ID}/games`} variant="secondary" size="md">
        Manage games
      </Button>
    </div>
  );
}
