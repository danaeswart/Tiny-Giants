import { StyleSheet, Text, View } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import { adult, colors, fonts } from '../../shared/theme.js';

// The coach replies in light markdown (### headings, **bold**, - bullets, 1. steps). This turns
// that into proper headings, bold words and lists, so a reply reads like a short article
// rather than a chat bubble full of symbols.

const HEADING = /^\s{0,3}#{1,6}\s+(.*)$/;
const BULLET = /^\s*[-*•]\s+(.*)$/;
const NUMBERED = /^\s*(\d+)[.)]\s+(.*)$/;
const INLINE = /(\*\*[^*]+\*\*|__[^_]+__|\*[^*\s][^*]*\*|_[^_\s][^_]*_)/;

/** Bold and italic words inside a line, as nested <Text>. */
function inline(text) {
  return text.split(INLINE).map((part, i) => {
    if (/^(\*\*|__)[\s\S]+\1$/.test(part)) {
      return (
        <Text key={i} style={{ fontFamily: fonts.bold }}>
          {part.slice(2, -2)}
        </Text>
      );
    }
    if (/^(\*|_)[\s\S]+\1$/.test(part)) {
      return (
        <Text key={i} style={{ fontStyle: 'italic' }}>
          {part.slice(1, -1)}
        </Text>
      );
    }
    return part;
  });
}

function parse(content) {
  const blocks = [];
  for (const raw of content.replace(/\r\n/g, '\n').split('\n')) {
    const line = raw.trimEnd();
    if (!line.trim()) continue;
    let m;
    if ((m = line.match(HEADING))) blocks.push({ type: 'heading', text: m[1].replace(/\*\*/g, '') });
    else if ((m = line.match(BULLET))) blocks.push({ type: 'bullet', text: m[1] });
    else if ((m = line.match(NUMBERED))) blocks.push({ type: 'number', n: m[1], text: m[2] });
    else blocks.push({ type: 'text', text: line.trim() });
  }
  return blocks;
}

/** One coach reply, laid out as headed, readable information. */
export default function CoachMessage({ content }) {
  const blocks = parse(content);
  return (
    <View style={styles.body}>
      {blocks.map((b, i) => {
        if (b.type === 'heading') {
          return (
            <AppText key={i} size={20} weight="bold" accessibilityRole="header" style={[styles.heading, i === 0 && { marginTop: 0 }]}>
              {inline(b.text)}
            </AppText>
          );
        }
        if (b.type === 'bullet' || b.type === 'number') {
          return (
            <View key={i} style={styles.item}>
              <AppText size={17} weight="bold" color={adult.accent} style={styles.marker}>
                {b.type === 'bullet' ? '•' : `${b.n}.`}
              </AppText>
              <AppText size={17} selectable style={{ flex: 1 }}>
                {inline(b.text)}
              </AppText>
            </View>
          );
        }
        return (
          <AppText key={i} size={17} selectable>
            {inline(b.text)}
          </AppText>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  body: { gap: 10 },
  heading: { marginTop: 8, color: colors.ink },
  item: { flexDirection: 'row', gap: 10 },
  marker: { minWidth: 20 },
});
