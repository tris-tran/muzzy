<script>
	import { resolve } from '$app/paths';
</script>

<div class="intro">
	<p class="step-label">Part two · An interactive explainer</p>
	<h1>What does an LLM do when there's no right answer?</h1>
	<p class="step-lede">
		Ask it the capital of France and it says Paris. Easy. But what about a question where people
		disagree, like <em>“what are your politics?”</em> Does it hesitate? Does it have doubts?
	</p>
	<p class="step-lede">
		Short answer: it can't. There is only ever the next token. But the way it was trained decides
		which token wins.
	</p>
	<p class="part-one">
		New here? This builds on <a href={resolve('/how-llms-work')}>part one: How LLMs work</a>.
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
	.step-lede em {
		color: var(--ink);
	}
	.part-one {
		margin-top: 2rem;
		color: var(--ink-soft);
	}
	.part-one a {
		color: var(--accent);
	}
	@media (max-width: 600px) {
		h1 {
			font-size: calc(2.3rem * var(--display-scale));
		}
	}
</style>
