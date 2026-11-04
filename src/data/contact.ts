import { serviceIndex } from "./services";

export const contactPanel = {
	title: "Get in {touch}",
	intro:
		"Prefer to talk first? Reach us directly — or send a message and we’ll come back to you.",
	details: [
		{
			icon: "email" as const,
			label: "Email",
			value: "hello@thesquarepeg.agency",
			href: "mailto:hello@thesquarepeg.agency",
		},
		// Phone + location hidden until confirmed — restore here when ready.
		// {
		// 	icon: "phone" as const,
		// 	label: "Phone",
		// 	value: "[+44 (0)000 000 0000]",
		// 	href: "tel:+440000000000",
		// },
		// {
		// 	icon: "location" as const,
		// 	label: "Location",
		// 	value: ["[Building / street]", "[Town / city]", "[Postcode]"],
		// },
	],
};

export const contactForm = {
	title: "Send us a {message}",
	intro: "Tell us a little about your organisation and what you need help with.",
	services: [...serviceIndex.map((item) => item.title), "Other"],
	privacyHref: "/privacy-policy",
	submitLabel: "Send message",
};
