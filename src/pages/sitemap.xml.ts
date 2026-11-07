import type { APIRoute } from "astro";
import { resolveSiteOrigin } from "../utils/seo";
import { buildSitemapXml, getSitemapPaths } from "../utils/sitemap";

export const prerender = false;

export const GET: APIRoute = async ({ site, url, request }) => {
	const origin = resolveSiteOrigin({
		configured: site,
		requestOrigin: url.origin,
		headers: request.headers,
	});
	const paths = await getSitemapPaths();
	const body = buildSitemapXml(origin, paths);

	return new Response(body, {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
};
