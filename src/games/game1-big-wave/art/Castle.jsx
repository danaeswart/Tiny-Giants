// PLACEHOLDER ART: the sandcastle at each building step (scene 12), plus the
// finished castle for later scenes. Replace with your drawn frames: one image per
// step, listed in scene 12's FRAMES.

import Svg, { Circle, G, Path, Rect } from 'react-native-svg';

const SAND = '#e9c27d';
const SAND_DARK = '#d1a45e';

export const CASTLE_STEPS = 9; // 0 = a pile of sand, 8 = finished with shells (the candle on top is added by the scenes)

/** The castle built up to `step` (0 to CASTLE_STEPS - 1). */
export default function Castle({ step = CASTLE_STEPS - 1, size = 320 }) {
  return (
    <Svg width={size} height={size * 0.8} viewBox="0 0 200 160" style={{ pointerEvents: 'none' }}>
      {/* 0: a loose mound of sand */}
      {step === 0 && <Path d="M30 160 Q100 90 170 160 Z" fill={SAND} />}
      {/* 1+: a packed base */}
      {step >= 1 && <Rect x={30} y={120} width={140} height={40} rx={4} fill={SAND} />}
      {/* 2+: middle block */}
      {step >= 2 && <Rect x={60} y={80} width={80} height={42} rx={3} fill={SAND} />}
      {/* 3+: left tower, 4+: right tower */}
      {step >= 3 && (
        <G fill={SAND_DARK}>
          <Rect x={26} y={86} width={30} height={74} rx={3} />
          <Path d="M26 86 h6 v-8 h6 v8 h6 v-8 h6 v8 h6" />
        </G>
      )}
      {step >= 4 && (
        <G fill={SAND_DARK}>
          <Rect x={144} y={86} width={30} height={74} rx={3} />
          <Path d="M144 86 h6 v-8 h6 v8 h6 v-8 h6 v8 h6" />
        </G>
      )}
      {/* 5+: top tower */}
      {step >= 5 && (
        <G>
          <Rect x={84} y={46} width={32} height={36} rx={3} fill={SAND} />
          <Path d="M84 46 h6 v-8 h7 v8 h6 v-8 h7 v8 h6" fill={SAND} />
        </G>
      )}
      {/* 6+: a door */}
      {step >= 6 && <Path d="M90 160 v-22 a10 10 0 0 1 20 0 v22 Z" fill={SAND_DARK} />}
      {/* step 7 is the candle on top, which the scene draws itself */}
      {/* 8: shell decorations */}
      {step >= 8 && (
        <G>
          <Circle cx={50} cy={140} r={4} fill="#fff7ea" />
          <Circle cx={150} cy={140} r={4} fill="#fff7ea" />
          <Circle cx={75} cy={100} r={3} fill="#f6b8ad" />
          <Circle cx={125} cy={100} r={3} fill="#f6b8ad" />
        </G>
      )}
    </Svg>
  );
}
