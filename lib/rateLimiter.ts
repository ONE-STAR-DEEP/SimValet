
const store = new Map<string, { count: number; time: number }>();

export function isRateLimited(key: string, limit = 5, windowMs = 60000) {
  const now = Date.now();

  const entry = store.get(key);

  if (!entry) {
    store.set(key, { count: 1, time: now });
    return false;
  }

  if (now - entry.time > windowMs) {
    store.set(key, { count: 1, time: now });
    return false;
  }

  entry.count++;

  return entry.count > limit;
}