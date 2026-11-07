import { defineMiddleware } from "astro:middleware";

/** Agent-discovery Link headers (RFC 8288) — point crawlers at machine-readable index files. */
const DISCOVERY_LINK = [
	'</llms.txt>; rel="describedby"; type="text/plain"',
	'</sitemap.xml>; rel="sitemap"; type="application/xml"',
].join(", ");

export const onRequest = defineMiddleware(async (_context, next) => {
	const response = await next();

	// Skip asset / CMS internals — discovery belongs on document responses
	const contentType = response.headers.get("content-type") ?? "";
	const isDocument =
		contentType.includes("text/html") ||
		contentType.includes("text/plain") ||
		contentType.includes("application/xml") ||
		contentType.includes("application/json");

	if (!isDocument || response.headers.has("Link")) {
		return response;
	}

	const headers = new Headers(response.headers);
	headers.set("Link", DISCOVERY_LINK);

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers,
	});
});
