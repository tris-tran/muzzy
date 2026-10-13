<script>
	// Step 13: radio. The wiggle travels through the air as an invisible radio wave, an antenna turns
	// it back into electricity, and the speaker plays it. No frequencies on purpose; this is the
	// bridge to Bluetooth.
	import RadioChain from '../components/RadioChain.svelte';
</script>

<div class="radio">
	<div class="head">
		<div>
			<p class="step-label">Step 13 · Radio</p>
			<h2 class="step-title">Sound without a cable</h2>
		</div>
		<p class="step-lede">
			A radio station turns sound into the same electrical wiggle, then sends it through the air as an
			invisible <strong>radio wave</strong>. Your radio's antenna catches it, turns it back into the
			electrical wiggle, and the speaker does the rest.
		</p>
	</div>

	<div class="stage"><RadioChain /></div>

	<p class="takeaway">
		How radio waves work (and why every station has its own number on the dial) is another story. What
		matters here: <strong>the cable can be replaced by the air</strong>. Keep that in mind for Bluetooth.
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
	strong {
		color: var(--ink);
		font-weight: normal;
		border-bottom: 2px solid var(--accent-mid);
	}
	.stage {
		max-width: 54rem;
		margin-top: 1.25rem;
	}
	.takeaway {
		max-width: 46rem;
		margin: 1rem 0 0;
		font-size: 1.05rem;
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
