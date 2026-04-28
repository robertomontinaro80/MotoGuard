/**
 * Test di coerenza del design system.
 * Verifica che i token del tema siano definiti correttamente
 * e che non ci siano regressioni nei valori fondamentali.
 */

import { Colors, Spacing, Radius, Typography, Shadows, Animation } from '@theme/index';

describe('Theme — Colors', () => {
  it('all background colors are defined', () => {
    expect(Colors.bg.primary).toBeDefined();
    expect(Colors.bg.secondary).toBeDefined();
    expect(Colors.bg.tertiary).toBeDefined();
    expect(Colors.bg.elevated).toBeDefined();
  });

  it('all status colors are defined', () => {
    expect(Colors.status.ok).toBeDefined();
    expect(Colors.status.warning).toBeDefined();
    expect(Colors.status.danger).toBeDefined();
    expect(Colors.status.info).toBeDefined();
  });

  it('accent primary is the brand orange', () => {
    expect(Colors.accent.primary).toBe('#FF6B2B');
  });

  it('primary background is dark enough', () => {
    // Verifica che sia un colore scuro (dark theme)
    expect(Colors.bg.primary).toBe('#0A0A0F');
  });

  it('all colors are valid hex strings', () => {
    const hexRegex = /^#([0-9A-Fa-f]{3,8})$/;
    const allColors = [
      Colors.accent.primary, Colors.accent.secondary,
      Colors.status.ok, Colors.status.warning, Colors.status.danger, Colors.status.info,
      Colors.text.primary, Colors.text.secondary,
      Colors.bg.primary, Colors.bg.secondary,
    ];
    allColors.forEach((color) => {
      expect(color).toMatch(hexRegex);
    });
  });
});

describe('Theme — Spacing', () => {
  it('spacing values are positive integers', () => {
    Object.values(Spacing).forEach((val) => {
      expect(typeof val).toBe('number');
      expect(val).toBeGreaterThan(0);
    });
  });

  it('spacing increases progressively', () => {
    const { xs, sm, md, lg, xl, xxl } = Spacing;
    expect(xs).toBeLessThan(sm);
    expect(sm).toBeLessThan(md);
    expect(md).toBeLessThan(lg);
    expect(lg).toBeLessThan(xl);
    expect(xl).toBeLessThan(xxl);
  });
});

describe('Theme — Radius', () => {
  it('all radius values are defined and positive', () => {
    Object.values(Radius).forEach((val) => {
      expect(typeof val).toBe('number');
      expect(val).toBeGreaterThan(0);
    });
  });

  it('"full" radius is 999 (pill shape)', () => {
    expect(Radius.full).toBe(999);
  });
});

describe('Theme — Typography', () => {
  it('all variants have fontSize defined', () => {
    const variants = ['display', 'h1', 'h2', 'h3', 'body', 'bodyS', 'label', 'caption'] as const;
    variants.forEach((v) => {
      expect(Typography[v].fontSize).toBeDefined();
      expect(typeof Typography[v].fontSize).toBe('number');
    });
  });

  it('display fontSize is larger than h1', () => {
    expect(Typography.display.fontSize).toBeGreaterThan(Typography.h1.fontSize as number);
  });

  it('h1 fontSize is larger than body', () => {
    expect(Typography.h1.fontSize).toBeGreaterThan(Typography.body.fontSize as number);
  });
});

describe('Theme — Animation', () => {
  it('animation durations are in correct order', () => {
    expect(Animation.fast).toBeLessThan(Animation.normal);
    expect(Animation.normal).toBeLessThan(Animation.slow);
  });

  it('spring config has damping and stiffness', () => {
    expect(Animation.spring.damping).toBeDefined();
    expect(Animation.spring.stiffness).toBeDefined();
  });
});
