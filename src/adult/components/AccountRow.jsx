import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import { adult, colors, fonts, radius } from '../../shared/theme.js';
import AdultButton from './AdultButton.jsx';
import Eyebrow from './Eyebrow.jsx';

/**
 * One account detail (email, password) that the parent can change in place. It moves
 * through four states: showing the value, editing (a small form opens), saving, and a
 * confirmation line once it has saved. Errors show under the form and keep it open.
 *   fields    [{ key, label, secure?, keyboardType?, autoComplete?, placeholder? }]
 *   validate  (values) => error message or null, checked before anything is sent
 *   onSubmit  (values) => Promise; throw an Error with a readable message to show it
 */
export default function AccountRow({ label, value, fields, submitLabel, validate, onSubmit, successMessage }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState({});
  const [error, setError] = useState('');
  const [done, setDone] = useState('');

  function open() {
    setValues({});
    setError('');
    setDone('');
    setEditing(true);
  }

  function close() {
    setEditing(false);
    setError('');
  }

  async function submit() {
    const problem = validate?.(values);
    if (problem) {
      setError(problem);
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSubmit(values);
      setEditing(false);
      setDone(successMessage);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.row}>
      <View style={styles.head}>
        <View style={{ flex: 1, gap: 4 }}>
          <Eyebrow>{label}</Eyebrow>
          <AppText size={20} weight="semibold">
            {value}
          </AppText>
        </View>
        {!editing && (
          <Pressable
            onPress={open}
            accessibilityRole="button"
            accessibilityLabel={`Change ${label.toLowerCase()}`}
            hitSlop={8}
            style={styles.change}
          >
            <AppText size={16} weight="bold" color={adult.accent}>
              Change
            </AppText>
          </Pressable>
        )}
      </View>

      {done && !editing ? (
        <AppText size={16} color={adult.leaf} accessibilityLiveRegion="polite">
          {done}
        </AppText>
      ) : null}

      {editing && (
        <View style={styles.form}>
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
                autoCapitalize="none"
                autoCorrect={false}
                editable={!saving}
                placeholder={field.placeholder}
                placeholderTextColor={colors.switchOff}
                accessibilityLabel={field.label}
                style={styles.input}
              />
            </View>
          ))}

          {error ? (
            <AppText size={16} color={adult.berry} accessibilityLiveRegion="assertive">
              {error}
            </AppText>
          ) : null}

          <View style={styles.actions}>
            <AdultButton variant="primary" onPress={submit} disabled={saving}>
              {saving ? 'Saving…' : submitLabel}
            </AdultButton>
            <AdultButton onPress={close} disabled={saving}>
              Cancel
            </AdultButton>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { gap: 16 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  change: { minHeight: 44, justifyContent: 'center' },
  form: { gap: 16 },
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
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
});
