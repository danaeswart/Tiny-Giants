import { View } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import { colors } from '../../shared/theme.js';
import Eyebrow from './Eyebrow.jsx';

/**
 * A quiet alternative to Hero for the calmer pages (Insights, Settings): no coloured band,
 * just an eyebrow, a title, a line of text and a hairline rule on the cream background.
 * Render it as the first child of AdultScreen (without a `hero`).
 */
export default function PageHeader({ eyebrow, title, subtitle, rule = true }) {
  return (
    <View style={{ gap: 10, paddingBottom: 20, borderBottomWidth: rule ? 1 : 0, borderBottomColor: 'rgba(0,0,0,0.15)' }}>
      {eyebrow ? <Eyebrow color={colors.inkSoft}>{eyebrow}</Eyebrow> : null}
      <AppText size={38} weight="extrabold" color={colors.ink} accessibilityRole="header" style={{ lineHeight: 42 }}>
        {title}
      </AppText>
      {subtitle ? (
        <AppText size={17} color={colors.inkSoft}>
          {subtitle}
        </AppText>
      ) : null}
    </View>
  );
}
