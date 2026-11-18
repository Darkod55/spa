import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (_context, next) => {
	const response = await next();
	if (!response.headers.has("Server-Timing")) {
		return response;
	}

	const headers = new Headers(response.headers);
	headers.delete("Server-Timing");

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers,
	});
});
