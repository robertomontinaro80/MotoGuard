import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { VerdictCard } from '../ui/VerdictCard';
import { RouteWeatherAnalysis } from '@types/index';
import { Colors } from '@theme/index';

const makeAnalysis = (overrides: Partial<RouteWeatherAnalysis> = {}): RouteWeatherAnalysis => ({
  score: 80,
  verdict: 'go',
  risks: [],
  worstSeverity: 'none',
  points: [],
  ...overrides,
});

describe('VerdictCard — verdict display', () => {
  // Corrisponde esattamente allo snippet T3.3 della roadmap
  it('displays VAI! for go verdict with green color', () => {
    render(<VerdictCard analysis={makeAnalysis({ score: 88, verdict: 'go' })} />);
    expect(screen.getByTestId('verdict-label')).toHaveTextContent('VAI!');
    expect(screen.getByTestId('verdict-card')).toHaveStyle({ borderColor: Colors.status.ok });
  });

  it('displays ATTENZIONE for caution verdict', () => {
    render(<VerdictCard analysis={makeAnalysis({ score: 55, verdict: 'caution' })} />);
    expect(screen.getByTestId('verdict-label')).toHaveTextContent('ATTENZIONE');
    expect(screen.getByTestId('verdict-card')).toHaveStyle({ borderColor: Colors.status.warning });
  });

  it('displays NO GO for no_go verdict', () => {
    render(<VerdictCard analysis={makeAnalysis({ score: 20, verdict: 'no_go' })} />);
    expect(screen.getByTestId('verdict-label')).toHaveTextContent('NO GO');
    expect(screen.getByTestId('verdict-card')).toHaveStyle({ borderColor: Colors.status.danger });
  });
});

describe('VerdictCard — risks', () => {
  it('shows risk badges when risks present', () => {
    render(<VerdictCard analysis={makeAnalysis({ risks: ['ice', 'strong_wind'], worstSeverity: 'high' })} />);
    expect(screen.getByTestId('risk-badge-ice')).toBeTruthy();
    expect(screen.getByTestId('risk-badge-strong_wind')).toBeTruthy();
  });

  it('hides risks section when no risks', () => {
    render(<VerdictCard analysis={makeAnalysis({ risks: [] })} />);
    expect(screen.queryByTestId('verdict-risks')).toBeNull();
  });
});

describe('VerdictCard — suggestion', () => {
  it('shows departure suggestion when available', () => {
    render(<VerdictCard analysis={makeAnalysis({
      verdict: 'caution',
      bestDepartureLabel: 'Parti alle 14:00 (score 82)',
    })} />);
    expect(screen.getByTestId('verdict-suggestion')).toBeTruthy();
    expect(screen.getByText(/Parti alle 14:00/)).toBeTruthy();
  });

  it('hides suggestion when not available', () => {
    render(<VerdictCard analysis={makeAnalysis({ bestDepartureLabel: undefined })} />);
    expect(screen.queryByTestId('verdict-suggestion')).toBeNull();
  });
});
