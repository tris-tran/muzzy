<script>
	// A sound drawn as a wave line that scrolls past, like on an oscilloscope.
	//   parts   – [cycles across the tile, height 0…1] pairs, added together. One pair is a pure
	//             tone; several make a richer sound. Cycles must be whole numbers so the loop is seamless.
	//   playing – pause with false
	let { parts = [[2, 0.8]], playing = true } = $props();

	const W = 200;
	const H = 80;

	// Draw two tiles' worth, then slide left by one tile, forever
	let d = $derived.by(() => {
		let path = '';
		for (let x = 0; x <= W * 2; x += 2) {
			const y = parts.reduce((sum, [c, a]) => sum + a * Math.sin((x / W) * c * Math.PI * 2), 0);
			path += `${x ? 'L' : 'M'}${x},${(H / 2 - y * (H / 2 - 6)).toFixed(1)}`;
		}
		return path;
	});
</script>

<svg viewBox="0 0 {W} {H}" class:playing aria-hidden="true">
	<line x1="0" y1={H / 2} x2={W} y2={H / 2} />
	<path {d} />
</svg>

<style>
	svg {
		display: block;
		width: 100%;
		height: auto;
		overflow: hidden;
	}
	line {
		stroke: var(--line);
		stroke-width: 1;
	}
	path {
		fill: none;
		stroke: var(--accent);
		stroke-width: 2.5;
		stroke-linejoin: round;
		animation: scroll 2.4s linear infinite paused;
	}
	.playing path {
		animation-play-state: running;
	}
	@keyframes scroll {
		to {
			transform: translateX(-200px);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		path {
			animation: none;
		}
	}
</style>
