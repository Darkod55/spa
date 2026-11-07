/**
 * Native `loading="lazy"` thresholds can't be tuned. Warm those images into
 * cache ~1 viewport early so they paint without a blank flash on scroll-in.
 */
const ROOT_MARGIN = "1000px 0px";

function warm(img: HTMLImageElement) {
	if (img.dataset.earlyLazy === "done" || img.complete) {
		img.dataset.earlyLazy = "done";
		return;
	}

	img.dataset.earlyLazy = "done";
	img.loading = "eager";

	const probe = new Image();
	if (img.sizes) probe.sizes = img.sizes;
	if (img.srcset) probe.srcset = img.srcset;
	probe.src = img.currentSrc || img.src;
}

function init() {
	if (!("IntersectionObserver" in window)) return;

	const imgs = document.querySelectorAll<HTMLImageElement>(
		'img[loading="lazy"]:not([data-early-lazy="done"])',
	);
	if (!imgs.length) return;

	const io = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				const img = entry.target as HTMLImageElement;
				warm(img);
				io.unobserve(img);
			}
		},
		{ rootMargin: ROOT_MARGIN, threshold: 0 },
	);

	for (const img of imgs) io.observe(img);
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
	init();
}
