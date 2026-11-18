export type ContactPayload = {
	name: string;
	email: string;
	organisation?: string;
	phone?: string;
	service?: string;
	message: string;
};

type ZeptoRecipient = {
	address: string;
	name?: string;
};

type ZeptoConfig = {
	apiUrl: string;
	apiKey: string;
	fromAddress: string;
	fromName: string;
	toAddress: string;
	toName?: string;
	bcc: ZeptoRecipient[];
};

function requireEnv(name: string): string {
	const value = process.env[name]?.trim();
	if (!value) throw new Error(`Missing environment variable: ${name}`);
	return value;
}

/** Accept either the raw token or a full `Zoho-enczapikey …` value. */
function normalizeApiKey(raw: string): string {
	return raw.replace(/^Zoho-enczapikey\s+/i, "").trim();
}

function parseBccList(raw: string | undefined): ZeptoRecipient[] {
	const fallback = "darko@thesquarepeg.agency";
	const source = raw?.trim() ? raw : fallback;
	const seen = new Set<string>();
	const out: ZeptoRecipient[] = [];

	for (const part of source.split(",")) {
		const address = part.trim().toLowerCase();
		if (!address || seen.has(address)) continue;
		seen.add(address);
		out.push({ address });
	}

	return out;
}

export function getZeptoConfig(): ZeptoConfig {
	return {
		// Classic ZeptoMail endpoint; override if your account uses EU/IN or CPaaS
		apiUrl:
			process.env.ZEPTOMAIL_API_URL?.trim() ||
			"https://api.zeptomail.com/v1.1/email",
		apiKey: normalizeApiKey(requireEnv("ZEPTOMAIL_API_KEY")),
		fromAddress: requireEnv("ZEPTOMAIL_FROM_ADDRESS"),
		fromName: process.env.ZEPTOMAIL_FROM_NAME?.trim() || "The Square Peg Agency",
		toAddress: requireEnv("CONTACT_TO_ADDRESS"),
		toName: process.env.CONTACT_TO_NAME?.trim() || "The Square Peg Agency",
		bcc: parseBccList(process.env.CONTACT_BCC_ADDRESS),
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

function asEmailAddress(recipient: ZeptoRecipient) {
	return {
		email_address: {
			address: recipient.address,
			...(recipient.name ? { name: recipient.name } : {}),
		},
	};
}

async function postZeptoMail(
	config: ZeptoConfig,
	body: Record<string, unknown>,
): Promise<void> {
	const response = await fetch(config.apiUrl, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Zoho-enczapikey ${config.apiKey}`,
		},
		body: JSON.stringify(body),
	});

	if (!response.ok) {
		const detail = await response.text().catch(() => "");
		throw new Error(
			`ZeptoMail request failed (${response.status})${detail ? `: ${detail}` : ""}`,
		);
	}
}

export async function sendContactEmail(payload: ContactPayload): Promise<void> {
	const config = getZeptoConfig();
	const { text, html } = buildBodies(payload);
	const subject = `Website enquiry from ${payload.name}`;
	const replyTo = [
		{
			address: payload.email,
			name: payload.name,
		},
	];

	const base = {
		from: {
			address: config.fromAddress,
			name: config.fromName,
		},
		reply_to: replyTo,
		subject,
		textbody: text,
		htmlbody: html,
	};

	const primaryTo = config.toAddress.trim().toLowerCase();

	// Primary delivery to the enquiry inbox.
	await postZeptoMail(config, {
		...base,
		to: [
			asEmailAddress({
				address: config.toAddress,
				name: config.toName,
			}),
		],
		client_reference: `contact-${Date.now()}`,
	});

	/*
	 * Silent copies for CONTACT_BCC_ADDRESS (defaults to darko@…).
	 * Sent as separate messages (not SMTP BCC) so delivery is reliable with ZeptoMail.
	 * Distinct subject + no reply_to so providers don't treat it as a twin of Mandy's mail.
	 * Copy failures are logged but do not fail the visitor-facing submit.
	 */
	for (const [index, recipient] of config.bcc.entries()) {
		if (recipient.address.toLowerCase() === primaryTo) continue;
		try {
			await postZeptoMail(config, {
				from: base.from,
				to: [asEmailAddress(recipient)],
				subject: `[Copy] ${subject}`,
				textbody: text,
				htmlbody: html,
				client_reference: `contact-copy-${Date.now()}-${index}`,
			});
			console.info(`[zeptomail] silent copy sent to ${recipient.address}`);
		} catch (error) {
			console.error(
				`[zeptomail] silent copy failed for ${recipient.address}`,
				error,
			);
		}
	}
}

/** Plain-text admin alert (contact clicks, etc.). */
export async function sendPlainAlertEmail(options: {
	to?: string;
	subject: string;
	text: string;
	clientReference?: string;
}): Promise<void> {
	const config = getZeptoConfig();
	const to = options.to?.trim() || config.toAddress;

	await postZeptoMail(config, {
		from: {
			address: config.fromAddress,
			name: config.fromName,
		},
		to: [asEmailAddress({ address: to, name: config.toName })],
		subject: options.subject,
		textbody: options.text,
		htmlbody: `<pre style="font-family: ui-monospace, Menlo, monospace; font-size: 13px; line-height: 1.5; white-space: pre-wrap;">${escapeHtml(options.text)}</pre>`,
		client_reference: options.clientReference || `alert-${Date.now()}`,
	});
}
