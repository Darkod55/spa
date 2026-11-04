/**
 * Home page content — passed as props into theme section components.
 * Edit copy/surfaces here; the page file only composes the sections.
 */
import towerHero from "../assets/images/hero/tower-hero.webp";
import bigBenBw from "../assets/images/home/big-ben-bw.webp";
import {
	beliefs,
	homeCta,
	howWeHelp,
	moreThanAnAgency,
} from "../data/home";
import phoneBoxRain from "../assets/images/home/phone-box-rain.webp";

export const homeMeta = {
	title:
		"Strategic Marketing for Addiction, Mental Health & Wellness | The Square Peg Agency",
	description:
		"The Square Peg Agency provides strategy-led marketing for addiction, mental health, behavioural health and wellness organisations.",
	canonicalPath: "/",
	ogImage: towerHero.src,
	ogImageAlt: "Tower of London on the Thames",
};

export const homeHero = {
	id: "hero",
	variant: "home" as const,
	background: "primary" as const,
	label: "The Square Peg Agency",
	title: "Why fit in when you can stand out?",
	highlight: "stand out?",
	subtitle:
		"Strategic marketing for organisations in the addiction, mental health, behavioural health and wellness sectors.",
	image: towerHero,
	imageAlt: "Tower of London on the Thames",
	imagePosition: "55% 42%",
	imageFilter: "none" as const,
	primaryCta: {
		label: "Book a discovery call",
		href: "/contact",
	},
	secondaryCta: {
		label: "How we help",
		href: "/services",
	},
	divider: true,
	dividerTo: "white" as const,
};

export const homeIntro = {
	id: "intro",
	statement:
		"You don't need another marketing agency. You need one that understands the sectors you work in and the people you serve.",
	highlight: "understands the sectors you work in",
	body: "Choosing the right marketing agency isn't just about websites, content or social media. It's about finding a team that can communicate your expertise, strengthen your reputation and help your organisation grow in a way that reflects your values.",
	emphasis:
		"At The Square Peg Agency, that's exactly what we help organisations achieve.",
	showGraphic: true,
	graphicScheme: "navy" as const,
	animate: true,
};

export const homeBetterUnderstanding = {
	id: "better-understanding",
	background: "tertiary" as const,
	textColor: "white" as const,
	divider: "slant-top" as const,
	imageSide: "right" as const,
	showSlash: true,
	title: "Better understanding creates better marketing",
	lead: "In sectors where credibility, ethics and reputation matter, effective marketing is about more than visibility. It's about building trust, demonstrating expertise and helping the right people find you.",
	cta: {
		label: "Book a discovery call",
		href: "/contact",
	},
	image: bigBenBw,
	imageAlt:
		"Big Ben and the Houses of Parliament from Westminster Bridge, in black and white",
	imagePosition: "100% 50%",
	imageCorners: "tl-br" as const,
	imageFilter: "none" as const,
};

export const homeBeliefs = {
	id: "what-we-stand-for",
	title: "What we {stand for}",
	intro:
		"Three beliefs shape every strategy, website and campaign we create.",
	items: beliefs,
};

export const homeHowWeHelp = {
	id: "how-we-help",
	...howWeHelp,
};

export const homeMoreThanAnAgency = {
	id: "more-than-an-agency",
	title: moreThanAnAgency.title,
	lead: moreThanAnAgency.lead,
	body: moreThanAnAgency.body,
	image: phoneBoxRain,
	imageAlt: moreThanAnAgency.image.alt,
	imagePosition: moreThanAnAgency.image.position,
};

export const homeCtaSection = {
	...homeCta,
};
