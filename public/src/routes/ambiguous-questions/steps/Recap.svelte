<script>
	// Last step: the whole story in four lines, and the way back.
	import { resolve } from '$app/paths';

	function toTop() {
		document.getElementById('start')?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<div class="recap">
	<p class="step-label">Wrapping up</p>
	<h2 class="step-title">So, what does it really “think”?</h2>

	<ol>
		<li>
			An LLM <strong>never doubts</strong>. There is always a next token. “Doubt” is just flat bars, and
			the dice lands somewhere anyway.
		</li>
		<li>
			A raw model answers like <strong>a random person from its training text</strong>, tilts
			included.
		</li>
		<li>
			Chat training <strong>makes one answer the likely one</strong>. “I don't take sides” is trained,
			not felt.
		</li>
		<li>
			Different teachers give <strong>different answers, all equally confident</strong>.
		</li>
	</ol>

	<p class="question">
		So next time an AI answers a question with no right answer, ask yourself:
		<em>who taught it to say that?</em>
	</p>

	<div class="end">
		<p>Thanks for reading! ✦</p>
		<div class="links">
			<button onclick={toTop}>↑ Back to the start</button>
			<a href={resolve('/how-llms-work')}>← Part one: How LLMs work</a>
		</div>
	</div>
</div>

<style>
	.recap {
		max-width: 44rem;
		margin: 0 auto;
	}
	ol {
		margin: 1.75rem 0 0;
		padding-left: 1.3rem;
		display: grid;
		gap: 0.8rem;
	}
	li {
		font-size: 1.1rem;
		line-height: 1.5;
		color: var(--ink-soft);
	}
	strong {
		color: var(--ink);
		font-weight: normal;
		border-bottom: 2px solid var(--accent-mid);
	}
	.question {
		margin: 2rem 0 0;
		padding: 1rem 1.25rem;
		border-radius: var(--radius);
		background: var(--accent-soft);
		font-size: 1.15rem;
		line-height: 1.5;
	}
	.question em {
		color: var(--accent);
	}

	.end {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.8rem;
		margin-top: 2.5rem;
	}
	.end p {
		margin: 0;
		font-size: 1.1rem;
	}
	.links {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		flex-wrap: wrap;
		justify-content: center;
	}
	.links button {
		font: inherit;
		font-size: 0.9rem;
		background: none;
		border: var(--bw) solid var(--ink-soft);
		border-radius: var(--pill);
		padding: 0.4rem 1rem;
		color: var(--ink);
		cursor: pointer;
	}
	.links button:hover {
		background: var(--ink);
		color: var(--paper);
	}
	.links a {
		font-size: 0.9rem;
		color: var(--ink-soft);
	}
</style>
