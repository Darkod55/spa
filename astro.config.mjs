import node from "@astrojs/node";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import icon from "astro-iconset";
import { defineConfig, fontProviders } from "astro/config";
import { satteri } from "@astrojs/markdown-satteri";
import emdash, { local } from "emdash/astro";
import { sqlite } from "emdash/db";
import { rehypeWrapTables } from "./src/utils/rehype-wrap-tables.ts";

export default defineConfig({
	// Absolute URLs for canonical / Open Graph when SITE_URL or PUBLIC_SITE_URL is set
	site: process.env.SITE_URL || process.env.PUBLIC_SITE_URL,
	output: "server",
	adapter: node({
		mode: "standalone",
	}),
	markdown: {
		processor: satteri({
			hastPlugins: [rehypeWrapTables()],
		}),
	},
	image: {
		layout: "constrained",
		responsiveStyles: true,
	},
	integrations: [
		react(),
		mdx(),
		icon({
			// Only ship the Phosphor icons actually referenced in templates,
			// not the full @iconify-json/ph set.
			include: {
				ph: [
					"arrow-right",
					"bell-simple",
					"buildings",
					"chart-bar",
					"chat-circle",
					"check",
					"check-circle",
					"clock",
					"cloud",
					"code",
					"currency-dollar",
					"envelope",
					"file-text",
					"gauge",
					"globe",
					"heart",
					"leaf",
					"lifebuoy",
					"lightning",
					"list",
					"lock",
					"map-pin",
					"pause",
					"phone",
					"play",
					"plug",
					"plus",
					"shield-check",
					"sparkle",
					"star",
					"sun",
					"thermometer-simple",
					"trend-up",
					"users-three",
					"x",
				],
			},
		}),
		emdash({
			database: sqlite({ url: "file:./data.db" }),
			storage: local({
				directory: "./uploads",
				baseUrl: "/_emdash/api/media/file",
			}),
		}),
	],
	fonts: [
		{
			provider: fontProviders.google(),
			name: "Inter",
			cssVariable: "--font-body",
			weights: [400, 500, 600, 700],
			fallbacks: ["sans-serif"],
		},
		{
			provider: fontProviders.google(),
			name: "Instrument Serif",
			cssVariable: "--font-display",
			weights: [400],
			styles: ["normal", "italic"],
			fallbacks: ["serif"],
		},
	],
	devToolbar: { enabled: false },
});
