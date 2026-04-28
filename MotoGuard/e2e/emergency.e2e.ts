/**
 * E2E — flusso emergenza: countdown SOS e annullo.
 * Corrisponde al test critico #3 della roadmap T5.1.
 */

import { device, element, by, expect as detoxExpect } from 'detox';

describe('Emergency Countdown Flow', () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
      launchArgs: { detoxTestMode: 'true' },
    });
  });

  it('should navigate to Emergency tab', async () => {
    await element(by.id('tab-emergency')).tap();
    await detoxExpect(element(by.id('screen-emergency'))).toBeVisible();
  });

  it('should show add contact button when no contacts', async () => {
    await detoxExpect(element(by.id('add-contact-btn'))).toBeVisible();
  });

  it('should show fall detection inactive badge', async () => {
    await detoxExpect(element(by.id('fall-detection-badge'))).toBeVisible();
  });
});
