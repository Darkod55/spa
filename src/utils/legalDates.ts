/**
 * Whether a legal frontmatter date string is a real date (not a [placeholder]).
 * Returns an ISO date string for <time datetime> when parseable.
 */
export function parseLegalDate(display: string): string | undefined {
	const trimmed = display.trim();
	if (!trimmed || trimmed.includes("[") || trimmed.includes("]")) {
		return undefined;
	}

	const parsed = Date.parse(trimmed);
	if (!Number.isNaN(parsed)) {
		return new Date(parsed).toISOString().slice(0, 10);
	}

	return undefined;
}
