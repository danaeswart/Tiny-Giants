import { useCallback } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AppText from '../../shared/components/AppText.jsx';
import Icon from '../../shared/components/Icon.jsx';
import { useLoad } from '../../shared/hooks/useLoad.js';
import { getInsightById } from '../../shared/services/api.js';
import { adult, colors } from '../../shared/theme.js';
import { formatDay } from '../../shared/utils/dates.js';
import ActivitySuggestionCard from '../components/ActivitySuggestionCard.jsx';
import AdultButton from '../components/AdultButton.jsx';
import AdultScreen from '../components/AdultScreen.jsx';
import AiInsightBlock from '../components/AiInsightBlock.jsx';
import BackBar from '../components/BackBar.jsx';
import Hero from '../components/Hero.jsx';
import Section from '../components/Section.jsx';

/** One session's full insight: what we noticed, what to try together, and the session's numbers. */
export default function InsightDetail() {
  const { insightId } = useLocalSearchParams();
  const load = useCallback(() => getInsightById(insightId), [insightId]);
  const { data: insight, loading } = useLoad(load);

  if (loading) return <AdultScreen withNav={false} />;
  if (!insight) {
    return (
      <AdultScreen withNav={false}>
        <BackBar />
        <AppText size={20} weight="bold">
          We could not find that insight.
        </AppText>
      </AdultScreen>
    );
  }

  const { session } = insight;

  return (
    <AdultScreen
      withNav={false}
      hero={
        <Hero
          top={<BackBar label="Insights" onDark />}
          eyebrow={`${formatDay(insight.date)} · ${insight.child?.name ?? ''}`}
          title={insight.gameTitle}
        />
      }
    >
      <Rise delay={0}>
        <AiInsightBlock summary={insight.summary} observed={insight.observed} disclaimer={insight.aiDisclaimer} />
      </Rise>

      <Rise delay={90}>
        <ActivitySuggestionCard suggestion={insight.activitySuggestion} />
      </Rise>

      {session && (
        <Rise delay={180}>
          <Section label="This session" stacked>
            <View style={styles.stats}>
              <Stat icon="clock" label="Time played" value={`${session.durationMinutes} min`} />
              <Stat
                icon={session.completed ? 'check' : 'close'}
                label="Story"
                value={session.completed ? 'Finished' : 'Stopped early'}
                good={session.completed}
              />
            </View>
          </Section>
        </Rise>
      )}

      <Rise delay={270}>
        <AdultButton
          variant="primary"
          onPress={() => router.push(`/adult/game/${insight.gameId}?from=insight&insightId=${insight.id}`)}
          style={{ alignSelf: 'stretch' }}
        >
          About {insight.gameTitle}
        </AdultButton>
      </Rise>
    </AdultScreen>
  );
}

// Fades each block up in turn, so the page settles in rather than appearing all at once.
function Rise({ delay, children }) {
  return <Animated.View entering={FadeInDown.delay(delay).duration(380)}>{children}</Animated.View>;
}

function Stat({ icon, label, value, good }) {
  return (
    <View style={styles.stat}>
      <Icon name={icon} size={22} color={good ? adult.leaf : adult.accent} strokeWidth={2.4} />
      <View>
        <AppText size={16} color={colors.inkSoft}>
          {label}
        </AppText>
        <AppText size={18} weight="extrabold">
          {value}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stats: { flexDirection: 'row', gap: 12 },
  stat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: adult.rule,
  },
});
