<script>
	// Step 12: WAV files are big; MP3 stores the same song with far fewer numbers, which is why it
	// took over. How it does that (compression) is left for another day on purpose.
	import SizeCompare from '../components/SizeCompare.svelte';
</script>

<div class="mp3">
	<div class="head">
		<div>
			<p class="step-label">Step 12 · Why MP3 won</p>
			<h2 class="step-title">WAV files are big</h2>
		</div>
		<p class="step-lede">
			44,100 numbers every second, for each ear, adds up fast. An <strong>MP3</strong> stores the
			same song with <strong>far fewer numbers</strong>, leaving out details your ears barely notice.
			Smaller files meant faster downloads and more songs in your pocket, so MP3 took over.
		</p>
	</div>

	<div class="body">
		<SizeCompare />
		<aside class="note">
			<p class="label">A note</p>
			<p>
				How MP3 decides what to leave out is called <strong>compression</strong>, and that's a whole
				different story. We'll skip it here: for now, an MP3 is just a smaller list of numbers that
				turns back into the same wiggle.
			</p>
		</aside>
	</div>
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
	.body {
		display: grid;
		grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
		gap: 1.5rem;
		align-items: start;
		margin-top: 1.5rem;
	}
	.note {
		padding: 1rem 1.25rem;
		border-radius: var(--radius-lg);
		background: var(--accent-soft);
		line-height: 1.55;
	}
	.note p {
		margin: 0;
	}
	.note .label {
		margin-bottom: 0.4rem;
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--accent);
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
</style>
