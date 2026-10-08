import { useCallback } from 'react';
import { router } from 'expo-router';
import { View } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import { useCurrentChildId } from '../../shared/hooks/useCurrentChildId.js';
import { useLoad } from '../../shared/hooks/useLoad.js';
import { getChild, getInsights } from '../../shared/services/api.js';
import { colors } from '../../shared/theme.js';
import AdultScreen from '../components/AdultScreen.jsx';
import Hero from '../components/Hero.jsx';
import InsightCard from '../components/InsightCard.jsx';

/** Every insight, newest first, with more of each one's story than the dashboard shows. */
export default function Insights() {
  const childId = useCurrentChildId();
  const load = useCallback(() => Promise.all([getInsights(childId), getChild(childId)]), [childId]);
  const { data } = useLoad(load);

  if (!data) return <AdultScreen />;
  const [insights, child] = data;

  return (
    <AdultScreen
      hero={
        <Hero
          eyebrow="Insights"
          title="What we're noticing"
          subtitle={`Patterns from ${child?.name ?? 'your child'}'s play, and ideas to try together.`}
          note={{ label: 'So far', text: `${insights.length} ${insights.length === 1 ? 'insight' : 'insights'} to read` }}
        />
      }
    >
      {insights.length === 0 ? (
        <AppText size={17} color={colors.inkSoft}>
          Nothing yet. Insights appear after a story has been played.
        </AppText>
      ) : (
        <View style={{ gap: 32 }}>
          {insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} onPress={() => router.push(`/adult/insight/${insight.id}`)} />
          ))}
        </View>
      )}
    </AdultScreen>
  );
}
