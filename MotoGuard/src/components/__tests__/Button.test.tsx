/**
 * Test suite per il componente Button.
 * Copre: render, interazioni, stati, accessibilità.
 */

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { Button } from '../ui/Button';

// Helper per renderizzare con le prop minime
const renderButton = (props: Partial<React.ComponentProps<typeof Button>> = {}) => {
  const defaults = {
    label: 'Test Button',
    onPress: jest.fn(),
  };
  return render(<Button {...defaults} {...props} />);
};

// ─── Render ────────────────────────────────────────────────────────────────

describe('Button — render', () => {
  it('renders label correctly', () => {
    renderButton({ label: 'Salva moto' });
    expect(screen.getByText('Salva moto')).toBeTruthy();
  });

  it('renders with default testID derived from label', () => {
    renderButton({ label: 'Aggiungi moto' });
    expect(screen.getByTestId('button-aggiungi-moto')).toBeTruthy();
  });

  it('renders with custom testID when provided', () => {
    renderButton({ testID: 'custom-test-id' });
    expect(screen.getByTestId('custom-test-id')).toBeTruthy();
  });
});

// ─── Interazioni ───────────────────────────────────────────────────────────

describe('Button — interactions', () => {
  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    renderButton({ onPress });
    fireEvent.press(screen.getByTestId('button-test-button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does NOT call onPress when disabled', () => {
    const onPress = jest.fn();
    renderButton({ onPress, disabled: true });
    fireEvent.press(screen.getByTestId('button-test-button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('does NOT call onPress when loading', () => {
    const onPress = jest.fn();
    renderButton({ onPress, loading: true });
    fireEvent.press(screen.getByTestId('button-test-button'));
    expect(onPress).not.toHaveBeenCalled();
  });
});

// ─── Stato loading ─────────────────────────────────────────────────────────

describe('Button — loading state', () => {
  it('shows spinner when loading=true', () => {
    renderButton({ loading: true });
    expect(screen.getByTestId('button-spinner')).toBeTruthy();
  });

  it('hides label when loading=true', () => {
    renderButton({ loading: true, label: 'Salva' });
    expect(screen.queryByTestId('button-label')).toBeNull();
  });

  it('shows label when loading=false', () => {
    renderButton({ loading: false, label: 'Salva' });
    expect(screen.getByTestId('button-label')).toBeTruthy();
  });
});

// ─── Varianti ──────────────────────────────────────────────────────────────

describe('Button — variants', () => {
  const variants = ['primary', 'secondary', 'danger', 'ghost'] as const;

  variants.forEach((variant) => {
    it(`renders ${variant} variant without crashing`, () => {
      expect(() => renderButton({ variant })).not.toThrow();
    });
  });
});

// ─── Accessibilità ─────────────────────────────────────────────────────────

describe('Button — accessibility', () => {
  it('has role="button"', () => {
    renderButton();
    const btn = screen.getByRole('button');
    expect(btn).toBeTruthy();
  });

  it('has accessibilityLabel equal to label', () => {
    renderButton({ label: 'Conferma partenza' });
    expect(screen.getByLabelText('Conferma partenza')).toBeTruthy();
  });

  it('is marked as disabled in accessibilityState when disabled', () => {
    renderButton({ disabled: true });
    const btn = screen.getByRole('button');
    expect(btn.props.accessibilityState?.disabled).toBe(true);
  });

  it('is marked as busy in accessibilityState when loading', () => {
    renderButton({ loading: true });
    const btn = screen.getByRole('button');
    expect(btn.props.accessibilityState?.busy).toBe(true);
  });
});
