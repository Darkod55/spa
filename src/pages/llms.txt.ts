import type { APIRoute } from "astro";
import { absoluteUrl, resolveSiteOrigin } from "../utils/seo";
import { serviceIndex } from "../data/services";

export const prerender = false;

export const GET: APIRoute = async ({ site, url, request }) => {
	const origin = resolveSiteOrigin({
		configured: site,
		requestOrigin: url.origin,
		headers: request.headers,
	});

	const home = absoluteUrl("/", origin);
	const about = absoluteUrl("/about", origin);
	const services = absoluteUrl("/services", origin);
	const contact = absoluteUrl("/contact", origin);
	const sitemap = absoluteUrl("/sitemap.xml", origin);

	const serviceLines = serviceIndex
		.map((s) => `- [${s.title}](${services}#${s.id})`)
		.join("\n");

	const body = `# The Square Peg Agency

> Strategic marketing for organisations in the addiction, mental health, behavioural health and wellness sectors.

The Square Peg Agency is a UK marketing agency that specialises in strategy-led work for addiction, mental health, behavioural health and wellness organisations. We focus on understanding first, strategy second, and implementation third.

## Key pages

- [Home](${home}): Agency overview and approach
- [About](${about}): Team, values, and how we work
- [Services](${services}): Full list of marketing services
- [Contact](${contact}): Book a discovery call or website audit
- [Sitemap](${sitemap}): Machine-readable list of public URLs

## Services

${serviceLines}

## Contact

Email: hello@thesquarepeg.agency
Website: ${home}
`;

	return new Response(body, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
};
