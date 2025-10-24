// src/utils/share.ts
// Minimal, safe sharing helpers.
// encodeState: JSON -> URL-safe base64 string
// decodeState: URL-safe base64 string -> JSON

export function encodeState(obj: unknown): string {
  const json = JSON.stringify(obj);
  const b64 = typeof btoa !== 'undefined' ? btoa(json) : Buffer.from(json, 'utf8').toString('base64');
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export function decodeState<T = unknown>(hash: string): T | null {
  try {
    const b64 = hash.replace(/-/g, '+').replace(/_/g, '/');
    const pad = b64.length % 4 === 0 ? b64 : b64 + '='.repeat(4 - (b64.length % 4));
    const json = typeof atob !== 'undefined' ? atob(pad) : Buffer.from(pad, 'base64').toString('utf8');
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

// If you have UI-only fields in your line items, strip them here.
// Otherwise this just returns the items as-is.
export function toShareableItems<T>(items: T[]): T[] {
  return items;
}
