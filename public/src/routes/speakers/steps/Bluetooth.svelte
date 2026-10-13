<script>
	// Step 14: Bluetooth. Radio again, short-range, carrying the file's numbers instead of the
	// wiggle; a chip in the speaker turns them back into the wiggle. Every piece was already shown.
	import BluetoothChain from '../components/BluetoothChain.svelte';
</script>

<div class="bluetooth">
	<div class="head">
		<div>
			<p class="step-label">Step 14 · Bluetooth</p>
			<h2 class="step-title">A tiny radio station in your phone</h2>
		</div>
		<p class="step-lede">
			Bluetooth is radio again: very short-range, with its own kind of radio wave. But instead of the
			wiggle, it sends <strong>the numbers from the file</strong>. Inside the speaker, a little chip
			does what the headphone jack used to do: it turns the numbers back into the electrical wiggle.
		</p>
	</div>

	<div class="stage"><BluetoothChain /></div>

	<p class="takeaway">
		Nothing here is new: the <strong>numbers</strong> from step 11, the <strong>radio</strong> from
		step 13, and the same <strong>coil, magnet and cone</strong> from step 8. And underneath it all,
		the gramophone's trick: read the wiggle, shake the air.
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
		max-width: 48rem;
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
