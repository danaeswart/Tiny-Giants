import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Blobs from '../../shared/components/Blobs.jsx';
import { adult } from '../../shared/theme.js';

/**
 * Full-screen child canvas on the same cream as the grown-up side that keeps content clear of notches and
 * rounded corners. `blobs` adds the drifting circles behind the content.
 */
export default function ChildScreen({ children, style, blobs = false, background }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, background && { backgroundColor: background }]}>
      {blobs && <Blobs />}
      <View
        style={[
          {
            flex: 1,
            paddingTop: Math.max(insets.top, 16),
            paddingBottom: Math.max(insets.bottom, 16),
            paddingLeft: Math.max(insets.left, 24),
            paddingRight: Math.max(insets.right, 24),
          },
          style,
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: adult.bg, overflow: 'hidden' },
});
