<script>
	// JPEG stage 3, part 3: our tile as a recipe of 64 amounts. Point at a number to see its pattern
	// and what it adds; mix the patterns in, smoothest first, and watch the tile appear.
	import JpegPage from '../components/JpegPage.svelte';
	import PatternChart from '../components/PatternChart.svelte';
	import Grid from '../components/Grid.svelte';
	import { jpeg } from '../components/jpegState.svelte.js';
	import * as J from '../components/jpeg.js';

	let recipe = $derived(jpeg.tile ? J.dct(jpeg.tile.pixels) : null);
	let selected = $state(8); // 0 across, 1 down: the biggest ingredient of our tile (light top, dark bottom)

	let mixed = $state(64); // patterns mixed in, in zigzag order (smooth first)
	let usedSet = $derived(new Set(J.ZIGZAG.slice(0, mixed)));
	let notUsed = $derived(Array.from({ length: 64 }, (_, i) => !usedSet.has(i)));
	let rebuilt = $derived(recipe ? J.idct(recipe, usedSet) : null);

	// What the picked ingredient adds on its own (shown around mid-grey)
	let adds = $derived(recipe ? J.idct(recipe, new Set([selected])) : null);
	let amount = $derived(recipe ? Math.round(recipe[selected]) : 0);
	let across = $derived(selected % 8);
	let down = $derived(Math.floor(selected / 8));
	let says = $derived(
		selected === 0
			? `This is the flat pattern. Its amount sets the overall brightness of the tile.`
			: Math.abs(amount) < 10
				? 'A tiny amount: this pattern barely changes the tile.'
				: amount > 0
					? 'Added as it is.'
					: 'Negative: added flipped, with light and dark swapped.'
	);

	let run = 0;
	async function mixIn() {
		const id = ++run;
		const slow = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.1 : 1;
		for (let k = 1; k <= 64; k++) {
			mixed = k;
			await new Promise((r) => setTimeout(r, (k < 12 ? 420 : 70) * slow));
			if (id !== run) return;
		}
	}
</script>

<JpegPage n={3} part="part 3 of 3" title="Our tile, written as a recipe">
	{#snippet lede()}
		<p>
			Back to our tile. JPEG works out how much of each of the 64 patterns it needs. That list of 64 amounts
			is the <strong>recipe</strong>, and it's stored instead of the pixels.
		</p>
	{/snippet}

	<div class="jp-panel">
		{#if recipe}
			<div class="jp-row recipe-row">
				<figure>
					<PatternChart used={usedSet} {selected} onpick={(i) => (selected = i)} size="12rem" />
					<figcaption>The 64 patterns</figcaption>
				</figure>
				<figure>
					<Grid
						values={recipe}
						kind="amount"
						faded={notUsed}
						{selected}
						onpick={(i) => (selected = i)}
						--cell="1.5rem"
						label="The recipe: how much of each pattern"
					/>
					<figcaption>The recipe <span>same spots as the patterns</span></figcaption>
				</figure>
				<span class="op">→</span>
				<figure>
					<Grid values={rebuilt} numbers={false} --cell="1.5rem" label="The tile, mixed from the patterns so far" />
					<figcaption>Mixed so far <span>{mixed} of 64 patterns</span></figcaption>
				</figure>
			</div>

			<div class="ingredient">
				<Grid values={adds} numbers={false} --cell="0.55rem" label="What the picked pattern adds" />
				<p>
					<strong>Across {across} · Down {down}</strong>, amount
					<b class:neg={amount < 0}>{amount}</b>. {says}
				</p>
			</div>

			<div class="jp-controls">
				<button class="jp-btn main" onclick={mixIn}>▶ Mix them in, smoothest first</button>
				<label class="jp-quality">
					<span>Patterns: <strong>{mixed}</strong></span>
					<input type="range" min="1" max="64" bind:value={mixed} oninput={() => run++} />
				</label>
			</div>
		{:else}
			<p class="jp-loading">Getting the picture ready…</p>
		{/if}
	</div>

	<div class="jp-notes">
		<p>
			<strong>Reading the recipe.</strong> It's laid out exactly like the pattern chart: the number in each
			spot says how much of the pattern in the same spot. Blue means add it, red means add it flipped. The
			stronger the colour, the bigger the amount. Point at any number to see its pattern.
		</p>
		<p>
			<strong>Big numbers top left, tiny ones bottom right.</strong> Our tile is mostly “light on top,
			dark below”, which is what the smooth patterns describe. The busy patterns only add the fine grain.
		</p>
		<p>
			<strong>Still nothing lost.</strong> Mix all 64 and you get our tile back, pixel for pixel. It's the
			same tile, just written differently. But now the important part and the unimportant part are
			separated. And that's what the next stage uses.
		</p>
	</div>
</JpegPage>

<style>
	.recipe-row {
		gap: 1.4rem;
	}
	.ingredient {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.8rem;
		margin-top: 0.6rem;
		min-height: 2.8rem;
	}
	.ingredient p {
		margin: 0;
		max-width: 34rem;
		font-size: 0.9rem;
		line-height: 1.45;
		color: var(--ink-soft);
	}
	.ingredient strong {
		color: var(--ink);
	}
	.ingredient b {
		font-family: var(--font-mono);
		color: var(--accent);
	}
	.ingredient b.neg {
		color: var(--bad);
	}
</style>
