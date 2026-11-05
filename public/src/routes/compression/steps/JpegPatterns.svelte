<script>
	// JPEG stage 3, part 2: from 8 waves to 64 patterns (waves across × waves down). Pick any pattern
	// to see it up close and how it's made.
	import JpegPage from '../components/JpegPage.svelte';
	import PatternChart from '../components/PatternChart.svelte';
	import Grid from '../components/Grid.svelte';
	import { pattern, waveAt } from '../components/jpeg.js';

	let selected = $state(10); // 2 across, 1 down: a gentle checker
	let across = $derived(selected % 8);
	let down = $derived(Math.floor(selected / 8));
	let big = $derived(pattern(across, down).map((p) => 128 + p * 118));
	const grey = (p) => {
		const g = Math.round(128 + p * 118);
		return `rgb(${g} ${g} ${g})`;
	};
	const strip = (k) => Array.from({ length: 8 }, (_, x) => grey(waveAt(k, x)));

	let describe = $derived(
		across === 0 && down === 0
			? 'Completely flat. It only sets how bright the tile is overall.'
			: down === 0
				? `Wave ${across} going across, so the stripes stand up.`
				: across === 0
					? `Wave ${down} going down, so the stripes lie flat.`
					: `Wave ${across} across, crossed with wave ${down} down: a checkerboard.`
	);
</script>

<JpegPage n={3} part="part 2 of 3" title="From 8 waves to 64 patterns">
	{#snippet lede()}
		<p>
			A tile isn't one row, it's 8 rows <em>and</em> 8 columns. So JPEG crosses the waves: one going
			<strong>across</strong>, one going <strong>down</strong>. 8 waves across × 8 waves down makes 64
			patterns.
		</p>
	{/snippet}

	<div class="jp-panel">
		<div class="patterns-stage">
			<figure>
				<PatternChart {selected} onpick={(i) => (selected = i)} size="17rem" axes />
				<figcaption>The 64 patterns <span>point at any of them</span></figcaption>
			</figure>

			<div class="detail">
				<p class="which">Across <strong>{across}</strong> · Down <strong>{down}</strong></p>
				<div class="made">
					<figure>
						<div class="strip across">{#each strip(across) as c, i (i)}<i style="background: {c}"></i>{/each}</div>
						<figcaption><span>wave {across} across</span></figcaption>
					</figure>
					<span class="times">×</span>
					<figure>
						<div class="strip down">{#each strip(down) as c, i (i)}<i style="background: {c}"></i>{/each}</div>
						<figcaption><span>wave {down} down</span></figcaption>
					</figure>
					<span class="times">=</span>
					<figure>
						<Grid values={big} numbers={false} --cell="1.25rem" label="The pattern, up close" />
						<figcaption><span>the pattern</span></figcaption>
					</figure>
				</div>
				<p class="describe">{describe}</p>
			</div>
		</div>
	</div>

	<div class="jp-notes">
		<p>
			<strong>Reading the chart.</strong> Top left is flat. Along the top row the stripes stand up (waves
			going across); down the left side they lie flat (waves going down). Everything in between is a mix of
			both, and the further towards the bottom right, the finer and busier the pattern.
		</p>
		<p>
			<strong>Any tile at all</strong> can be made by mixing these 64 patterns in the right amounts, just
			like the row was made from 8 waves. A sky, an eye, a letter: anything.
		</p>
		<p>
			<strong>They're always the same 64.</strong> Every JPEG ever made uses exactly these patterns, and
			every phone and computer already knows them. So they're never sent. Only the amounts are.
		</p>
	</div>
</JpegPage>

<style>
	.patterns-stage {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		gap: 2.5rem;
		align-items: center;
		justify-content: center;
	}
	.detail {
		display: grid;
		gap: 0.9rem;
		justify-items: center;
		min-height: 15rem;
		align-content: center;
	}
	.which {
		margin: 0;
		font-size: 1.05rem;
	}
	.which strong {
		color: var(--accent);
	}
	.made {
		display: flex;
		align-items: center;
		gap: 0.9rem;
	}
	.times {
		font-size: 1.3rem;
		color: var(--muted);
		padding-bottom: 1.4rem;
	}
	.strip {
		display: flex;
		border-radius: 4px;
		overflow: hidden;
		border: var(--bw) solid var(--line);
	}
	.strip i {
		width: 1.25rem;
		height: 1.25rem;
	}
	.strip.down {
		flex-direction: column;
	}
	.describe {
		margin: 0;
		max-width: 24rem;
		min-height: 2.8em;
		text-align: center;
		line-height: 1.45;
		color: var(--ink-soft);
	}

	@media (max-width: 860px) {
		.patterns-stage {
			grid-template-columns: minmax(0, 1fr);
			justify-items: center;
			gap: 1.5rem;
		}
	}
	@media (max-width: 500px) {
		.made {
			gap: 0.5rem;
			flex-wrap: wrap;
			justify-content: center;
		}
	}
</style>
