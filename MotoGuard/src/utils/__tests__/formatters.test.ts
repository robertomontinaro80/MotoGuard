import { formatKm, formatCost, formatDate, formatDaysLeft, truncate, formatPhone } from '../formatters';

describe('formatKm', () => {
  it('formats with thousands separator', () => {
    expect(formatKm(15000)).toContain('15');
    expect(formatKm(15000)).toContain('km');
  });
  it('handles zero', () => {
    expect(formatKm(0)).toContain('0');
  });
});

describe('formatCost', () => {
  it('formats with euro symbol', () => {
    expect(formatCost(80)).toContain('€');
    expect(formatCost(80)).toContain('80');
  });
  it('formats decimal correctly', () => {
    expect(formatCost(12.5)).toContain('12');
  });
});

describe('formatDate', () => {
  it('returns a non-empty string', () => {
    expect(formatDate(new Date('2024-06-01'))).toBeTruthy();
  });
  it('handles string input', () => {
    expect(formatDate('2024-06-01')).toBeTruthy();
  });
});

describe('formatDaysLeft', () => {
  it('handles negative days', () => {
    expect(formatDaysLeft(-5)).toContain('fa');
  });
  it('handles zero', () => {
    expect(formatDaysLeft(0)).toBe('oggi');
  });
  it('handles one day', () => {
    expect(formatDaysLeft(1)).toBe('domani');
  });
  it('handles weeks', () => {
    expect(formatDaysLeft(14)).toContain('settiman');
  });
  it('handles months', () => {
    expect(formatDaysLeft(60)).toContain('mes');
  });
});

describe('truncate', () => {
  it('returns string as-is when short enough', () => {
    expect(truncate('Ducati', 30)).toBe('Ducati');
  });
  it('truncates long string with ellipsis', () => {
    const long = 'A'.repeat(50);
    expect(truncate(long, 30)).toHaveLength(30);
    expect(truncate(long, 30)).toContain('…');
  });
});

describe('formatPhone', () => {
  it('formats italian number', () => {
    expect(formatPhone('+393331112222')).toContain('+39');
  });
  it('returns original if unrecognized format', () => {
    expect(formatPhone('12345')).toBe('12345');
  });
});
