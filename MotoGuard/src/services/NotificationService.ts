/**
 * NotificationService — gestisce permessi e scheduling push notification.
 */

import * as Notifications from 'expo-notifications';
import { addDays } from 'date-fns';
import { MaintenanceReminder, MaintenanceType } from '@types/index';
import { MAINTENANCE_INTERVALS } from './maintenanceIntervals';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const NotificationService = {
  async requestPermissions(): Promise<boolean> {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  },

  async scheduleReminder(reminder: MaintenanceReminder, motorcycleName: string): Promise<string | null> {
    if (!reminder.nextDate && !reminder.nextKm) return null;

    // Notifica 7 giorni prima della scadenza per data
    const triggerDate = reminder.nextDate
      ? addDays(reminder.nextDate, -7)
      : null;

    if (!triggerDate || triggerDate < new Date()) return null;

    const interval = MAINTENANCE_INTERVALS[reminder.type];
    const secondsUntil = Math.floor((triggerDate.getTime() - Date.now()) / 1000);

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: `🔧 ${interval.label} in scadenza`,
        body: `La ${interval.label.toLowerCase()} della tua ${motorcycleName} scade tra 7 giorni.`,
        data: { type: reminder.type, motorcycleName },
      },
      trigger: { seconds: secondsUntil },
    });

    return id;
  },

  async scheduleAllReminders(
    reminders: MaintenanceReminder[],
    motorcycleName: string,
  ): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
    for (const reminder of reminders) {
      if (reminder.status !== 'ok') {
        await this.scheduleReminder(reminder, motorcycleName);
      }
    }
  },

  async cancelAll(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },
};
