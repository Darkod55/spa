/**
 * Contact page content — passed as props into theme section components.
 */
import phoneBoxRain from "../assets/images/home/phone-box-rain.webp";

export const contactMeta = {
	title: "Contact The Square Peg Agency",
	description:
		"Tell us where you are and what you're trying to achieve — The Square Peg Agency will help you work out where to start.",
};

export const contactHero = {
	variant: "page" as const,
	background: "primary" as const,
	label: "Contact us",
	title: "Let's talk",
	highlight: "talk",
	subtitle:
		"Tell us where you are and what you're trying to achieve, and we'll help you work out where to start.",
	image: phoneBoxRain,
	imageAlt:
		"A red telephone box on a rainy Thames embankment, with Big Ben and Westminster Bridge behind",
	imagePosition: "35% 50%",
	imageFilter: "none" as const,
	divider: true,
	dividerTo: "gray" as const,
};

