<script>
	// The frame every "Inside JPEG" page shares: label, title, intro, and the map of the six stages
	// (click one to jump there). Also holds the styles the JPEG pages have in common.
	//   n     – which stage this page is (1–6)
	//   part  – e.g. "part 1 of 3", when a stage takes more than one page
	import { onMount } from 'svelte';
	import { STAGES, goTo } from './jpegStages.js';
	import { prepare } from './jpegState.svelte.js';

	let { n, part = '', title, lede, children } = $props();

	onMount(prepare);
</script>

<div class="jpeg-page">
	<div class="head">
		<div>
			<p class="step-label">Inside JPEG · stage {n} of 6{part ? ` · ${part}` : ''}</p>
			<h2 class="step-title">{title}</h2>
		</div>
		<div class="step-lede">{@render lede()}</div>
	</div>

	<ol class="map" aria-label="The six stages of JPEG">
		{#each STAGES as s, i (s.id)}
			<li>
				<button class:current={i === n - 1} class:done={i < n - 1} onclick={() => goTo(s.id)}>
					<span class="num">{i + 1}</span>{s.name}
				</button>
			</li>
		{/each}
	</ol>

	{@render children()}
</div>

<style>
	.head {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
		gap: 0 3rem;
		align-items: end;
	}
	.step-lede {
		margin: 0;
	}
	.step-lede :global(p) {
		margin: 0;
	}
	.step-lede :global(strong) {
		color: var(--ink);
		font-weight: normal;
		border-bottom: 2px solid var(--accent-mid);
	}

	/* The map of stages */
	.map {
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
		margin: 1.3rem 0 1rem;
		padding: 0;
	}
	.map li {
		display: flex;
		align-items: center;
	}
	.map li + li::before {
		content: '→';
		margin-right: 0.3rem;
		color: var(--muted);
	}
	.map button {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		font: inherit;
		font-size: 0.82rem;
		padding: 0.25rem 0.7rem 0.25rem 0.3rem;
		border-radius: var(--pill);
		border: var(--bw) solid var(--line);
		background: var(--card);
		color: var(--ink-soft);
		cursor: pointer;
	}
	.map .num {
		display: inline-grid;
		place-items: center;
		width: 1.25rem;
		height: 1.25rem;
		border-radius: 50%;
		background: var(--track);
		font-size: 0.7rem;
		font-weight: 700;
	}
	.map button.done .num {
		background: var(--accent-soft);
		color: var(--accent);
	}
	.map button.current {
		border-color: var(--accent);
		color: var(--ink);
		box-shadow: 0 0 0 3px var(--accent-soft);
	}
	.map button.current .num {
		background: var(--accent);
		color: white;
	}

	/* Shared by the pages */
	.jpeg-page :global(.jp-panel) {
		padding: 1rem 1.2rem;
		border-radius: var(--radius-lg);
		background: var(--card);
		border: var(--bw) solid var(--line);
	}
	.jpeg-page :global(.jp-row) {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1.1rem;
		flex-wrap: wrap;
	}
	.jpeg-page :global(figure) {
		margin: 0;
		display: grid;
		justify-items: center;
		gap: 0.45rem;
	}
	.jpeg-page :global(figcaption) {
		display: grid;
		justify-items: center;
		font-size: 0.85rem;
		font-weight: 700;
		text-align: center;
	}
	.jpeg-page :global(figcaption span) {
		font-weight: normal;
		font-size: 0.78rem;
		color: var(--ink-soft);
	}
	.jpeg-page :global(.op) {
		font-size: 1.4rem;
		color: var(--muted);
		padding-bottom: 1.6rem;
	}
	.jpeg-page :global(.jp-notes) {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
		gap: 0.5rem 2rem;
		margin-top: 1.1rem;
	}
	.jpeg-page :global(.jp-notes p) {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.6;
		color: var(--ink-soft);
	}
	.jpeg-page :global(.jp-notes strong) {
		color: var(--ink);
	}
	.jpeg-page :global(.jp-btn) {
		font: inherit;
		font-size: 0.88rem;
		padding: 0.4rem 0.9rem;
		border-radius: var(--pill);
		border: var(--bw) solid var(--line);
		background: var(--card);
		color: var(--ink);
		cursor: pointer;
	}
	.jpeg-page :global(.jp-btn:hover:not(:disabled)) {
		border-color: var(--accent);
		color: var(--accent);
	}
	.jpeg-page :global(.jp-btn.main) {
		border-color: var(--accent);
		background: var(--accent);
		color: white;
	}
	.jpeg-page :global(.jp-btn.main:hover:not(:disabled)) {
		background: var(--accent-hover);
		color: white;
	}
	.jpeg-page :global(.jp-btn:disabled) {
		opacity: 0.4;
		cursor: default;
	}
	.jpeg-page :global(.jp-controls) {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		flex-wrap: wrap;
		margin-top: 0.9rem;
		min-height: 2.3rem;
	}
	.jpeg-page :global(.jp-quality) {
		display: flex;
		align-items: center;
		gap: 0.8rem;
		font-size: 0.9rem;
		color: var(--ink-soft);
	}
	.jpeg-page :global(.jp-quality strong) {
		display: inline-block;
		min-width: 1.8rem;
		color: var(--ink);
	}
	.jpeg-page :global(.jp-quality input) {
		width: 14rem;
		accent-color: var(--accent);
	}
	.jpeg-page :global(.jp-loading) {
		color: var(--muted);
		font-style: italic;
		text-align: center;
	}
	.jpeg-page :global(canvas),
	.jpeg-page :global(img) {
		display: block;
		border-radius: 6px;
	}

	@media (max-width: 860px) {
		.head {
			grid-template-columns: minmax(0, 1fr);
		}
		.step-lede {
			margin-top: 1rem;
		}
		.jpeg-page :global(.op) {
			padding: 0;
		}
	}
	@media (max-width: 600px) {
		.jpeg-page :global(.jp-quality input) {
			width: 9rem;
		}
	}
</style>
