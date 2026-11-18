import type { APIRoute } from "astro";
import { sendClickAlertEmail } from "../../../utils/analytics/click-alert";
import { isDuplicateClick } from "../../../utils/analytics/dedupe";
import { appendAnalyticsLog } from "../../../utils/analytics/json-log";
import {
	asText,
	clientIp,
	isClickType,
	parseAttribution,
	sanitizePageUrl,
} from "../../../utils/analytics/sanitize";
import { resolveSiteOrigin } from "../../../utils/seo";

export const prerender = false;

function json(status: number, body: Record<string, unknown>) {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			"Content-Type": "application/json",
			"Cache-Control": "no-store",
		},
	});
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
	try {
		const contentType = request.headers.get("content-type") || "";
		let body: Record<string, unknown> = {};

		if (contentType.includes("application/json")) {
			body = (await request.json()) as Record<string, unknown>;
		} else {
			const text = await request.text();
			if (text) body = JSON.parse(text) as Record<string, unknown>;
		}

		if (!isClickType(body.type)) {
			return json(400, { ok: false, error: "Unknown click type." });
		}

		const origin = resolveSiteOrigin({
			configured: undefined,
			requestOrigin: new URL(request.url).origin,
			headers: request.headers,
		});

		const value = asText(body.value, 300);
		const page = sanitizePageUrl(body.page, origin);
		if (!value || !page) {
			return json(400, { ok: false, error: "Incomplete click." });
		}

		const location = asText(body.location, 80);
		const attribution = parseAttribution(body);
		const ip = clientIp(request, clientAddress);

		const dedupeKey = `${ip}|${body.type}|${value.toLowerCase()}|${location.toLowerCase()}`;
		if (isDuplicateClick(dedupeKey)) {
			return json(200, { ok: true, duplicate: true });
		}

		const context = {
			value,
			location,
			page,
			ip,
			...attribution,
		};

		appendAnalyticsLog("clicks.log", body.type, context);

		// Fire-and-forget email so the beacon isn't held up.
		void sendClickAlertEmail(body.type, context);

		return json(200, { ok: true });
	} catch (error) {
		console.error("[analytics/click]", error);
		return json(400, { ok: false, error: "Could not record click." });
	}
};
