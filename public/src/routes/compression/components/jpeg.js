// The real JPEG maths for one 8×8 tile, kept small and readable (no speed tricks).
// Pixel and recipe arrays are 64 long, row by row: index = row * 8 + column.

/** The standard brightness table from the JPEG spec (quality 50): bigger numbers for busier patterns */
export const LUMA_TABLE = [
	16, 11, 10, 16, 24, 40, 51, 61, 12, 12, 14, 19, 26, 58, 60, 55, 14, 13, 16, 24, 40, 57, 69, 56,
	14, 17, 22, 29, 51, 87, 80, 62, 18, 22, 37, 56, 68, 109, 103, 77, 24, 35, 55, 64, 81, 104, 113,
	92, 49, 64, 78, 87, 103, 121, 120, 101, 72, 92, 95, 98, 112, 100, 103, 99
];

/** The table for a quality from 1 to 100, scaled the way libjpeg does it */
export function table(quality) {
	const q = Math.min(100, Math.max(1, quality));
	const scale = q < 50 ? 5000 / q : 200 - 2 * q;
	return LUMA_TABLE.map((v) => Math.min(255, Math.max(1, Math.floor((v * scale + 50) / 100))));
}

const COS = Array.from({ length: 8 }, (_, x) =>
	Array.from({ length: 8 }, (_, u) => Math.cos(((2 * x + 1) * u * Math.PI) / 16))
);
const C = (u) => (u === 0 ? Math.SQRT1_2 : 1);

/** Pixels (0–255) → the recipe: how much of each of the 64 patterns (the DCT) */
export function dct(pixels) {
	const out = new Array(64);
	for (let v = 0; v < 8; v++) {
		for (let u = 0; u < 8; u++) {
			let sum = 0;
			for (let y = 0; y < 8; y++) {
				for (let x = 0; x < 8; x++) sum += (pixels[y * 8 + x] - 128) * COS[x][u] * COS[y][v];
			}
			out[v * 8 + u] = 0.25 * C(u) * C(v) * sum;
		}
	}
	return out;
}

/** The recipe → pixels again, mixing only the patterns in `use` (all of them if not given) */
export function idct(recipe, use = null) {
	const out = new Array(64);
	for (let y = 0; y < 8; y++) {
		for (let x = 0; x < 8; x++) {
			let sum = 0;
			for (let v = 0; v < 8; v++) {
				for (let u = 0; u < 8; u++) {
					const i = v * 8 + u;
					if (use && !use.has(i)) continue;
					sum += C(u) * C(v) * recipe[i] * COS[x][u] * COS[y][v];
				}
			}
			out[y * 8 + x] = Math.min(255, Math.max(0, Math.round(0.25 * sum + 128)));
		}
	}
	return out;
}

/** One of the 64 patterns, as values from -1 to 1 */
export const pattern = (u, v) =>
	Array.from({ length: 64 }, (_, i) => COS[i % 8][u] * COS[Math.floor(i / 8)][v]);

/** The zigzag reading order: from the smoothest pattern to the busiest */
export const ZIGZAG = (() => {
	const order = [];
	for (let s = 0; s < 15; s++) {
		const rows = [];
		for (let r = Math.max(0, s - 7); r <= Math.min(s, 7); r++) rows.push(r);
		if (s % 2 === 0) rows.reverse();
		for (const r of rows) order.push(r * 8 + (s - r));
	}
	return order;
})();

export const quantize = (recipe, t) => recipe.map((c, i) => Math.round(c / t[i]) || 0);
export const dequantize = (rounded, t) => rounded.map((c, i) => c * t[i]);

/** Colour ↔ brightness + two colour numbers (the JFIF formulas) */
export const toYCbCr = (r, g, b) => [
	0.299 * r + 0.587 * g + 0.114 * b,
	128 - 0.168736 * r - 0.331264 * g + 0.5 * b,
	128 + 0.5 * r - 0.418688 * g - 0.081312 * b
];
export const toRGB = (y, cb, cr) => [
	y + 1.402 * (cr - 128),
	y - 0.344136 * (cb - 128) - 0.714136 * (cr - 128),
	y + 1.772 * (cb - 128)
];

// --- One row of 8 pixels: the same idea in one direction (used to explain the patterns) ---------
const c1 = (k) => (k === 0 ? Math.sqrt(1 / 8) : Math.sqrt(2 / 8));

/** A row of 8 pixels → how much of each of the 8 waves */
export const dct1 = (row) =>
	Array.from(
		{ length: 8 },
		(_, k) => c1(k) * row.reduce((s, p, x) => s + (p - 128) * COS[x][k], 0)
	);

/** The first `n` waves, mixed in their amounts → a row of 8 pixels (not rounded) */
export const idct1 = (amounts, n = 8) =>
	Array.from(
		{ length: 8 },
		(_, x) => 128 + amounts.slice(0, n).reduce((s, a, k) => s + c1(k) * a * COS[x][k], 0)
	);

/** Wave `k` at position x (x can be in between pixels, for drawing smooth curves) */
export const waveAt = (k, x) => Math.cos(((2 * x + 1) * k * Math.PI) / 16);
