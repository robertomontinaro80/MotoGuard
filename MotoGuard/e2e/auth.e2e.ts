/**
 * E2E — flusso autenticazione.
 * Verifica che la LoginScreen sia visibile e i bottoni social siano tappabili.
 */

import { device, element, by, expect as detoxExpect } from 'detox';

describe('Auth Flow', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show login screen on first launch', async () => {
    await detoxExpect(element(by.id('screen-login'))).toBeVisible();
  });

  it('should show Google and Facebook login buttons', async () => {
    await detoxExpect(element(by.id('google-login-btn'))).toBeVisible();
    await detoxExpect(element(by.id('facebook-login-btn'))).toBeVisible();
  });
});
