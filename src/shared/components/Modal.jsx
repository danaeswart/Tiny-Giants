import { Modal as RNModal, Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { colors, radius } from '../theme.js';
import AppText from './AppText.jsx';
import IconButton from './IconButton.jsx';

/**
 * Simple dialog. Tapping the dimmed backdrop, the close button, or the Android
 * back button closes it. Use align="top" when it holds a text field, so the
 * on-screen keyboard (huge in landscape) doesn't cover it.
 */
export default function Modal({ open, onClose, title, align = 'center', children }) {
  const { height } = useWindowDimensions();

  return (
    <RNModal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      // iOS modals default to portrait-only, which would rotate a landscape child screen.
      supportedOrientations={['portrait', 'landscape', 'landscape-left', 'landscape-right']}
      statusBarTranslucent
    >
      <View style={[styles.backdrop, { justifyContent: align === 'top' ? 'flex-start' : 'center' }]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close"
          importantForAccessibility="no"
          accessibilityElementsHidden
        />
        <View style={[styles.card, { maxHeight: height - 32 }]} accessibilityViewIsModal>
          <View style={styles.header}>
            <AppText size={24} weight="extrabold" accessibilityRole="header" style={styles.title}>
              {title}
            </AppText>
            <IconButton icon="close" label="Close" size="md" onPress={onClose} />
          </View>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.body}>
            {open && children}
          </ScrollView>
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.backdrop,
  },
  card: {
    width: '100%',
    maxWidth: 640,
    borderRadius: radius.lg,
    backgroundColor: colors.cream,
    padding: 20,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  title: { flexShrink: 1 },
  body: { gap: 12 },
});
