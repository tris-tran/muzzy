<script>
	// Step 6: the groove → needle → diaphragm → horn chain, animated.
	import GramophoneAnimation from '../components/GramophoneAnimation.svelte';
</script>

<div class="how">
	<div class="head">
		<div>
			<p class="step-label">Step 6 · How it makes sound</p>
			<h2 class="step-title">The groove is the sound</h2>
		</div>
		<p class="step-lede">
			The groove is that wave line from step 4, cut into the record. The needle rides it and shakes a
			thin <strong>diaphragm</strong>, the diaphragm shakes the air, and the horn makes it loud enough
			to fill a room.
		</p>
	</div>
	<div class="stage"><GramophoneAnimation /></div>
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
		max-width: 52rem;
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
