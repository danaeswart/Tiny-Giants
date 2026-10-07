// PLACEHOLDER ART: code-drawn backgrounds. Once the real images exist, scenes
// use `background={require(...)}` instead and these can be deleted.
//
// All backdrops share a 1600 × 900 canvas that crops to fill any screen
// (like CSS background-size: cover). The horizon sits at y = 560.

import { StyleSheet } from 'react-native';
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

function Canvas({ children }) {
  return (
    <Svg
      style={[StyleSheet.absoluteFill, { pointerEvents: 'none' }]}
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
    >
      {children}
    </Svg>
  );
}

function Tree({ x, y, s = 1, shade = '#3f7a4f' }) {
  return (
    <G transform={`translate(${x} ${y}) scale(${s})`}>
      <Rect x={-12} y={-30} width={24} height={60} rx={6} fill="#7a5134" />
      <Path d="M0 -230 L90 -40 L-90 -40 Z" fill={shade} />
      <Path d="M0 -290 L70 -140 L-70 -140 Z" fill={shade} />
      <Path d="M0 -340 L50 -230 L-50 -230 Z" fill={shade} />
    </G>
  );
}

/** The woods. `path` draws the dirt path along the ground. */
export function ForestBackdrop({ path = true }) {
  return (
    <Canvas>
      <Defs>
        <LinearGradient id="forestSky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#bfe6e0" />
          <Stop offset="1" stopColor="#eaf6df" />
        </LinearGradient>
      </Defs>
      <Rect width={1600} height={900} fill="url(#forestSky)" />
      <Path d="M0 560 Q300 420 650 540 T1300 500 T1600 520 V900 H0 Z" fill="#9cc98e" />
      {[120, 380, 620, 900, 1150, 1450].map((x, i) => (
        <Tree key={x} x={x} y={540} s={0.75} shade={i % 2 ? '#5b9a68' : '#6aa874'} />
      ))}
      <Rect y={560} width={1600} height={340} fill="#7fb36f" />
      {path && <Path d="M-50 760 C300 640 500 820 800 720 S1300 640 1650 700" stroke="#d9b98a" strokeWidth={90} fill="none" strokeLinecap="round" />}
      {[60, 300, 1250, 1540].map((x) => (
        <Tree key={x} x={x} y={880} s={1.2} />
      ))}
    </Canvas>
  );
}

/** The beach in daylight. */
export function BeachBackdrop() {
  return (
    <Canvas>
      <Defs>
        <LinearGradient id="beachSky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#8fd3ea" />
          <Stop offset="1" stopColor="#dff3f7" />
        </LinearGradient>
      </Defs>
      <Rect width={1600} height={900} fill="url(#beachSky)" />
      <Circle cx={1320} cy={160} r={70} fill="#ffd66b" />
      <Ellipse cx={380} cy={150} rx={110} ry={34} fill="#ffffff" opacity={0.9} />
      <Ellipse cx={460} cy={130} rx={80} ry={30} fill="#ffffff" opacity={0.9} />
      <Rect y={420} width={1600} height={200} fill="#3f8fa8" />
      <Path d="M0 600 Q200 570 400 600 T800 600 T1200 600 T1600 600 V640 H0 Z" fill="#7cc3d6" />
      <Path d="M0 620 Q400 590 800 630 T1600 610 V900 H0 Z" fill="#f2d7a2" />
    </Canvas>
  );
}

/** The beach at sunset, for the ending. */
export function SunsetBackdrop() {
  return (
    <Canvas>
      <Defs>
        <LinearGradient id="sunsetSky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#6b5aa6" />
          <Stop offset="0.5" stopColor="#f08a7a" />
          <Stop offset="1" stopColor="#ffd08a" />
        </LinearGradient>
      </Defs>
      <Rect width={1600} height={900} fill="url(#sunsetSky)" />
      <Circle cx={800} cy={480} r={130} fill="#ffcf5c" />
      <Rect y={480} width={1600} height={160} fill="#c4677a" />
      <Rect x={680} y={500} width={240} height={10} rx={5} fill="#ffcf5c" opacity={0.6} />
      <Rect x={720} y={540} width={160} height={8} rx={4} fill="#ffcf5c" opacity={0.45} />
      <Path d="M0 640 Q400 610 800 650 T1600 630 V900 H0 Z" fill="#e3b98a" />
    </Canvas>
  );
}
