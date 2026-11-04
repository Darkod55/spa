/**
 * About page content — passed as props into theme section components.
 */
import londonEye from "../assets/images/about/london-eye.webp";
import phoneBoxWestminster from "../assets/images/about/phone-box-westminster.jpg";
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
	label: "About us",
	title: "All about The Square Peg Agency",
	highlight: "The Square Peg Agency",
	subtitle: "The agency, the team and why we do things differently.",
	image: londonEye,
	imageAlt: "The London Eye against a bright sky",
	imagePosition: "0% 62%",
	imageFilter: "none" as const,
	divider: true,
	dividerTo: "white" as const,
};

export { aboutIntroData as aboutIntro };

export const aboutVisible = {
	...aboutVisibleData,
	image: phoneBoxWestminster,
	imageAlt: aboutVisibleData.image.alt,
	imagePosition: aboutVisibleData.image.position,
};
