/** Short-lived in-memory dedupe (MPX used a 5s transient). */
const hits = new Map<string, number>();
const TTL_MS = 5_000;

export function isDuplicateClick(key: string): boolean {
	const now = Date.now();
	for (const [k, expires] of hits) {
		if (expires <= now) hits.delete(k);
	}
	const existing = hits.get(key);
	if (existing && existing > now) return true;
	hits.set(key, now + TTL_MS);
	return false;
}
