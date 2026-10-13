<script>
	// Step 9: the microphone, the same coil-magnet-cone run backwards: sound into electricity.
	import Microphone from '../components/Microphone.svelte';
</script>

<div class="backwards">
	<div class="head">
		<div>
			<p class="step-label">Step 9 · It works backwards</p>
			<h2 class="step-title">A microphone is a speaker in reverse</h2>
		</div>
		<p class="step-lede">
			Push the cone with sound, and the coil moves inside the magnet and <strong>makes a
			current</strong>. That's a microphone. It's how that 1925 recording got so much clearer: no more
			shouting into a horn.
		</p>
	</div>
	<div class="stage"><Microphone /></div>
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
	.stage {
		max-width: 56rem;
	}
</style>
