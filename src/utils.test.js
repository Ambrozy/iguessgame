import { formatNumber, formatPercent, shuffle, rewards } from './utils';

describe('utils', () => {
  test('formatNumber returns exponential for numbers >=1000', () => {
    expect(formatNumber(1234)).toMatch(/e\+/);
  });

  test('formatNumber returns number for values <1000', () => {
    expect(formatNumber(123)).toBe(123);
  });

  test('formatPercent formats percentages correctly', () => {
    expect(formatPercent(0)).toBe('0%');
    expect(formatPercent(0.1234)).toBe('12.34%');
  });

  test('shuffle returns array with same items', () => {
    const result = shuffle(rewards);
    expect(result).toHaveLength(rewards.length);
    rewards.forEach(r => expect(result).toContain(r));
  });
});
