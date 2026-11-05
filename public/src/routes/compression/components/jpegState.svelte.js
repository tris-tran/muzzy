// Shared by all the JPEG pages: the sunset, split into brightness and colour, the tile we follow,
// a calm sky tile for comparison, and the quality setting (so every page uses the same one).
// Made once, in the browser, by whichever page asks first.
import { paintSunset } from './sunset.js';
import * as J from './jpeg.js';

export const W = 320;
export const H = 200;

export const jpeg = $state({
	quality: 50,
	pictures: null,
	tile: null,
	sky: null
});

let started = false;

export function prepare() {
	if (started) return;
	started = true;

	const c = document.createElement('canvas');
	c.width = W;
	c.height = H;
	const original = paintSunset(c.getContext('2d'), W, H);

	const Y = new Float32Array(W * H);
	const cb = new Float32Array(W * H);
	const cr = new Float32Array(W * H);
	const d = original.data;
	for (let i = 0; i < W * H; i++)
		[Y[i], cb[i], cr[i]] = J.toYCbCr(d[i * 4], d[i * 4 + 1], d[i * 4 + 2]);

	// Colour at half the width and half the height: one value per 2 × 2 pixels
	const half = (arr, x, y) => {
		const x0 = x & ~1;
		const y0 = y & ~1;
		return (
			(arr[y0 * W + x0] +
				arr[y0 * W + x0 + 1] +
				arr[(y0 + 1) * W + x0] +
				arr[(y0 + 1) * W + x0 + 1]) /
			4
		);
	};
	const make = (fn) => {
		const img = new ImageData(W, H);
		for (let y = 0; y < H; y++) {
			for (let x = 0; x < W; x++) {
				const [r, g, b] = fn(x, y, y * W + x);
				const o = (y * W + x) * 4;
				img.data[o] = r;
				img.data[o + 1] = g;
				img.data[o + 2] = b;
				img.data[o + 3] = 255;
			}
		}
		return img;
	};

	// Every tile's 64 brightness numbers, and how much is going on in it
	const tiles = [];
	for (let ty = 0; ty < H / 8; ty++) {
		for (let tx = 0; tx < W / 8; tx++) {
			const pixels = [];
			for (let y = 0; y < 8; y++)
				for (let x = 0; x < 8; x++) pixels.push(Math.round(Y[(ty * 8 + y) * W + tx * 8 + x]));
			const mean = pixels.reduce((s, v) => s + v, 0) / 64;
			tiles.push({
				tx,
				ty,
				pixels,
				busy: pixels.reduce((s, v) => s + (v - mean) ** 2, 0)
			});
		}
	}

	jpeg.pictures = {
		original,
		bright: make((x, y, i) => [Y[i], Y[i], Y[i]]),
		colour: make((x, y) => J.toRGB(150, half(cb, x, y), half(cr, x, y))),
		together: make((x, y, i) => J.toRGB(Y[i], half(cb, x, y), half(cr, x, y)))
	};
	// The tile we follow: the busiest one (where a hill meets the sky). For comparison: the calmest bit of sky.
	jpeg.tile = tiles.reduce((a, b) => (b.busy > a.busy ? b : a));
	jpeg.sky = tiles.filter((t) => t.ty < 8).reduce((a, b) => (b.busy < a.busy ? b : a));
}
