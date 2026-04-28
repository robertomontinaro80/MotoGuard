import { AlertService } from '../AlertService';
import * as Linking from 'expo-linking';

jest.mock('expo-linking', () => ({
  canOpenURL: jest.fn().mockResolvedValue(true),
  openURL: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../database', () => ({
  database: {
    write: jest.fn(async (fn: () => Promise<void>) => fn()),
    get: jest.fn(() => ({
      create: jest.fn(async (fn: (m: object) => void) => {
        const mock = { lat: 0, lng: 0, gForce: 0, alertSent: false, canceledByUser: false };
        fn(mock);
        return { id: 'event-1', ...mock };
      }),
      query: jest.fn(() => ({ fetch: jest.fn().mockResolvedValue([]) })),
      find: jest.fn().mockResolvedValue({ markAsDeleted: jest.fn() }),
    })),
  },
}));

const mockContacts = [
  { id: '1', name: 'Mario', phone: '+39333111222' },
  { id: '2', name: 'Lucia', phone: '+39344555666' },
];

// ─── buildSmsBody ──────────────────────────────────────────────────────────

describe('AlertService.buildSmsBody', () => {
  it('includes Google Maps link — matches roadmap T4.2 spec', () => {
    const body = AlertService.buildSmsBody(45.4642, 9.1900);
    expect(body).toContain('maps.google.com');
    expect(body).toContain('45.4642');
    expect(body).toContain('9.19');
  });

  it('includes allerta keyword', () => {
    const body = AlertService.buildSmsBody(0, 0);
    expect(body.toLowerCase()).toContain('caduta');
  });
});

// ─── sendSms ──────────────────────────────────────────────────────────────

describe('AlertService.sendSms', () => {
  it('calls Linking.openURL with sms scheme', async () => {
    await AlertService.sendSms('+39333000111', 'Test message');
    expect(Linking.openURL).toHaveBeenCalledWith(
      expect.stringContaining('sms:+39333000111'),
    );
  });

  it('does not call openURL if canOpenURL returns false', async () => {
    (Linking.canOpenURL as jest.Mock).mockResolvedValueOnce(false);
    (Linking.openURL as jest.Mock).mockClear();
    await AlertService.sendSms('+39333000111', 'Test');
    expect(Linking.openURL).not.toHaveBeenCalled();
  });
});

// ─── triggerEmergency ─────────────────────────────────────────────────────

describe('AlertService.triggerEmergency', () => {
  it('sends SMS to all contacts with coordinates', async () => {
    const openSpy = jest.spyOn(Linking, 'openURL');
    await AlertService.triggerEmergency({
      lat: 45.4642, lng: 9.1900,
      contacts: mockContacts,
    });
    // Deve aver chiamato openURL per ogni contatto
    expect(openSpy).toHaveBeenCalledTimes(mockContacts.length);
  });

  it('SMS body contains Google Maps URL', async () => {
    const openSpy = jest.spyOn(Linking, 'openURL');
    await AlertService.triggerEmergency({ lat: 45.0, lng: 10.0, contacts: [mockContacts[0]] });
    const calledUrl = (openSpy.mock.calls[0][0] as string);
    expect(calledUrl).toContain('maps.google.com');
  });
});
