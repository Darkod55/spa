import { getCollection } from "astro:content";
import { absoluteUrl } from "./seo";
import { isPublishedPost, blogPostPath, sortPostsByDate } from "./blog";

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

export async function getSitemapPaths(): Promise<string[]> {
	const paths = new Set<string>(STATIC_SITEMAP_PATHS);

	const [blog, legal] = await Promise.all([
		getCollection("blog"),
		getCollection("legal"),
	]);

	for (const post of blog
		.filter((entry) => isPublishedPost(entry, { includeDrafts: false }))
		.sort(sortPostsByDate)) {
		paths.add(blogPostPath(post.id));
	}

	for (const entry of legal) {
		if (entry.data.draft) continue;
		const slug = entry.id.replace(/\.mdx?$/, "");
		paths.add(`/${slug}`);
	}

	return [...paths];
}

export function buildSitemapXml(origin: string, paths: string[]): string {
	const urls = paths
		.map((path) => {
			const loc = absoluteUrl(path, origin);
			return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n  </url>`;
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
