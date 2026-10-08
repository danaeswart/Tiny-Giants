import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { adult } from '../../shared/theme.js';

// How far the floating bottom nav reaches up from the bottom edge, so the last row can
// always scroll clear of it.
const NAV_CLEARANCE = 128;

/**
 * Scrollable page on the cream background. `hero` is a full-bleed band (see Hero) drawn
 * above the padded, centred content column. `withNav` leaves room for the floating bottom
 * nav (detail pages don't have one).
 */
export default function AdultScreen({ children, hero, withNav = true }) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: adult.bg }} showsVerticalScrollIndicator={false}>
      {hero}
      <View
        style={{
          width: '100%',
          maxWidth: 720,
          alignSelf: 'center',
          gap: 32,
          paddingTop: hero ? 32 : Math.max(insets.top, 16) + 20,
          paddingBottom: (withNav ? NAV_CLEARANCE : 32) + Math.max(insets.bottom, 0),
          paddingLeft: Math.max(insets.left, 24),
          paddingRight: Math.max(insets.right, 24),
        }}
      >
        {children}
      </View>
    </ScrollView>
  );
}
