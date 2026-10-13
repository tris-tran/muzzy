<script>
	// Step 1: there is no "I'm not sure" inside the model, only the bars. A clear question gets
	// one tall bar; an open one gets several short ones. A weighted dice roll picks either way.
	import Bars, { roll } from '../components/Bars.svelte';

	// Made-up but plausible chances (in %) for the next token
	const phrases = [
		{
			start: 'The capital of France is',
			guesses: [['Paris', 94], ['a', 2], ['Lyon', 1], ['located', 1]]
		},
		{
			start: 'The best pizza topping is',
			guesses: [['pepperoni', 26], ['mushrooms', 18], ['cheese', 16], ['pineapple', 12]]
		},
		{
			start: 'The greatest footballer ever is',
			guesses: [['Messi', 33], ['Pelé', 22], ['Maradona', 17], ['Ronaldo', 16]]
		},
		{
			start: 'My favourite colour is',
			guesses: [['blue', 31], ['green', 18], ['purple', 14], ['red', 13]]
		}
	];
	const ASKS = 10;

	let index = $state(0);
	let phrase = $derived(phrases[index]);
	let results = $state([]); // what each ask came back with
	let picked = $state(-1);
	let phase = $state('ready'); // ready → rolling → done

	let different = $derived(new Set(results).size);

	let run = 0;
	const wait = (ms) => new Promise((r) => setTimeout(r, ms));

	async function askMany() {
		const id = ++run;
		const slow = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.2 : 1;
		results = [];
		phase = 'rolling';
		for (let i = 0; i < ASKS; i++) {
			picked = roll(phrase.guesses);
			results = [...results, phrase.guesses[picked][0]];
			await wait(380 * slow);
			if (id !== run) return;
		}
		picked = -1;
		phase = 'done';
	}

	function choose(i) {
		run++;
		index = i;
		results = [];
		picked = -1;
		phase = 'ready';
	}
</script>

<div class="no-doubt">
	<div class="head">
		<div>
			<p class="step-label">Step 1 · No room for doubt</p>
			<h2 class="step-title">An LLM never says “hmm”</h2>
		</div>
		<p class="step-lede">
			Remember the guessing game from part one? For every next token, the model gives each candidate
			a chance. A clear question gets <strong>one tall bar</strong>. An open question gets
			<strong>lots of short ones</strong>. There is no bar for “I'm not sure”.
		</p>
	</div>

	<p class="confession">
		<span>A small confession:</span> in part one we said it picks the top guess. Most chat apps actually
		<strong>roll a weighted dice</strong>: a token with a 30% bar wins about 3 times out of 10.
	</p>

	<div class="phrases" role="group" aria-label="Pick a sentence">
		{#each phrases as p, i (p.start)}
			<button class="chip" class:active={i === index} disabled={phase === 'rolling'} onclick={() => choose(i)}
				>{p.start} …</button
			>
		{/each}
	</div>

	<div class="stage">
		<div class="panel">
			<span class="label">The text so far</span>
			<p class="text">{phrase.start} <span class="blank">___</span></p>
			<button class="run" onclick={askMany} disabled={phase === 'rolling'}>🎲 Ask {ASKS} times</button>
		</div>

		<div class="panel">
			<span class="label">Its guesses for the next token</span>
			<div class="bars"><Bars options={phrase.guesses} {picked} /></div>
		</div>
	</div>

	<div class="results" aria-live="polite">
		{#each results as r, i (i)}
			<span class="result" class:first={r === phrase.guesses[0][0]}>{r}</span>
		{/each}
	</div>

	<p class="takeaway" class:visible={phase === 'done'}>
		{#if different === 1}
			{ASKS} asks, the same answer every time. The tall bar leaves no room for anything else.
		{:else}
			{ASKS} asks, {different} different answers. It never hesitated once: each roll simply landed
			somewhere else. <strong>Flat bars are the only “doubt” there is</strong>, and they still produce
			a confident-sounding answer.
		{/if}
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
	.confession strong,
	.takeaway strong {
		color: var(--ink);
		font-weight: normal;
		border-bottom: 2px solid var(--accent-mid);
	}

	.confession {
		margin: 1.5rem 0 0;
		padding: 0.7rem 1rem;
		border-radius: var(--radius);
		background: var(--accent-soft);
		line-height: 1.55;
		color: var(--ink-soft);
	}
	.confession span {
		color: var(--accent);
		font-weight: 700;
	}

	.phrases {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 1.5rem 0 1.25rem;
	}
	.chip {
		font: inherit;
		font-size: 0.95rem;
		padding: 0.45rem 0.9rem;
		border-radius: var(--pill);
		border: var(--bw) solid var(--line);
		background: var(--card);
		color: var(--ink);
		cursor: pointer;
	}
	.chip:hover:not(:disabled) {
		border-color: var(--ink-soft);
	}
	.chip.active {
		background: var(--ink);
		border-color: var(--ink);
		color: var(--paper);
	}
	.chip:disabled:not(.active) {
		opacity: 0.45;
		cursor: default;
	}

	.stage {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 1.25rem;
	}
	.panel {
		background: var(--card);
		border: var(--bw) solid var(--line);
		border-radius: var(--radius);
		padding: 1.1rem 1.25rem;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}
	.label {
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}
	.text {
		flex: 1;
		margin: 0.6rem 0 1rem;
		font-size: 1.35rem;
		line-height: 1.5;
	}
	.blank {
		color: var(--muted);
	}
	.bars {
		width: 100%;
		margin-top: 0.7rem;
	}

	.run {
		font: inherit;
		background: var(--accent);
		color: white;
		border: 0;
		padding: 0.55rem 1.1rem;
		border-radius: var(--pill);
		cursor: pointer;
	}
	.run:hover:not(:disabled) {
		background: var(--accent-hover);
	}
	.run:disabled {
		opacity: 0.4;
		cursor: default;
	}

	.results {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		min-height: 2.2rem;
		margin-top: 1.25rem;
	}
	.result {
		padding: 0.3rem 0.75rem;
		border-radius: var(--pill);
		background: var(--card);
		border: var(--bw) solid var(--line);
		animation: drop-in 0.3s ease-out both;
	}
	.result.first {
		color: var(--accent);
		border-color: var(--accent-mid);
	}
	@keyframes drop-in {
		from {
			opacity: 0;
			transform: translateY(-8px);
		}
	}

	.takeaway {
		max-width: 44rem;
		margin: 1.25rem 0 0;
		font-size: 1.1rem;
		line-height: 1.6;
		opacity: 0;
		transition: opacity 0.5s ease;
	}
	.takeaway.visible {
		opacity: 1;
	}

	@media (max-width: 860px) {
		.head {
			grid-template-columns: minmax(0, 1fr);
		}
		.step-lede {
			margin-top: 1rem;
		}
	}
	@media (max-width: 760px) {
		.phrases {
			flex-wrap: nowrap;
			overflow-x: auto;
			margin: 1.25rem -16px;
			padding: 0 16px;
			scrollbar-width: none;
		}
		.chip {
			flex: 0 0 auto;
		}
		.stage {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.result {
			animation: none;
		}
	}
</style>
