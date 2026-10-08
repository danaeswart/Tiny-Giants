import { ScrollView } from 'react-native';
import Pill from './Pill.jsx';

export const ALL = 'All';

/** Theme filter pills: "All", then one per category (Stress, Grief, Social Awareness...). */
export default function CategoryFilter({ categories, value, onChange }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingVertical: 4 }}
      accessibilityLabel="Filter games by theme"
    >
      {[ALL, ...categories].map((category) => (
        <Pill key={category} label={category} selected={value === category} onPress={() => onChange(category)} />
      ))}
    </ScrollView>
  );
}
