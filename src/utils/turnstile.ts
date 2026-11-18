export type TurnstileVerifyResult =
	| { ok: true }
	| { ok: false; error: string };

/**
 * Verify a Cloudflare Turnstile token with the siteverify API.
 * Returns ok:true without calling Cloudflare if keys are not configured
 * (local/dev convenience). Production should always set both keys.
 */
export async function verifyTurnstileToken(opts: {
	token: string;
	remoteIp?: string | null;
}): Promise<TurnstileVerifyResult> {
	const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
	const siteKey =
		process.env.PUBLIC_TURNSTILE_SITE_KEY?.trim() ||
		import.meta.env.PUBLIC_TURNSTILE_SITE_KEY?.trim();

	if (!secret || !siteKey) {
		if (import.meta.env.PROD) {
			return {
				ok: false,
				error: "Spam protection is temporarily unavailable. Please try again later.",
			};
		}
		return { ok: true };
	}

	if (!opts.token) {
		return {
			ok: false,
			error: "Please complete the spam check and try again.",
		};
	}

	const body = new URLSearchParams();
	body.set("secret", secret);
	body.set("response", opts.token);
	if (opts.remoteIp) body.set("remoteip", opts.remoteIp);

	const response = await fetch(
		"https://challenges.cloudflare.com/turnstile/v0/siteverify",
		{
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body,
		},
	);

	if (!response.ok) {
		return {
			ok: false,
			error: "Spam check failed. Please try again.",
		};
	}

	const data = (await response.json().catch(() => null)) as {
		success?: boolean;
	} | null;

	if (!data?.success) {
		return {
			ok: false,
			error: "Spam check failed. Please try again.",
		};
	}

	return { ok: true };
}

export function getTurnstileSiteKey(): string {
	return (
		(typeof process !== "undefined" &&
			process.env.PUBLIC_TURNSTILE_SITE_KEY?.trim()) ||
		import.meta.env.PUBLIC_TURNSTILE_SITE_KEY?.trim() ||
		""
	);
}
