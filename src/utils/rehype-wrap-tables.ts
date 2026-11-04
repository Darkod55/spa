/**
 * Sätteri hast plugin: wraps every <table> in <div class="table-scroll">.
 */
export function rehypeWrapTables() {
	return {
		name: "wrap-tables",
		element: {
			filter: ["table"],
			visit(
				node: unknown,
				ctx: {
					wrapNode: (
						target: unknown,
						parent: {
							type: string;
							tagName: string;
							properties?: Record<string, unknown>;
							children?: unknown[];
						},
					) => void;
				},
			) {
				ctx.wrapNode(node, {
					type: "element",
					tagName: "div",
					properties: { className: ["table-scroll"] },
					children: [],
				});
			},
		},
	};
}
