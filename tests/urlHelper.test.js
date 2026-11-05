import { normalizeLinkedInUrl, formatHandle } from '../src/utils/urlHelper';

describe('urlHelper utilities', () => {
  it('normalizes raw linkedin paths', () => {
    expect(normalizeLinkedInUrl('linkedin.com/in/test/')).toBe('https://linkedin.com/in/test');
  });

  it('formats twitter handles correctly', () => {
    expect(formatHandle('@sama', 'twitter')).toBe('https://x.com/sama');
  });
});
