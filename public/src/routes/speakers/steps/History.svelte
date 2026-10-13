<script>
	// Step 1: a quick walk through 130 years of loud music, one 3D model per era.
	import { asset } from '$app/paths';
	import ModelImage from '../components/ModelImage.svelte';
	import { history } from '../components/data.js';
</script>

<div class="history">
	<div class="head">
		<div>
			<p class="step-label">Step 1 · A bit of history</p>
			<h2 class="step-title">130 years of making music loud</h2>
		</div>
		<p class="step-lede">
			The shapes changed a lot, all the way to today's Bluetooth speakers. The idea underneath
			<strong>barely changed at all</strong>, and it starts with a machine that didn't even need
			electricity.
		</p>
	</div>

	<ol class="timeline">
		{#each history as h (h.name)}
			<li>
				<ModelImage src={asset('models/' + h.file)} alt={h.name} view={h.view} height="9rem" />
				<span class="year">{h.year}</span>
				<span class="name">{h.name}</span>
				<span class="text">{h.text}</span>
				<span class="credit">{h.credit}</span>
			</li>
		{/each}
	</ol>
</div>

<style>
	.head {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 0 3rem;
		align-items: end;
	}
	.step-lede {
		margin: 0;
	}
	.step-lede strong {
		color: var(--ink);
		font-weight: normal;
		border-bottom: 2px solid var(--accent-mid);
	}

	.timeline {
		list-style: none;
		margin: 1.75rem 0 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		gap: 0.75rem;
	}
	li {
		display: flex;
		flex-direction: column;
		padding: 0.6rem 0.6rem 0.8rem;
		border-radius: var(--radius);
		border: var(--bw) solid var(--line);
		background: var(--card);
	}
	li :global(.still) {
		margin-bottom: 0.6rem;
	}
	.year {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		color: var(--accent);
	}
	.name {
		font-weight: 700;
	}
	.text {
		margin-top: 0.2rem;
		font-size: 0.88rem;
		line-height: 1.4;
		color: var(--ink-soft);
	}
	.credit {
		margin-top: auto;
		padding-top: 0.4rem;
		font-size: 0.68rem;
		color: var(--muted);
	}

	@media (max-width: 1000px) {
		.timeline {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
	@media (max-width: 860px) {
		.head {
			grid-template-columns: minmax(0, 1fr);
		}
		.step-lede {
			margin-top: 1rem;
		}
	}
</style>
