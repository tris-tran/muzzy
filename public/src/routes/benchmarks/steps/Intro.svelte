<div class="intro">
	<p class="step-label">An interactive explainer</p>
	<h1>How do you know a language model is good enough?</h1>
	<p class="step-lede">
		Every few months a new model shows up: faster, cheaper, smarter, or so they say. Before we switch,
		we want proof, not a hunch. This is how we get it: with <strong>benchmarks</strong>, and the small
		tool we built to run them.
	</p>
	<p class="parts">
		<strong>Part one:</strong> what a benchmark is and how ours work. No code.
		<br /><strong>Part two:</strong> building one yourself.
	</p>
</div>

<style>
	.intro {
		max-width: 46rem;
	}
	h1 {
		margin: 0;
		font-size: calc(3.4rem * var(--display-scale));
		line-height: 1.05;
		text-wrap: balance;
	}
	.step-lede {
		margin-top: 1.5rem;
		font-size: 1.3rem;
	}
	.step-lede strong {
		color: var(--ink);
		font-weight: normal;
		border-bottom: 2px solid var(--accent-mid);
	}
	.parts {
		margin-top: 2rem;
		line-height: 1.6;
		color: var(--ink-soft);
	}
	.parts strong {
		color: var(--ink);
	}
	@media (max-width: 600px) {
		h1 {
			font-size: calc(2.3rem * var(--display-scale));
		}
	}
</style>
