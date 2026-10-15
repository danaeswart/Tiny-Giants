import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import AvatarImage from '../../shared/components/AvatarImage.jsx';
import Icon from '../../shared/components/Icon.jsx';
import { adult, colors } from '../../shared/theme.js';

/**
 * A page title that doubles as a child picker: "Mike's games ▾". Tapping it opens a list of
 * the account's children; choosing one calls `onSelect(id)`. With only one child it is
 * just a title.
 */
export default function ChildTitleDropdown({ profiles, current, onSelect, noun = 'games' }) {
  const [open, setOpen] = useState(false);
  const name = current?.name ?? 'Your child';
  const title = `${name}'s ${noun}`;
  const canPick = profiles.length > 1;

  const titleText = (
    <AppText size={38} weight="extrabold" color={colors.ink} accessibilityRole="header" style={{ lineHeight: 42, flexShrink: 1 }}>
      {title}
    </AppText>
  );

  if (!canPick) return titleText;

  return (
    <View style={{ gap: 12 }}>
      <Pressable
        onPress={() => setOpen((o) => !o)}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={`${title}. Choose a child.`}
        style={({ pressed }) => [styles.trigger, pressed && { opacity: 0.7 }]}
      >
        {titleText}
        <View style={[styles.chevron, open && { transform: [{ rotate: '180deg' }] }]}>
          <Icon name="chevron-down" size={22} color={adult.accent} strokeWidth={2.6} />
        </View>
      </Pressable>

      {open ? (
        <View style={styles.menu}>
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
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', alignSelf: 'stretch', gap: 10 },
  chevron: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: adult.accentSoft },
  menu: { borderWidth: 1.5, borderColor: adult.border, borderRadius: 16, padding: 6, gap: 2, alignSelf: 'stretch' },
  avatar: { width: 40, height: 48, alignItems: 'center', justifyContent: 'center' },
  option: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8, paddingHorizontal: 10, borderRadius: 12 },
  optionSelected: { backgroundColor: adult.accentSoft },
});
