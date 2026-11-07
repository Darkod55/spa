export type JsonLd = Record<string, unknown> | Record<string, unknown>[];

export type PageSeo = {
	title: string;
	description: string;
	/** Path only, e.g. "/" or "/about" — resolved against site origin */
	canonicalPath?: string;
	/** Absolute or site-root path for social share image */
	ogImage?: string;
	ogImageAlt?: string;
	/** openGraph type — default "website" */
	ogType?: "website" | "article";
	robots?: string;
	jsonLd?: JsonLd;
};

const BRAND = "The Square Peg Agency";

/** Default Open Graph / Twitter share image (public/share.webp). */
export const DEFAULT_OG_IMAGE = "/share.webp";
export const DEFAULT_OG_IMAGE_ALT =
	"The Square Peg Agency — Why fit in when you can stand out?";
export const DEFAULT_OG_IMAGE_WIDTH = 1200;
export const DEFAULT_OG_IMAGE_HEIGHT = 630;

/** Site launch / first publish date for marketing pages without their own chronology. */
export const SITE_LAUNCH_DATE = "2026-11-07";

/** Schema.org-friendly date (YYYY-MM-DD or full ISO). */
export function toSchemaDate(value: string | Date): string {
	if (value instanceof Date) return value.toISOString();
	return value;
}

/** Absolute URL from a path or absolute href. */
export function absoluteUrl(pathOrUrl: string, origin: string): string {
	if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
	const base = origin.endsWith("/") ? origin.slice(0, -1) : origin;
	const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
	return `${base}${path}`;
}

/** Loopback / internal hosts must never appear in canonical, OG, or JSON-LD. */
export function isPrivateOrigin(originOrHost: string): boolean {
	try {
		const url = originOrHost.includes("://")
			? new URL(originOrHost)
			: new URL(`http://${originOrHost}`);
		const host = url.hostname.toLowerCase();
		return (
			host === "localhost" ||
			host === "127.0.0.1" ||
			host === "0.0.0.0" ||
			host === "::1" ||
			host.endsWith(".local")
		);
	} catch {
		return /localhost|127\.0\.0\.1/i.test(originOrHost);
	}
}

/**
 * Public site origin for SEO URLs.
 * Prefer SITE_URL / Astro.site, then forwarded Host — never localhost behind Nginx.
 */
export function resolveSiteOrigin(opts: {
	configured?: string | URL | null;
	requestOrigin: string;
	headers?: Headers;
}): string {
	const candidates: string[] = [];

	const envConfigured =
		(typeof process !== "undefined" &&
			(process.env.SITE_URL ||
				process.env.PUBLIC_SITE_URL ||
				process.env.EMDASH_SITE_URL)) ||
		undefined;

	if (opts.configured) {
		candidates.push(
			typeof opts.configured === "string"
				? opts.configured
				: opts.configured.origin,
		);
	}
	if (envConfigured) candidates.push(envConfigured);

	const xfHost = opts.headers?.get("x-forwarded-host")?.split(",")[0]?.trim();
	const host = opts.headers?.get("host")?.split(",")[0]?.trim();
	const xfProto =
		opts.headers?.get("x-forwarded-proto")?.split(",")[0]?.trim() || "https";

	if (xfHost) candidates.push(`${xfProto}://${xfHost}`);
	if (host) candidates.push(`${xfProto}://${host}`);
	candidates.push(opts.requestOrigin);

	for (const candidate of candidates) {
		if (!candidate) continue;
		try {
			const origin = new URL(candidate).origin;
			if (!isPrivateOrigin(origin)) return origin;
		} catch {
			/* skip invalid */
		}
	}

	return opts.requestOrigin;
}

export function documentTitle(pageTitle: string, brand = BRAND): string {
	const trimmed = pageTitle.trim();
	if (!trimmed) return brand;
	if (trimmed.toLowerCase().includes("square peg")) return trimmed;
	return `${trimmed} — ${brand}`;
}

/** Safe JSON-LD for a script tag (escapes `<` so content can’t break out). */
export function serializeJsonLd(data: JsonLd): string {
	return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function organizationJsonLd(origin: string) {
	return {
		"@type": "Organization",
		"@id": `${origin}/#organization`,
		name: BRAND,
		url: origin,
		logo: absoluteUrl("/logo.svg", origin),
		description:
			"Strategic marketing for organisations in the addiction, mental health, behavioural health and wellness sectors.",
		areaServed: "GB",
		knowsAbout: [
			"Addiction sector marketing",
			"Mental health marketing",
			"Behavioural health marketing",
			"Wellness marketing",
			"Brand strategy",
			"Website design",
			"Content marketing",
		],
	};
}

export function webSiteJsonLd(origin: string) {
	return {
		"@type": "WebSite",
		"@id": `${origin}/#website`,
		name: BRAND,
		url: origin,
		publisher: { "@id": `${origin}/#organization` },
		inLanguage: "en-GB",
	};
}

export function webPageJsonLd(opts: {
	origin: string;
	path: string;
	title: string;
	description: string;
	datePublished?: string | Date;
	dateModified?: string | Date;
}) {
	const url = absoluteUrl(opts.path, opts.origin);
	const datePublished = toSchemaDate(
		opts.datePublished ?? SITE_LAUNCH_DATE,
	);
	const dateModified = toSchemaDate(
		opts.dateModified ?? opts.datePublished ?? SITE_LAUNCH_DATE,
	);
	return {
		"@type": "WebPage",
		"@id": `${url}#webpage`,
		url,
		name: opts.title,
		description: opts.description,
		datePublished,
		dateModified,
		isPartOf: { "@id": `${opts.origin}/#website` },
		about: { "@id": `${opts.origin}/#organization` },
		inLanguage: "en-GB",
	};
}

/** Graph with Organization + WebSite + optional page nodes. */
export function buildSiteGraph(
	origin: string,
	extra: Record<string, unknown>[] = [],
) {
	return {
		"@context": "https://schema.org",
		"@graph": [organizationJsonLd(origin), webSiteJsonLd(origin), ...extra],
	};
}
