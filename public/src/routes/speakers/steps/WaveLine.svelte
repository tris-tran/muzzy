<script>
	// Step 4: drawing the wiggle over time gives the wave line, which is exactly what a groove stores.
	import WaveForm from '../components/WaveForm.svelte';
	import { waves } from '../components/data.js';
</script>

<div class="wave-line">
	<div class="head">
		<div>
			<p class="step-label">Step 4 · Drawing sound</p>
			<h2 class="step-title">Draw the wiggle, and you get a wave</h2>
		</div>
		<p class="step-lede">
			Draw how the air moves over time and you get the familiar wave line. Keep this shape in mind:
			a gramophone record stores <strong>exactly this line</strong>, cut into its groove.
		</p>
	</div>

	<div class="waves">
		{#each waves as w (w.name)}
			<figure>
				<WaveForm parts={w.parts} />
				<figcaption>{w.name}</figcaption>
			</figure>
		{/each}
	</div>

	<p class="takeaway">
		Real sounds are many wiggles added together. That's why a piano and a voice singing the same note
		still sound different.
	</p>
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
	.waves {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
		gap: 1rem;
		margin-top: 1.75rem;
	}
	figure {
		margin: 0;
		padding: 0.8rem 1rem;
		border-radius: var(--radius);
		border: var(--bw) solid var(--line);
		background: var(--card);
	}
	figcaption {
		margin-top: 0.5rem;
		font-size: 0.9rem;
		color: var(--ink-soft);
	}
	.takeaway {
		max-width: 46rem;
		margin: 1.5rem 0 0;
		font-size: 1.1rem;
		line-height: 1.6;
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
