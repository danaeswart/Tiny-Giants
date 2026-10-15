import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import AppText from '../../shared/components/AppText.jsx';
import AvatarImage from '../../shared/components/AvatarImage.jsx';
import Icon from '../../shared/components/Icon.jsx';
import { adult, colors } from '../../shared/theme.js';

const GAP = 12;
const DURATION = 300;
const EASING = Easing.bezier(0.4, 0, 0.2, 1);

/**
 * A page title that doubles as a child picker: "Mike's games ▾". Tapping it opens a list of
 * the account's children; choosing one calls `onSelect(id)`. With only one child it is
 * just a title.
 * The list is a plain drop-down: it slides open to its natural height while fading in, and
 * closes the same way in reverse. The chevron turns in step with it.
 */
export default function ChildTitleDropdown({ profiles, current, onSelect, noun = 'games' }) {
  const [open, setOpen] = useState(false);
  const progress = useSharedValue(0);
  const menuHeight = useSharedValue(0);
  const name = current?.name ?? 'Your child';
  const title = `${name}'s ${noun}`;
  const canPick = profiles.length > 1;

  useEffect(() => {
    progress.set(withTiming(open ? 1 : 0, { duration: DURATION, easing: EASING }));
  }, [open, progress]);

  const chevronStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${progress.get() * 180}deg` }] }));
  const dropStyle = useAnimatedStyle(() => ({
    height: progress.get() * menuHeight.get(),
    marginTop: progress.get() * GAP,
    opacity: progress.get(),
  }));

  const titleText = (
    <AppText size={38} weight="extrabold" color={colors.ink} accessibilityRole="header" style={{ lineHeight: 42, flexShrink: 1 }}>
      {title}
    </AppText>
  );

  if (!canPick) return titleText;

  return (
    <View>
      <Pressable
        onPress={() => setOpen((o) => !o)}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={`${title}. Choose a child.`}
        style={({ pressed }) => [styles.trigger, pressed && { opacity: 0.7 }]}
      >
        {titleText}
        <Animated.View style={[styles.chevron, chevronStyle]}>
          <Icon name="chevron-down" size={22} color={adult.accent} strokeWidth={2.6} />
        </Animated.View>
      </Pressable>

      {/* The menu is always laid out (so its height is known) but clipped to nothing while closed. */}
      <Animated.View
        style={[styles.drop, dropStyle]}
        pointerEvents={open ? 'auto' : 'none'}
        importantForAccessibility={open ? 'auto' : 'no-hide-descendants'}
        accessibilityElementsHidden={!open}
      >
        <View style={styles.menu} onLayout={(e) => menuHeight.set(e.nativeEvent.layout.height)}>
          {profiles.map((p) => {
            const selected = p.id === current?.id;
            return (
              <Pressable
                key={p.id}
                onPress={() => {
                  setOpen(false);
                  onSelect(p.id);
                }}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={p.name}
                style={({ pressed }) => [styles.option, selected && styles.optionSelected, pressed && { opacity: 0.7 }]}
              >
                <View style={styles.avatar}>
                  <AvatarImage avatar={p.avatar} height={48} />
                </View>
                <AppText size={18} weight={selected ? 'bold' : 'regular'} color={selected ? adult.accent : colors.ink}>
                  {p.name}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', alignSelf: 'stretch', gap: 10 },
  chevron: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: adult.accentSoft },
  // Clips the menu to the animated height; the menu inside keeps its natural size and is
  // pinned to the top so it is revealed rather than squashed.
  drop: { overflow: 'hidden' },
  menu: { position: 'absolute', top: 0, left: 0, right: 0, borderWidth: 1.5, borderColor: adult.border, borderRadius: 16, padding: 6, gap: 2 },
  avatar: { width: 40, height: 48, alignItems: 'center', justifyContent: 'center' },
  option: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8, paddingHorizontal: 10, borderRadius: 12 },
  optionSelected: { backgroundColor: adult.accentSoft },
});
