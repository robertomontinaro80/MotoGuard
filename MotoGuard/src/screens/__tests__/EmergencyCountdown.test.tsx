import React from 'react';
import { render, fireEvent, act, screen } from '@testing-library/react-native';
import { EmergencyCountdownScreen } from '../EmergencyCountdownScreen';

jest.mock('@services/AlertService', () => ({
  AlertService: {
    getContacts: jest.fn().mockResolvedValue([]),
    triggerEmergency: jest.fn().mockResolvedValue(undefined),
  },
}));
jest.mock('expo-location', () => ({
  getCurrentPositionAsync: jest.fn().mockResolvedValue({ coords: { latitude: 45, longitude: 9 } }),
}));
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return { ...RN, Vibration: { vibrate: jest.fn(), cancel: jest.fn() } };
});

describe('EmergencyCountdownScreen', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('renders countdown starting at 30', () => {
    render(<EmergencyCountdownScreen />);
    expect(screen.getByTestId('countdown-seconds')).toHaveTextContent('30');
  });

  it('shows cancel button', () => {
    render(<EmergencyCountdownScreen />);
    expect(screen.getByTestId('cancel-btn')).toBeTruthy();
  });

  it('decrements countdown over time', () => {
    render(<EmergencyCountdownScreen />);
    act(() => { jest.advanceTimersByTime(3000); });
    expect(screen.getByTestId('countdown-seconds')).toHaveTextContent('27');
  });

  it('shows canceled state when cancel pressed — matches roadmap T4.2 spec', () => {
    const { getByTestId, queryByTestId } = render(<EmergencyCountdownScreen />);
    fireEvent.press(getByTestId('cancel-btn'));
    expect(screen.getByText('Allerta annullata')).toBeTruthy();
    expect(queryByTestId('countdown-ring')).toBeNull();
  });

  it('cancel button has correct accessibility label', () => {
    render(<EmergencyCountdownScreen />);
    expect(screen.getByLabelText('Annulla allerta')).toBeTruthy();
  });
});
