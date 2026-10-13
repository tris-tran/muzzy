<script>
	// Step 8: a real speaker driver, cut in half and pulled apart.
	import SpeakerCutaway from '../components/SpeakerCutaway.svelte';
</script>

<div class="speaker">
	<div class="head">
		<div>
			<p class="step-label">Step 8 · Inside a speaker</p>
			<h2 class="step-title">The diaphragm, reborn</h2>
		</div>
		<p class="step-lede">
			Here's a speaker cut in half and pulled apart. The current flows through the
			<strong>voice coil</strong>, the coil pushes against the <strong>magnet</strong>, and the
			<strong>cone</strong> does what the gramophone's diaphragm did: it shakes the air.
		</p>
	</div>
	<div class="stage"><SpeakerCutaway height="min(28rem, 56svh)" /></div>
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
	.stage {
		margin-top: 1.5rem;
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
