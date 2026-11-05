// Real gzip, straight from the browser (no libraries): the sizes the explainer shows are genuine.

export async function gzip(text) {
	const stream = new Blob([text]).stream().pipeThrough(new CompressionStream('gzip'));
	return new Uint8Array(await new Response(stream).arrayBuffer());
}

export async function gunzip(bytes) {
	const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
	return await new Response(stream).text();
}

/** How many bytes a text takes (roughly one per letter) */
export const byteSize = (text) => new TextEncoder().encode(text).length;

// One visible character per byte, so the gibberish on screen is exactly as long as the real file
const ranges = [
	[0x21, 0x7e], // ! … ~
	[0xa1, 0xac],
	[0xae, 0xff], // ¡ … ÿ
	[0x391, 0x3a1],
	[0x3a3, 0x3c9], // Greek
	[0x410, 0x44f] // Cyrillic
];
const GLYPHS = ranges.flatMap(([a, b]) =>
	Array.from({ length: b - a + 1 }, (_, i) => String.fromCodePoint(a + i))
);

/** Bytes drawn as gibberish: one character each */
export const glyphs = (bytes) => Array.from(bytes, (b) => GLYPHS[b]).join('');
