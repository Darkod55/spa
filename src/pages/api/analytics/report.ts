import type { APIRoute } from "astro";
import { authorizeAnalyticsReport } from "../../../utils/analytics/auth";
import {
	buildAnalyticsReport,
	parseReportQuery,
} from "../../../utils/analytics/report";

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

export const GET: APIRoute = async ({ request }) => {
	if (!authorizeAnalyticsReport(request)) {
		return json(401, { ok: false, error: "Unauthorized." });
	}

	const parsed = parseReportQuery(new URL(request.url));
	if (!parsed.ok) {
		return json(400, { ok: false, error: parsed.error });
	}

	try {
		const report = buildAnalyticsReport(parsed);
		return json(200, report);
	} catch (error) {
		console.error("[analytics/report]", error);
		return json(500, { ok: false, error: "Could not build report." });
	}
};
