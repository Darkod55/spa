import type { APIRoute } from "astro";
import { resolveSiteOrigin } from "../utils/seo";
import { buildSitemapXml, getSitemapEntries } from "../utils/sitemap";

export const prerender = false;

export const GET: APIRoute = async ({ site, url, request }) => {
	const origin = resolveSiteOrigin({
		configured: site,
		requestOrigin: url.origin,
		headers: request.headers,
	});
	const entries = await getSitemapEntries();
	const body = buildSitemapXml(origin, entries);

	return new Response(body, {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
};
