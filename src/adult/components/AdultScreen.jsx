import { useEffect, useRef, useState } from 'react';
import { Keyboard, Platform, ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { adult } from '../../shared/theme.js';

const KEYBOARD_GAP = 16;

/**
 * Scrollable page on the cream background. `hero` is a full-bleed band (see Hero) drawn
 * above the padded, centred content column. `withNav` marks pages that sit above the
 * bottom nav, which already handles the bottom safe area itself.
 * When the keyboard opens, the page gains room beneath the content and scrolls so the
 * focused text box stays visible above the keyboard.
 */
export default function AdultScreen({ children, hero, withNav = true }) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef(null);
  const offsetY = useRef(0);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      // Wait a frame so the extra bottom padding is laid out before scrolling into it.
      setTimeout(() => {
        const input = TextInput.State.currentlyFocusedInput?.();
        if (!input?.measureInWindow) return;
        input.measureInWindow((_x, y, _w, height) => {
          const overlap = y + height + KEYBOARD_GAP - e.endCoordinates.screenY;
          if (overlap > 0) scrollRef.current?.scrollTo({ y: offsetY.current + overlap, animated: true });
        });
      }, 100);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardHeight(0));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <ScrollView
      ref={scrollRef}
      style={{ flex: 1, backgroundColor: adult.bg }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      scrollEventThrottle={16}
      onScroll={(e) => {
        offsetY.current = e.nativeEvent.contentOffset.y;
      }}
    >
      {hero}
      <View
        style={{
          width: '100%',
          maxWidth: 720,
          alignSelf: 'center',
          gap: 32,
          paddingTop: hero ? 32 : Math.max(insets.top, 16) + 20,
          paddingBottom: 32 + (withNav ? 0 : Math.max(insets.bottom, 0)) + keyboardHeight,
          paddingLeft: Math.max(insets.left, 24),
          paddingRight: Math.max(insets.right, 24),
        }}
      >
        {children}
      </View>
    </ScrollView>
  );
}
