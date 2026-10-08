import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import AppText from '../../shared/components/AppText.jsx';
import Icon from '../../shared/components/Icon.jsx';
import { adult, colors, radius, shadows } from '../../shared/theme.js';
import AdultButton from './AdultButton.jsx';

/**
 * The AI-written insight: what happened, and what we noticed. It's labelled "AI insight"
 * with an (i) button right beside the label, plus a "What does this mean?" link under the
 * text, and both open the disclaimer, so nobody has to hunt for it.
 */
export default function AiInsightBlock({ summary, observed, disclaimer }) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.block}>
      <View style={styles.head}>
        <View style={styles.badge}>
          <Icon name="sparkle" size={18} color={adult.accent} strokeWidth={2.2} />
          <AppText size={16} weight="extrabold" color={adult.accent}>
            AI insight
          </AppText>
        </View>
        <Pressable
          onPress={() => setOpen(true)}
          accessibilityRole="button"
          accessibilityLabel="About this AI insight"
          hitSlop={6}
          style={({ pressed }) => [styles.info, pressed && { opacity: 0.6 }]}
        >
          <Icon name="info" size={26} color={adult.accent} strokeWidth={2.2} />
        </Pressable>
      </View>

      <AppText size={18}>{summary}</AppText>
      <View style={styles.divider} />
      <AppText size={16} weight="extrabold" color={colors.inkSoft}>
        What we noticed
      </AppText>
      <AppText size={18}>{observed}</AppText>

      <Pressable onPress={() => setOpen(true)} accessibilityRole="button" style={{ minHeight: 44, justifyContent: 'center' }}>
        <AppText size={16} color={colors.inkSoft}>
          Written from gameplay patterns, not a diagnosis.{' '}
          <AppText size={16} weight="bold" color={adult.accent} style={{ textDecorationLine: 'underline' }}>
            What does this mean?
          </AppText>
        </AppText>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
        supportedOrientations={['portrait', 'landscape', 'landscape-left', 'landscape-right']}
        statusBarTranslucent
      >
        <View style={styles.backdrop}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setOpen(false)}
            accessibilityRole="button"
            accessibilityLabel="Close"
          />
          <Animated.View entering={ZoomIn.duration(220)} style={styles.sheet} accessibilityViewIsModal>
            <View style={styles.sheetHead}>
              <Icon name="info" size={26} color={adult.accent} strokeWidth={2.2} />
              <AppText size={20} weight="extrabold" accessibilityRole="header">
                About this insight
              </AppText>
            </View>
            <AppText size={17}>{disclaimer}</AppText>
            <AdultButton variant="primary" onPress={() => setOpen(false)} style={{ alignSelf: 'stretch' }}>
              Got it
            </AdultButton>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    gap: 10,
    padding: 24,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: adult.accent,
  },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    backgroundColor: adult.accentSoft,
  },
  info: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  divider: { height: 1, backgroundColor: adult.rule },
  backdrop: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: colors.backdrop },
  sheet: {
    width: '100%',
    maxWidth: 440,
    gap: 14,
    padding: 22,
    borderRadius: radius.lg,
    backgroundColor: colors.cream,
    boxShadow: shadows.lifted,
  },
  sheetHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
});
