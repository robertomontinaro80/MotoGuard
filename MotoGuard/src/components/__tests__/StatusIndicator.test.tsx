/**
 * Test per StatusIndicator e computeStatus.
 * Corrisponde al test definito nella roadmap T2.3:
 *   it.each(['green', 'yellow', 'red'], ...)
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { StatusIndicator, computeStatus } from '../ui/StatusIndicator';
import { Colors } from '@theme/index';

// ─── computeStatus (funzione pura — facile da testare) ────────────────────

describe('computeStatus', () => {
  it('returns "ok" when more than 30 days left', () => {
    expect(computeStatus(45)).toBe('ok');
  });

  it('returns "warning" between 15 and 30 days', () => {
    expect(computeStatus(20)).toBe('warning');
  });

  it('returns "due" between 0 and 14 days', () => {
    expect(computeStatus(7)).toBe('due');
  });

  it('returns "overdue" when days are negative', () => {
    expect(computeStatus(-3)).toBe('overdue');
  });

  it('uses km if smaller than days', () => {
    // 50 giorni ma solo 5 km rimanenti → "due"
    expect(computeStatus(50, 5)).toBe('due');
  });

  it('returns "ok" when both days and km are comfortable', () => {
    expect(computeStatus(60, 500)).toBe('ok');
  });

  it('returns "overdue" if either metric is negative', () => {
    expect(computeStatus(20, -10)).toBe('overdue');
  });
});

// ─── StatusIndicator (componente) ─────────────────────────────────────────

describe('StatusIndicator — render', () => {
  // Corrisponde esattamente allo snippet della roadmap T2.3
  it.each([
    ['ok',      Colors.status.ok],
    ['warning', Colors.status.warning],
    ['due',     Colors.accent.primary],
    ['overdue', Colors.status.danger],
  ] as const)('status="%s" → dot ha colore corretto', (status, expectedColor) => {
    render(<StatusIndicator status={status} />);
    expect(screen.getByTestId('status-dot')).toHaveStyle({
      backgroundColor: expectedColor,
    });
  });

  it('shows label when showLabel=true', () => {
    render(<StatusIndicator status="warning" showLabel />);
    expect(screen.getByTestId('status-label')).toBeTruthy();
  });

  it('hides label when showLabel=false (default)', () => {
    render(<StatusIndicator status="warning" />);
    expect(screen.queryByTestId('status-label')).toBeNull();
  });

  it('shows remaining days in label when positive', () => {
    render(<StatusIndicator status="warning" daysLeft={12} showLabel />);
    expect(screen.getByTestId('status-label')).toHaveTextContent('12gg');
  });

  it('shows "X giorni fa" in label when overdue', () => {
    render(<StatusIndicator status="overdue" daysLeft={-5} showLabel />);
    expect(screen.getByTestId('status-label')).toHaveTextContent('5gg fa');
  });
});
