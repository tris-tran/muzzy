<script>
	// Step 8: what I built. The factory from the last few steps, part by part, with what each part
	// is called in the llmbench project.
	import FactoryMap from '../components/FactoryMap.svelte';
</script>

<div class="built">
	<div class="head">
		<div>
			<p class="step-label">Step 8 · What I built</p>
			<h2 class="step-title">The factory, in the project's own words</h2>
		</div>
		<p class="step-lede">
			Everything in the factory exists in the project, under a name of its own. I built the
			<strong>factory</strong> (the belt, the floor, the probes, the crate) so that a new benchmark only
			needs its own <strong>dock and machines</strong>. Tap a number.
		</p>
	</div>

	<div class="stage"><FactoryMap /></div>
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
