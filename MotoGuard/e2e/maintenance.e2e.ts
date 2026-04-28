/**
 * E2E — flusso manutenzione completo.
 * Corrisponde al test critico #1 della roadmap T5.1.
 */

import { device, element, by, expect as detoxExpect } from 'detox';

describe('Maintenance Flow', () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
      // Bypassa login in test mode
      launchArgs: { detoxTestMode: 'true' },
    });
  });

  // Corrisponde esattamente allo snippet della roadmap T5.1
  it('should add motorcycle and show due reminder', async () => {
    // Tap su "Aggiungi la tua moto"
    await element(by.id('home-empty')).tap();

    // Compila form
    await element(by.id('brand-input')).typeText('Ducati');
    await element(by.id('model-input')).typeText('Monster 950');
    await element(by.id('year-input')).typeText('2022');
    await element(by.id('engine-input')).typeText('937');
    await element(by.id('plate-input')).typeText('AB123CD');
    await element(by.id('km-input')).typeText('15800');

    await element(by.id('submit-button')).tap();

    // Deve tornare alla Home con la card moto
    await detoxExpect(element(by.id('moto-card'))).toBeVisible();
  });

  it('should navigate to maintenance tab and see reminders', async () => {
    await element(by.id('tab-maintenance')).tap();
    await detoxExpect(element(by.id('screen-maintenance'))).toBeVisible();
    // Con km 15800 il cambio olio a 16000 è imminente
    await detoxExpect(element(by.id('reminder-oil_change'))).toBeVisible();
  });

  it('should add a maintenance record', async () => {
    await element(by.id('add-maintenance-btn')).tap();
    await detoxExpect(element(by.id('screen-add-maintenance'))).toBeVisible();

    await element(by.id('km-input')).typeText('15800');
    await element(by.id('cost-input')).typeText('85');
    await element(by.id('submit-btn')).tap();

    // Torna alla schermata manutenzione
    await detoxExpect(element(by.id('screen-maintenance'))).toBeVisible();
  });
});
