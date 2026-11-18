import {
	analyticsLogPath,
	decodeAnalyticsLine,
	newestAnalyticsLines,
} from "./json-log";
import type {
	AnalyticsReport,
	ClickEvent,
	ClickType,
	SubmissionEvent,
} from "./types";

export const REPORT_DEFAULT_LIMIT = 100;
export const REPORT_MAX_LIMIT = 500;

const CLICK_EVENTS = new Set(["phone", "email", "address", "social"]);

function asString(value: unknown): string {
	return typeof value === "string" ? value.trim() : "";
}

function dateBound(value: string, end: boolean): string | null {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
	const probe = new Date(`${value}T00:00:00.000Z`);
	if (Number.isNaN(probe.getTime()) || probe.toISOString().slice(0, 10) !== value) {
		return null;
	}
	return `${value} ${end ? "23:59:59" : "00:00:00"}`;
}

function walk(
	filename: string,
	fromStart: string,
	toEnd: string,
	onRow: (data: Record<string, unknown>, time: string) => boolean,
): void {
	const base = analyticsLogPath(filename);
	let stop = false;

	for (const path of [base, `${base}.1.bak`]) {
		if (stop) break;
		for (const line of newestAnalyticsLines(path, 0)) {
			const data = decodeAnalyticsLine(line);
			if (!data) continue;

			const time = asString(data.time);
			if (!time) continue;

			// Support both "YYYY-MM-DD HH:MM:SS" and ISO strings.
			const cmp = time.includes("T")
				? time.replace("T", " ").replace(/\.\d{3}Z?$/, "").replace(/Z$/, "")
				: time;

			if (toEnd && cmp > toEnd) continue;
			if (fromStart && cmp < fromStart) {
				stop = true;
				break;
			}

			if (onRow(data, time) === false) {
				stop = true;
				break;
			}
		}
	}
}

function mapClick(
	data: Record<string, unknown>,
	time: string,
): ClickEvent | null {
	const event = asString(data.event);
	if (!CLICK_EVENTS.has(event)) return null;

	return {
		time,
		event: event as ClickType,
		value: asString(data.value),
		location: asString(data.location),
		visitor_id: asString(data.visitor_id),
		page: asString(data.page),
		ip: asString(data.ip),
		source: asString(data.source),
		medium: asString(data.medium),
		campaign: asString(data.campaign),
		journey: asString(data.journey),
	};
}

function mapSubmission(
	data: Record<string, unknown>,
	time: string,
): SubmissionEvent | null {
	if (asString(data.event) !== "submission") return null;

	return {
		time,
		event: "submission",
		visitor_id: asString(data.visitor_id),
		page: asString(data.page),
		ip: asString(data.ip),
		source: asString(data.source),
		medium: asString(data.medium),
		campaign: asString(data.campaign),
		journey: asString(data.journey),
		name: asString(data.name),
		email: asString(data.email),
		organisation: asString(data.organisation),
		phone: asString(data.phone),
		service: asString(data.service),
		message: asString(data.message),
	};
}

export function parseReportQuery(url: URL): {
	ok: true;
	from: string;
	to: string;
	fromStart: string;
	toEnd: string;
	limit: number;
} | { ok: false; error: string } {
	const from = url.searchParams.get("from")?.trim() ?? "";
	const to = url.searchParams.get("to")?.trim() ?? "";
	let limit = Number(url.searchParams.get("limit") ?? REPORT_DEFAULT_LIMIT);

	if (!Number.isFinite(limit) || limit < 1) limit = REPORT_DEFAULT_LIMIT;
	limit = Math.min(REPORT_MAX_LIMIT, Math.floor(limit));

	if (from && !dateBound(from, false)) {
		return { ok: false, error: "Use dates as YYYY-MM-DD." };
	}
	if (to && !dateBound(to, true)) {
		return { ok: false, error: "Use dates as YYYY-MM-DD." };
	}
	if (from && to && from > to) {
		return { ok: false, error: "The start date is after the end date." };
	}

	return {
		ok: true,
		from,
		to,
		fromStart: from ? (dateBound(from, false) as string) : "",
		toEnd: to ? (dateBound(to, true) as string) : "",
		limit,
	};
}

export function buildAnalyticsReport(options: {
	from: string;
	to: string;
	fromStart: string;
	toEnd: string;
	limit: number;
}): AnalyticsReport {
	const clicks: ClickEvent[] = [];
	const submissions: SubmissionEvent[] = [];

	walk("clicks.log", options.fromStart, options.toEnd, (data, time) => {
		if (clicks.length >= options.limit) return false;
		const row = mapClick(data, time);
		if (row) clicks.push(row);
		return true;
	});

	walk("submissions.log", options.fromStart, options.toEnd, (data, time) => {
		if (submissions.length >= options.limit) return false;
		const row = mapSubmission(data, time);
		if (row) submissions.push(row);
		return true;
	});

	return {
		from: options.from || null,
		to: options.to || null,
		limit: options.limit,
		included: ["clicks", "submissions"],
		clicks,
		submissions,
	};
}
