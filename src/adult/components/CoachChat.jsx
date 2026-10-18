import { useState } from 'react';
import { ActivityIndicator, StyleSheet, TextInput, View } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import Icon from '../../shared/components/Icon.jsx';
import { askCoach } from '../../shared/services/coach.js';
import { adult, colors, fonts, radius } from '../../shared/theme.js';
import AdultButton from './AdultButton.jsx';
import Eyebrow from './Eyebrow.jsx';
import CoachMessage from './CoachMessage.jsx';

const MAX_LENGTH = 500;

/**
 * Chat with the parent coach about one game, as one open chat area (no card or border around it).
 * Nothing is sent until the grown-up taps "Get ideas", which fetches the opening recommendation;
 * after that they can ask follow-ups. The conversation lives only in this component (it isn't saved).
 */
export default function CoachChat({ game, child, plays }) {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [started, setStarted] = useState(false);

  async function ask(history) {
    setBusy(true);
    setError('');
    try {
      const reply = await askCoach({ game, child, plays, messages: history });
      setMessages([...history, { role: 'assistant', content: reply }]);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  function start() {
    setStarted(true);
    ask([]);
  }

  function send() {
    const text = draft.trim();
    if (!text || busy) return;
    setDraft('');
    const history = [...messages, { role: 'user', content: text }];
    setMessages(history);
    ask(history);
  }

  if (!started) {
    return (
      <View style={[styles.chat, { minHeight: 0 }]}>
        <View style={styles.intro}>
          <Icon name="sparkle" size={28} color={adult.accent} strokeWidth={2.2} />
          <AppText size={20} weight="semibold" style={{ lineHeight: 28 }}>
            Get ideas for playing {game.title} with {child?.name ?? 'your child'}, and activities that build on it.
          </AppText>
        </View>
        <AdultButton variant="primary" icon="sparkle" onPress={start} style={{ alignSelf: 'stretch' }}>
          Get ideas
        </AdultButton>
      </View>
    );
  }

  return (
    <View style={styles.chat}>
      <View style={styles.messages}>
        {messages.map((m, i) =>
          m.role === 'user' ? (
            <View key={i} style={styles.question}>
              <Eyebrow color={adult.accent}>You asked</Eyebrow>
              <AppText size={17} weight="semibold" selectable>
                {m.content}
              </AppText>
            </View>
          ) : (
            <View key={i} style={i > 0 && styles.reply}>
              <CoachMessage content={m.content} />
            </View>
          ),
        )}

        {busy && (
          <View style={styles.thinking} accessibilityLiveRegion="polite">
            <ActivityIndicator color={adult.accent} />
            <AppText size={16} color={colors.inkSoft}>
              Thinking…
            </AppText>
          </View>
        )}

        {error ? (
          <View style={{ gap: 8 }}>
            <AppText size={16} color={colors.inkSoft} accessibilityLiveRegion="polite">
              {error}
            </AppText>
            <AdultButton onPress={() => ask(messages)}>Try again</AdultButton>
          </View>
        ) : null}
      </View>

      <View style={{ gap: 8 }}>
        <View style={styles.inputRow}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={send}
            maxLength={MAX_LENGTH}
            placeholder="Ask a follow-up…"
            placeholderTextColor={colors.switchOff}
            accessibilityLabel="Ask the coach a follow-up question"
            returnKeyType="send"
            editable={!busy}
            style={styles.input}
          />
          <AdultButton variant="primary" icon="play" onPress={send} disabled={busy || !draft.trim()} accessibilityLabel="Send" />
        </View>
        <AppText size={16} color={colors.inkSoft}>
          AI suggestions, not professional advice.
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chat: { gap: 20, minHeight: 420 },
  intro: { gap: 12 },
  messages: { flex: 1, gap: 16 },
  // A follow-up question is a labelled line with a rule above it, and the answer reads on from it.
  question: { gap: 4, paddingTop: 16, borderTopWidth: 1.5, borderTopColor: adult.rule },
  reply: { paddingBottom: 4 },
  thinking: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: adult.rule,
    fontFamily: fonts.regular,
    fontSize: 17,
    color: colors.ink,
    outlineStyle: 'none',
  },
});
