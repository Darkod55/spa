export type NavItem = {
	label: string;
	href: string;
};

export type SocialLink = {
	label: string;
	href: string;
	icon: "linkedin" | "x" | "instagram" | "facebook";
};

/** Header / mobile panel menu */
export const mainNav: NavItem[] = [
	{ label: "Home", href: "/" },
	{ label: "About", href: "/about" },
	{ label: "Services", href: "/services" },
	// Blog hidden for now — restore when ready to publish.
	// { label: "Blog", href: "/blog" },
];

/** Footer menu — same as main, plus Contact */
export const footerNav: NavItem[] = [
	...mainNav,
	{ label: "Contact", href: "/contact" },
];

/** Header primary CTA */
export const headerCta: NavItem = {
	label: "Let's talk",
	href: "/contact",
};

/** Audit bar link — placeholder enquiry URL, easy to change */
export const auditBarLink: NavItem = {
	label: "Book your free website audit",
	href: "/contact?enquiry=website-audit",
};

export const socialLinks: SocialLink[] = [
	{
		label: "LinkedIn",
		href: "https://www.linkedin.com/company/94275355/",
		icon: "linkedin",
	},
	{
		label: "Facebook",
		href: "https://www.facebook.com/thesquarepegagency",
		icon: "facebook",
	},
	{
		label: "Instagram",
		href: "https://www.instagram.com/thesquarepegagency/",
		icon: "instagram",
	},
	// Hidden until a real profile is ready.
	// {
	// 	label: "X",
	// 	href: "https://x.com/PLACEHOLDER",
	// 	icon: "x",
	// },
];

export const legalLinks: NavItem[] = [
	{ label: "Privacy policy", href: "/privacy-policy" },
	{ label: "Terms and Conditions", href: "/terms-and-conditions" },
	{ label: "Sitemap", href: "/sitemap.xml" },
];
