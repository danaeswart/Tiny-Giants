import { useState } from 'react';
import { Link } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from '../../shared/components/AppText.jsx';
import { adult, colors, fonts, radius } from '../../shared/theme.js';
import AdultButton from './AdultButton.jsx';

/**
 * One form for both sign in and sign up.
 *   fields    [{ key, label, secure?, keyboardType?, autoComplete?, autoCapitalize? }]
 *   onSubmit  (values) => Promise; throw an Error with a readable message to show it
 *   footer    { text, linkLabel, href } the "other screen" link under the button
 */
export default function AuthForm({ title, subtitle, fields, submitLabel, onSubmit, footer, extra }) {
  const [values, setValues] = useState({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    setError('');
    try {
      await onSubmit(values);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          <AppText size={40} weight="extrabold" color={colors.ink}>
            {title}
          </AppText>
          <AppText size={18} color={colors.inkSoft}>
            {subtitle}
          </AppText>

          {fields.map((field) => (
            <View key={field.key} style={{ gap: 6 }}>
              <AppText size={16} weight="semibold" color={colors.inkSoft}>
                {field.label}
              </AppText>
              <TextInput
                value={values[field.key] ?? ''}
                onChangeText={(text) => setValues((v) => ({ ...v, [field.key]: text }))}
                secureTextEntry={field.secure}
                keyboardType={field.keyboardType}
                autoComplete={field.autoComplete}
                autoCapitalize={field.autoCapitalize ?? 'none'}
                autoCorrect={false}
                editable={!busy}
                accessibilityLabel={field.label}
                onSubmitEditing={submit}
                style={styles.input}
              />
            </View>
          ))}

          {error ? (
            <AppText size={16} color={adult.berry} accessibilityLiveRegion="assertive">
              {error}
            </AppText>
          ) : null}

          <AdultButton variant="primary" onPress={submit} disabled={busy}>
            {busy ? 'One moment…' : submitLabel}
          </AdultButton>

          {extra}

          <View style={styles.footer}>
            <AppText size={16} color={colors.inkSoft}>
              {footer.text}
            </AppText>
            <Link href={footer.href} replace>
              <AppText size={16} weight="bold" color={adult.accent}>
                {footer.linkLabel}
              </AppText>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  body: { padding: 24, gap: 16, maxWidth: 520, width: '100%', alignSelf: 'center' },
  input: {
    minHeight: 52,
    paddingHorizontal: 18,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: adult.rule,
    fontFamily: fonts.regular,
    fontSize: 17,
    color: colors.ink,
    outlineStyle: 'none',
  },
  footer: { flexDirection: 'row', gap: 6, justifyContent: 'center', flexWrap: 'wrap' },
});
