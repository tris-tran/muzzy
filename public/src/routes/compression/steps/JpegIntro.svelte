<script>
	// Step 6: the map of JPEG, before going through it stage by stage on the next pages.
	import { onMount } from 'svelte';
	import { STAGES, goTo } from '../components/jpegStages.js';
	import { jpeg, prepare } from '../components/jpegState.svelte.js';
	import { paint, putImage } from '../components/canvas.js';

	onMount(prepare);
</script>

<div class="intro">
	<div class="head">
		<div>
			<p class="step-label">Step 6 · Inside JPEG</p>
			<h2 class="step-title">How JPEG squeezes a photo</h2>
		</div>
		<div class="step-lede">
			<p>
				JPEG is made just for photos. It knows how eyes work, and uses that to throw away what you won't
				miss. It does it in six stages. Over the next pages we'll follow one tiny piece of this sunset
				through all of them.
			</p>
		</div>
	</div>

	<div class="body">
		<figure class="picture">
			{#if jpeg.pictures}<canvas use:paint={putImage(jpeg.pictures.original)}></canvas>{/if}
			<figcaption>The picture we'll follow <span>320 × 200 pixels</span></figcaption>
		</figure>

		<ol class="stages">
			{#each STAGES as s, i (s.id)}
				<li>
					<button onclick={() => goTo(s.id)}>
						<span class="num">{i + 1}</span>
						<span class="text">
							<strong>{s.name}</strong>
							<span>{s.blurb}</span>
						</span>
						{#if s.loses === true}
							<span class="tag lossy">loses a little</span>
						{:else if s.loses === false}
							<span class="tag">loses nothing</span>
						{/if}
					</button>
				</li>
			{/each}
		</ol>
	</div>

	<p class="note">
		Only two stages actually throw something away. The others just rewrite the picture in a smarter way,
		so that the throwing away can happen where you won't notice it.
	</p>
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
	.step-lede p {
		margin: 0;
	}

	.body {
		display: grid;
		grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.4fr);
		gap: 2rem;
		align-items: center;
		margin-top: 2rem;
	}
	.picture {
		margin: 0;
		display: grid;
		gap: 0.5rem;
	}
	canvas {
		width: 100%;
		aspect-ratio: 16 / 10;
		border-radius: var(--radius);
		box-shadow: var(--shadow-lift);
	}
	figcaption {
		display: grid;
		font-size: 0.85rem;
		font-weight: 700;
	}
	figcaption span {
		font-weight: normal;
		color: var(--ink-soft);
	}

	.stages {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.45rem;
	}
	.stages button {
		width: 100%;
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		align-items: center;
		gap: 0.9rem;
		padding: 0.6rem 0.9rem;
		border-radius: var(--radius);
		border: var(--bw) solid var(--line);
		background: var(--card);
		color: var(--ink);
		font: inherit;
		text-align: left;
		cursor: pointer;
		transition:
			border-color 0.2s,
			transform 0.2s;
	}
	.stages button:hover {
		border-color: var(--accent-mid);
		transform: translateX(3px);
	}
	.num {
		display: grid;
		place-items: center;
		width: 1.8rem;
		height: 1.8rem;
		border-radius: 50%;
		background: var(--accent);
		color: white;
		font-weight: 700;
		font-size: 0.85rem;
	}
	.text {
		display: grid;
	}
	.text span {
		font-size: 0.88rem;
		color: var(--ink-soft);
	}
	.tag {
		padding: 0.15rem 0.55rem;
		border-radius: var(--pill);
		font-size: 0.72rem;
		white-space: nowrap;
		background: var(--good-soft);
		color: var(--good);
	}
	.tag.lossy {
		background: var(--bad-soft);
		color: var(--bad);
	}
	.note {
		margin: 1.5rem 0 0;
		max-width: 44rem;
		font-size: 1.05rem;
		line-height: 1.6;
		color: var(--ink-soft);
	}

	@media (max-width: 860px) {
		.head,
		.body {
			grid-template-columns: minmax(0, 1fr);
		}
		.step-lede {
			margin-top: 1rem;
		}
	}
	@media (max-width: 500px) {
		.stages button {
			grid-template-columns: auto minmax(0, 1fr);
		}
		.tag {
			grid-column: 2;
			justify-self: start;
		}
	}
</style>
