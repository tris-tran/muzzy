<script>
	// How a sound file works, as a flat animated diagram. 1: measure the wave at regular moments
	// (the dots). 2: each measurement is a number, and the list of numbers is the file. 3: to play
	// it, each number becomes a level of electricity for a moment, giving a staircase that follows
	// the wave. More numbers per second → smaller steps → closer to the real wave.
	// Uses the same groove as the other animations, so it's the same wiggle again.
	//   playing – pause with false
	import { onMount } from 'svelte';
	import { groove, MAX_AMP, animate } from './groove.js';

	let { playing = true } = $props();

	const W = 900;
	const H = 356;
	const X0 = 60;
	const X1 = 860;
	const STRETCH = 2.5; // the wave is drawn wider than the groove so the steps are easy to see
	const WINDOW = (X1 - X0) / STRETCH; // px of groove shown
	const TOP = 92; // middle of the measuring panel
	const BOTTOM = 296; // middle of the playback panel
	const SCALE = 3;

	let scroll = $state(0);
	let perScreen = $state(16); // how many measurements fit across the picture

	onMount(() => {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) playing = false;
		return animate((px) => (scroll += px * 0.5), () => playing);
	});

	const xOf = (u) => X0 + (u - scroll) * STRETCH;
	const wavePath = (mid) => {
		let d = '';
		for (let x = X0; x <= X1; x += 3) d += `${x === X0 ? 'M' : 'L'}${x},${(mid - groove(scroll + (x - X0) / STRETCH) * SCALE).toFixed(1)}`;
		return d;
	};

	let top = $derived(wavePath(TOP));
	let bottom = $derived(wavePath(BOTTOM));

	// Measurements sit at fixed spots on the wave, so they slide along with it
	let samples = $derived.by(() => {
		const step = WINDOW / perScreen;
		const list = [];
		for (let k = Math.ceil(scroll / step); k * step <= scroll + WINDOW; k++) {
			const u = k * step;
			const g = groove(u);
			list.push({ k, x: xOf(u), g, n: Math.round((g / MAX_AMP) * 100) });
		}
		return list;
	});
	let spacing = $derived((X1 - X0) / perScreen);

	// Each number held until the next one: the staircase
	let stairs = $derived.by(() => {
		const step = (X1 - X0) / perScreen;
		let d = '';
		samples.forEach((s, i) => {
			const y = (BOTTOM - s.g * SCALE).toFixed(1);
			const x2 = Math.min(X1, s.x + step);
			d += `${i ? 'L' : 'M'}${s.x.toFixed(1)},${y} L${x2.toFixed(1)},${y} `;
		});
		return d;
	});
</script>

<div class="anim">
	<svg viewBox="0 0 {W} {H}" role="img" aria-label="A wave is measured at regular moments; the measurements are numbers; playing them back gives a staircase that follows the wave">
		<g class="labels">
			<text x={X0} y="22">1 · Measure the wave, again and again</text>
			<text x={X0} y="168">2 · Write each measurement down: that list is the file</text>
			<text x={X0} y="232">3 · Play it back: each number becomes a level of electricity</text>
		</g>

		<!-- 1: the wave and its measurements -->
		<line class="axis" x1={X0} y1={TOP} x2={X1} y2={TOP} />
		<path class="wave" d={top} />
		{#each samples as s (s.k)}
			<line class="stem" x1={s.x} y1={TOP} x2={s.x} y2={TOP - s.g * SCALE} />
			<circle class="dot" cx={s.x} cy={TOP - s.g * SCALE} r="4" />
		{/each}

		<!-- 2: the numbers, when there's room for them -->
		{#if spacing >= 34}
			{#each samples as s (s.k)}
				<text class="number" x={s.x} y="192">{s.n}</text>
			{/each}
		{:else}
			<text class="number dense" x={(X0 + X1) / 2} y="192">too many numbers to fit here, which is exactly the point</text>
		{/if}

		<!-- 3: the staircase, over a faint copy of the real wave -->
		<line class="axis" x1={X0} y1={BOTTOM} x2={X1} y2={BOTTOM} />
		<path class="wave faint" d={bottom} />
		<path class="stairs" d={stairs} />
	</svg>

	<div class="file" aria-label="Inside the file">
		<span class="name">song.wav</span>
		<span class="header">label: numbers per second, how many ears</span>
		<span class="data">{samples.map((s) => s.n).join(', ')}, …</span>
	</div>

	<div class="bar">
		<button onclick={() => (playing = !playing)}>{playing ? '❚❚ Pause' : '▶ Play'}</button>
		<label>
			<span>Numbers per second</span>
			<small>few</small>
			<input type="range" min="6" max="120" step="1" bind:value={perScreen} />
			<small>many</small>
		</label>
	</div>
</div>

<style>
	.anim {
		border-radius: var(--radius-lg);
		border: var(--bw) solid var(--line);
		background: var(--card);
		padding: 1rem 1rem 0.9rem;
	}
	svg {
		display: block;
		width: 100%;
		height: auto;
	}
	.labels text {
		font-family: var(--font-body);
		font-size: 15px;
		fill: var(--ink-soft);
	}
	.axis {
		stroke: var(--line);
		stroke-width: 1.5;
	}
	.wave {
		fill: none;
		stroke: var(--track-strong);
		stroke-width: 2.5;
	}
	.wave.faint {
		stroke-dasharray: 4 5;
	}
	.stem {
		stroke: var(--accent-mid);
		stroke-width: 1.5;
	}
	.dot {
		fill: var(--accent);
	}
	.number {
		font-family: var(--font-mono);
		font-size: 13px;
		fill: var(--ink);
		text-anchor: middle;
	}
	.number.dense {
		font-family: var(--font-body);
		font-style: italic;
		fill: var(--muted);
	}
	.stairs {
		fill: none;
		stroke: var(--accent);
		stroke-width: 3;
		stroke-linejoin: round;
	}

	.file {
		display: grid;
		gap: 0.2rem;
		margin-top: 0.4rem;
		padding: 0.7rem 1rem;
		border-radius: var(--radius);
		background: var(--dark);
		color: var(--on-dark);
		font-family: var(--font-mono);
		font-size: 0.8rem;
	}
	.name {
		color: var(--tag);
	}
	.header {
		opacity: 0.6;
	}
	.data {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.bar {
		display: flex;
		align-items: center;
		gap: 1rem 1.5rem;
		flex-wrap: wrap;
		margin-top: 0.8rem;
		font-size: 0.9rem;
		color: var(--ink-soft);
	}
	button {
		font: inherit;
		padding: 0.4rem 1rem;
		border-radius: var(--pill);
		border: var(--bw) solid var(--ink-soft);
		background: none;
		color: var(--ink);
		cursor: pointer;
	}
	label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	label span {
		font-weight: 700;
		color: var(--ink);
	}
	input {
		width: 10rem;
		accent-color: var(--accent);
	}
</style>
