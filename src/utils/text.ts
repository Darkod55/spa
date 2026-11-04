const PARAGRAPH_BREAK = /\n\s*\n/;

/** Splits plain text into paragraphs at blank lines, dropping empty ones. */
export function toParagraphs(text: string | null | undefined): string[] {
	return (text ?? "")
		.split(PARAGRAPH_BREAK)
		.map((paragraph) => paragraph.trim())
		.filter(Boolean);
}

/** URL/fragment id from a label, e.g. "Pay-Per-Click Advertising" → "pay-per-click-advertising". */
export function slugify(text: string): string {
	return text
		.trim()
		.toLowerCase()
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}
