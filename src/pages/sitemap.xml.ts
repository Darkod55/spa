import type { APIRoute } from "astro";
import { buildSitemapXml, getSitemapPaths } from "../utils/sitemap";

export const prerender = false;

export const GET: APIRoute = async ({ site, url }) => {
	const origin = site?.origin ?? url.origin;
	const paths = await getSitemapPaths();
	const body = buildSitemapXml(origin, paths);

	return new Response(body, {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
};
