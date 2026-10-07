// PLACEHOLDER ART: the main character, drawn in code. Swap for the real
// character images when they're ready (one PNG per pose/mood works well).

import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';

const SKIN = '#f2c7a5';
const HAIR = '#6b3f2a';
const DRESS = '#e8736b';

// Mouth and eyes for each mood.
const FACES = {
  happy: { mouth: 'M42 50 Q50 58 58 50', eyes: 'open' },
  worried: { mouth: 'M43 54 Q50 49 57 54', eyes: 'open' },
  ouch: { mouth: 'M45 53 Q50 48 55 53 Q50 56 45 53', eyes: 'squint' },
  calm: { mouth: 'M44 51 Q50 55 56 51', eyes: 'closed' },
  blowing: { mouth: null, eyes: 'closed' },
};

/**
 *   size    height in pixels
 *   mood    'happy' | 'worried' | 'ouch' | 'calm' | 'blowing'
 *   candle  'lit' | 'out' | null: the small candle she carries
 */
export default function Character({ size = 220, mood = 'happy', candle = 'lit' }) {
  const face = FACES[mood];
  return (
    <Svg width={size * 0.75} height={size} viewBox="0 0 120 160" style={{ pointerEvents: 'none' }}>
      {/* hair (back) */}
      <Path d="M24 40 Q22 80 34 86 L66 86 Q78 80 76 40 Z" fill={HAIR} />
      {/* legs + shoes */}
      <Rect x={40} y={128} width={7} height={22} fill={SKIN} />
      <Rect x={53} y={128} width={7} height={22} fill={SKIN} />
      <Ellipse cx={42} cy={152} rx={8} ry={4} fill="#3d5a80" />
      <Ellipse cx={58} cy={152} rx={8} ry={4} fill="#3d5a80" />
      {/* dress */}
      <Path d="M38 74 L62 74 L76 132 L24 132 Z" fill={DRESS} />
      {/* arms */}
      <Path d="M38 80 Q26 96 28 108" stroke={SKIN} strokeWidth={7} strokeLinecap="round" fill="none" />
      <Path d="M62 80 Q78 92 84 98" stroke={SKIN} strokeWidth={7} strokeLinecap="round" fill="none" />
      {/* head */}
      <Circle cx={50} cy={44} r={24} fill={SKIN} />
      <Path d="M26 42 Q30 16 50 18 Q72 16 75 42 Q62 30 50 32 Q36 30 26 42 Z" fill={HAIR} />
      {/* eyes */}
      {face.eyes === 'open' && (
        <G fill="#2b2733">
          <Circle cx={41} cy={44} r={3} />
          <Circle cx={59} cy={44} r={3} />
        </G>
      )}
      {face.eyes !== 'open' && (
        <G stroke="#2b2733" strokeWidth={2.5} strokeLinecap="round" fill="none">
          <Path d={face.eyes === 'squint' ? 'M37 42 L44 45 M63 42 L56 45' : 'M37 45 Q41 48 45 45 M55 45 Q59 48 63 45'} />
        </G>
      )}
      {/* cheeks */}
      <Circle cx={36} cy={51} r={4} fill="#f29b8f" opacity={0.6} />
      <Circle cx={64} cy={51} r={4} fill="#f29b8f" opacity={0.6} />
      {/* mouth */}
      {face.mouth ? (
        <Path d={face.mouth} stroke="#2b2733" strokeWidth={2.5} strokeLinecap="round" fill="none" />
      ) : (
        <Circle cx={50} cy={53} r={3.5} fill="#2b2733" />
      )}
      {/* her little candle */}
      {candle && (
        <G>
          <Rect x={82} y={88} width={10} height={20} rx={2} fill="#fff3d6" stroke="#e0c99a" strokeWidth={1} />
          <Rect x={86.5} y={84} width={1.5} height={5} fill="#2b2733" />
          {candle === 'lit' && <Path d="M87 72 Q93 80 87 85 Q81 80 87 72 Z" fill="#ffb238" />}
        </G>
      )}
    </Svg>
  );
}
