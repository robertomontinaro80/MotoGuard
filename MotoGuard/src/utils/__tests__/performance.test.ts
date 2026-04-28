import { debounce, throttle, memoize } from '../performance';

jest.useFakeTimers();

describe('debounce', () => {
  it('calls function only after delay', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 300);
    debounced(); debounced(); debounced();
    expect(fn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('resets timer on repeated calls', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 300);
    debounced();
    jest.advanceTimersByTime(200);
    debounced();
    jest.advanceTimersByTime(200);
    expect(fn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe('throttle', () => {
  it('calls function immediately on first call', () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 500);
    throttled();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('ignores subsequent calls within limit', () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 500);
    throttled(); throttled(); throttled();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('allows call after limit expires', () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 500);
    throttled();
    jest.advanceTimersByTime(500);
    throttled();
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe('memoize', () => {
  it('caches results for same arguments', () => {
    const fn = jest.fn((x: number) => x * 2);
    const memoized = memoize(fn);
    expect(memoized(5)).toBe(10);
    expect(memoized(5)).toBe(10);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('computes fresh result for different arguments', () => {
    const fn = jest.fn((x: number) => x * 3);
    const memoized = memoize(fn);
    memoized(2);
    memoized(4);
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
