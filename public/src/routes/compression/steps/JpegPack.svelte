<script>
	// JPEG stage 5: write the rounded recipe down tightly, losing nothing. Zigzag, "End", short codes.
	// Compare our busy tile with a calm bit of sky.
	import JpegPage from '../components/JpegPage.svelte';
	import Grid from '../components/Grid.svelte';
	import { jpeg } from '../components/jpegState.svelte.js';
	import * as J from '../components/jpeg.js';

	let which = $state('ours'); // 'ours' | 'sky'
	let tile = $derived(which === 'sky' ? jpeg.sky : jpeg.tile);
	let dividers = $derived(J.table(jpeg.quality));
	let rounded = $derived(tile ? J.quantize(J.dct(tile.pixels), dividers) : null);
	let sequence = $derived(rounded ? J.ZIGZAG.map((i) => rounded[i]) : []);
	let packed = $derived(sequence.slice(0, sequence.findLastIndex((v) => v !== 0) + 1));
	const zigzagPoints = J.ZIGZAG.map((i) => `${(i % 8) + 0.5},${Math.floor(i / 8) + 0.5}`).join(' ');
</script>

<JpegPage n={5} title="Pack the numbers tightly">
	{#snippet lede()}
		<p>
			After rounding, the recipe is mostly zeros. The last stage writes it down in as little space as
			possible, and <strong>this part loses nothing</strong>.
		</p>
	{/snippet}

	<div class="jp-panel">
		{#if rounded}
			<div class="switch" role="group" aria-label="Which tile">
				<button class:on={which === 'ours'} onclick={() => (which = 'ours')}>Our tile</button>
				<button class:on={which === 'sky'} onclick={() => (which = 'sky')}>A bit of plain sky</button>
			</div>
			<div class="jp-row pack-row">
				<figure>
					<Grid values={tile.pixels} numbers={false} --cell="0.9rem" label="The tile" />
					<figcaption><span>the tile</span></figcaption>
				</figure>
				<span class="op">→</span>
				{#key which}
					<figure>
						<Grid values={rounded} kind="amount" --cell="1.75rem" label="The rounded recipe, read in a zigzag">
							<svg class="zigzag" viewBox="0 0 8 8" aria-hidden="true">
								<polyline points={zigzagPoints} pathLength="1" />
							</svg>
						</Grid>
						<figcaption>Rounded recipe <span>read in a zigzag</span></figcaption>
					</figure>
					<span class="op">→</span>
					<figure class="list">
						<div class="sequence">
							{#each packed as v, i (i)}
								<span class="num" class:zero={v === 0} style="--i: {i}">{v}</span>
							{/each}
							<span class="num end" style="--i: {packed.length}">End</span>
						</div>
						<figcaption>
							<span class="line">64 numbers → <strong>{packed.length + 1}</strong> things to write down</span>
						</figcaption>
					</figure>
				{/key}
			</div>
		{:else}
			<p class="jp-loading">Getting the picture ready…</p>
		{/if}
	</div>

	<div class="jp-notes">
		<p>
			<strong>1. Zigzag.</strong> The numbers are read in a zigzag, from the smooth patterns to the busy
			ones. The busy ones were mostly rounded to 0, so this way all the zeros pile up at the end.
		</p>
		<p>
			<strong>2. “End”.</strong> Instead of writing out all those zeros, JPEG writes one “End” marker,
			meaning “the rest are all zeros”. A plain bit of sky ends up as almost nothing: its brightness,
			maybe a number or two, and End.
		</p>
		<p>
			<strong>3. Short codes.</strong> Finally everything is written with codes where the most common things
			(small numbers, runs of zeros) get the shortest ones. The same idea as gz and our dictionary from
			before: nothing lost, just written smarter.
		</p>
	</div>
</JpegPage>

<style>
	.switch {
		display: flex;
		width: max-content;
		margin: 0 auto 0.9rem;
		padding: 3px;
		border-radius: var(--pill);
		background: var(--track);
	}
	.switch button {
		font: inherit;
		font-size: 0.85rem;
		padding: 0.3rem 0.85rem;
		border: 0;
		border-radius: var(--pill);
		background: none;
		color: var(--ink-soft);
		cursor: pointer;
	}
	.switch button.on {
		background: var(--card);
		color: var(--ink);
		box-shadow: var(--shadow);
	}
	.pack-row {
		min-height: 16.5rem;
	}
	.zigzag {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}
	.zigzag polyline {
		fill: none;
		stroke: var(--ink);
		stroke-width: 0.05;
		stroke-linejoin: round;
		opacity: 0.45;
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		animation: draw 2.4s ease-in-out forwards;
	}
	@keyframes draw {
		to {
			stroke-dashoffset: 0;
		}
	}
	.list {
		width: 22rem;
		max-width: 100%;
	}
	.sequence {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
		justify-content: center;
	}
	.num {
		min-width: 1.6rem;
		padding: 0.2rem 0.35rem;
		border-radius: 5px;
		text-align: center;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		background: var(--accent-soft);
		color: var(--ink);
		animation: arrive 0.3s ease-out calc(0.4s + var(--i) * 70ms) both;
	}
	.num.zero {
		background: var(--track);
		color: var(--muted);
	}
	.num.end {
		background: var(--ink);
		color: var(--paper);
	}
	@keyframes arrive {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
	}
	figcaption .line {
		font-size: 0.88rem;
		color: var(--ink);
	}
	@media (prefers-reduced-motion: reduce) {
		.zigzag polyline,
		.num {
			animation: none;
			stroke-dashoffset: 0;
		}
	}
</style>
