/**
 * Normalizes and sanitizes LinkedIn and social profile links.
 */
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
