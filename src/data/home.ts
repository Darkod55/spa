import { serviceIndex, type ServiceNavItem } from "./services";

export type Belief = {
	number: string;
	title: string;
	lead?: string;
	body: string[];
};

/** Homepage “What we stand for” belief cards — `{word}` = highlight. */
export const beliefs: Belief[] = [
	{
		number: "01",
		title: "We believe {strategy} comes before tactics",
		lead: "Every marketing decision should have a purpose and every activity a role.",
		body: [
			"Whether you're redesigning your website, investing in SEO or planning your next campaign, every activity should support a clear objective. Without a strategy, it's easy to spend time and money on marketing that looks busy but delivers very little.",
			"The most effective marketing isn't created by doing more. It's created by making sure everything works together.",
		],
	},
	{
		number: "02",
		title: "We {specialise} where others generalise",
		body: [
			"At The Square Peg Agency, we work exclusively with organisations in addiction, mental health, behavioural health and wellness sectors. This focus allows us to create stronger marketing strategies and build lasting relationships with the organisations we support.",
			"We believe specialist knowledge leads to better decisions, stronger marketing and better outcomes for our clients. Every strategy we develop, every website we design, and every campaign we create reflects the audiences you serve, the challenges you face, and the goals you're working towards.",
		],
	},
	{
		number: "03",
		title: "We {choose} our clients carefully",
		lead: "The organisations we work with support people through some of life's most challenging experiences. That's a responsibility we take seriously.",
		body: [
			"We work with organisations whose values align with our own and whose work we genuinely believe in. We want the marketing campaigns we create to help the right organisations reach the people who need them most.",
			"That also shapes the way we market. We won't rely on fear, false promises or manipulative messaging to attract attention. We believe trust is earned, and the marketing we create should reflect that.",
		],
	},
];

export type HowWeHelpService = ServiceNavItem | string | { label: string; href?: string };

export const howWeHelp = {
	title: "How {we} help",
	intro:
		"Whether you're launching a new organisation, refreshing your brand or looking for ongoing marketing support, every service we provide is built on the same foundation:",
	steps: [
		"Understanding first",
		"Strategy second",
		"Implementation third",
	],
	outro:
		"Whether you need support with a single project or ongoing marketing, we'll help you choose the services that are right for your organisation, ensuring every marketing activity has a clear purpose and supports your wider strategy.",
	cta: { label: "Explore our services", href: "/services" },
	servicesLabel: "Our services include",
	services: [...serviceIndex] satisfies HowWeHelpService[],
};

export const moreThanAnAgency = {
	title: "More than {an agency}",
	lead: "The best partnerships are built on trust, honesty and open communication, and we work collaboratively with our clients, offering strategic guidance, practical support and honest advice at every stage.",
	body: "When you work with us, we become part of your team, and you'll always know why we're recommending something, how it supports your wider strategy and what we believe success looks like.",
	image: {
		alt: "A red telephone box on a rainy Thames embankment, with Big Ben and Westminster Bridge behind",
		position: "0% 50%",
	},
};

export const homeCta = {
	id: "lets-talk",
	title: "Don't fit the mould? Good.",
	tagline: "Neither do we.",
	paragraphs: [
		"Whether you're launching a new service, strengthening your brand or looking for a trusted marketing partner, we're here to help you communicate with confidence, build trust and achieve your goals.",
		"If you're looking for a marketing agency that values strategy over shortcuts, relationships over transactions and long-term success over quick wins, we'd love to help.",
	],
	card: {
		text: "If that sounds like your organisation, we'd love to {start the conversation.}",
		cta: { label: "Let's talk", href: "/contact" },
	},
};
