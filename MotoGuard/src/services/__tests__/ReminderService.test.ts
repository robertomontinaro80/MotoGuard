import { ReminderService } from '../MaintenanceRepository';
import { subDays } from 'date-fns';

describe('ReminderService.check — km only', () => {
  it('returns ok when far from interval', () => {
    const r = ReminderService.check({ lastKm: 10000, currentKm: 12000, intervalKm: 6000 });
    expect(r.status).toBe('ok');
    expect(r.kmLeft).toBe(4000);
  });

  it('returns warning when within 30km of interval', () => {
    const r = ReminderService.check({ lastKm: 10000, currentKm: 15800, intervalKm: 6000 });
    expect(r.status).toBe('warning');
  });

  it('returns due when within 14km', () => {
    const r = ReminderService.check({ lastKm: 10000, currentKm: 15990, intervalKm: 6000 });
    expect(r.status).toBe('due');
  });

  it('returns overdue when km exceeded — matches T2.1 roadmap spec', () => {
    const r = ReminderService.check({ lastKm: 10000, currentKm: 16200, intervalKm: 6000 });
    expect(r.status).toBe('overdue');
    expect(r.kmLeft).toBe(-200);
  });

  it('calculates nextKm correctly', () => {
    const r = ReminderService.check({ lastKm: 5000, currentKm: 8000, intervalKm: 6000 });
    expect(r.nextKm).toBe(11000);
  });
});

describe('ReminderService.check — days only', () => {
  it('returns ok when plenty of days remain', () => {
    const r = ReminderService.check({
      lastDate: subDays(new Date(), 300),
      currentKm: 0,
      intervalDays: 365,
    });
    expect(r.status).toBe('ok');
  });

  it('returns due when fewer than 14 days remain', () => {
    const r = ReminderService.check({
      lastDate: subDays(new Date(), 358),
      currentKm: 0,
      intervalDays: 365,
    });
    expect(r.status).toBe('due');
  });

  it('returns overdue when date has passed', () => {
    const r = ReminderService.check({
      lastDate: subDays(new Date(), 400),
      currentKm: 0,
      intervalDays: 365,
    });
    expect(r.status).toBe('overdue');
    expect(r.daysLeft).toBeLessThan(0);
  });
});

describe('ReminderService.check — km and days combined', () => {
  it('uses worst of the two metrics', () => {
    // km ok ma giorni scaduti → overdue
    const r = ReminderService.check({
      lastKm: 10000, currentKm: 12000, intervalKm: 6000,
      lastDate: subDays(new Date(), 400), intervalDays: 365,
    });
    expect(r.status).toBe('overdue');
  });

  it('returns ok only when both metrics are ok', () => {
    const r = ReminderService.check({
      lastKm: 10000, currentKm: 11000, intervalKm: 6000,
      lastDate: subDays(new Date(), 100), intervalDays: 365,
    });
    expect(r.status).toBe('ok');
  });
});

describe('ReminderService.check — no history', () => {
  it('handles missing lastKm gracefully', () => {
    const r = ReminderService.check({ currentKm: 5000, intervalKm: 6000 });
    expect(r.kmLeft).toBeUndefined();
    expect(r.nextKm).toBeUndefined();
  });
});
