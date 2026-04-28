import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { OnboardingScreen } from '../OnboardingScreen';

jest.mock('@hooks/useAppNavigation', () => ({
  useAppNavigation: () => ({ reset: jest.fn(), navigate: jest.fn() }),
}));

function renderOnboarding() {
  return render(
    <NavigationContainer>
      <OnboardingScreen />
    </NavigationContainer>,
  );
}

describe('OnboardingScreen', () => {
  it('renders first slide correctly', () => {
    renderOnboarding();
    expect(screen.getByTestId('onboarding-slide-0')).toBeTruthy();
  });

  it('shows skip button on first slide', () => {
    renderOnboarding();
    expect(screen.getByTestId('onboarding-skip')).toBeTruthy();
  });

  it('shows next button', () => {
    renderOnboarding();
    expect(screen.getByTestId('onboarding-next')).toBeTruthy();
  });

  it('shows 3 dots for 3 slides', () => {
    renderOnboarding();
    expect(screen.getByTestId('dot-0')).toBeTruthy();
    expect(screen.getByTestId('dot-1')).toBeTruthy();
    expect(screen.getByTestId('dot-2')).toBeTruthy();
  });

  it('renders progress bar', () => {
    renderOnboarding();
    expect(screen.getByTestId('onboarding-progress')).toBeTruthy();
  });
});
