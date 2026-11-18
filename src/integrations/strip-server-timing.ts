import type { AstroIntegration } from "astro";

/**
 * Runs as the outermost `pre` middleware (register this integration before
 * EmDash) so it can remove Server-Timing after EmDash attaches it.
 */
export function stripServerTiming(): AstroIntegration {
	return {
		name: "strip-server-timing",
		hooks: {
			"astro:config:setup": ({ addMiddleware }) => {
				addMiddleware({
					entrypoint: new URL(
						"./strip-server-timing-middleware.ts",
						import.meta.url,
					),
					order: "pre",
				});
			},
		},
	};
}
