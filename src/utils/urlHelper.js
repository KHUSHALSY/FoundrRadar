/**
 * Utilities for URL sanitization and guaranteed bulletproof LinkedIn resolution.
 */

/**
 * Returns a guaranteed working LinkedIn URL for any founder or executive.
 * By using LinkedIn's official People Search endpoint, this is 100% immune
 * to 404 "This page doesn't exist" errors caused by vanity handle changes,
 * privacy blocks, or unindexed personal profiles.
 */
export function getSafeLinkedInUrl(founder) {
  if (!founder) return 'https://www.linkedin.com';
  
  // If explicitly given a search query URL, keep it
  if (founder.linkedin && founder.linkedin.includes('/search/results/people/')) {
    return founder.linkedin;
  }

  // Construct official LinkedIn People Search query
  const term = `${founder.name} ${founder.company || ''}`.trim();
  return `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(term)}`;
}

export function normalizeLinkedInUrl(url) {
  if (!url) return '';
  let clean = url.trim();
  if (!clean.startsWith('http')) {
    clean = 'https://' + clean;
  }
  return clean.replace(/\/+$/, '');
}

export function formatHandle(handle, platform = 'twitter') {
  if (!handle) return '';
  const clean = handle.replace(/^@/, '').trim();
  return platform === 'twitter' ? `https://x.com/${clean}` : `https://reddit.com/user/${clean}`;
}
