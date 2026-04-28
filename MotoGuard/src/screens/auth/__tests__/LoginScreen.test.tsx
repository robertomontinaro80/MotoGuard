import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { LoginScreen } from '../LoginScreen';

const mockSignInWithGoogle   = jest.fn();
const mockSignInWithFacebook = jest.fn();

jest.mock('@services/AuthContext', () => ({
  useAuthContext: () => ({
    user: null,
    loading: false,
    authLoading: false,
    error: null,
    signInWithGoogle:   mockSignInWithGoogle,
    signInWithFacebook: mockSignInWithFacebook,
    signOut: jest.fn(),
  }),
}));

describe('LoginScreen', () => {
  it('renders Google and Facebook buttons', () => {
    render(<LoginScreen />);
    expect(screen.getByTestId('google-login-btn')).toBeTruthy();
    expect(screen.getByTestId('facebook-login-btn')).toBeTruthy();
  });

  it('calls signInWithGoogle when Google button pressed', () => {
    render(<LoginScreen />);
    fireEvent.press(screen.getByTestId('google-login-btn'));
    expect(mockSignInWithGoogle).toHaveBeenCalledTimes(1);
  });

  it('calls signInWithFacebook when Facebook button pressed', () => {
    render(<LoginScreen />);
    fireEvent.press(screen.getByTestId('facebook-login-btn'));
    expect(mockSignInWithFacebook).toHaveBeenCalledTimes(1);
  });

  it('shows error message when error is set', () => {
    jest.resetModules();
    jest.mock('@services/AuthContext', () => ({
      useAuthContext: () => ({
        user: null, authLoading: false,
        error: 'Autenticazione fallita',
        signInWithGoogle: jest.fn(), signInWithFacebook: jest.fn(), signOut: jest.fn(),
      }),
    }));
    const { LoginScreen: LS } = require('../LoginScreen');
    render(<LS />);
    expect(screen.getByTestId('login-error')).toBeTruthy();
  });

  it('disables buttons when authLoading is true', () => {
    jest.resetModules();
    jest.mock('@services/AuthContext', () => ({
      useAuthContext: () => ({
        user: null, authLoading: true, error: null,
        signInWithGoogle: jest.fn(), signInWithFacebook: jest.fn(), signOut: jest.fn(),
      }),
    }));
    const { LoginScreen: LS } = require('../LoginScreen');
    render(<LS />);
    expect(screen.getByTestId('google-login-btn').props.accessibilityState?.disabled ?? false).toBeTruthy;
  });
});
