import { sendPlainAlertEmail } from "../zeptomail";
import type { ClickType } from "./types";

const LABELS: Record<ClickType, string> = {
	phone: "Phone",
	email: "Email",
	address: "Address",
	social: "Social",
};

function alertsEnabled(): boolean {
	const raw = process.env.ANALYTICS_CLICK_ALERTS?.trim().toLowerCase();
	if (raw === "0" || raw === "false" || raw === "off") return false;
	return true;
}

function alertRecipient(): string {
	return (
		process.env.ANALYTICS_ALERT_EMAIL?.trim() ||
		process.env.CONTACT_TO_ADDRESS?.trim() ||
		""
	);
}

export async function sendClickAlertEmail(
	type: ClickType,
	context: {
		value: string;
		location: string;
		visitor_id: string;
		page: string;
		source: string;
		medium: string;
		campaign: string;
		journey: string;
		ip: string;
	},
): Promise<void> {
	if (!alertsEnabled()) return;

	const to = alertRecipient();
	if (!to) return;

	const label = LABELS[type];
	const subject = `[The Square Peg Agency] Contact click: ${label}`;
	const lines = [
		`Type: ${label}`,
		`Value: ${context.value}`,
		`Location: ${context.location || "—"}`,
		`Visitor: ${context.visitor_id || "—"}`,
		`Page: ${context.page}`,
		`Source: ${context.source || "—"}`,
		`Medium: ${context.medium || "—"}`,
		`Campaign: ${context.campaign || "—"}`,
		`IP: ${context.ip || "—"}`,
		`Time (UTC): ${new Date().toISOString().replace(/\.\d{3}Z$/, "").replace("T", " ")}`,
		"",
		"Journey:",
		context.journey || "—",
	];

	try {
		await sendPlainAlertEmail({
			to,
			subject,
			text: `${lines.join("\n")}\n`,
			clientReference: `click-${type}-${Date.now()}`,
		});
	} catch (error) {
		console.error("[analytics] click alert failed", error);
	}
}
