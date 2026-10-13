<script>
	// Sound as moving air (canvas 2D): a cone on the left pushes and pulls, the air in front of it
	// bunches up (compression) and spreads out (rarefaction), and that pattern travels right.
	// One bit of air is marked in red: it only wiggles in place, it never travels with the sound.
	// Below, the same thing as the familiar wave line: air pressure along the way.
	//   pitch   – 1 (low) … 6 (high): how many waves fit across
	//   volume  – 0 … 1: how far the cone moves
	//   playing – pause with false
	import { onMount } from 'svelte';

	let { pitch = 2.5, volume = 0.6, playing = true, height = '20rem' } = $props();

	let canvas;

	onMount(() => {
		const ctx = canvas.getContext('2d');
		const css = getComputedStyle(canvas);
		const color = (name) => css.getPropertyValue(name).trim();
		const ink = color('--ink'),
			soft = color('--ink-soft'),
			accent = color('--accent'),
			red = color('--bad'),
			line = color('--line');

		const SPEED = 140; // px per second: the speed of sound here, the same at any pitch
		const SPACING = 9;
		const X0 = 78; // where the cone sits at rest

		let W = 0,
			H = 0,
			dots = [],
			tracked = null;

		// Fixed-seed jitter so the air looks natural but stays the same each time
		function layout() {
			const ratio = Math.min(devicePixelRatio, 2);
			W = canvas.clientWidth;
			H = canvas.clientHeight;
			canvas.width = W * ratio;
			canvas.height = H * ratio;
			ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

			let seed = 11;
			const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
			const top = 18,
				bottom = H * 0.6;
			dots = [];
			for (let y = top; y <= bottom; y += SPACING)
				for (let x = X0 + 14; x < W - 6; x += SPACING)
					dots.push({ x: x + (rand() - 0.5) * 5, y: y + (rand() - 0.5) * 5 });
			const midRow = top + Math.round((bottom - top) / 2 / SPACING) * SPACING;
			tracked = dots.reduce((best, d) =>
				Math.hypot(d.x - W / 2, d.y - midRow) < Math.hypot(best.x - W / 2, best.y - midRow) ? d : best
			);
		}

		let t = 0,
			last = performance.now(),
			frame,
			visible = true;

		function draw(now) {
			frame = requestAnimationFrame(draw);
			const dt = Math.min((now - last) / 1000, 0.05);
			last = now;
			if (!visible) return;
			if (playing) t += dt;

			const lambda = (W - X0) / pitch; // wavelength in px
			const k = (Math.PI * 2) / lambda;
			const w = k * SPEED;
			const A = volume * Math.min(lambda * 0.12, 14);
			const shift = (x) => A * Math.sin(k * (x - X0) - w * t); // how far air at x is pushed
			const pressure = (x) => -Math.cos(k * (x - X0) - w * t); // -1 … 1, + = squeezed

			const top = 10,
				bottom = H * 0.6 + 10,
				mid = (top + bottom) / 2;
			ctx.clearRect(0, 0, W, H);

			// Pressure shading behind the air
			for (let x = X0; x < W; x += 4) {
				const p = pressure(x) * volume;
				if (p <= 0) continue;
				ctx.globalAlpha = p * 0.16;
				ctx.fillStyle = accent;
				ctx.fillRect(x, top, 4, bottom - top);
			}
			ctx.globalAlpha = 1;

			// The air
			ctx.fillStyle = soft;
			for (const d of dots) {
				if (d === tracked) continue;
				ctx.beginPath();
				ctx.arc(d.x + shift(d.x), d.y, 1.6, 0, Math.PI * 2);
				ctx.fill();
			}
			// The one bit of air we follow, and its home spot
			ctx.strokeStyle = red;
			ctx.globalAlpha = 0.35;
			ctx.beginPath();
			ctx.moveTo(tracked.x, tracked.y - 9);
			ctx.lineTo(tracked.x, tracked.y + 9);
			ctx.stroke();
			ctx.globalAlpha = 1;
			ctx.fillStyle = red;
			ctx.beginPath();
			ctx.arc(tracked.x + shift(tracked.x), tracked.y, 4, 0, Math.PI * 2);
			ctx.fill();

			// The speaker: magnet block and a cone whose face moves with the air next to it
			const face = X0 + shift(X0);
			ctx.fillStyle = ink;
			ctx.fillRect(8, mid - 16, 18, 32);
			ctx.beginPath();
			ctx.moveTo(26, mid - 9);
			ctx.lineTo(face, top + 4);
			ctx.lineTo(face, bottom - 4);
			ctx.lineTo(26, mid + 9);
			ctx.closePath();
			ctx.globalAlpha = 0.85;
			ctx.fill();
			ctx.globalAlpha = 1;
			ctx.fillRect(face - 2, top, 4, bottom - top);

			// Pressure as a line
			const cMid = H * 0.82,
				cAmp = H * 0.11;
			ctx.strokeStyle = line;
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(X0, cMid);
			ctx.lineTo(W - 6, cMid);
			ctx.stroke();
			ctx.strokeStyle = accent;
			ctx.lineWidth = 2.5;
			ctx.beginPath();
			for (let x = X0; x < W - 6; x += 3) {
				const y = cMid - pressure(x) * volume * cAmp;
				x === X0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
			}
			ctx.stroke();
			ctx.fillStyle = soft;
			ctx.font = '12px ' + color('--font-body');
			ctx.textAlign = 'right';
			ctx.fillText('squeezed', X0 - 8, cMid - cAmp + 4);
			ctx.fillText('stretched', X0 - 8, cMid + cAmp + 4);
		}

		const ro = new ResizeObserver(layout);
		ro.observe(canvas);
		layout();
		const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
		io.observe(canvas);
		frame = requestAnimationFrame(draw);

		return () => {
			cancelAnimationFrame(frame);
			ro.disconnect();
			io.disconnect();
		};
	});
</script>

<canvas bind:this={canvas} style:height aria-label="Air pushed by a speaker cone, with the pressure wave below"></canvas>

<style>
	canvas {
		display: block;
		width: 100%;
		border-radius: var(--radius-lg);
		background: var(--card);
		border: var(--bw) solid var(--line);
	}
</style>
