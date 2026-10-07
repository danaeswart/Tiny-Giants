import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors } from '../theme.js';

// Small built-in icon set. Icons are always decorative — the control they sit
// in carries the accessible label.
const SHAPES = {
  home: () => <Path d="M3.5 11 12 4l8.5 7M6 9.5V20h12V9.5" />,
  back: () => <Path d="M19 12H5m6-7-7 7 7 7" />,
  'chevron-left': () => <Path d="m15 5-7 7 7 7" />,
  'chevron-right': () => <Path d="m9 5 7 7-7 7" />,
  search: () => (
    <>
      <Circle cx="10.5" cy="10.5" r="6.5" />
      <Path d="m20 20-4.8-4.8" />
    </>
  ),
  grid: () => (
    <>
      <Rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
      <Rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
      <Rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" />
      <Rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
    </>
  ),
  play: (color) => (
    <Path
      d="M8 5.2v13.6a1 1 0 0 0 1.5.86l11-6.8a1 1 0 0 0 0-1.72l-11-6.8A1 1 0 0 0 8 5.2Z"
      fill={color}
    />
  ),
  close: () => <Path d="M6 6l12 12M18 6 6 18" />,
  heart: () => (
    <Path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20Z" />
  ),
  phone: () => (
    <>
      <Rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
      <Path d="M10.5 18.5h3" />
    </>
  ),
};

export default function Icon({ name, size = 24, color = colors.ink, strokeWidth = 2.5 }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ pointerEvents: 'none' }}
    >
      {SHAPES[name](color)}
    </Svg>
  );
}
