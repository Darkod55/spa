import { getCollection } from "astro:content";
import { absoluteUrl, SITE_LAUNCH_DATE } from "./seo";
import { isPublishedPost, blogPostPath, sortPostsByDate } from "./blog";
import { parseLegalDate } from "./legalDates";

export type SitemapEntry = {
	path: string;
	/** W3C date for <lastmod> — YYYY-MM-DD preferred */
	lastmod: string;
};

/** Core marketing + legal routes that should appear in the sitemap. */
export const STATIC_SITEMAP_PATHS = [
	"/",
	"/about",
	"/services",
	"/contact",
	"/blog",
	"/privacy-policy",
	"/cookie-policy",
	"/terms-and-conditions",
] as const;

function toLastmod(value: string | Date | undefined | null): string {
	if (!value) return SITE_LAUNCH_DATE;
	if (value instanceof Date && !Number.isNaN(value.getTime())) {
		return value.toISOString().slice(0, 10);
	}
	if (typeof value === "string") {
		const trimmed = value.trim();
		if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return trimmed.slice(0, 10);
		const fromLegal = parseLegalDate(trimmed);
		if (fromLegal && /^\d{4}-\d{2}-\d{2}/.test(fromLegal)) {
			return fromLegal.slice(0, 10);
		}
	}
	return SITE_LAUNCH_DATE;
}

export async function getSitemapEntries(): Promise<SitemapEntry[]> {
	const entries = new Map<string, SitemapEntry>();

	for (const path of STATIC_SITEMAP_PATHS) {
		entries.set(path, { path, lastmod: SITE_LAUNCH_DATE });
	}

	const [blog, legal] = await Promise.all([
		getCollection("blog"),
		getCollection("legal"),
	]);

	for (const post of blog
		.filter((entry) => isPublishedPost(entry, { includeDrafts: false }))
		.sort(sortPostsByDate)) {
		const path = blogPostPath(post.id);
		entries.set(path, {
			path,
			lastmod: toLastmod(post.data.updatedDate ?? post.data.publishDate),
		});
	}

	for (const entry of legal) {
		if (entry.data.draft) continue;
		const slug = entry.id.replace(/\.mdx?$/, "");
		const path = `/${slug}`;
		entries.set(path, {
			path,
			lastmod: toLastmod(entry.data.lastUpdated),
		});
	}

	return [...entries.values()];
}

export function buildSitemapXml(
	origin: string,
	entries: SitemapEntry[],
): string {
	const urls = entries
		.map((entry) => {
			const loc = absoluteUrl(entry.path, origin);
			const lastmod = toLastmod(entry.lastmod);
			return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
		})
		.join("\n");

	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function escapeXml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}
