// Small helpers for drawing on canvases from Svelte.

/** use:paint={fn} – calls fn(canvas) now and whenever fn changes */
export function paint(canvas, fn) {
	const run = (f) => f && f(canvas);
	run(fn);
	return { update: run };
}

/** A painter that puts a whole ImageData on the canvas */
export const putImage = (img) => (canvas) => {
	if (!img) return;
	canvas.width = img.width;
	canvas.height = img.height;
	canvas.getContext('2d').putImageData(img, 0, 0);
};

/** A painter that puts just one rectangle of an ImageData on the canvas (for close-ups) */
export const putCrop = (img, x, y, w, h) => (canvas) => {
	if (!img) return;
	canvas.width = w;
	canvas.height = h;
	canvas.getContext('2d').putImageData(img, -x, -y, x, y, w, h);
};
