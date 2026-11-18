import {
	appendFileSync,
	existsSync,
	mkdirSync,
	readFileSync,
	renameSync,
	statSync,
	writeFileSync,
} from "node:fs";
import { join } from "node:path";

/** Default 2 MB — matches MPX Features rotation. */
export const ANALYTICS_MAX_BYTES = 2_097_152;

export function analyticsLogDir(): string {
	const fromEnv = process.env.ANALYTICS_LOG_DIR?.trim();
	if (fromEnv) return fromEnv;
	return join(process.cwd(), "data", "analytics");
}

export function analyticsLogPath(filename: string): string {
	return join(analyticsLogDir(), filename.replace(/^\/+/, ""));
}

export function ensureAnalyticsLogDir(): void {
	const dir = analyticsLogDir();
	if (!existsSync(dir)) {
		mkdirSync(dir, { recursive: true });
	}
	const keepOut = join(dir, ".gitkeep");
	if (!existsSync(keepOut)) {
		writeFileSync(keepOut, "");
	}
}

/**
 * Append one JSON line. Oldest first; rotate to `.1.bak` when over maxBytes.
 */
export function appendAnalyticsLog(
	filename: string,
	event: string,
	context: Record<string, unknown>,
	maxBytes = ANALYTICS_MAX_BYTES,
): void {
	ensureAnalyticsLogDir();
	const path = analyticsLogPath(filename);
	const record = {
		...context,
		time: new Date().toISOString().replace(/\.\d{3}Z$/, "").replace("T", " "),
		event,
	};
	const line = `${JSON.stringify(record)}\n`;

	if (maxBytes > 0 && existsSync(path)) {
		try {
			const size = statSync(path).size;
			if (size >= maxBytes) {
				renameSync(path, `${path}.1.bak`);
			}
		} catch {
			/* ignore rotation races */
		}
	}

	appendFileSync(path, line, "utf8");
}

/** Newest lines first. limit 0 = all. */
export function newestAnalyticsLines(path: string, limit = 0): string[] {
	if (!existsSync(path)) return [];

	let raw = "";
	try {
		raw = readFileSync(path, "utf8");
	} catch {
		return [];
	}

	const lines = raw.split(/\r?\n/);
	const out: string[] = [];

	for (let i = lines.length - 1; i >= 0; i--) {
		const line = lines[i]?.trim() ?? "";
		if (!line) continue;
		out.push(line);
		if (limit > 0 && out.length >= limit) break;
	}

	return out;
}

export function decodeAnalyticsLine(
	line: string,
): Record<string, unknown> | null {
	const trimmed = line.trim();
	if (!trimmed || trimmed[0] !== "{") return null;
	try {
		const data = JSON.parse(trimmed) as unknown;
		return data && typeof data === "object" && !Array.isArray(data)
			? (data as Record<string, unknown>)
			: null;
	} catch {
		return null;
	}
}
