/**
 * First-party journey + contact-click tracking (MPX Features equivalent).
 * Stores attribution in localStorage and posts clicks to /api/analytics/click.
 */
(() => {
	const STORAGE_KEY = "spa_tracking";
	const ENDPOINT = "/api/analytics/click";
	const lastSent: Record<string, number> = {};

	type JourneyItem = { url: string; startTime: number; duration: number };
	type Tracking = {
		visitorId: string;
		source: string;
		medium: string;
		campaign: string;
		journey: JourneyItem[];
	};

	function uuid(): string {
		if (window.crypto?.randomUUID) return window.crypto.randomUUID();
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
			const r = (Math.random() * 16) | 0;
			const v = c === "x" ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		});
	}

	function readTracking(): Tracking {
		let data: Partial<Tracking> = {};
		try {
			data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") || {};
		} catch {
			data = {};
		}

		return {
			visitorId: typeof data.visitorId === "string" ? data.visitorId : "",
			source: typeof data.source === "string" ? data.source : "",
			medium: typeof data.medium === "string" ? data.medium : "",
			campaign: typeof data.campaign === "string" ? data.campaign : "",
			journey: Array.isArray(data.journey) ? data.journey : [],
		};
	}

	function writeTracking(data: Tracking): void {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
		} catch {
			/* private mode / quota */
		}
	}

	function journeyText(journey: JourneyItem[], markSubmission = false): string {
		return journey
			.map((item, index) => {
				const url = item?.url || "";
				const duration = item?.duration || 0;
				const suffix =
					markSubmission && index === journey.length - 1 ? " submission" : "";
				return `${index + 1}. ${url} (${duration}s)${suffix}`;
			})
			.join("\n");
	}

	function touchCurrentDuration(data: Tracking): void {
		if (!data.journey.length) return;
		const current = data.journey[data.journey.length - 1];
		if (current && current.url === window.location.href && current.startTime) {
			current.duration = Math.round((Date.now() - current.startTime) / 1000);
		}
	}

	function initAttribution(): Tracking {
		const urlParams = new URLSearchParams(window.location.search);
		const currentUrl = window.location.href;
		let refHost = "";

		if (document.referrer) {
			try {
				refHost = new URL(document.referrer).hostname
					.toLowerCase()
					.replace(/^www\./, "");
			} catch {
				refHost = "";
			}
		}

		const tracking = readTracking();
		if (!tracking.visitorId) tracking.visitorId = uuid();

		const gclid = urlParams.get("gclid");
		const fbclid = urlParams.get("fbclid");
		const utmSource = urlParams.get("utm_source");

		if (utmSource || gclid || fbclid) {
			tracking.source =
				utmSource || (gclid ? "Google Ads" : "Meta Ads");
			tracking.medium =
				urlParams.get("utm_medium") || (gclid || fbclid ? "cpc" : "direct");
			tracking.campaign = urlParams.get("utm_campaign") || "";
		} else if (refHost && refHost !== window.location.hostname.replace(/^www\./, "")) {
			switch (true) {
				case refHost.includes("google."):
					tracking.source = "Google Search";
					tracking.medium = "organic";
					break;
				case refHost.includes("facebook.") || refHost.includes("instagram."):
					tracking.source = "Meta Organic";
					tracking.medium = "organic";
					break;
				case refHost.includes("bing."):
					tracking.source = urlParams.has("form")
						? "Bing Copilot"
						: "Bing Search";
					tracking.medium = urlParams.has("form")
						? "ai_assistant"
						: "organic";
					break;
				case refHost === "chatgpt.com":
					tracking.source = "ChatGPT";
					tracking.medium = "ai_assistant";
					break;
				case refHost === "claude.ai":
					tracking.source = "Claude";
					tracking.medium = "ai_assistant";
					break;
				case refHost === "perplexity.ai":
					tracking.source = "Perplexity";
					tracking.medium = "ai_assistant";
					break;
				case refHost === "copilot.microsoft.com":
					tracking.source = "Bing Copilot";
					tracking.medium = "ai_assistant";
					break;
				default:
					tracking.source = refHost;
					tracking.medium = "referral";
			}
		} else if (!tracking.source) {
			tracking.source = "Direct";
			tracking.medium = "direct";
		}

		const now = Date.now();
		const last = tracking.journey[tracking.journey.length - 1];
		if (!last || last.url !== currentUrl) {
			tracking.journey.push({ url: currentUrl, startTime: now, duration: 0 });
			if (tracking.journey.length > 10) tracking.journey.shift();
		}

		writeTracking(tracking);
		return tracking;
	}

	function persistDuration(): void {
		const tracking = readTracking();
		touchCurrentDuration(tracking);
		writeTracking(tracking);
	}

	function populateFormFields(markSubmission = false): void {
		const tracking = readTracking();
		touchCurrentDuration(tracking);
		writeTracking(tracking);

		const setAll = (name: string, value: string) => {
			document
				.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
					`input[name="${name}"], textarea[name="${name}"]`,
				)
				.forEach((el) => {
					el.value = value;
				});
		};

		setAll("referrer_source", tracking.source || "");
		setAll("referrer_medium", tracking.medium || "");
		setAll("referrer_campaign", tracking.campaign || "");
		setAll("referrer_visitor_id", tracking.visitorId || "");
		setAll(
			"referrer_journey",
			journeyText(tracking.journey || [], markSubmission),
		);
	}

	function clickType(anchor: HTMLAnchorElement): string {
		const explicit = (anchor.getAttribute("data-spa-track") || "").trim();
		if (explicit) return explicit;

		const href = anchor.getAttribute("href") || "";
		if (/^tel:/i.test(href)) return "phone";
		if (/^mailto:/i.test(href)) return "email";
		if (/maps\.google\.|google\.[^/]+\/maps|maps\.apple\./i.test(href)) {
			return "address";
		}
		if (
			/linkedin\.com|facebook\.com|instagram\.com|x\.com|twitter\.com/i.test(
				href,
			)
		) {
			return "social";
		}
		return "";
	}

	function clickLocation(anchor: HTMLAnchorElement): string {
		const explicit = (anchor.getAttribute("data-spa-location") || "").trim();
		if (explicit) return explicit;
		if (anchor.closest("#site-chrome, .site-header, header")) return "Header";
		if (anchor.closest(".site-footer, footer")) return "Footer";
		if (anchor.closest(".contact-aside")) return "Contact panel";
		if (anchor.closest(".contact-section")) return "Contact";
		if (anchor.closest(".hero")) return "Hero";
		return "Content";
	}

	function decodePart(value: string): string {
		try {
			return decodeURIComponent(value);
		} catch {
			return value;
		}
	}

	function clickValue(anchor: HTMLAnchorElement, type: string): string {
		const href = anchor.getAttribute("href") || "";
		if (type === "phone") {
			return decodePart(href.replace(/^tel:/i, "")).split("?")[0] || "";
		}
		if (type === "email") {
			return decodePart(href.replace(/^mailto:/i, "")).split("?")[0] || "";
		}
		if (type === "social") {
			if (/linkedin\.com/i.test(href)) return "LinkedIn";
			if (/facebook\.com/i.test(href)) return "Facebook";
			if (/instagram\.com/i.test(href)) return "Instagram";
			if (/x\.com|twitter\.com/i.test(href)) return "X";
		}
		const text = (anchor.textContent || "").replace(/\s+/g, " ").trim();
		return text || href;
	}

	function sendClick(payload: Record<string, string>): void {
		const body = JSON.stringify(payload);
		if (typeof navigator.sendBeacon === "function") {
			const blob = new Blob([body], { type: "application/json" });
			if (navigator.sendBeacon(ENDPOINT, blob)) return;
		}
		void fetch(ENDPOINT, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body,
			keepalive: true,
			credentials: "same-origin",
		});
	}

	initAttribution();

	window.addEventListener("beforeunload", persistDuration);
	document.addEventListener("visibilitychange", () => {
		if (document.visibilityState === "hidden") persistDuration();
	});

	const populate = () => populateFormFields(false);
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", () => {
			populate();
			window.setTimeout(populate, 1000);
		});
	} else {
		populate();
		window.setTimeout(populate, 1000);
	}

	document.addEventListener(
		"submit",
		() => {
			populateFormFields(true);
		},
		true,
	);

	document.addEventListener(
		"click",
		(event) => {
			const target = event.target;
			if (!(target instanceof Element)) return;
			const anchor = target.closest("a");
			if (!(anchor instanceof HTMLAnchorElement)) return;

			const type = clickType(anchor);
			if (!type) return;

			const value = clickValue(anchor, type);
			const location = clickLocation(anchor);
			const key = `${type}|${value}|${location}`;
			const now = Date.now();
			if (lastSent[key] && now - lastSent[key] < 4000) return;
			lastSent[key] = now;

			const tracking = readTracking();
			touchCurrentDuration(tracking);
			writeTracking(tracking);

			sendClick({
				type,
				value,
				location,
				page: window.location.href,
				visitor_id: tracking.visitorId || "",
				source: tracking.source || "",
				medium: tracking.medium || "",
				campaign: tracking.campaign || "",
				journey: journeyText(tracking.journey || []),
			});
		},
		true,
	);
})();
