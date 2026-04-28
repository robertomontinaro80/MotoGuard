import { NotificationService } from '../NotificationService';
import * as Notifications from 'expo-notifications';
import { addDays, subDays } from 'date-fns';
import { MaintenanceReminder } from '@types/index';

const makeReminder = (overrides: Partial<MaintenanceReminder> = {}): MaintenanceReminder => ({
  type: 'oil_change',
  status: 'warning',
  nextDate: addDays(new Date(), 20),
  ...overrides,
});

describe('NotificationService.requestPermissions', () => {
  it('returns true when permission granted', async () => {
    const result = await NotificationService.requestPermissions();
    expect(result).toBe(true);
  });
});

describe('NotificationService.scheduleReminder', () => {
  it('schedules notification 7 days before due date', async () => {
    const spy = jest.spyOn(Notifications, 'scheduleNotificationAsync');
    await NotificationService.scheduleReminder(makeReminder(), 'Ducati Monster');
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.objectContaining({
          title: expect.stringContaining('Cambio olio'),
        }),
        trigger: expect.objectContaining({ seconds: expect.any(Number) }),
      }),
    );
  });

  it('does not schedule if trigger date is in the past', async () => {
    const spy = jest.spyOn(Notifications, 'scheduleNotificationAsync');
    // nextDate tra 3 giorni → trigger sarebbe 4 giorni FA
    await NotificationService.scheduleReminder(
      makeReminder({ nextDate: addDays(new Date(), 3) }),
      'Moto',
    );
    expect(spy).not.toHaveBeenCalled();
  });

  it('returns null when no nextDate or nextKm', async () => {
    const result = await NotificationService.scheduleReminder(
      makeReminder({ nextDate: undefined, nextKm: undefined }),
      'Moto',
    );
    expect(result).toBeNull();
  });

  it('includes motorcycle name in notification body', async () => {
    const spy = jest.spyOn(Notifications, 'scheduleNotificationAsync');
    await NotificationService.scheduleReminder(makeReminder(), 'Honda CBR');
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.objectContaining({
          body: expect.stringContaining('Honda CBR'),
        }),
      }),
    );
  });
});

describe('NotificationService.cancelAll', () => {
  it('calls cancelAllScheduledNotificationsAsync', async () => {
    const spy = jest.spyOn(Notifications, 'cancelAllScheduledNotificationsAsync');
    await NotificationService.cancelAll();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
