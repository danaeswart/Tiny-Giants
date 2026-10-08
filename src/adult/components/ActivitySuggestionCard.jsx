import { StyleSheet, View } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import Icon from '../../shared/components/Icon.jsx';
import { adult, radius } from '../../shared/theme.js';

/** A concrete thing to do with the child next, set apart in a warm card. */
export default function ActivitySuggestionCard({ suggestion }) {
  return (
    <View style={styles.card}>
      <View style={styles.label}>
        <Icon name="heart" size={18} color={adult.warm} strokeWidth={2.2} />
        <AppText size={16} weight="extrabold" color={adult.warm}>
          Try this together
        </AppText>
      </View>
      <AppText size={21} weight="extrabold">
        {suggestion.title}
      </AppText>
      <AppText size={17}>{suggestion.description}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: 10, padding: 24, borderRadius: radius.lg, borderWidth: 2, borderColor: adult.flame },
  label: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
