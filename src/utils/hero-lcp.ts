import type { ImageMetadata } from "astro";
import { getImage } from "astro:assets";

export type HeroLcpVariant = "home" | "page";

/** Shared with Hero.astro so preload srcset matches the rendered <img>. */
export const HERO_LCP_WIDTHS = [640, 960, 1280, 1600] as const;
export const HERO_LCP_QUALITY = 78;

export function heroLcpSizes(variant: HeroLcpVariant = "page"): string {
	return variant === "home"
		? "(min-width: 768px) 52vw, 100vw"
		: "(min-width: 768px) 46vw, 100vw";
}

/**
 * Build an early <link rel="preload"> for the page LCP hero photo.
 * Call from BaseLayout so the browser starts the fetch before body/chrome parse.
 */
export async function getHeroLcpPreload(
	image: ImageMetadata,
	variant: HeroLcpVariant = "page",
) {
	const sizes = heroLcpSizes(variant);
	const optimized = await getImage({
		src: image,
		widths: [...HERO_LCP_WIDTHS],
		sizes,
		format: "webp",
		quality: HERO_LCP_QUALITY,
	});

	return {
		href: optimized.src,
		imagesrcset: optimized.srcSet.attribute || undefined,
		imagesizes: sizes,
	};
}
