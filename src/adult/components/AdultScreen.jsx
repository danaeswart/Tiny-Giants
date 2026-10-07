import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Scrollable, centred content column for adult pages. */
export default function AdultScreen({ children }) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      contentContainerStyle={{
        width: '100%',
        maxWidth: 720,
        alignSelf: 'center',
        gap: 24,
        paddingTop: 24,
        paddingBottom: Math.max(insets.bottom, 24),
        paddingLeft: Math.max(insets.left, 20),
        paddingRight: Math.max(insets.right, 20),
      }}
    >
      {children}
    </ScrollView>
  );
}
