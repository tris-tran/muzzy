<script>
	// Step 7: the record player and speaker. The diaphragm's job becomes making electricity, the
	// horn's job goes to the amplifier, and a magnet turns the electricity back into movement.
	import ElectricChain from '../components/ElectricChain.svelte';
</script>

<div class="electric">
	<div class="head">
		<div>
			<p class="step-label">Step 7 · Going electric</p>
			<h2 class="step-title">Swap the horn for electricity</h2>
		</div>
		<p class="step-lede">
			A modern record player still has a groove and a needle. But the needle doesn't shake a
			diaphragm any more: it wiggles a tiny magnet inside a coil, and that makes
			<strong>electricity that wiggles the same way</strong>. In the speaker, a magnet turns it back
			into movement.
		</p>
	</div>
	<div class="stage"><ElectricChain /></div>
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
