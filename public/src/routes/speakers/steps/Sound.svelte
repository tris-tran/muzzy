<script>
	// Step 3: before the machine, what sound is: air pushed and pulled, the push travelling on.
	import AirWave from '../components/AirWave.svelte';

	let pitch = $state(2.5);
	let volume = $state(0.6);
</script>

<div class="sound">
	<div class="head">
		<div>
			<p class="step-label">Step 3 · What is sound?</p>
			<h2 class="step-title">Sound is air, wiggling</h2>
		</div>
		<p class="step-lede">
			Something pushes the air, that air pushes the air next to it, and the push travels on until
			it reaches your ear. Play with it:
		</p>
	</div>

	<div class="stage"><AirWave {pitch} {volume} height="17rem" /></div>

	<div class="sliders">
		<label>
			<span>Pitch</span>
			<small>low</small>
			<input type="range" min="1" max="6" step="0.1" bind:value={pitch} />
			<small>high</small>
		</label>
		<label>
			<span>Volume</span>
			<small>quiet</small>
			<input type="range" min="0" max="1" step="0.01" bind:value={volume} />
			<small>loud</small>
		</label>
	</div>

	<p class="takeaway">
		See the red dot? It's one bit of air, and it <strong>never travels</strong>: only the push does.
		Faster wiggles sound higher; bigger wiggles sound louder.
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
	.takeaway strong {
		color: var(--ink);
		font-weight: normal;
		border-bottom: 2px solid var(--accent-mid);
	}
	.stage {
		margin-top: 1.75rem;
	}
	.sliders {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem 2rem;
		margin-top: 1rem;
	}
	label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	label span {
		font-weight: 700;
		min-width: 4rem;
	}
	small {
		color: var(--ink-soft);
	}
	input {
		width: 10rem;
		accent-color: var(--accent);
	}
	.takeaway {
		max-width: 46rem;
		margin: 1.25rem 0 0;
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
