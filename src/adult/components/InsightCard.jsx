import { Pressable, StyleSheet, View } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import Icon from '../../shared/components/Icon.jsx';
import { adult, colors } from '../../shared/theme.js';
import { formatDay } from '../../shared/utils/dates.js';
import Eyebrow from './Eyebrow.jsx';

/** One insight as an open row under a thin rule: game and date, the summary large, then a short peek. */
export default function InsightCard({ insight, onPress, compact = false }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${insight.gameTitle}, ${formatDay(insight.date)}. ${insight.summary}`}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.65 }]}
    >
      <Eyebrow>
        {insight.gameTitle} · {formatDay(insight.date)}
      </Eyebrow>
      <AppText size={compact ? 20 : 24} weight="semibold" style={{ lineHeight: compact ? 28 : 32 }} numberOfLines={compact ? 3 : undefined}>
        {insight.summary}
      </AppText>
      {!compact && (
        <AppText size={16} color={colors.inkSoft} numberOfLines={2}>
          {insight.observed}
        </AppText>
      )}
      <View style={styles.more}>
        <AppText size={16} weight="bold" color={adult.accent}>
          Read insight
        </AppText>
        <Icon name="chevron-right" size={18} color={adult.accent} strokeWidth={2.6} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { gap: 12, paddingTop: 24, borderTopWidth: 1.5, borderTopColor: adult.rule },
  more: { flexDirection: 'row', alignItems: 'center', gap: 2 },
});
