/** Escape text for safe HTML interpolation. */
export function escapeHtml(text: string): string {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

/**
 * Turns `{word}` markers into `<span class="hl">word</span>`.
 * All other text is HTML-escaped.
 */
export function highlightBraces(input: string): string {
	return escapeHtml(input).replace(
		/\{([^{}]+)\}/g,
		'<span class="hl">$1</span>',
	);
}
