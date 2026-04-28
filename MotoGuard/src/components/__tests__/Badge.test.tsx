import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Badge } from '../ui/Badge';
import { Colors } from '@theme/index';

describe('Badge — render', () => {
  it('renders label text', () => {
    render(<Badge label="Scaduto" status="danger" />);
    expect(screen.getByTestId('badge-label')).toHaveTextContent('Scaduto');
  });

  it('renders dot mode without text', () => {
    render(<Badge label="hidden" dot />);
    expect(screen.getByTestId('badge-dot')).toBeTruthy();
    expect(screen.queryByTestId('badge-label')).toBeNull();
  });

  it('applies correct color for danger status', () => {
    render(<Badge label="Overdue" status="danger" />);
    expect(screen.getByTestId('badge-label')).toHaveStyle({ color: Colors.status.danger });
  });

  it('applies correct color for ok status', () => {
    render(<Badge label="OK" status="ok" />);
    expect(screen.getByTestId('badge-label')).toHaveStyle({ color: Colors.status.ok });
  });

  const statuses = ['ok', 'warning', 'danger', 'info', 'neutral'] as const;
  statuses.forEach((s) => {
    it(`renders status="${s}" without crash`, () => {
      expect(() => render(<Badge label="test" status={s} />)).not.toThrow();
    });
  });
});
