/**
 * Report API auth — Bearer token must match ANALYTICS_API_KEY.
 * Click ingest stays public (browser); only reads are locked down.
 */
export function authorizeAnalyticsReport(request: Request): boolean {
	const expected = process.env.ANALYTICS_API_KEY?.trim();
	if (!expected) return false;

	const header = request.headers.get("authorization")?.trim() ?? "";
	const match = /^Bearer\s+(.+)$/i.exec(header);
	const token = match?.[1]?.trim() ?? "";

	if (!token || token.length !== expected.length) return false;

	// Constant-time-ish compare for equal-length strings.
	let diff = 0;
	for (let i = 0; i < expected.length; i++) {
		diff |= expected.charCodeAt(i) ^ token.charCodeAt(i);
	}
	return diff === 0;
}
