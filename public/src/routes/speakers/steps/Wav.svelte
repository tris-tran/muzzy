<script>
	// Step 11: a sound file (WAV) is the wiggle measured over and over and written down as numbers;
	// playing it turns the numbers back into the electrical wiggle.
	import SampleWave from '../components/SampleWave.svelte';
</script>

<div class="wav">
	<div class="head">
		<div>
			<p class="step-label">Step 11 · Sound files</p>
			<h2 class="step-title">A sound file is a list of numbers</h2>
		</div>
		<p class="step-lede">
			Measure how high the wave is, again and again, very fast, and write each measurement down. That
			list of numbers is a <strong>WAV file</strong>. To play it, the phone turns each number back
			into a level of electricity, one after another, and the wiggle comes back.
		</p>
	</div>
	<div class="stage"><SampleWave /></div>
	<p class="takeaway">
		Few numbers give big, blocky steps. Real music uses <strong>44,100 numbers every second</strong>
		for each ear, so the steps are far too small to hear.
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
	.step-lede strong,
	.takeaway strong {
		color: var(--ink);
		font-weight: normal;
		border-bottom: 2px solid var(--accent-mid);
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
		max-width: 48rem;
		margin-top: 1rem;
	}
	.takeaway {
		max-width: 46rem;
		margin: 1rem 0 0;
		font-size: 1.05rem;
		line-height: 1.6;
	}
</style>
