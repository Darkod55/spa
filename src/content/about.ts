/**
 * About page content — passed as props into theme section components.
 */
import londonEyePortrait from "../assets/images/about/london-eye-portrait.webp";
import undergroundRoundel from "../assets/images/about/underground-roundel.webp";
import {
	aboutIntro as aboutIntroData,
	aboutVisible as aboutVisibleData,
} from "../data/about";

export const aboutMeta = {
	title: "About The Square Peg Agency",
	description:
		"Meet The Square Peg Agency — the team and approach behind strategy-led marketing for addiction, mental health, behavioural health and wellness organisations.",
};

export const aboutHero = {
	variant: "page" as const,
	background: "primary" as const,
	label: "Who We Are",
	title: "All about The Square Peg Agency",
	highlight: "The Square Peg Agency",
	subtitle: "The agency, the team and why we do things differently.",
	image: londonEyePortrait,
	imageAlt: "The London Eye against a bright sky",
	imagePosition: "35% 40%",
	imageFilter: "none" as const,
	divider: true,
	dividerTo: "white" as const,
};

export { aboutIntroData as aboutIntro };

export const aboutVisible = {
	...aboutVisibleData,
	image: undergroundRoundel,
	imageAlt:
		"A London Underground roundel in colour against monochrome brickwork at St Pancras",
	imagePosition: "50% 45%",
};
