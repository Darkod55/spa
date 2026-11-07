import type { APIRoute } from "astro";
import { absoluteUrl, resolveSiteOrigin } from "../utils/seo";

export const prerender = false;

export const GET: APIRoute = async ({ site, url, request }) => {
	const origin = resolveSiteOrigin({
		configured: site,
		requestOrigin: url.origin,
		headers: request.headers,
	});
	const sitemapUrl = absoluteUrl("/sitemap.xml", origin);

	const body = `# The Square Peg Agency
User-agent: *
Allow: /
Content-Signal: search=yes, ai-input=yes, ai-train=no

# Keep admin / CMS / design-system out of the index
Disallow: /_emdash/
Disallow: /styleguide

Sitemap: ${sitemapUrl}
`;

	return new Response(body, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
};
