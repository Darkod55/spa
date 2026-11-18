import { appendAnalyticsLog } from "./json-log";
import { asText, clientIp, parseAttribution, sanitizePageUrl } from "./sanitize";
import type { ContactPayload } from "../zeptomail";

export function logContactSubmission(options: {
	payload: ContactPayload;
	attribution: Record<string, unknown>;
	page?: string;
	request: Request;
	clientAddress?: string;
	siteOrigin?: string;
}): void {
	const attribution = parseAttribution(options.attribution);
	const page =
		sanitizePageUrl(options.page ?? options.attribution.page, options.siteOrigin) ||
		sanitizePageUrl(options.request.headers.get("referer"), options.siteOrigin);

	appendAnalyticsLog("submissions.log", "submission", {
		...attribution,
		page,
		ip: clientIp(options.request, options.clientAddress ?? ""),
		name: asText(options.payload.name, 200),
		email: asText(options.payload.email, 200),
		organisation: asText(options.payload.organisation ?? "", 200),
		phone: asText(options.payload.phone ?? "", 80),
		service: asText(options.payload.service ?? "", 200),
		message: asText(options.payload.message, 5000),
	});
}
