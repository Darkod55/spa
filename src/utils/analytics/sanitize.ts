import type { Attribution, ClickType } from "./types";

const CLICK_TYPES = new Set<ClickType>(["phone", "email", "address", "social"]);

export function clip(value: string, max: number): string {
	if (value.length <= max) return value;
	return value.slice(0, max);
}

export function asText(value: unknown, max: number): string {
	if (typeof value !== "string") return "";
	return clip(value.trim(), max);
}

export function isClickType(value: unknown): value is ClickType {
	return typeof value === "string" && CLICK_TYPES.has(value as ClickType);
}

export function parseAttribution(input: Record<string, unknown>): Attribution {
	const visitor = asText(input.visitor_id, 64);
	const visitor_id = /^[A-Za-z0-9-]{8,64}$/.test(visitor) ? visitor : "";

	return {
		visitor_id,
		source: asText(input.source, 120),
		medium: asText(input.medium, 120),
		campaign: asText(input.campaign, 120),
		journey: asText(input.journey, 4000),
	};
}

/** Accept absolute same-site URLs or relative paths. */
export function sanitizePageUrl(value: unknown, siteOrigin?: string): string {
	const raw = asText(value, 500);
	if (!raw) return "";

	try {
		const origin =
			siteOrigin?.replace(/\/$/, "") ||
			process.env.SITE_URL?.trim() ||
			process.env.PUBLIC_SITE_URL?.trim() ||
			"";
		const url = raw.startsWith("http")
			? new URL(raw)
			: origin
				? new URL(raw, origin)
				: null;

		if (!url) return raw.startsWith("/") ? raw : "";

		if (origin) {
			const allowed = new URL(origin);
			if (url.hostname.replace(/^www\./, "") !== allowed.hostname.replace(/^www\./, "")) {
				return "";
			}
		}

		return url.toString();
	} catch {
		return "";
	}
}

export function clientIp(request: Request, fallback = ""): string {
	const forwarded = request.headers.get("x-forwarded-for");
	if (forwarded) {
		const first = forwarded.split(",")[0]?.trim();
		if (first) return clip(first, 80);
	}
	const real = request.headers.get("x-real-ip")?.trim();
	if (real) return clip(real, 80);
	return clip(fallback, 80);
}
