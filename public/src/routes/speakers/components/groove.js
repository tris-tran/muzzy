// The one "song" every animation plays: a groove that wiggles, swelling louder and quieter.
// Sharing it means the same wiggle shows up as a groove, a current and a sound.

export const WAVELENGTH = 64; // px of groove per wiggle
export const SCROLL = 120; // px of groove passing the needle per second (slowed way down)
export const SOUND = 170; // px per second for pulses of sound in the air
export const MAX_AMP = 17;

export const amp = (u) => 5 + (MAX_AMP - 5) * (0.5 + 0.5 * Math.sin((u / 900) * Math.PI * 2));
export const groove = (u) => amp(u) * Math.sin((u / WAVELENGTH) * Math.PI * 2);

// Pulses of sound for a wiggle read at groove position `u`: one per push (the top of each
// wiggle), each with how far it has travelled since and how strong it was
export function pulses(u, count = 40) {
	const newest = Math.floor(u / WAVELENGTH - 0.25);
	const list = [];
	for (let k = newest; k > newest - count; k--) {
		const born = (k + 0.25) * WAVELENGTH;
		list.push({ k, dist: ((u - born) / SCROLL) * SOUND, strength: amp(born) / MAX_AMP });
	}
	return list;
}

// Calls `tick(px)` every frame with how far the groove moved, while `isPlaying()` is true.
// Returns a function that stops it.
export function animate(tick, isPlaying) {
	let last = performance.now();
	let frame = requestAnimationFrame(function loop(now) {
		if (isPlaying()) tick((Math.min(now - last, 50) / 1000) * SCROLL);
		last = now;
		frame = requestAnimationFrame(loop);
	});
	return () => cancelAnimationFrame(frame);
}
