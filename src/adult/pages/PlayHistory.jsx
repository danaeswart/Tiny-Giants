import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import { useCurrentChildId } from '../../shared/hooks/useCurrentChildId.js';
import { useLoad } from '../../shared/hooks/useLoad.js';
import { getChild, getSessions } from '../../shared/services/api.js';
import { adult, colors } from '../../shared/theme.js';
import { formatDay } from '../../shared/utils/dates.js';
import AdultScreen from '../components/AdultScreen.jsx';
import BackBar from '../components/BackBar.jsx';
import Chip from '../components/Chip.jsx';
import PageHeader from '../components/PageHeader.jsx';

/** Every story the current baby has played, newest first. */
export default function PlayHistory() {
  const childId = useCurrentChildId();
  const load = useCallback(() => Promise.all([getChild(childId), getSessions(childId)]), [childId]);
  const { data } = useLoad(load);

  if (!data) return <AdultScreen withNav={false} />;
  const [child, sessions] = data;

  return (
    <AdultScreen withNav={false}>
      <BackBar label="Profile" />
      <PageHeader
        eyebrow="Play history"
        title={child ? `${child.name}’s stories` : 'Play history'}
        subtitle="Everything played so far."
      />
      {sessions.length === 0 ? (
        <AppText size={17} color={colors.inkSoft}>
          No stories played yet.
        </AppText>
      ) : (
        <View>
          {sessions.map((session, i) => (
            <View
              key={`${session.date}-${session.gameId}-${i}`}
              style={[styles.row, i < sessions.length - 1 && styles.divider]}
            >
              <View style={{ flex: 1 }}>
                <AppText size={18} weight="semibold">
                  {session.gameTitle}
                </AppText>
                <AppText size={16} color={colors.inkSoft}>
                  {formatDay(session.date)} · {session.durationMinutes} min
                </AppText>
              </View>
              <Chip label={session.completed ? 'Finished' : 'Stopped early'} tone={session.completed ? 'leaf' : 'neutral'} />
            </View>
          ))}
        </View>
      )}
    </AdultScreen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 16 },
  divider: { borderBottomWidth: 1, borderBottomColor: adult.border },
});
