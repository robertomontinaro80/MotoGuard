import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { ProgressBar } from '../ui/ProgressBar';

describe('ProgressBar', () => {
  it('renders track and fill', () => {
    render(<ProgressBar value={50} animated={false} />);
    expect(screen.getByTestId('progress-bar')).toBeTruthy();
    expect(screen.getByTestId('progress-fill')).toBeTruthy();
  });

  it('clamps value above 100 to 100', () => {
    expect(() => render(<ProgressBar value={150} animated={false} />)).not.toThrow();
  });

  it('clamps value below 0 to 0', () => {
    expect(() => render(<ProgressBar value={-10} animated={false} />)).not.toThrow();
  });

  it('has correct accessibilityValue', () => {
    render(<ProgressBar value={72} animated={false} />);
    const bar = screen.getByTestId('progress-bar');
    expect(bar.props.accessibilityValue).toEqual({ min: 0, max: 100, now: 72 });
  });

  it('applies custom color to fill', () => {
    render(<ProgressBar value={50} color="#FF4757" animated={false} />);
    expect(screen.getByTestId('progress-fill')).toHaveStyle({ backgroundColor: '#FF4757' });
  });
});
