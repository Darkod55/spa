/**
 * Shared surface system — backgrounds, text colours, section dividers.
 *
 * Source of truth: `surfaces.json`. CMS select options, CSS classes
 * (`bg-primary`, `text-secondary`, `divider-slant-top`), and section
 * components all pull from here so a new colour shows up everywhere
 * that uses these controls.
 */
import surfaces from "./surfaces.json";

export const SURFACE_COLORS = surfaces.colors;
export const SURFACE_DIVIDERS = surfaces.dividers;
export const SURFACE_LABELS = surfaces.labels;
export const SURFACE_DEFAULTS = surfaces.defaults;

export type SurfaceColor = (typeof SURFACE_COLORS)[number];
export type SurfaceDivider = (typeof SURFACE_DIVIDERS)[number];

const colorSet = new Set<string>(SURFACE_COLORS);
const dividerSet = new Set<string>(SURFACE_DIVIDERS);
const legacyToneMap = surfaces.legacyToneMap as Record<string, SurfaceColor>;

/** Light surfaces that need dark type by default. */
const LIGHT_BACKGROUNDS = new Set<SurfaceColor>(["white", "gray"]);

export function isSurfaceColor(value: unknown): value is SurfaceColor {
	return typeof value === "string" && colorSet.has(value);
}

export function isSurfaceDivider(value: unknown): value is SurfaceDivider {
	return typeof value === "string" && dividerSet.has(value);
}

/** Map old tone names (navy/royal/red/grey) onto the new palette. */
export function normalizeSurfaceColor(
	value: unknown,
	fallback: SurfaceColor = SURFACE_DEFAULTS.background as SurfaceColor,
): SurfaceColor {
	if (isSurfaceColor(value)) return value;
	if (typeof value === "string" && value in legacyToneMap) {
		return legacyToneMap[value]!;
	}
	return fallback;
}

export function normalizeSurfaceDivider(
	value: unknown,
	fallback: SurfaceDivider = SURFACE_DEFAULTS.divider as SurfaceDivider,
): SurfaceDivider {
	if (isSurfaceDivider(value)) return value;
	if (value === true) return "slant-top";
	if (value === false) return "none";
	return fallback;
}

/** Default text colour for a background when the CMS leaves text blank. */
export function defaultTextForBackground(background: SurfaceColor): SurfaceColor {
	if (LIGHT_BACKGROUNDS.has(background)) return "primary";
	if (background === "secondary") return "white";
	return "white";
}

export function normalizeTextColor(
	value: unknown,
	background: SurfaceColor,
): SurfaceColor {
	if (typeof value === "string" && value.trim() === "") {
		return defaultTextForBackground(background);
	}
	if (isSurfaceColor(value)) return value;
	return defaultTextForBackground(background);
}

export function isLightSurface(color: SurfaceColor): boolean {
	return LIGHT_BACKGROUNDS.has(color);
}

/** Classes applied to a section root from CMS surface fields. */
export function surfaceClasses(input: {
	background?: unknown;
	text?: unknown;
	divider?: unknown;
}): string[] {
	const background = normalizeSurfaceColor(input.background);
	const text = normalizeTextColor(input.text, background);
	const divider = normalizeSurfaceDivider(input.divider);
	return [`bg-${background}`, `text-${text}`, `divider-${divider}`];
}

/** EmDash select field for background — paste into any block that needs it. */
export function backgroundCmsField(overrides: Record<string, unknown> = {}) {
	return {
		slug: "background",
		label: "Background",
		type: "select",
		defaultValue: SURFACE_DEFAULTS.background,
		validation: { options: [...SURFACE_COLORS] },
		...overrides,
	};
}

/** EmDash select field for text colour. Empty = derive from background. */
export function textColorCmsField(overrides: Record<string, unknown> = {}) {
	return {
		slug: "text_color",
		label: "Text colour (leave blank to match background)",
		type: "select",
		validation: { options: [...SURFACE_COLORS] },
		...overrides,
	};
}

/** EmDash select field for section edge dividers. */
export function dividerCmsField(overrides: Record<string, unknown> = {}) {
	return {
		slug: "divider",
		label: "Section divider",
		type: "select",
		defaultValue: SURFACE_DEFAULTS.divider,
		validation: { options: [...SURFACE_DIVIDERS] },
		...overrides,
	};
}

/** All three surface fields, in editor order. */
export function surfaceCmsFields() {
	return [backgroundCmsField(), textColorCmsField(), dividerCmsField()];
}
