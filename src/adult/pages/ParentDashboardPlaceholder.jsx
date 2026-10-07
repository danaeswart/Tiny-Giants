import { router, Stack } from 'expo-router';
import AppText from '../../shared/components/AppText.jsx';
import Button from '../../shared/components/Button.jsx';
import { DEFAULT_CHILD_ID } from '../../shared/data/childGameSettings.js';
import AdultScreen from '../components/AdultScreen.jsx';

// Placeholder: the real dashboard comes later.
export default function ParentDashboardPlaceholder() {
  return (
    <AdultScreen>
      <Stack.Screen options={{ title: 'Grown-ups' }} />
      <AppText size={30} weight="extrabold" accessibilityRole="header">
        Parent dashboard
      </AppText>
      <Button
        variant="secondary"
        size="md"
        style={{ alignSelf: 'flex-start' }}
        onPress={() => router.push(`/adult/children/${DEFAULT_CHILD_ID}/games`)}
      >
        Manage games
      </Button>
    </AdultScreen>
  );
}
