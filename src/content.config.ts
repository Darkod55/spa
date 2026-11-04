import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { team } from "./data/team";
import { BLOG_CATEGORIES } from "./utils/blog";

const teamSlugs = team.map((member) => member.slug);

const legal = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/legal" }),
	schema: z.object({
		title: z.string(),
		highlight: z.string().optional(),
		description: z.string(),
		lastUpdated: z.string(),
		effectiveFrom: z.string().optional(),
		intro: z.string().optional(),
		draft: z.boolean().default(false),
		order: z.number().optional(),
	}),
});

const blog = defineCollection({
	loader: glob({
		pattern: "**/*.{md,mdx}",
		base: "./src/content/blog",
	}),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			highlight: z.string().optional(),
			excerpt: z.string(),
			category: z.enum(BLOG_CATEGORIES),
			tags: z.array(z.string()).optional(),
			author: z
				.string()
				.refine((slug) => teamSlugs.includes(slug), {
					message: `Author must be a team slug (${teamSlugs.join(", ")})`,
				}),
			publishDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			cover: image(),
			coverAlt: z.string(),
			coverPosition: z.string().default("center"),
			readingTime: z.string().optional(),
			featured: z.boolean().default(false),
			draft: z.boolean().default(false),
		}),
});

export const collections = { legal, blog };
