// Design tokens shared by child/ and adult/ screens.

// Palette drawn from Cami's world: the candle flame, the big wave, the forest and castle.
export const colors = {
  cream: '#fff6e3',
  paper: '#fffbf2',
  white: '#ffffff',
  ink: '#241447', // Night: deep plum
  inkSoft: '#5d5280',
  inkFaint: 'rgba(36, 20, 71, 0.12)',
  flame: '#ff6b2c',
  flameSoft: '#ffe6d8',
  glow: '#ffc933',
  glowSoft: '#fff1c2',
  wave: '#14a3d9',
  waveSoft: '#d6f0fb',
  deepSea: '#0b4c8c',
  deepSeaSoft: '#dbe8f5',
  berry: '#ff4f87',
  berrySoft: '#ffdbe7',
  forest: '#22b573',
  forestSoft: '#d6f3e5',
  // Legacy names kept so existing screens pick up the new palette.
  sun: '#ffc933',
  sunDeep: '#ff6b2c',
  sea: '#14a3d9',
  seaDeep: '#0b4c8c',
  leaf: '#22b573',
  switchOff: '#9a90b8',
  // Storybook
  page: '#fbeccb',
  spine: '#241447',
  backdrop: 'rgba(36, 20, 71, 0.55)',
};

// Talina is the display face for headings and big labels. The demo cut only has letters
// (no digits or punctuation), so AppText falls back to Poppins for those characters.
// Poppins is the body face.
export const fonts = {
  regular: 'Poppins_400Regular',
  semibold: 'Poppins_500Medium',
  bold: 'Poppins_600SemiBold',
  extrabold: 'Talina',
  fallback: 'Poppins_600SemiBold',
  mono: 'DMMono_400Regular',
};

// Accessibility floors. AppText never renders below MIN_FONT_SIZE, and no
// tappable control is smaller than MIN_TOUCH (child controls are bigger still).
export const MIN_FONT_SIZE = 16;
export const MIN_TOUCH = 56;

// 4-pt spacing scale.
export const space = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };

export const radius = {
  sm: 14,
  md: 20,
  lg: 28,
  pill: 999,
};

// Grown-up side: same hues as the child side, but quieter. Deep Sea does the heavy
// lifting; the brighter colours appear as small accents and soft tints.
export const adult = {
  bg: colors.cream,
  card: 'transparent', // no white boxes on the cream background
  nav: colors.ink,
  border: 'rgba(36, 20, 71, 0.14)',
  rule: 'rgba(36, 20, 71, 0.2)',
  hero: '#2b3bff', // electric blue bands
  accent: '#2b3bff',
  accentSoft: '#dfe2ff',
  lime: '#d7f23a',
  flame: colors.flame,
  leaf: '#168a56',
  leafSoft: colors.forestSoft,
  warm: '#b34a10',
  warmSoft: colors.flameSoft,
  berry: '#d62f67',
  berrySoft: colors.berrySoft,
  glow: colors.glow,
  glowSoft: colors.glowSoft,
};

export const shadows = {
  card: '0 4px 16px rgba(36, 20, 71, 0.06)',
  lifted: '0 12px 28px rgba(36, 20, 71, 0.16)',
};
