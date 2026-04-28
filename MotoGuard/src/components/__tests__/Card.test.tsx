import React from 'react';
import { Text } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { Card } from '../ui/Card';

describe('Card — render', () => {
  it('renders children', () => {
    render(<Card><Text>Contenuto</Text></Card>);
    expect(screen.getByText('Contenuto')).toBeTruthy();
  });

  it('renders with default testID', () => {
    render(<Card><Text>x</Text></Card>);
    expect(screen.getByTestId('card')).toBeTruthy();
  });

  it('renders with custom testID', () => {
    render(<Card testID="moto-card"><Text>x</Text></Card>);
    expect(screen.getByTestId('moto-card')).toBeTruthy();
  });

  const variants = ['default', 'accent', 'danger', 'info', 'flat'] as const;
  variants.forEach((v) => {
    it(`renders variant="${v}" without crash`, () => {
      expect(() => render(<Card variant={v}><Text>x</Text></Card>)).not.toThrow();
    });
  });
});
