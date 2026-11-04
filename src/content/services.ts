/**
 * Services page content — passed as props into theme section components.
 */
import bigBenBw from "../assets/images/home/big-ben-bw.webp";
import { serviceIndex } from "../data/services";

export const servicesMeta = {
	title: "Marketing Services for Addiction, Mental Health & Wellness",
	description:
		"Full-service marketing across strategy, brand, websites, content, SEO, paid, email and ongoing support from The Square Peg Agency.",
};

export const servicesHero = {
	variant: "page" as const,
	background: "primary" as const,
	label: "What we do",
	title: "Our services",
	highlight: "services",
	subtitle:
		"Full-service marketing solutions across branding, design, technology and strategy.",
	image: bigBenBw,
	imageAlt:
		"Big Ben and the Houses of Parliament from Westminster Bridge, in black and white",
	imagePosition: "100% 50%",
	imageFilter: "none" as const,
	divider: true,
	dividerTo: "white" as const,
};

export const servicesOverview = {
	title:
		"There are many elements to marketing, but they {shouldn't work independently} of one another.",
	intro:
		"Each has a role to play, and their strength comes from being connected and working towards the same objectives.",
	services: [...serviceIndex],
};

export const servicesCta = {
	title: "Not sure what you need?",
	paragraphs: [
		"You don't need to arrive with a list of services or know exactly what your marketing needs.",
		"Tell us where you are, what you're trying to achieve and what's getting in the way. We'll help you work out where to start and what will make the greatest difference.",
	],
	cta: { label: "Let's start a conversation", href: "/contact" },
};
