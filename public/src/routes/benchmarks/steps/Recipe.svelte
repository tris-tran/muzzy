<script>
	// The last step: what you decide to make a new benchmark, in order: the source, the input
	// shape, the steps and what they return, the benchmark, and how to run it. Pseudocode only.
	import Recipe from '../components/Recipe.svelte';
</script>

<div class="recipe">
	<div class="head">
		<div>
			<p class="step-label">Your turn</p>
			<h2 class="step-title">What you write to make a benchmark</h2>
		</div>
		<p class="step-lede">
			The factory is built. A new benchmark is a handful of <strong>decisions, in this order</strong>:
			where the data comes from, what one input looks like, the steps, and how to run it. No Python,
			just what each piece needs.
		</p>
	</div>

	<div class="stage"><Recipe /></div>
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
