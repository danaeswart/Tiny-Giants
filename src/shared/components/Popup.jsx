import { useEffect, useRef } from 'react';
import { Modal as RNModal, Platform, Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { adult, colors, radius } from '../theme.js';
import AppText from './AppText.jsx';
import AdultButton from '../../adult/components/AdultButton.jsx';
import Button from './Button.jsx';
import Icon from './Icon.jsx';
import IconButton from './IconButton.jsx';

// How the three kinds of popup look. `badge` is the soft round sticker at the top.
const TONES = {
  success: { badge: adult.lime, icon: 'check', iconColor: colors.ink, button: 'primary' },
  confirm: { badge: colors.glowSoft, icon: 'heart', iconColor: colors.ink, button: 'primary' },
  danger: { badge: colors.berrySoft, icon: 'info', iconColor: adult.berry, button: 'berry' },
};

const BADGE = 64;
const SMOOTH = Easing.out(Easing.cubic);

/**
 * Small, quiet dialog for "are you sure?" and "all done" moments.
 *
 *   tone          'success', 'confirm' (a friendly question) or 'danger' (a careful question)
 *   icon / art    the badge picture: an Icon name, or `art` for your own node (e.g. a child's character)
 *   badge         false hides the round sticker on a child popup (default true)
 *   title         two to four words
 *   message       one short sentence
 *   confirmLabel  the main button. With no cancelLabel the popup has just this one button
 *   cancelLabel   the quieter button that backs out
 *   audience      'parent' (default): flat white card, solid flat buttons, no badge. 'child': the soft badge
 *                 and chunky raised buttons used on the child screens
 *   choice        swaps the buttons for a red cross (onCancel) and a green tick (onConfirm). The
 *                 labels are then only read aloud by screen readers
 *   onClosed      runs once the popup has finished leaving the screen. Navigate from here, never
 *                 straight from a button: leaving while a native modal is still dismissing can
 *                 leave it swallowing touches on the screen underneath.
 *
 * It fades and eases up into place, with no bounce. Tapping outside or pressing Android back runs
 * onDismiss; without one it counts as cancel (or as the one button, for a success popup). Pass
 * onDismiss when cancel isn't the safe choice. Nothing closes on a timer, so nobody is rushed.
 */
export default function Popup({
  open,
  tone = 'success',
  icon,
  art,
  title,
  message,
  children,
  confirmLabel = 'Done',
  cancelLabel,
  onConfirm,
  onCancel,
  onDismiss,
  onClosed,
  choice = false,
  badge = true,
  audience = 'parent',
  busy = false,
}) {
  const { width, height } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const t = TONES[tone];
  const parentSide = audience === 'parent';
  // Phones on their side (every child screen) are too short for a stacked card.
  const sideBySide = width > height && height < 520;
  const dismiss = busy ? undefined : (onDismiss ?? (cancelLabel ? onCancel : onConfirm));

  // Tell the screen when we've fully gone, so it can navigate safely.
  const wasOpen = useRef(false);
  const timer = useRef(null);
  const closedRef = useRef(onClosed);
  useEffect(() => {
    closedRef.current = onClosed;
  });

  function flush() {
    clearTimeout(timer.current);
    if (!wasOpen.current) return;
    wasOpen.current = false;
    closedRef.current?.();
  }

  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      clearTimeout(timer.current);
    } else if (wasOpen.current) {
      // iOS reports the end of the dismissal through onDismiss; the others have no such event.
      timer.current = setTimeout(flush, Platform.OS === 'ios' ? 1000 : 350);
    }
    return () => clearTimeout(timer.current);
  }, [open]);

  return (
    <RNModal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={dismiss}
      onDismiss={flush}
      supportedOrientations={['portrait', 'landscape', 'landscape-left', 'landscape-right']}
      statusBarTranslucent
    >
      <View style={styles.backdrop}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={dismiss}
          accessible={false}
          importantForAccessibility="no"
          accessibilityElementsHidden
        />
        {parentSide ? (
          <Animated.View
            entering={reduceMotion ? undefined : FadeIn.duration(220)}
            style={styles.flatCard}
            accessibilityViewIsModal
          >
            {art ? <View style={{ alignItems: 'center' }}>{art}</View> : null}
            <AppText size={20} weight="bold" accessibilityRole="header" accessibilityLiveRegion="polite">
              {title}
            </AppText>
            {message ? (
              <AppText size={16} color={colors.inkSoft}>
                {message}
              </AppText>
            ) : null}
            {children}
            <View style={styles.flatActions}>
              {cancelLabel ? (
                <AdultButton onPress={busy ? undefined : onCancel} style={styles.flatButton}>
                  {cancelLabel}
                </AdultButton>
              ) : null}
              <AdultButton
                variant="primary"
                onPress={busy ? undefined : onConfirm}
                style={[styles.flatButton, tone === 'danger' && styles.flatDanger]}
              >
                {confirmLabel}
              </AdultButton>
            </View>
          </Animated.View>
        ) : (
          <Animated.View
            entering={reduceMotion ? undefined : FadeInDown.duration(320).easing(SMOOTH)}
            style={[styles.card, sideBySide ? styles.cardWide : styles.cardTall, { maxHeight: height - 24 }]}
            accessibilityViewIsModal
          >
            <ScrollView
              contentContainerStyle={[styles.content, sideBySide && styles.contentWide]}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {badge && <Badge tone={t} reduceMotion={reduceMotion} art={art} icon={icon ?? t.icon} />}
  
              <View style={[styles.text, sideBySide && { flex: 1, alignItems: 'flex-start' }]}>
                <AppText
                  size={24}
                  weight="extrabold"
                  align={sideBySide ? 'left' : 'center'}
                  accessibilityRole="header"
                  accessibilityLiveRegion="polite"
                  style={{ lineHeight: 28 }}
                >
                  {title}
                </AppText>
                {message ? (
                  <AppText size={17} color={colors.inkSoft} align={sideBySide ? 'left' : 'center'}>
                    {message}
                  </AppText>
                ) : null}
                {children}
                {choice ? (
                  // Words-free yes/no for little ones: a red cross and a green tick.
                  <View style={styles.choice}>
                    <IconButton icon="close" label={cancelLabel} variant="berry" onPress={busy ? undefined : onCancel} />
                    <IconButton icon="check" label={confirmLabel} variant="green" onPress={busy ? undefined : onConfirm} />
                  </View>
                ) : (
                <View style={[styles.actions, sideBySide && { flexDirection: 'row-reverse' }]}>
                  <Button
                    size="md"
                    variant={t.button}
                    onPress={busy ? undefined : onConfirm}
                    style={sideBySide ? { flex: 1 } : styles.fullWidth}
                  >
                    {confirmLabel}
                  </Button>
                  {cancelLabel ? (
                    <Button
                      size="md"
                      variant="secondary"
                      onPress={busy ? undefined : onCancel}
                      style={sideBySide ? { flex: 1 } : styles.fullWidth}
                    >
                      {cancelLabel}
                    </Button>
                  ) : null}
                </View>
                )}
              </View>
            </ScrollView>
          </Animated.View>
        )}
      </View>
    </RNModal>
  );
}

/** The round sticker: eases in a beat after the card, no bounce. */
function Badge({ tone, reduceMotion, art, icon }) {
  const show = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    if (reduceMotion) return;
    show.set(withDelay(120, withTiming(1, { duration: 450, easing: SMOOTH })));
  }, [reduceMotion, show]);

  const style = useAnimatedStyle(() => ({
    opacity: show.get(),
    transform: [{ scale: 0.85 + 0.15 * show.get() }],
  }));

  return (
    <Animated.View
      style={[styles.badge, { backgroundColor: tone.badge }, art && styles.badgeArt, style]}
      accessible={false}
      importantForAccessibility="no-hide-descendants"
    >
      {art ?? <Icon name={icon} size={32} color={tone.iconColor} strokeWidth={3} />}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 12, backgroundColor: colors.backdrop },
  card: {
    width: '100%',
    borderRadius: radius.lg,
    backgroundColor: colors.paper,
    borderWidth: 1.5,
    borderColor: colors.inkFaint,
  },
  cardTall: { maxWidth: 340 },
  cardWide: { maxWidth: 560 },
  content: { alignItems: 'center', gap: 14, padding: 24 },
  contentWide: { flexDirection: 'row', gap: 20 },
  text: { alignItems: 'center', gap: 8, alignSelf: 'stretch' },
  actions: { gap: 10, alignSelf: 'stretch', marginTop: 8 },
  // Parent side: flat, quiet, solid buttons (no raised edge).
  flatCard: { width: '100%', maxWidth: 360, gap: 8, padding: 24, borderRadius: radius.md, backgroundColor: colors.white },
  flatActions: { flexDirection: 'row', justifyContent: 'flex-end', flexWrap: 'wrap', gap: 10, marginTop: 12 },
  flatButton: { flexGrow: 1, flexBasis: 120 },
  flatDanger: { backgroundColor: adult.berry, borderColor: adult.berry },
  fullWidth: { alignSelf: 'stretch' },
  choice: { flexDirection: 'row', justifyContent: 'center', gap: 24, alignSelf: 'stretch', marginTop: 8 },
  badge: { width: BADGE, height: BADGE, borderRadius: BADGE / 2, alignItems: 'center', justifyContent: 'center' },
  // A character picture wants room to be itself, so the sticker grows into a rounded tile.
  badgeArt: { width: 112, height: 104, borderRadius: radius.md, overflow: 'hidden' },
});
