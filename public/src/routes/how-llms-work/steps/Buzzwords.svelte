<script>
	// Last step: no explanations, just a promise. Popular AI words to spark curiosity;
	// tap the ones you'd like explained and they collect into a little "ask me" list.
	import { resolve } from '$app/paths';

	// Size 3 = big, 2 = medium, 1 = small
	const buzzwords = [
		['RAG', 3], ['Tools', 3], ['Agents', 3], ['Embeddings', 3], ['Tokens', 3],
		['Parameters', 3], ['Classifiers', 2], ['Mixture of experts', 3], ['Attention', 3], ['GPU', 3],
		['Transformer', 3], ['Context window', 2], ['Hallucinations', 3], ['Fine-tuning', 2], ['RLHF', 2],
		['Temperature', 2], ['Prompt engineering', 2], ['System prompt', 1], ['Reasoning models', 2],
		['Chain of thought', 2], ['Multimodal', 2], ['Diffusion', 1], ['Vector database', 1], ['MCP', 2],
		['Open weights', 2], ['Quantization', 1], ['Distillation', 1], ['Benchmarks', 1], ['Evals', 1],
		['AGI', 3], ['Alignment', 2], ['Jailbreak', 2], ['Prompt injection', 1], ['Vibe coding', 2],
		['Small language models', 1], ['Synthetic data', 1], ['Scaling laws', 2], ['TPU', 1],
		['Neural network', 2], ['Backpropagation', 1], ['Guardrails', 1], ['Grounding', 1], ['Latency', 1],
		['Copilot', 1], ['Inference', 1], ['Training data', 1]
	];

	// Shuffle once with a fixed seed so big and small words mix, the same on server and browser
	let seed = 7;
	const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
	const cloud = buzzwords
		.map(([word, size]) => ({ word, size, k: rand(), tilt: (rand() - 0.5) * 4, delay: rand() * 3 }))
		.sort((a, b) => a.k - b.k);

	let picked = $state([]);
	const toggle = (word) =>
		(picked = picked.includes(word) ? picked.filter((w) => w !== word) : [...picked, word]);

	function toTop() {
		document.getElementById('start')?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<div class="buzz">
	<div class="head">
		<p class="step-label">One more thing</p>
		<h2 class="step-title">You've probably heard a lot of these words</h2>
		<p class="step-lede">
			The world of AI is full of buzzwords. We didn't cover them here, but now you know enough for
			every one of them to make sense. <strong>Spotted one you've heard before?</strong> Tap it, and
			ask me. I promise to explain.
		</p>
	</div>

	<ul class="cloud" aria-label="AI buzzwords">
		{#each cloud as b (b.word)}
			<li style="--tilt: {b.tilt}deg; --delay: {b.delay}s">
				<button
					class="word size{b.size}"
					class:picked={picked.includes(b.word)}
					aria-pressed={picked.includes(b.word)}
					onclick={() => toggle(b.word)}>{b.word}</button
				>
			</li>
		{/each}
		<li class="more">…and plenty more</li>
	</ul>

	<div class="ask" class:visible={picked.length > 0} aria-live="polite">
		{#if picked.length}
			<p>
				<span class="ask-label">Ask me about:</span>
				{#each picked as w, i (w)}<strong>{w}</strong>{i < picked.length - 2
						? ', '
						: i === picked.length - 2
							? ' and '
							: ''}{/each}
			</p>
		{/if}
	</div>

	<div class="end">
		<p>Thanks for reading! ✦</p>
		<a class="part-two" href={resolve('/ambiguous-questions')}>
			<span>Part two</span>
			What does an LLM do when there's no right answer? →
		</a>
		<button onclick={toTop}>↑ Back to the start</button>
	</div>
</div>

<style>
	.head {
		max-width: 44rem;
		margin: 0 auto;
		text-align: center;
	}
	.step-lede {
		margin: 1rem auto 0;
	}
	.step-lede strong {
		color: var(--ink);
		font-weight: normal;
		border-bottom: 2px solid var(--accent-mid);
	}

	.cloud {
		list-style: none;
		margin: 2.25rem auto 0;
		padding: 0;
		max-width: 60rem;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 0.6rem 0.7rem;
	}
	.cloud li {
		transform: rotate(var(--tilt));
		animation: float 6s ease-in-out var(--delay) infinite;
	}
	@keyframes float {
		50% {
			transform: rotate(var(--tilt)) translateY(-4px);
		}
	}
	.word {
		font: inherit;
		border-radius: var(--pill);
		border: var(--bw) solid var(--line);
		background: var(--card);
		color: var(--ink);
		cursor: pointer;
		transition:
			background 0.2s,
			color 0.2s,
			border-color 0.2s,
			transform 0.2s;
	}
	.word:hover {
		border-color: var(--accent);
		color: var(--accent);
		transform: scale(1.06);
	}
	.size3 {
		font-size: 1.35rem;
		padding: 0.45rem 1.1rem;
	}
	.size2 {
		font-size: 1.05rem;
		padding: 0.35rem 0.9rem;
		color: var(--ink);
	}
	.size1 {
		font-size: 0.88rem;
		padding: 0.3rem 0.75rem;
		color: var(--ink-soft);
	}
	.word.picked {
		background: var(--accent);
		border-color: var(--accent);
		color: white;
	}
	.more {
		font-style: italic;
		color: var(--muted);
		padding: 0 0.5rem;
	}

	.ask {
		min-height: 3.5rem;
		margin: 1.75rem auto 0;
		max-width: 44rem;
		text-align: center;
		opacity: 0;
		transition: opacity 0.4s;
	}
	.ask.visible {
		opacity: 1;
	}
	.ask p {
		display: inline-block;
		margin: 0;
		padding: 0.7rem 1.2rem;
		border-radius: var(--radius);
		background: var(--accent-soft);
		line-height: 1.5;
	}
	.ask-label {
		color: var(--ink-soft);
		margin-right: 0.3rem;
	}
	.ask strong {
		color: var(--accent);
	}

	.end {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.6rem;
		margin-top: 1.5rem;
	}
	.end p {
		margin: 0;
		font-size: 1.1rem;
	}
	.part-two {
		display: grid;
		gap: 0.15rem;
		padding: 0.7rem 1.3rem;
		border-radius: var(--radius);
		background: var(--accent);
		color: white;
		text-align: center;
		text-decoration: none;
		transition: background 0.2s;
	}
	.part-two:hover {
		background: var(--accent-hover);
	}
	.part-two span {
		font-size: 0.72rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		opacity: 0.8;
	}
	.end button {
		font: inherit;
		font-size: 0.9rem;
		background: none;
		border: var(--bw) solid var(--ink-soft);
		border-radius: var(--pill);
		padding: 0.4rem 1rem;
		color: var(--ink);
		cursor: pointer;
	}
	.end button:hover {
		background: var(--ink);
		color: var(--paper);
	}

	@media (max-width: 600px) {
		.cloud {
			gap: 0.45rem 0.5rem;
		}
		.size3 {
			font-size: 1.1rem;
		}
		.size2 {
			font-size: 0.95rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.cloud li {
			animation: none;
		}
	}
</style>
