/**
 * Blog archive page content — hero, newsletter, SEO.
 */
import phoneBoxRain from "../assets/images/blog/phone-box-rain.webp";

export const blogMeta = {
	title: "Marketing Insights Blog",
	description:
		"Practical thinking on strategy, branding, websites and marketing for organisations in addiction, mental health and wellness.",
};

export const blogHero = {
	variant: "page" as const,
	background: "primary" as const,
	label: "Insights",
	title: "The blog",
	highlight: "blog",
	subtitle:
		"Practical thinking on strategy, branding, websites and marketing for organisations in addiction, mental health and wellness.",
	image: phoneBoxRain,
	imageAlt:
		"A red telephone box on a rainy Thames embankment, with Big Ben and Westminster Bridge behind",
	imagePosition: "0% 50%",
	divider: true,
	dividerTo: "white" as const,
	minHeight: "560px",
};

export const blogNewsletter = {
	title: "Insights in your inbox",
	body: "Get new articles and practical marketing advice for the addiction, mental health and wellness sectors, sent once a month. No spam, unsubscribe at any time.",
	emailLabel: "Email address",
	placeholder: "you@organisation.com",
	submitLabel: "Subscribe",
};
