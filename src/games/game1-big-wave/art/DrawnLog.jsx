// A log lying on its side, drawn in code, its cut end showing on the right.
// Used by the log-clearing game (05) and the log-jumping game (08).

import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

export default function DrawnLog({ width, height, bark = '#6b4423', cut = '#dcae78', ring = '#a7744a' }) {
  const r = height / 2;
  const endX = width - r * 0.55; // centre of the cut end
  const grain = { stroke: '#000', strokeOpacity: 0.22, strokeWidth: 3, strokeLinecap: 'round' };
  return (
    <Svg width={width} height={height} style={{ pointerEvents: 'none' }}>
      <Rect x={0} y={0} width={endX} height={height} rx={r * 0.35} fill={bark} />
      <Rect x={0} y={height * 0.62} width={endX} height={height * 0.38} rx={r * 0.35} fill="#000" opacity={0.18} />
      <Path d={`M${width * 0.08} ${height * 0.3} H${width * 0.5}`} {...grain} />
      <Path d={`M${width * 0.28} ${height * 0.55} H${width * 0.74}`} {...grain} />
      <Path d={`M${width * 0.12} ${height * 0.78} H${width * 0.4}`} {...grain} />
      <Ellipse cx={endX} cy={r} rx={r * 0.55} ry={r} fill={cut} stroke={ring} strokeWidth={2.5} />
      <Ellipse cx={endX} cy={r} rx={r * 0.32} ry={r * 0.6} fill="none" stroke={ring} strokeWidth={2} />
      <Circle cx={endX} cy={r} r={r * 0.12} fill={ring} />
    </Svg>
  );
}
