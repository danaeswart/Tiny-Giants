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
  user: () => (
    <>
      <Circle cx="12" cy="8" r="4" />
      <Path d="M4.5 20c.8-4 3.9-6 7.5-6s6.7 2 7.5 6" />
    </>
  ),
  check: () => <Path d="m5 12.5 4.5 4.5L19 7.5" />,
  chart: () => <Path d="M5 20V11M12 20V4M19 20v-6" />,
  info: () => (
    <>
      <Circle cx="12" cy="12" r="9" />
      <Path d="M12 11v5.5M12 7.6v.1" />
    </>
  ),
  sparkle: () => <Path d="M12 3l2 5.5L19.5 10.5 14 12.5 12 18l-2-5.5L4.5 10.5 10 8.5ZM19 16v4M17 18h4" />,
  clock: () => (
    <>
      <Circle cx="12" cy="12" r="9" />
      <Path d="M12 7v5l3 2" />
    </>
  ),
  swap: () => <Path d="M4 8h14m-4-4 4 4-4 4M20 16H6m4-4-4 4 4 4" />,
  heart: () => (
    <Path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20Z" />
  ),
  image: () => (
    <>
      <Rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
      <Circle cx="9" cy="10" r="1.6" />
      <Path d="m4 17 5-4.5 3.5 3L15.5 13l4.5 4.5" />
    </>
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
