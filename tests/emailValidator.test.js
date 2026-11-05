import { isValidEmail, extractDomain } from '../src/utils/emailValidator';

describe('emailValidator utilities', () => {
  it('validates correct email syntax', () => {
    expect(isValidEmail('founder@venture.com')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
  });

  it('extracts corporate domains', () => {
    expect(extractDomain('sam@openai.com')).toBe('openai.com');
  });
});
