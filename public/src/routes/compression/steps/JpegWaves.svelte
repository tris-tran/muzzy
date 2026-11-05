<script>
	// JPEG stage 3, part 1: before the 64 patterns, the same idea on one row of 8 pixels.
	// Any row can be made by mixing 8 standard waves; add them one by one and watch the mix match.
	import JpegPage from '../components/JpegPage.svelte';
	import { jpeg } from '../components/jpegState.svelte.js';
	import { dct1, idct1, waveAt } from '../components/jpeg.js';

	// The row of our tile with the most going on in it
	let rowIndex = $derived.by(() => {
		if (!jpeg.tile) return 0;
		let best = 0;
		let bestSpread = -1;
		for (let r = 0; r < 8; r++) {
			const row = jpeg.tile.pixels.slice(r * 8, r * 8 + 8);
			const spread = Math.max(...row) - Math.min(...row);
			if (spread > bestSpread) [best, bestSpread] = [r, spread];
		}
		return best;
	});
	let row = $derived(jpeg.tile ? jpeg.tile.pixels.slice(rowIndex * 8, rowIndex * 8 + 8) : null);
	let amounts = $derived(row ? dct1(row) : []);
	let biggest = $derived(Math.max(1, ...amounts.map((a) => Math.abs(a))));

	let used = $state(1); // how many waves are mixed in
	let mix = $derived(row ? idct1(amounts, used) : []);
	let close = $derived(row ? mix.reduce((s, v, i) => s + Math.abs(v - row[i]), 0) / 8 : 0);

	// The chart: positions of the 8 pixels, and brightness from 0 (bottom) to 255 (top)
	const X = (x) => 30 + x * 43;
	const Y = (v) => 165 - (Math.max(-20, Math.min(275, v)) / 255) * 150;
	// The mix as a smooth curve: the waves really are smooth, the pixels sit on them
	let curve = $derived.by(() => {
		if (!row) return '';
		const pts = [];
		for (let t = -0.5; t <= 7.5; t += 0.1) {
			let v = 128;
			for (let k = 0; k < used; k++) v += (k === 0 ? Math.sqrt(1 / 8) : Math.sqrt(2 / 8)) * amounts[k] * waveAt(k, t);
			pts.push(`${X(t).toFixed(1)},${Y(v).toFixed(1)}`);
		}
		return pts.join(' ');
	});

	// A little drawing of each wave
	const spark = (k) =>
		Array.from({ length: 41 }, (_, i) => {
			const t = -0.5 + (i / 40) * 8;
			return `${(i * 1.8).toFixed(1)},${(13 - waveAt(k, t) * 10).toFixed(1)}`;
		}).join(' ');
	const waveName = (k) => (k === 0 ? 'Flat' : `Wave ${k}`);
	const waveSub = (k) =>
		k === 0 ? 'the overall brightness' : k === 1 ? 'one slow change' : k === 7 ? 'the fastest wiggle' : 'wiggles faster';
	const grey = (v) => {
		const g = Math.round(Math.max(0, Math.min(255, v)));
		return `rgb(${g} ${g} ${g})`;
	};

	let run = 0;
	async function addAll() {
		const id = ++run;
		const slow = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.1 : 1;
		for (let k = used + 1; k <= 8; k++) {
			await new Promise((r) => setTimeout(r, 650 * slow));
			if (id !== run) return;
			used = k;
		}
	}
	function addOne() {
		run++;
		used = Math.min(8, used + 1);
	}
	function restart() {
		run++;
		used = 1;
	}
</script>

<JpegPage n={3} part="part 1 of 3" title="Any row of pixels is a mix of waves">
	{#snippet lede()}
		<p>
			This is the clever part of JPEG, so let's go slowly. Forget the whole tile for a moment and take just
			<strong>one row</strong> of it: 8 pixels, from dark to light. Can we describe it a smarter way?
		</p>
	{/snippet}

	<div class="jp-panel">
		{#if row}
			<div class="waves-stage">
				<div class="left">
					<svg class="chart" viewBox="0 0 360 180" role="img" aria-label="The row's brightness, and the mix of waves so far">
						<line class="axis" x1="10" x2="350" y1={Y(0)} y2={Y(0)} />
						<line class="axis soft" x1="10" x2="350" y1={Y(255)} y2={Y(255)} />
						<text x="352" y={Y(0) + 4}>black</text>
						<text x="352" y={Y(255) + 4}>white</text>
						<polyline class="target" points={row.map((v, i) => `${X(i)},${Y(v)}`).join(' ')} />
						<polyline class="mix" points={curve} />
						{#each row as v, i (i)}
							<circle class="target-dot" cx={X(i)} cy={Y(v)} r="5" />
							<circle class="mix-dot" cx={X(i)} cy={Y(mix[i])} r="3.2" />
						{/each}
					</svg>
					<div class="strips">
						<span class="strip-label">The row</span>
						<div class="strip">{#each row as v, i (i)}<i style="background: {grey(v)}"></i>{/each}</div>
						<span class="strip-label mix-label">The mix</span>
						<div class="strip">{#each mix as v, i (i)}<i style="background: {grey(v)}"></i>{/each}</div>
					</div>
					<p class="status">
						{used} of 8 waves ·
						{#if close < 1}<strong class="exact">a perfect match</strong>
						{:else}off by {close.toFixed(0)} on average{/if}
					</p>
				</div>

				<ol class="wave-list">
					{#each amounts as a, k (k)}
						<li class:off={k >= used}>
							<svg viewBox="-2 0 76 26" aria-hidden="true"><polyline points={spark(k)} /></svg>
							<span class="wname"><strong>{waveName(k)}</strong><span>{waveSub(k)}</span></span>
							<span class="amount" class:neg={a < 0}>
								{#if k < used}
									<i style="width: {(Math.abs(a) / biggest) * 100}%"></i>
									<b>{Math.round(a)}</b>
								{/if}
							</span>
						</li>
					{/each}
				</ol>
			</div>
			<div class="jp-controls">
				<button class="jp-btn main" onclick={addOne} disabled={used >= 8}>+ Add the next wave</button>
				<button class="jp-btn" onclick={addAll} disabled={used >= 8}>Add them all</button>
				<button class="jp-btn" onclick={restart} disabled={used === 1}>Start over</button>
			</div>
		{:else}
			<p class="jp-loading">Getting the picture ready…</p>
		{/if}
	</div>

	<div class="jp-notes">
		<p>
			<strong>8 standard waves.</strong> The first is flat: it just sets the average brightness. The next
			goes from one side to the other once, and each one after that wiggles a bit faster. Mix them in the
			right amounts, and you can make <em>any</em> row of 8 pixels. Exactly.
		</p>
		<p>
			<strong>So a row can be written as 8 amounts</strong> instead of 8 pixels. Same number of numbers,
			nothing lost. A negative amount just means the wave is flipped upside down.
		</p>
		<p>
			<strong>Look at the amounts.</strong> The first few waves are big and do almost all the work. The fast
			wiggles add very little. In photos that's nearly always true, because neighbouring pixels tend to be
			similar. Remember that: it's the whole trick.
		</p>
	</div>
</JpegPage>

<style>
	.waves-stage {
		display: grid;
		grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
		gap: 1.5rem;
		align-items: center;
	}
	.left {
		display: grid;
		gap: 0.6rem;
	}
	.chart {
		width: 100%;
		max-width: 26rem;
		justify-self: center;
		overflow: visible;
	}
	.chart text {
		font-size: 10px;
		fill: var(--muted);
	}
	.axis {
		stroke: var(--track-strong);
		stroke-width: 1;
	}
	.axis.soft {
		stroke-dasharray: 3 4;
	}
	.target {
		fill: none;
		stroke: var(--track-strong);
		stroke-width: 2;
		stroke-dasharray: 4 4;
	}
	.target-dot {
		fill: var(--card);
		stroke: var(--ink);
		stroke-width: 2;
	}
	.mix {
		fill: none;
		stroke: var(--accent);
		stroke-width: 2.5;
		transition: d 0.3s;
	}
	.mix-dot {
		fill: var(--accent);
		transition: cy 0.4s ease;
	}
	.strips {
		display: grid;
		grid-template-columns: auto auto;
		justify-content: center;
		align-items: center;
		gap: 0.35rem 0.8rem;
	}
	.strip-label {
		font-size: 0.78rem;
		color: var(--ink-soft);
		text-align: right;
	}
	.mix-label {
		color: var(--accent);
	}
	.strip {
		display: flex;
		border-radius: 4px;
		overflow: hidden;
		border: var(--bw) solid var(--line);
	}
	.strip i {
		width: 1.9rem;
		height: 1.5rem;
		transition: background 0.4s;
	}
	.status {
		margin: 0;
		text-align: center;
		font-size: 0.88rem;
		color: var(--ink-soft);
	}
	.exact {
		color: var(--good);
	}

	/* The waves, with their amounts */
	.wave-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.2rem;
	}
	.wave-list li {
		display: grid;
		grid-template-columns: 4.2rem 7.2rem minmax(0, 1fr);
		align-items: center;
		gap: 0.6rem;
		padding: 0.18rem 0.4rem;
		border-radius: var(--radius-sm);
		transition:
			opacity 0.3s,
			background 0.3s;
	}
	.wave-list li:not(.off) {
		background: var(--accent-soft);
	}
	.wave-list li.off {
		opacity: 0.4;
	}
	.wave-list svg {
		width: 4.2rem;
		height: 1.5rem;
	}
	.wave-list polyline {
		fill: none;
		stroke: var(--ink);
		stroke-width: 1.6;
	}
	.wname {
		display: grid;
		line-height: 1.15;
	}
	.wname strong {
		font-size: 0.85rem;
	}
	.wname span {
		font-size: 0.72rem;
		color: var(--ink-soft);
	}
	.amount {
		position: relative;
		display: flex;
		align-items: center;
		height: 1.3rem;
	}
	.amount i {
		position: absolute;
		left: 0;
		top: 0.25rem;
		bottom: 0.25rem;
		border-radius: 3px;
		background: var(--accent);
		opacity: 0.35;
		animation: grow 0.4s ease-out;
		transform-origin: left;
	}
	.amount.neg i {
		background: var(--bad);
	}
	.amount b {
		position: relative;
		margin-left: 0.4rem;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		font-weight: normal;
	}
	@keyframes grow {
		from {
			transform: scaleX(0);
		}
	}

	@media (max-width: 860px) {
		.waves-stage {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.amount i {
			animation: none;
		}
	}
</style>
