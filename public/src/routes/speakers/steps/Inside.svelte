<script>
	// Step 5: the gramophone cut in half, numbered in the order things happen.
	import GramophoneCutaway from '../components/GramophoneCutaway.svelte';
</script>

<div class="inside">
	<div class="head">
		<div>
			<p class="step-label">Step 5 · Inside a gramophone</p>
			<h2 class="step-title">A music machine with no electricity</h2>
		</div>
		<p class="step-lede">
			Here's one cut in half. Follow the numbers: you wind a spring, the spring spins the record, and
			the sound comes out of the horn. The <strong>blue line</strong> is the path the sound takes.
		</p>
	</div>
	<div class="stage"><GramophoneCutaway height="min(30rem, 58svh)" /></div>
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
