/**
 * Services — nav index (overview / homepage pills) and full ServiceBlock entries.
 * Overview and homepage link to `#${id}`; keep ids stable.
 */

import type { ImageMetadata } from "astro";
import phoneBoxRain from "../assets/images/home/phone-box-rain.webp";

export type ServiceNavItem = {
	id: string;
	title: string;
};

/** Quick-links / homepage pill labels + stable anchor ids. */
export const serviceIndex: readonly ServiceNavItem[] = [
	{ id: "strategy", title: "Marketing Strategy" },
	{ id: "brand", title: "Brand Strategy and Design" },
	{ id: "website", title: "Website Design and Development" },
	{ id: "content", title: "Content Marketing and Copywriting" },
	{ id: "social", title: "Social Media Marketing and Management" },
	{ id: "seo", title: "Search Engine Optimisation" },
	{ id: "paid", title: "Paid Advertising" },
	{ id: "email", title: "Email Marketing" },
	{ id: "events", title: "Event and Conference Marketing" },
	{ id: "data", title: "Data, Analytics and Reporting" },
	{ id: "hosting", title: "Website Hosting and Maintenance" },
	{ id: "support", title: "Ongoing Marketing Support" },
] as const;

/** Full service section — drives ServiceBlock. */
export type ServiceItem = {
	id: string;
	number: string;
	title: string;
	tagline: string;
	lead: string;
	body: string[];
	/** "What's included" list — omit when the block uses an image instead. */
	included?: string[];
	cta: { label: string; href: string };
	/** Override auto light-on-dark / primary-on-light CTA. */
	ctaVariant?: "primary" | "light";
	tone: "grey" | "white" | "royal" | "navy";
	reverse: boolean;
	slant: "up" | "down";
	bands?: "none" | "right" | "left";
	listColumns?: 1 | 2;
	/** Banded photo instead of the included card (e.g. ongoing support). */
	image?: ImageMetadata;
	imageAlt?: string;
	imagePosition?: string;
	imageCorners?: "tl-br" | "tl-bl";
};

export const services: ServiceItem[] = [
	{
		id: "strategy",
		number: "01",
		title: "Marketing strategy",
		tagline: "Charting your north star",
		lead: "Effective marketing starts with understanding where you are, knowing where you want to go and what needs to happen to get you there.",
		body: [
			"We work with you to develop practical marketing strategies around your organisation, audiences and objectives, helping you focus on the priorities, opportunities and activities that will build momentum and move your marketing forward with greater clarity and direction.",
		],
		included: [
			"Marketing audits and research",
			"Marketing strategy and planning",
			"Marketing roadmaps",
			"Campaign strategy",
			"Senior marketing leadership",
		],
		cta: { label: "Let's talk strategy", href: "/contact" },
		tone: "grey",
		reverse: false,
		slant: "up",
		bands: "none",
		listColumns: 1,
	},
	{
		id: "brand",
		number: "02",
		title: "Brand strategy and design",
		tagline: "We help you stand out",
		lead: "Your brand's visual identity is often someone's first introduction to your organisation.",
		body: [
			"We create visual identities from scratch or refresh existing branding, by combining thoughtful design with creativity to give your organisation a distinctive presence. From colour and typography to logos and supporting assets, we work with you to create a look that is consistent, recognisable and unmistakably yours.",
		],
		included: [
			"Brand strategy, visual identity and positioning",
			"Brand identity development",
			"Rebranding and brand refreshes",
			"Logo design",
		],
		cta: { label: "Build your brand", href: "/contact" },
		tone: "white",
		reverse: true,
		slant: "down",
		bands: "none",
		listColumns: 1,
	},
	{
		id: "website",
		number: "03",
		title: "Website design and development",
		tagline: "Your hardest-working marketing asset",
		lead: "Your website represents your organisation around the clock, helping people understand what you do, and whether you are the right fit for them.",
		body: [
			"We bring strategy, content, design and development together to create websites that reflect your organisation, support your wider marketing and make it easy for people to take the next step.",
		],
		included: [
			"Website strategy and planning",
			"Responsive website design across mobile, tablet and desktop",
			"Brand-led UX and interface design",
			"Wireframes and interactive prototypes",
			"WordPress website development",
			"Custom website and web application development",
			"Microsites and landing pages",
			"Cross-browser and cross-device compatibility",
		],
		cta: { label: "Discuss your website", href: "/contact" },
		tone: "navy",
		reverse: false,
		slant: "up",
		bands: "right",
		listColumns: 1,
	},
	{
		id: "content",
		number: "04",
		title: "Content marketing and copywriting",
		tagline: "Creating something worth reading",
		lead: "Good content helps people understand who you are, what you know and why they should trust you.",
		body: [
			"We develop content strategies and create useful, relevant content across the channels your audiences use. From thought leadership and long-form articles to website copy and campaign content, everything we produce has a reason for being there.",
		],
		included: [
			"Content strategy and planning",
			"Blogs and articles",
			"White papers and guides",
			"Email and campaign copy",
			"Content repurposing",
			"Website copywriting",
			"Thought leadership",
			"Case studies and success stories",
			"Social media content",
		],
		cta: { label: "Talk to us about content", href: "/contact" },
		tone: "grey",
		reverse: true,
		slant: "down",
		bands: "none",
		listColumns: 2,
	},
	{
		id: "social",
		number: "05",
		title: "Social media marketing and management",
		tagline: "Social media with a purpose",
		lead: "Being active on social media isn't the same as having an effective social media presence.",
		body: [
			"We develop and manage social media around clear objectives, combining strategy, content and creative to build visibility, demonstrate expertise and create meaningful engagement with the people you want to reach.",
		],
		included: [
			"Social media strategy",
			"Content planning",
			"Content creation",
			"Graphic and video content",
			"Social media management",
			"Paid social campaigns",
			"Analytics and reporting",
		],
		cta: { label: "Let's get social", href: "/contact" },
		tone: "white",
		reverse: false,
		slant: "up",
		bands: "none",
		listColumns: 1,
	},
	{
		id: "seo",
		number: "06",
		title: "Search engine optimisation",
		tagline: "Help the right people find you",
		lead: "Search is changing, but the principle remains the same: when people look for the expertise, information, or services you provide, you need to be visible.",
		body: [
			"We improve how your organisation is discovered through traditional search engines and emerging AI search experiences, combining technical optimisation, content and authority-building to strengthen your visibility.",
		],
		included: [
			"SEO strategy",
			"On-page SEO",
			"Local SEO",
			"Link building and digital authority",
			"SEO monitoring and reporting",
			"Keyword and search intent research",
			"Technical SEO",
			"Content optimisation",
			"AI search and generative engine optimisation",
		],
		cta: { label: "Improve your visibility", href: "/contact" },
		tone: "navy",
		reverse: true,
		slant: "down",
		bands: "left",
		listColumns: 2,
	},
	{
		id: "paid",
		number: "07",
		title: "Paid advertising",
		tagline: "Put your marketing in front of the right people",
		lead: "Paid advertising can create visibility quickly, but only when the targeting, message and campaign are right.",
		body: [
			"We plan, create and manage paid campaigns across search and social platforms, continually reviewing performance to make sure your budget is being used effectively.",
		],
		included: [
			"Google, Meta and Microsoft Ads",
			"Campaign strategy and setup",
			"Audience and keyword targeting",
			"Creative and ad copy",
			"Campaign optimisation",
			"Tracking and performance reporting",
		],
		cta: { label: "Talk to us about paid advertising", href: "/contact" },
		tone: "grey",
		reverse: false,
		slant: "up",
		bands: "none",
		listColumns: 1,
	},
	{
		id: "email",
		number: "08",
		title: "Email marketing",
		tagline: "Stay connected with your audience",
		lead: "Email gives organisations a direct way to build relationships with the people who have chosen to hear from them.",
		body: [
			"We develop email strategies and campaigns that keep audiences connected, engaged and up to date, from regular communications to automated journeys built around specific actions and needs.",
		],
		included: [
			"Email marketing strategy",
			"Newsletter development",
			"Automated email journeys",
			"CRM and platform support",
			"Campaign planning and creation",
			"Email copywriting and design",
			"Audience segmentation",
			"Performance analysis",
		],
		cta: { label: "Improve your email marketing", href: "/contact" },
		tone: "white",
		reverse: true,
		slant: "down",
		bands: "none",
		listColumns: 2,
	},
	{
		id: "events",
		number: "09",
		title: "Event and conference marketing",
		tagline: "Build momentum before, during and after the event",
		lead: "A successful event doesn't begin when the doors open or end when they close.",
		body: [
			"We develop marketing strategies and campaigns that build awareness, drive registrations and participation, support sponsors and speakers, and extend the life of your event through content and ongoing engagement.",
		],
		included: [
			"Event marketing strategy and planning",
			"Event branding and promotional materials",
			"Registration and attendance marketing",
			"Speaker, sponsor and exhibitor promotion",
			"Social media and email campaigns",
			"Paid advertising campaigns",
			"Post-event content and engagement",
		],
		cta: { label: "Talk to us about your event", href: "/contact" },
		tone: "navy",
		reverse: false,
		slant: "up",
		bands: "right",
		listColumns: 1,
	},
	{
		id: "data",
		number: "10",
		title: "Data, analytics and reporting",
		tagline: "Understand what's working",
		lead: "Marketing data is useful when it helps you make better decisions.",
		body: [
			"We track and analyse performance across your marketing activity, turning the numbers into useful information about what's working, what isn't and where there are opportunities to improve.",
		],
		included: [
			"Marketing performance tracking and analysis",
			"Website and conversion analytics",
			"Campaign performance reporting",
			"Cross-channel marketing reporting",
			"Marketing dashboards",
			"Performance reviews and recommendations",
		],
		cta: { label: "Make sense of your marketing data", href: "/contact" },
		tone: "grey",
		reverse: true,
		slant: "down",
		bands: "none",
		listColumns: 1,
	},
	{
		id: "hosting",
		number: "11",
		title: "Website hosting and maintenance",
		tagline: "Keep your website working as hard as you do",
		lead: "Launching a website isn't the end of the project. It needs somewhere to live and regular attention to keep it running efficiently.",
		body: [
			"We provide ongoing hosting, maintenance and support to keep websites secure, up to date and performing as they should, while making improvements as your organisation and marketing evolve.",
		],
		included: [
			"Managed website hosting",
			"Website security and monitoring",
			"Website performance monitoring",
			"Website content updates",
			"WordPress core, theme and plugin updates",
			"Website backups",
			"Technical support",
			"Website improvements and enhancements",
		],
		cta: { label: "Look after your website", href: "/contact" },
		tone: "white",
		reverse: false,
		slant: "up",
		bands: "none",
		listColumns: 2,
	},
	{
		id: "support",
		number: "12",
		title: "Ongoing marketing support",
		tagline: "Your marketing team, without building one in-house",
		lead: "Not every organisation needs a full internal marketing department, but that doesn't mean marketing should be fragmented across different suppliers.",
		body: [
			"Our ongoing marketing support brings strategy, creative, digital and delivery together under one team. We can manage your marketing as a whole or work alongside your existing team, providing the additional expertise and capacity you need.",
			"The level of support is tailored to your organisation, priorities and objectives, giving you the expertise and capacity you need as your requirements evolve.",
		],
		cta: { label: "Talk to us about ongoing support", href: "/contact" },
		ctaVariant: "primary",
		tone: "navy",
		reverse: true,
		slant: "up",
		bands: "none",
		image: phoneBoxRain,
		imageAlt:
			"A red telephone box on a rainy Thames embankment, with Big Ben and Westminster Bridge behind",
		imagePosition: "0% 50%",
		imageCorners: "tl-br",
	},
];

/** @deprecated Prefer serviceIndex — kept for any string-list consumers. */
export const serviceItems = serviceIndex.map((item) => item.title);
