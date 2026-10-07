// PLACEHOLDER ART: logs for the log pile (scenes 02, 05) and the jumping game (08).

import { View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

/** One log lying on its side. */
export function Log({ width = 200, height = 56 }) {
  const r = height / 2;
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ pointerEvents: 'none' }}>
      <Rect x={0} y={0} width={width - r} height={height} rx={r} fill="#8b5a3c" />
      <Path d={`M${r} ${height * 0.35} H${width - r * 2}`} stroke="#6e4329" strokeWidth={3} strokeLinecap="round" />
      <Path d={`M${r * 1.6} ${height * 0.68} H${width - r * 2.6}`} stroke="#6e4329" strokeWidth={3} strokeLinecap="round" />
      <Circle cx={width - r} cy={r} r={r} fill="#d9a873" />
      <Circle cx={width - r} cy={r} r={r * 0.6} fill="none" stroke="#a7744a" strokeWidth={2.5} />
      <Circle cx={width - r} cy={r} r={r * 0.25} fill="none" stroke="#a7744a" strokeWidth={2.5} />
    </Svg>
  );
}

// Positions for a big, messy pile (left / bottom offsets in "log heights").
export const PILE = [
  { x: 0, y: 0 },
  { x: 2.6, y: 0 },
  { x: 5.2, y: 0 },
  { x: 1.3, y: 1 },
  { x: 3.9, y: 1 },
  { x: 2.6, y: 2 },
];

/** A big pile of logs blocking the path. For story art (scene 02). */
export function LogPile({ logHeight = 56 }) {
  const w = logHeight * 3.6;
  return (
    <View style={{ width: logHeight * 5.2 + w, height: logHeight * 3, pointerEvents: 'none' }}>
      {PILE.map((p, i) => (
        <View key={i} style={{ position: 'absolute', left: p.x * logHeight, bottom: p.y * logHeight * 0.92 }}>
          <Log width={w} height={logHeight} />
        </View>
      ))}
    </View>
  );
}
