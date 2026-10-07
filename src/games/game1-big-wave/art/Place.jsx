import { View } from 'react-native';

/**
 * Puts art on the stage by fractions of the screen, so scenes look the same on
 * phones and tablets. `x` is where the art's centre goes (0 = left edge, 1 = right),
 * `bottom` is how far its bottom edge sits above the bottom of the screen.
 */
export default function Place({ x = 0.5, bottom = 0.1, children, style }) {
  return (
    <View
      style={[
        {
          position: 'absolute',
          left: `${x * 100}%`,
          bottom: `${bottom * 100}%`,
          transform: [{ translateX: '-50%' }],
          pointerEvents: 'none',
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
