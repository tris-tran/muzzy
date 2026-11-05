<script>
	// JPEG stage 4: the losing part. Divide each amount by a number from the table and round it.
	// Point at a number to see the sum; the tile before and after updates with the quality.
	import JpegPage from '../components/JpegPage.svelte';
	import Grid from '../components/Grid.svelte';
	import { jpeg } from '../components/jpegState.svelte.js';
	import * as J from '../components/jpeg.js';

	let recipe = $derived(jpeg.tile ? J.dct(jpeg.tile.pixels) : null);
	let dividers = $derived(J.table(jpeg.quality));
	let rounded = $derived(recipe ? J.quantize(recipe, dividers) : null);
	let left = $derived(rounded ? rounded.filter((v) => v !== 0).length : 0);
	let after = $derived(rounded ? J.idct(J.dequantize(rounded, dividers)) : null);

	let selected = $state(8);
	let a = $derived(recipe ? recipe[selected] : 0);
	let d = $derived(dividers[selected]);
	let r = $derived(rounded ? rounded[selected] : 0);
	const fmt = (n, digits = 1) => (Math.abs(n) < 0.05 ? '0' : n.toFixed(digits));
</script>

<JpegPage n={4} title="Round the recipe off">
	{#snippet lede()}
		<p>
			Here's where JPEG really throws things away. Every amount in the recipe is <strong>divided</strong>
			by a number from a table, and <strong>rounded</strong> to a whole number. Lots of them become 0.
		</p>
	{/snippet}

	<div class="jp-panel">
		{#if recipe}
			<div class="jp-row">
				<figure>
					<Grid values={recipe} kind="amount" {selected} onpick={(i) => (selected = i)} --cell="1.5rem" label="The recipe" />
					<figcaption>The recipe</figcaption>
				</figure>
				<span class="op">÷</span>
				<figure>
					<Grid values={dividers} kind="plain" {selected} onpick={(i) => (selected = i)} --cell="1.5rem" label="The table of dividers" />
					<figcaption>The table <span>quality {jpeg.quality}</span></figcaption>
				</figure>
				<span class="op">=</span>
				<figure>
					<Grid values={rounded} kind="amount" {selected} onpick={(i) => (selected = i)} --cell="1.5rem" label="The rounded recipe" />
					<figcaption>Rounded <span><strong>{left}</strong> of 64 numbers left</span></figcaption>
				</figure>

				<div class="side">
					<div class="sum">
						<p class="calc">
							<span>{fmt(a)}</span> ÷ <span>{d}</span> = <span>{(a / d).toFixed(2)}</span> → <b class:gone={r === 0}>{r}</b>
						</p>
						<p class="back">
							{#if r === 0}
								<strong>Gone.</strong> When the photo is opened, this pattern won't be in it at all.
							{:else}
								Opening the photo: {r} × {d} = <strong>{r * d}</strong> (it was {fmt(a, 0)}). Close
								enough.
							{/if}
						</p>
					</div>
					<div class="compare">
						<figure>
							<Grid values={jpeg.tile.pixels} numbers={false} --cell="0.85rem" label="Our tile" />
							<figcaption><span>before</span></figcaption>
						</figure>
						<figure>
							<Grid values={after} numbers={false} --cell="0.85rem" label="Our tile after rounding" />
							<figcaption><span>after</span></figcaption>
						</figure>
					</div>
				</div>
			</div>
			<div class="jp-controls">
				<label class="jp-quality">
					<span>Quality <strong>{jpeg.quality}</strong></span>
					<input type="range" min="1" max="100" bind:value={jpeg.quality} />
				</label>
			</div>
		{:else}
			<p class="jp-loading">Getting the picture ready…</p>
		{/if}
	</div>

	<div class="jp-notes">
		<p>
			<strong>Dividing and rounding</strong> keeps an amount roughly, in big steps. Divide by 1 and you
			keep it exactly. Divide by 100, and anything smaller than 50 becomes 0. Point at any number to see
			its sum.
		</p>
		<p>
			<strong>The table is the clever bit.</strong> It's part of the JPEG standard: small dividers for the
			smooth patterns (top left), which you'd notice, and big ones for the busy patterns (bottom right),
			which eyes barely see. So fine detail is the first thing to go.
		</p>
		<p>
			<strong>Quality just scales the table.</strong> Lower quality means bigger dividers, more zeros, a
			smaller file and a rougher picture. Try 10, then 90, and watch the zeros and the tile.
		</p>
	</div>
</JpegPage>

<style>
	.side {
		display: grid;
		gap: 0.9rem;
		width: 15rem;
		margin-left: 0.5rem;
	}
	.sum {
		min-height: 6.2rem;
		padding: 0.7rem 0.85rem;
		border-radius: var(--radius);
		background: var(--accent-soft);
	}
	.calc {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.95rem;
	}
	.calc b {
		color: var(--accent);
		font-size: 1.1rem;
	}
	.calc b.gone {
		color: var(--bad);
	}
	.back {
		margin: 0.45rem 0 0;
		font-size: 0.84rem;
		line-height: 1.45;
		color: var(--ink-soft);
	}
	.back strong {
		color: var(--ink);
	}
	.compare {
		display: flex;
		justify-content: center;
		gap: 0.8rem;
	}
	@media (max-width: 1100px) {
		.side {
			margin-left: 0;
		}
	}
</style>
