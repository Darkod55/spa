import type { SteppedLabelItem } from "../components/ui/SteppedLabels.astro";

export const aboutIntro = {
	statement:
		"The Square Peg Agency is a specialist marketing agency working across {addiction, mental health and wellness.}",
	disciplines: [
		{ text: "Strategy", tone: "navy" },
		{ text: "Branding", tone: "red" },
		{ text: "Digital", tone: "royal" },
		{ text: "Content", tone: "navy" },
		{ text: "Creative", tone: "red" },
	] satisfies SteppedLabelItem[],
	lead: "We bring strategy, branding, digital, content and creative expertise together to help organisations strengthen their position, reach the right people and grow.",
	body: [
		"Our team combines deep sector understanding with expertise across the full marketing mix. From branding and websites to content, social media, PPC, video and ongoing marketing leadership, we build our marketing plans around what each client actually needs.",
		"We believe the best marketing comes from understanding the organisation behind it. That means getting to know your business, your audience, your ambitions and the problems you are trying to solve, then creating a strategy that has a clear purpose and desired outcome.",
	],
	cta: { label: "See our work", href: "/work" },
};

export const aboutVisible = {
	title: "Marketing should do more than make you {visible}",
	lead: "In addiction, mental health and wellness, marketing has to do more than simply attract attention. It needs to build trust, communicate clearly and reflect the responsibility that comes with speaking to people at vulnerable or critical moments in their lives and the lives of their loved ones.",
	body: [
		"Every decision has meaning. It should strengthen your position, help the right people find you and turn attention into action, while representing your organisation in a way that is credible and true to who you are.",
		"We are not interested in creating content simply to fill a calendar or follow trends. We focus on the things that will strengthen your position, support growth and make a measurable difference.",
	],
	cta: { label: "Contact us", href: "/contact" },
	image: {
		alt: "A red telephone box on a Westminster street, with the Houses of Parliament behind",
		position: "50% 60%",
	},
};

export const aboutCta = {
	id: "work-with-us",
	title: "We're not the right agency for everyone",
	titleSize: "md" as const,
	tagline: "And we're good with that.",
	paragraphs: [
		"We work best with organisations in addiction, mental health and wellness that care about the quality of what they put into the world and want their marketing activity to reflect who they are and to play a meaningful role in their growth.",
		"You know your organisation, your sector and your audience from the inside. We know how to turn that knowledge into stronger positioning, better marketing and meaningful growth on the outside. And that shared commitment matters because, in our experience, the magic happens when both sides are invested.",
	],
	card: {
		text: "If that sounds like the kind of marketing partnership you're looking for, {we'd love to work with you.}",
		cta: { label: "Work with us", href: "/contact" },
	},
};

export const whySpa = {
	title: "Why work with {SPA?}",
	intro:
		"We know that choosing an agency means trusting people with your brand, your reputation and a significant part of your marketing investment, and we take that seriously.",
	listIntro: "When you work with us you get:",
	reasons: [
		"Specialist experience in addiction, mental health and wellness.",
		"Strategy-led, full-service branding and marketing.",
		"Senior expertise across creative, digital and technology.",
		"Straightforward communication and transparent ways of working.",
		"Marketing built around your organisation; not an agency formula.",
	],
	cta: { label: "Want to learn more?", href: "/contact" },
};
