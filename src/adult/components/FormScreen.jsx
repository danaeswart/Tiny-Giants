import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { adult } from '../../shared/theme.js';

/** A centred, keyboard-friendly column for the sign-in and add-child screens. */
export default function FormScreen({ children }) {
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: adult.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View
          style={{
            width: '100%',
            maxWidth: 480,
            alignSelf: 'center',
            gap: 20,
            paddingTop: Math.max(insets.top, 16) + 24,
            paddingBottom: Math.max(insets.bottom, 16) + 24,
            paddingHorizontal: 24,
          }}
        >
          {children}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
