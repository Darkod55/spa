/**
 * Canonical org identity for JSON-LD / NAP consistency.
 * Keep in sync with contact panel + footer socials.
 */
export const organization = {
	name: "The Square Peg Agency",
	legalName: "THE SQUARE PEG AGENCY LIMITED",
	/** Companies House registration number */
	companyNumber: "17035981",
	email: "hello@thesquarepeg.agency",
	address: {
		streetAddress: "71-75 Shelton Street",
		addressLocality: "London",
		addressRegion: "England",
		postalCode: "WC2H 9JQ",
		addressCountry: "GB",
	},
	/**
	 * Official profiles + registry — used as Organization.sameAs.
	 * Prefer the public LinkedIn slug when it resolves; numeric URL is the site link.
	 */
	sameAs: [
		"https://www.linkedin.com/company/the-square-peg-agency",
		"https://www.linkedin.com/company/94275355/",
		"https://www.facebook.com/thesquarepegagency",
		"https://www.instagram.com/thesquarepegagency/",
		"https://find-and-update.company-information.service.gov.uk/company/17035981",
	],
} as const;
