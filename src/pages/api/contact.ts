import type { APIRoute } from "astro";
import { logContactSubmission } from "../../utils/analytics/submissions";
import { sendContactEmail, type ContactPayload } from "../../utils/zeptomail";
import { verifyTurnstileToken } from "../../utils/turnstile";
import { resolveSiteOrigin } from "../../utils/seo";

export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asString(value: FormDataEntryValue | null): string {
	return typeof value === "string" ? value.trim() : "";
}

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
		const form = await request.formData();

		// Honeypot — bots fill this; humans never see it
		if (asString(form.get("company_website"))) {
			return json(200, { ok: true });
		}

		const turnstile = await verifyTurnstileToken({
			token: asString(form.get("cf-turnstile-response")),
			remoteIp: clientAddress,
		});
		if (!turnstile.ok) {
			return json(400, { ok: false, error: turnstile.error });
		}

		const payload: ContactPayload = {
			name: asString(form.get("name")),
			email: asString(form.get("email")),
			organisation: asString(form.get("organisation")) || undefined,
			phone: asString(form.get("phone")) || undefined,
			service: asString(form.get("service")) || undefined,
			message: asString(form.get("message")),
		};

		const privacy = asString(form.get("privacy"));

		if (!payload.name || !payload.email || !payload.message) {
			return json(400, {
				ok: false,
				error: "Please complete the required fields.",
			});
		}

		if (!EMAIL_RE.test(payload.email)) {
			return json(400, {
				ok: false,
				error: "Please enter a valid email address.",
			});
		}

		if (privacy !== "1") {
			return json(400, {
				ok: false,
				error: "Please agree to the privacy policy to continue.",
			});
		}

		if (payload.message.length > 5000 || payload.name.length > 200) {
			return json(400, {
				ok: false,
				error: "One of the fields is too long.",
			});
		}

		await sendContactEmail(payload);

		try {
			const siteOrigin = resolveSiteOrigin({
				configured: undefined,
				requestOrigin: new URL(request.url).origin,
				headers: request.headers,
			});
			logContactSubmission({
				payload,
				attribution: {
					visitor_id: asString(form.get("referrer_visitor_id")),
					source: asString(form.get("referrer_source")),
					medium: asString(form.get("referrer_medium")),
					campaign: asString(form.get("referrer_campaign")),
					journey: asString(form.get("referrer_journey")),
					page: request.headers.get("referer") || "",
				},
				request,
				clientAddress,
				siteOrigin,
			});
		} catch (logError) {
			console.error("[contact] analytics log failed", logError);
		}

		return json(200, {
			ok: true,
			message: "Thanks — your message is on its way. We’ll be in touch soon.",
		});
	} catch (error) {
		console.error("[contact]", error);
		return json(500, {
			ok: false,
			error:
				"Sorry, we couldn’t send your message just now. Please try again or email us directly.",
		});
	}
};
