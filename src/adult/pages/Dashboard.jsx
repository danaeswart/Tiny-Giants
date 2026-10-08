import { useCallback } from 'react';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import { useCurrentChildId } from '../../shared/hooks/useCurrentChildId.js';
import { useLoad } from '../../shared/hooks/useLoad.js';
import { getDashboardSummary } from '../../shared/services/api.js';
import { adult, colors } from '../../shared/theme.js';
import AdultScreen from '../components/AdultScreen.jsx';
import Eyebrow from '../components/Eyebrow.jsx';
import Hero from '../components/Hero.jsx';
import InsightCard from '../components/InsightCard.jsx';
import Section from '../components/Section.jsx';
import StatBar from '../components/StatBar.jsx';

function greeting() {
  const hour = new Date().getHours();
  return hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
}

/** The overview: one big number, one chart, a couple of insights. Open sections split by thin rules. */
export default function Dashboard() {
  const childId = useCurrentChildId();
  const load = useCallback(() => getDashboardSummary(childId), [childId]);
  const { data } = useLoad(load);

  if (!data) return <AdultScreen />;
  const { child, goalMinutes, weekMinutes, sessionsThisWeek, completedThisWeek, days, highlights } = data;
  const name = child?.name ?? 'Your child';
  const progress = Math.min(1, weekMinutes / goalMinutes);

  return (
    <AdultScreen
      hero={
        <Hero
          eyebrow={greeting()}
          title={`${name}'s week`}
          subtitle="A quiet look at how play is going."
          note={{ label: 'Finished', text: `${completedThisWeek} of ${sessionsThisWeek} stories this week` }}
        />
      }
    >
      <Section label="Time played">
        <View accessible accessibilityLabel={`${weekMinutes} of ${goalMinutes} minutes played this week`} style={{ gap: 16 }}>
          <AppText size={96} weight="bold" color={adult.accent} style={{ lineHeight: 100 }}>
            {weekMinutes}
          </AppText>
          <AppText size={17} color={colors.inkSoft}>
            of your {goalMinutes} minute goal
          </AppText>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${progress * 100}%` }]} />
          </View>
        </View>
      </Section>

      <Section label="Each day" stacked>
        <StatBar
          unit="Minutes played each day"
          data={days.map((d) => ({ label: d.label, value: d.minutes, highlight: d.isToday }))}
        />
      </Section>

      <View style={{ gap: 24 }}>
        <View style={styles.sectionHead}>
          <Eyebrow>Latest insights</Eyebrow>
          <Pressable
            onPress={() => router.navigate('/adult/insights')}
            accessibilityRole="button"
            hitSlop={8}
            style={{ minHeight: 44, justifyContent: 'center' }}
          >
            <AppText size={16} weight="bold" color={adult.accent}>
              See all
            </AppText>
          </Pressable>
        </View>

        {highlights.length === 0 ? (
          <AppText size={17} color={colors.inkSoft}>
            Insights show up here after {name} plays a story.
          </AppText>
        ) : (
          highlights
            .slice(0, 2)
            .map((insight) => (
              <InsightCard key={insight.id} insight={insight} compact onPress={() => router.push(`/adult/insight/${insight.id}`)} />
            ))
        )}
      </View>
    </AdultScreen>
  );
}

const styles = StyleSheet.create({
  track: { height: 16, borderRadius: 8, borderWidth: 1.5, borderColor: adult.accent, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: adult.accent },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: -8 },
});
