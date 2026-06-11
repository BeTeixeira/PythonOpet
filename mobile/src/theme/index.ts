export const Colors = {
  background: '#0D0D10',
  surface: 'rgba(255, 255, 255, 0.05)',
  surfaceMid: 'rgba(255, 255, 255, 0.08)',
  surfaceHigh: 'rgba(255, 255, 255, 0.14)',
  border: 'rgba(255, 255, 255, 0.09)',
  borderHigh: 'rgba(255, 255, 255, 0.20)',
  textPrimary: '#F2F2F5',
  textSecondary: '#8A8A96',
  textTertiary: '#4A4A56',
  accent: '#7C6FCD',
  accentSoft: 'rgba(124, 111, 205, 0.18)',
  star: '#F5C842',
  starEmpty: 'rgba(245, 200, 66, 0.22)',
  error: '#E05252',
  errorSoft: 'rgba(224, 82, 82, 0.14)',
  success: '#52C4A0',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0, 0, 0, 0.80)',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

export const Typography = {
  h1: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: '700' as const, letterSpacing: -0.3 },
  h3: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  bodySmall: { fontSize: 13, fontWeight: '400' as const, lineHeight: 19 },
  label: { fontSize: 12, fontWeight: '600' as const, letterSpacing: 0.5 },
  caption: { fontSize: 11, fontWeight: '400' as const },
} as const;
