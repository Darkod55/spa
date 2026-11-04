#!/usr/bin/env node
/**
 * Keeps every CMS block field named `background`, `text_color`, or `divider`
 * in seed/seed.json aligned with src/design/surfaces.json.
 *
 * Run after adding a colour/divider, or before `emdash seed`:
 *   node scripts/sync-surface-fields.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const surfaces = JSON.parse(
	readFileSync(join(root, "src/design/surfaces.json"), "utf8"),
);
const seedPath = join(root, "seed/seed.json");
const seed = JSON.parse(readFileSync(seedPath, "utf8"));

const fieldOptions = {
	background: surfaces.colors,
	text_color: surfaces.colors,
	divider: surfaces.dividers,
};

let patched = 0;

function walkFields(fields) {
	if (!Array.isArray(fields)) return;
	for (const field of fields) {
		const options = fieldOptions[field.slug];
		if (options && field.type === "select") {
			field.validation = { ...(field.validation ?? {}), options: [...options] };
			patched += 1;
		}
		if (field.validation?.subFields) walkFields(field.validation.subFields);
	}
}

for (const blockType of seed.blockTypes ?? []) {
	for (const version of blockType.versions ?? []) {
		walkFields(version.fields);
	}
}

writeFileSync(seedPath, `${JSON.stringify(seed, null, "\t")}\n`);
console.log(`Synced ${patched} surface select field(s) in seed/seed.json`);
