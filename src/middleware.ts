import { defineMiddleware } from "astro:middleware";

/** Agent-discovery Link headers (RFC 8288) — point crawlers at machine-readable index files. */
const DISCOVERY_LINK = [
	'</llms.txt>; rel="describedby"; type="text/plain"',
	'</sitemap.xml>; rel="sitemap"; type="application/xml"',
].join(", ");

/**
 * Public HTML CSP — allowlisted for GA4, Turnstile, Cloudflare Web Analytics,
 * and Astro inline scripts/styles. Skipped for EmDash admin (own CSP).
 */
const PUBLIC_CSP = [
	"default-src 'self'",
	"base-uri 'self'",
	"object-src 'none'",
	"frame-ancestors 'self'",
	"form-action 'self'",
	"img-src 'self' data: blob: https:",
	"font-src 'self' data:",
	"style-src 'self' 'unsafe-inline'",
	[
		"script-src",
		"'self'",
		"'unsafe-inline'",
		"https://www.googletagmanager.com",
		"https://www.google-analytics.com",
		"https://challenges.cloudflare.com",
		// Edge-injected CF Web Analytics beacon (RUM)
		"https://static.cloudflareinsights.com",
	].join(" "),
	[
		"connect-src",
		"'self'", // auto-injected beacon posts to /cdn-cgi/rum
		"https://www.google-analytics.com",
		"https://region1.google-analytics.com",
		"https://analytics.google.com",
		"https://*.google-analytics.com",
		"https://*.analytics.google.com",
		"https://challenges.cloudflare.com",
		// Manual CF Web Analytics embed posts here
		"https://cloudflareinsights.com",
	].join(" "),
	"frame-src https://challenges.cloudflare.com",
	"upgrade-insecure-requests",
].join("; ");

function preferredSiteUrl(): URL | null {
	const raw =
		process.env.SITE_URL?.trim() ||
		process.env.PUBLIC_SITE_URL?.trim() ||
		process.env.EMDASH_SITE_URL?.trim() ||
		"";
	if (!raw) return null;
	try {
		return new URL(raw);
	} catch {
		return null;
	}
}

function requestHostname(request: Request, fallbackHost: string): string {
	const forwarded = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
	const host = (forwarded || request.headers.get("host") || fallbackHost)
		.split(":")[0]
		.trim()
		.toLowerCase();
	return host;
}

function requestProto(request: Request, fallbackProto: string): string {
	const forwarded = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
	return (forwarded || fallbackProto.replace(/:$/, "")).toLowerCase();
}

function isEmdashPath(pathname: string): boolean {
	return pathname === "/_emdash" || pathname.startsWith("/_emdash/");
}

export const onRequest = defineMiddleware(async (context, next) => {
	const preferred = preferredSiteUrl();
	const { request, url } = context;

	/*
	 * Host / HTTPS canonicalisation.
	 * Cloudflare already 301s http→https at the edge; this covers www↔apex and
	 * any request that reaches Node without that edge redirect.
	 */
	if (preferred && !isEmdashPath(url.pathname)) {
		const preferredHost = preferred.hostname.toLowerCase();
		const bare = preferredHost.replace(/^www\./, "");
		const www = `www.${bare}`;
		const host = requestHostname(request, url.host);
		const proto = requestProto(request, url.protocol);

		const isSiteHost = host === bare || host === www;
		const wrongHost = isSiteHost && host !== preferredHost;
		const wrongProto = proto === "http";

		if (wrongHost || wrongProto) {
			const dest = new URL(url.pathname + url.search, preferred);
			dest.protocol = "https:";
			dest.hostname = preferredHost;
			return Response.redirect(dest.toString(), 301);
		}
	}

	/*
	 * Strip trailing slashes (except `/`) so LiteSpeed/Node never serve the
	 * slash and non-slash forms as separate documents. Uses a real 301, not
	 * Astro's HTML meta-refresh stub.
	 */
	if (
		!isEmdashPath(url.pathname) &&
		url.pathname.length > 1 &&
		url.pathname.endsWith("/")
	) {
		const dest = new URL(url.pathname.replace(/\/+$/, "") + url.search, url);
		return Response.redirect(dest.toString(), 301);
	}

	const response = await next();
	const headers = new Headers(response.headers);
	const contentType = headers.get("content-type") ?? "";
	const isDocument =
		contentType.includes("text/html") ||
		contentType.includes("text/plain") ||
		contentType.includes("application/xml") ||
		contentType.includes("application/json");

	// HSTS — only meaningful on HTTPS responses; harmless if already present.
	if (!headers.has("Strict-Transport-Security")) {
		headers.set(
			"Strict-Transport-Security",
			"max-age=31536000; includeSubDomains",
		);
	}

	if (isDocument && !isEmdashPath(url.pathname)) {
		if (!headers.has("Content-Security-Policy")) {
			headers.set("Content-Security-Policy", PUBLIC_CSP);
		}
		if (!headers.has("Link")) {
			headers.set("Link", DISCOVERY_LINK);
		}
	}

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers,
	});
});
