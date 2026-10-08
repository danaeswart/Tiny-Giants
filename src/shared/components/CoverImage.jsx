import { Image, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { resolveImage } from '../data/images.js';

// Soft palettes for generated placeholder covers, picked per game id so each
// game keeps a consistent look until real art is added.
const PALETTES = [
  { sky: '#bfe6f2', sun: '#ffd27a', hill: '#3f8fa8', far: '#8cc7d8' },
  { sky: '#ffe3c7', sun: '#f28f6b', hill: '#6a9f5c', far: '#b3d49c' },
  { sky: '#e8dcf7', sun: '#ffc24b', hill: '#8a67b8', far: '#c3aee0' },
  { sky: '#d9f0dc', sun: '#ffb36b', hill: '#4f8f5e', far: '#9fcfa8' },
];

function paletteFor(id) {
  let hash = 0;
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return PALETTES[hash % PALETTES.length];
}

/** A game's thumbnail. Decorative: the title is always shown beside it. */
export default function CoverImage({ game, style }) {
  const source =
    resolveImage(game.coverImage) ?? resolveImage(game.image) ?? resolveImage(game.pages?.left);

  if (source) {
    return (
      <Image
        source={source}
        resizeMode="cover"
        accessible={false}
        style={[{ overflow: 'hidden' }, style]}
      />
    );
  }

  const p = paletteFor(game.id);
  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={[{ overflow: 'hidden', backgroundColor: p.sky }, style]}
    >
      <Svg width="100%" height="100%" viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice">
        <Circle cx="116" cy="38" r="18" fill={p.sun} />
        <Path d="M0 86 C30 64 58 66 84 80 S130 70 160 74 V120 H0Z" fill={p.far} />
        <Path d="M0 100 C36 80 70 86 98 98 S140 92 160 96 V120 H0Z" fill={p.hill} />
      </Svg>
    </View>
  );
}
