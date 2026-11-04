/**
 * Active nav match: "/" is exact only; other paths match themselves and sub-paths.
 */
export function isActive(pathname: string, href: string): boolean {
	const path = pathname.replace(/\/+$/, "") || "/";
	const target = href.replace(/\/+$/, "") || "/";
	if (target === "/") return path === "/";
	return path === target || path.startsWith(`${target}/`);
}
