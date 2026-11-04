import { readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Collects static page slugs from src/pages (excludes dynamic routes and API).
 */
export function getStaticPageSlugs(pagesDir = join(process.cwd(), "src/pages")): Set<string> {
	const slugs = new Set<string>();

	for (const file of readdirSync(pagesDir, { withFileTypes: true })) {
		if (file.isDirectory()) continue;
		if (!file.name.endsWith(".astro")) continue;
		if (file.name.startsWith("[")) continue;
		if (file.name === "404.astro") continue;

		const base = file.name.replace(/\.astro$/, "");
		if (base === "index") {
			slugs.add("");
			continue;
		}
		slugs.add(base);
	}

	return slugs;
}

/**
 * Fail the build if a legal collection slug collides with an existing static page.
 */
export function assertLegalSlugsDoNotClash(legalIds: string[]): void {
	const reserved = getStaticPageSlugs();
	const clashes = legalIds.filter((id) => reserved.has(id));
	if (clashes.length > 0) {
		throw new Error(
			`Legal slug(s) clash with existing static pages: ${clashes
				.map((s) => `"/${s}"`)
				.join(", ")}. Rename the Markdown file or the page.`,
		);
	}
}
