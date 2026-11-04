/**
 * Blog archive page content — hero, newsletter, SEO.
 */
import phoneBoxWestminster from "../assets/images/blog/phone-box-westminster.jpg";

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
	image: phoneBoxWestminster,
	imageAlt:
		"A red telephone box on a London street with Westminster in the background",
	imagePosition: "70% 40%",
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
