// Design tokens shared by child/ and adult/ screens.

export const colors = {
  cream: '#fff7ea',
  paper: '#fffdf7',
  white: '#ffffff',
  ink: '#2b2733',
  inkSoft: '#5b5566',
  inkFaint: 'rgba(43, 39, 51, 0.12)',
  sun: '#ffc24b',
  sunDeep: '#e89b1c',
  sea: '#3f8fa8',
  seaDeep: '#2c6d82',
  leaf: '#4f8f5e',
  switchOff: '#8a8494',
  // Storybook
  page: '#ece6cf',
  spine: '#4b4650',
  backdrop: 'rgba(43, 39, 51, 0.5)',
};

export const fonts = {
  regular: 'Nunito_400Regular',
  semibold: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
  extrabold: 'Nunito_800ExtraBold',
};

// Accessibility floors. AppText never renders below MIN_FONT_SIZE, and no
// tappable control is smaller than MIN_TOUCH (child controls are bigger still).
export const MIN_FONT_SIZE = 16;
export const MIN_TOUCH = 56;

export const radius = {
  sm: 12,
  md: 16,
  lg: 24,
  pill: 999,
};
