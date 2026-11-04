export type ContactPayload = {
	name: string;
	email: string;
	organisation?: string;
	phone?: string;
	service?: string;
	message: string;
};

type ZeptoConfig = {
	apiUrl: string;
	apiKey: string;
	fromAddress: string;
	fromName: string;
	toAddress: string;
	toName?: string;
};

function requireEnv(name: string): string {
	const value = process.env[name]?.trim();
	if (!value) throw new Error(`Missing environment variable: ${name}`);
	return value;
}

export function getZeptoConfig(): ZeptoConfig {
	return {
		// Classic ZeptoMail endpoint; override if your account uses EU/IN or CPaaS
		apiUrl:
			process.env.ZEPTOMAIL_API_URL?.trim() ||
			"https://api.zeptomail.com/v1.1/email",
		apiKey: requireEnv("ZEPTOMAIL_API_KEY"),
		fromAddress: requireEnv("ZEPTOMAIL_FROM_ADDRESS"),
		fromName: process.env.ZEPTOMAIL_FROM_NAME?.trim() || "The Square Peg Agency",
		toAddress: requireEnv("CONTACT_TO_ADDRESS"),
		toName: process.env.CONTACT_TO_NAME?.trim() || "The Square Peg Agency",
	};
}

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

function buildBodies(payload: ContactPayload): { text: string; html: string } {
	const rows: [string, string][] = [
		["Name", payload.name],
		["Email", payload.email],
		["Organisation", payload.organisation || "—"],
		["Phone", payload.phone || "—"],
		["Service", payload.service || "—"],
		["Message", payload.message],
	];

	const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");

	const html = `
		<div style="font-family: Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #031433;">
			<p><strong>New enquiry from the website contact form</strong></p>
			<table style="border-collapse: collapse; width: 100%; max-width: 560px;">
				${rows
					.map(
						([label, value]) => `
					<tr>
						<td style="padding: 8px 12px 8px 0; vertical-align: top; font-weight: 700; white-space: nowrap;">${escapeHtml(label)}</td>
						<td style="padding: 8px 0; vertical-align: top; white-space: pre-wrap;">${escapeHtml(value)}</td>
					</tr>`,
					)
					.join("")}
			</table>
		</div>
	`;

	return { text, html };
}

export async function sendContactEmail(payload: ContactPayload): Promise<void> {
	const config = getZeptoConfig();
	const { text, html } = buildBodies(payload);

	const response = await fetch(config.apiUrl, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Zoho-enczapikey ${config.apiKey}`,
		},
		body: JSON.stringify({
			from: {
				address: config.fromAddress,
				name: config.fromName,
			},
			to: [
				{
					email_address: {
						address: config.toAddress,
						name: config.toName,
					},
				},
			],
			reply_to: [
				{
					address: payload.email,
					name: payload.name,
				},
			],
			subject: `Website enquiry from ${payload.name}`,
			textbody: text,
			htmlbody: html,
			client_reference: `contact-${Date.now()}`,
		}),
	});

	if (!response.ok) {
		const detail = await response.text().catch(() => "");
		throw new Error(
			`ZeptoMail request failed (${response.status})${detail ? `: ${detail}` : ""}`,
		);
	}
}
