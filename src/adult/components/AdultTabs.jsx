import { Tabs } from 'expo-router';
import { Dimensions, Easing } from 'react-native';
import { adult } from '../../shared/theme.js';
import BottomNav from './BottomNav.jsx';

// `progress` is 0 for the focused page, +1 when it sits one page to the right, -1 one page to the left.
// Sliding by a full screen width makes each page push the other out, like a swipe between pages.
function slidePages({ current }) {
  const { width } = Dimensions.get('window');
  return {
    sceneStyle: {
      transform: [{ translateX: current.progress.interpolate({ inputRange: [-1, 0, 1], outputRange: [-width, 0, width] }) }],
    },
  };
}

const SLIDE = {
  animation: 'timing',
  config: { duration: 420, easing: Easing.bezier(0.22, 1, 0.36, 1), useNativeDriver: true },
};

/** The four main grown-up pages, switched with the bottom nav; pages slide in the direction of the tab. */
export default function AdultTabs() {
  return (
    <Tabs
      tabBar={(props) => <BottomNav {...props} />}
      screenOptions={{
        headerShown: false,
        animation: 'shift',
        sceneStyleInterpolator: slidePages,
        transitionSpec: SLIDE,
        sceneStyle: { backgroundColor: adult.bg },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="insights" options={{ title: 'Insights' }} />
      <Tabs.Screen name="games" options={{ title: 'Games' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
