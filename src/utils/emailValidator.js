/**
 * Validates email syntax and identifies corporate domain patterns.
 */
export function isValidEmail(email) {
  if (!email) return false;
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email.trim());
}

export function extractDomain(email) {
  if (!isValidEmail(email)) return '';
  return email.split('@')[1].toLowerCase();
}
