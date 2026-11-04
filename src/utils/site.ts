import type { SiteSettings } from "emdash";

const DEFAULT_SITE_TITLE = "My Site";
const DEFAULT_TITLE_SEPARATOR = "—";

/** Brand mark shipped with the theme (`public/logo.svg`). */
const THEME_LOGO = {
	url: "/logo.svg",
	width: 820,
	height: 212,
} as const;

/**
 * Site identity from the admin's settings. Cleared values stay cleared: only a
 * missing or blank title falls back, because the header always needs a name.
 * Theme logo is used unless Settings › Logo is set in the admin.
 */
export function resolveSiteIdentity(settings: Partial<SiteSettings> | undefined) {
	const siteTitle = settings?.title?.trim() || DEFAULT_SITE_TITLE;

	return {
		siteTitle,
		siteTagline: settings?.tagline?.trim() ?? "",
		siteLogo: settings?.logo?.url
			? settings.logo
			: { ...THEME_LOGO, alt: siteTitle },
		titleSeparator: settings?.seo?.titleSeparator?.trim() || DEFAULT_TITLE_SEPARATOR,
	};
}
