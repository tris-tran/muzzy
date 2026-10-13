<script>
	// Step 2: real recordings from 1888 to 1925. The last two are weeks apart: one made with a
	// horn, one with the first microphones.
	import Recordings from '../components/Recordings.svelte';
</script>

<div class="listen">
	<div class="head">
		<div>
			<p class="step-label">Step 2 · Listen</p>
			<h2 class="step-title">What it sounded like</h2>
		</div>
		<p class="step-lede">
			Real recordings, the oldest from 1888. Until 1925 there was <strong>no electricity</strong>
			anywhere: a horn caught the sound, and a needle cut it into wax.
		</p>
	</div>

	<div class="list"><Recordings /></div>

	<p class="compare">
		<span>Try this:</span> play the last two. They were recorded only weeks apart, but the second one
		used one of the first <strong>microphones</strong>. Hear how much more of the voice and piano comes
		through? Step 9 shows why.
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
	.compare strong {
		color: var(--ink);
		font-weight: normal;
		border-bottom: 2px solid var(--accent-mid);
	}
	.list {
		margin-top: 1.75rem;
	}
	.compare {
		max-width: 46rem;
		margin: 1.25rem 0 0;
		font-size: 1.05rem;
		line-height: 1.6;
	}
	.compare span {
		color: var(--accent);
		font-weight: 700;
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
