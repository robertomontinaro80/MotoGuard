/**
 * Design system di MotoGuard.
 * Dark theme con accent arancione bruciato — stile industriale/automotive.
 */

import { TextStyle } from 'react-native';

// ─── Colori ───────────────────────────────────────────────────────────────

export const Colors = {
  // Background
  bg: {
    primary:   '#0A0A0F',   // Sfondo principale
    secondary: '#12121E',   // Card, bottom sheet
    tertiary:  '#1A1A2E',   // Input, badge
    elevated:  '#22223A',   // Tooltip, overlay
  },

  // Accent
  accent: {
    primary:  '#FF6B2B',    // CTA principale, progress
    secondary:'#FF8C55',    // Stato hover
    muted:    '#FF6B2B33',  // Background accent tenue
  },

  // Status
  status: {
    ok:       '#4ECDC4',    // Verde turchese — tutto bene
    warning:  '#FFC107',    // Giallo — attenzione
    danger:   '#FF4757',    // Rosso — emergenza / scaduto
    info:     '#A78BFA',    // Viola — info / meteo
  },

  // Testo
  text: {
    primary:   '#E8E8F0',   // Testo principale
    secondary: '#9898B0',   // Testo secondario, label
    muted:     '#55556A',   // Placeholder, disabilitato
    inverse:   '#0A0A0F',   // Testo su sfondo chiaro
  },

  // Bordi
  border: {
    default: '#2A2A3E',
    focused: '#FF6B2B',
    subtle:  '#1E1E2E',
  },

  // Trasparenze utility
  overlay: 'rgba(10, 10, 15, 0.85)',
  white:   '#FFFFFF',
  black:   '#000000',
} as const;

// ─── Spaziatura ───────────────────────────────────────────────────────────

export const Spacing = {
  xs:   4,
  sm:   8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
  xxxl:64,
} as const;

// ─── Border radius ────────────────────────────────────────────────────────

export const Radius = {
  sm:   6,
  md:  10,
  lg:  16,
  xl:  24,
  full:999,
} as const;

// ─── Tipografia ───────────────────────────────────────────────────────────

export const Typography = {
  // Display — per titoli grandi e verdict
  display: {
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -1,
    color: Colors.text.primary,
  } as TextStyle,

  // Heading
  h1: { fontSize: 28, fontWeight: '700', letterSpacing: -0.5, color: Colors.text.primary } as TextStyle,
  h2: { fontSize: 22, fontWeight: '700', letterSpacing: -0.3, color: Colors.text.primary } as TextStyle,
  h3: { fontSize: 18, fontWeight: '600', color: Colors.text.primary } as TextStyle,

  // Body
  body:  { fontSize: 15, fontWeight: '400', color: Colors.text.primary, lineHeight: 22 } as TextStyle,
  bodyS: { fontSize: 13, fontWeight: '400', color: Colors.text.secondary, lineHeight: 19 } as TextStyle,

  // Label (monospace — per ID, codici, badge)
  label:  { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', color: Colors.text.secondary } as TextStyle,
  labelS: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', color: Colors.text.muted } as TextStyle,

  // Caption
  caption: { fontSize: 12, fontWeight: '400', color: Colors.text.muted } as TextStyle,
} as const;

// ─── Ombre ────────────────────────────────────────────────────────────────

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  accent: {
    shadowColor: Colors.accent.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  danger: {
    shadowColor: Colors.status.danger,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
} as const;

// ─── Animazioni ───────────────────────────────────────────────────────────

export const Animation = {
  fast:   150,
  normal: 250,
  slow:   400,
  spring: { damping: 18, stiffness: 200 },
} as const;
