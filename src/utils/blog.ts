import type { CollectionEntry } from "astro:content";
import type { ImageMetadata } from "astro";
import { team, type TeamMember } from "../data/team";

export const BLOG_CATEGORIES = [
	"Strategy",
	"Branding",
	"Websites",
	"Content",
	"SEO",
	"Paid",
	"Social",
	"Events",
	"Data",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export type BlogPost = CollectionEntry<"blog">;

const teamBySlug = new Map(team.map((member) => [member.slug, member]));

const teamPhotoModules = import.meta.glob<{ default: ImageMetadata }>(
	"../assets/images/team/*.{webp,jpg,jpeg,png}",
	{ eager: true },
);

const teamPhotos = new Map<string, ImageMetadata>();
for (const [path, mod] of Object.entries(teamPhotoModules)) {
	const file = path.split("/").pop() ?? "";
	const slug = file.replace(/\.(webp|jpg|jpeg|png)$/i, "");
	teamPhotos.set(slug, mod.default);
}

export function getTeamMember(slug: string): TeamMember | undefined {
	return teamBySlug.get(slug);
}

export function getTeamPhoto(slug: string): ImageMetadata | undefined {
	return teamPhotos.get(slug);
}

export function formatBlogDate(date: Date): string {
	return new Intl.DateTimeFormat("en-GB", {
		day: "numeric",
		month: "long",
		year: "numeric",
	}).format(date);
}

export function readingTimeFromText(text: string): string {
	const words = text.trim().split(/\s+/).filter(Boolean).length;
	const minutes = Math.max(1, Math.ceil(words / 200));
	return `${minutes} min read`;
}

export function resolveReadingTime(
	explicit: string | undefined,
	body: string | undefined,
): string {
	if (explicit?.trim()) return explicit.trim();
	return readingTimeFromText(body ?? "");
}

export function isPublishedPost(
	entry: BlogPost,
	{ includeDrafts = import.meta.env.DEV }: { includeDrafts?: boolean } = {},
): boolean {
	return includeDrafts || !entry.data.draft;
}

export function sortPostsByDate(a: BlogPost, b: BlogPost): number {
	return b.data.publishDate.valueOf() - a.data.publishDate.valueOf();
}

/** Up to 3 related posts: same category first, then newest others. */
export function relatedPosts(
	current: BlogPost,
	all: BlogPost[],
	limit = 3,
): BlogPost[] {
	const others = all
		.filter((post) => post.id !== current.id && isPublishedPost(post))
		.sort(sortPostsByDate);

	const sameCategory = others.filter(
		(post) => post.data.category === current.data.category,
	);
	const rest = others.filter(
		(post) => post.data.category !== current.data.category,
	);

	return [...sameCategory, ...rest].slice(0, limit);
}

export function blogPostPath(id: string): string {
	return `/blog/${id}`;
}

export const BLOG_PAGE_SIZE = 9;

export function getPublishedPosts(posts: BlogPost[]): BlogPost[] {
	return posts.filter((post) => isPublishedPost(post)).sort(sortPostsByDate);
}

/** Featured post for the archive — explicit flag, else newest. */
export function getFeaturedPost(posts: BlogPost[]): BlogPost | undefined {
	const published = getPublishedPosts(posts);
	return (
		published.find((post) => post.data.featured) ?? published[0]
	);
}

export function filterPostsByCategory(
	posts: BlogPost[],
	category: string | undefined,
): BlogPost[] {
	if (!category) return posts;
	const match = BLOG_CATEGORIES.find(
		(item) => item.toLowerCase() === category.toLowerCase(),
	);
	if (!match) return posts;
	return posts.filter((post) => post.data.category === match);
}

/** Categories that appear on at least one post, in canonical enum order. */
export function getUsedCategories(posts: BlogPost[]): BlogCategory[] {
	const present = new Set(posts.map((post) => post.data.category));
	return BLOG_CATEGORIES.filter((category) => present.has(category));
}

export function paginatePosts<T>(
	items: T[],
	page: number,
	pageSize = BLOG_PAGE_SIZE,
): { items: T[]; page: number; totalPages: number; total: number } {
	const total = items.length;
	const totalPages = Math.max(1, Math.ceil(total / pageSize));
	const safePage = Math.min(Math.max(1, page), totalPages);
	const start = (safePage - 1) * pageSize;
	return {
		items: items.slice(start, start + pageSize),
		page: safePage,
		totalPages,
		total,
	};
}

export function blogIndexPath({
	category,
	page,
}: {
	category?: string;
	page?: number;
} = {}): string {
	const params = new URLSearchParams();
	if (category) params.set("category", category);
	if (page && page > 1) params.set("page", String(page));
	const query = params.toString();
	return query ? `/blog?${query}` : "/blog";
}

/**
 * Compact page list, e.g. 1 2 … 7 8 or 1 … 4 5 6 … 10.
 * Small totals (≤7) show every page.
 */
export function getPaginationRange(
	current: number,
	total: number,
	siblingCount = 1,
): Array<number | "ellipsis"> {
	if (total <= 7) {
		return Array.from({ length: total }, (_, i) => i + 1);
	}

	const pages = new Set<number>([1, total]);

	for (let i = current - siblingCount; i <= current + siblingCount; i++) {
		if (i >= 1 && i <= total) pages.add(i);
	}

	if (current <= 3) {
		pages.add(2);
		pages.add(3);
		pages.add(4);
	}
	if (current >= total - 2) {
		pages.add(total - 3);
		pages.add(total - 2);
		pages.add(total - 1);
	}

	const sorted = [...pages].sort((a, b) => a - b);
	const range: Array<number | "ellipsis"> = [];

	for (let i = 0; i < sorted.length; i++) {
		const page = sorted[i];
		if (page == null) continue;
		const prev = sorted[i - 1];
		if (prev != null && page - prev > 1) range.push("ellipsis");
		range.push(page);
	}

	return range;
}
