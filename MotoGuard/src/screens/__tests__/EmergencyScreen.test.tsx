import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import { EmergencyScreen } from '../EmergencyScreen';

const mockContacts = [
  { id: '1', name: 'Mario', phone: '+39333111222' },
  { id: '2', name: 'Lucia', phone: '+39344555666' },
];

jest.mock('@services/AlertService', () => ({
  AlertService: {
    getContacts:   jest.fn().mockResolvedValue([]),
    addContact:    jest.fn().mockResolvedValue({ id: '99', name: 'Test', phone: '+39333000000' }),
    removeContact: jest.fn().mockResolvedValue(undefined),
  },
}));
jest.mock('@hooks/useAppNavigation', () => ({ useAppNavigation: () => ({ navigate: jest.fn() }) }));

const { AlertService } = require('@services/AlertService');

describe('EmergencyScreen — empty state', () => {
  it('shows non-active badge with no contacts', async () => {
    AlertService.getContacts.mockResolvedValue([]);
    render(<EmergencyScreen />);
    await waitFor(() => {
      expect(screen.getByTestId('fall-detection-badge')).toBeTruthy();
    });
  });

  it('shows add contact button when fewer than 3 contacts', async () => {
    AlertService.getContacts.mockResolvedValue([]);
    render(<EmergencyScreen />);
    await waitFor(() => expect(screen.getByTestId('add-contact-btn')).toBeTruthy());
  });
});

describe('EmergencyScreen — with contacts', () => {
  beforeEach(() => AlertService.getContacts.mockResolvedValue(mockContacts));

  it('renders contact list', async () => {
    render(<EmergencyScreen />);
    await waitFor(() => {
      expect(screen.getByTestId('contacts-list')).toBeTruthy();
      expect(screen.getByTestId('contact-1')).toBeTruthy();
      expect(screen.getByTestId('contact-2')).toBeTruthy();
    });
  });

  it('shows active badge when contacts exist', async () => {
    render(<EmergencyScreen />);
    await waitFor(() => {
      expect(screen.getByText('Attivo')).toBeTruthy();
    });
  });

  it('shows test alert button when contacts exist', async () => {
    render(<EmergencyScreen />);
    await waitFor(() => expect(screen.getByTestId('test-alert-btn')).toBeTruthy());
  });
});

describe('EmergencyScreen — add contact form', () => {
  beforeEach(() => AlertService.getContacts.mockResolvedValue([]));

  it('shows form on add button press', async () => {
    render(<EmergencyScreen />);
    await waitFor(() => fireEvent.press(screen.getByTestId('add-contact-btn')));
    expect(screen.getByTestId('add-contact-form')).toBeTruthy();
  });

  it('validates empty name', async () => {
    render(<EmergencyScreen />);
    await waitFor(() => fireEvent.press(screen.getByTestId('add-contact-btn')));
    fireEvent.press(screen.getByTestId('save-contact-btn'));
    await waitFor(() => expect(screen.getByText('Inserisci un nome')).toBeTruthy());
  });

  it('disables add button at 3 contacts — matches roadmap T4.3 spec', async () => {
    AlertService.getContacts.mockResolvedValue([
      { id: '1', name: 'A', phone: '+39333111222' },
      { id: '2', name: 'B', phone: '+39333111223' },
      { id: '3', name: 'C', phone: '+39333111224' },
    ]);
    render(<EmergencyScreen />);
    await waitFor(() => {
      expect(screen.queryByTestId('add-contact-btn')).toBeNull();
    });
  });
});
