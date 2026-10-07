<script>
	import LlmBox from '../components/LlmBox.svelte';
	import Pipe from '../components/Pipe.svelte';

	// The LLM seen from the outside: words go in, something happens, words come out.
	const examples = [
		{
			prompt: "What's the capital of France?",
			answer: 'The capital of France is Paris.'
		},
		{
			prompt: 'Write a haiku about coffee',
			answer: 'Dark and warm it pours, / morning wakes inside the cup, / steam curls into day.'
		},
		{
			prompt: 'Explain rain to a five-year-old',
			answer:
				'Clouds are full of tiny drops of water. When the drops get too heavy, they fall down. That is rain!'
		},
		{
			prompt: 'Give my cat a name',
			answer: 'How about Biscuit? It is cozy, cute, and fits almost any cat.'
		}
	];

	// idle → feeding (question goes in) → thinking → speaking (answer comes out) → done
	let phase = $state('idle');
	let pickedIndex = $state(0);
	let picked = $derived(examples[pickedIndex]);
	let shown = $state(0); // how many answer words are visible

	let promptWords = $derived(picked.prompt.split(' '));
	let answerWords = $derived(picked.answer.split(' '));
	let busy = $derived(phase === 'feeding' || phase === 'thinking' || phase === 'speaking');

	let run = 0;
	const wait = (ms) => new Promise((r) => setTimeout(r, ms));
	const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

	async function send() {
		const id = ++run;
		const slow = reduced() ? 0.2 : 1;
		shown = 0;

		phase = 'feeding';
		await wait((600 + promptWords.length * 90) * slow);
		if (id !== run) return;

		phase = 'thinking';
		await wait(1100 * slow);
		if (id !== run) return;

		phase = 'speaking';
		for (let i = 1; i <= answerWords.length; i++) {
			shown = i;
			await wait(140 * slow);
			if (id !== run) return;
		}
		phase = 'done';
	}

	function pick(index) {
		run++;
		pickedIndex = index;
		phase = 'idle';
		shown = 0;
	}
</script>

<div class="blackbox">
	<div class="intro">
		<p class="step-label">Step 1 · The view from outside</p>
		<h2 class="step-title">It starts as a black box</h2>
		<p class="step-lede">
			From the outside, an LLM is surprisingly simple: you give it some words, and it gives you some
			words back. Pick a question and send it in.
		</p>
	</div>

	<div class="choices" role="group" aria-label="Pick a question">
		{#each examples as example, i (example.prompt)}
			<button
				class="chip"
				class:active={i === pickedIndex}
				disabled={busy}
				onclick={() => pick(i)}>{example.prompt}</button
			>
		{/each}
	</div>

	<div class="stage" data-phase={phase}>
		<!-- What goes in -->
		<div class="side in">
			<span class="label">Your words</span>
			<p class="words" aria-label={picked.prompt}>
				{#each promptWords as word, i (picked.prompt + i)}
					<span class="word in-word" style="--i: {i}">{word}</span>
				{/each}
			</p>
			<button class="send" onclick={send} disabled={busy}>
				{phase === 'done' ? 'Send again' : 'Send it in'} →
			</button>
		</div>

		<!-- The box itself -->
		<div class="box-wrap">
			<Pipe flowing={phase === 'feeding'} />
			<LlmBox mode={phase === 'thinking' ? 'thinking' : busy ? 'working' : 'idle'} />
			<div class="pipe-out"><Pipe flowing={phase === 'speaking'} /></div>
			<p class="status" aria-live="polite">
				{#if phase === 'idle'}Waiting…
				{:else if phase === 'feeding'}Reading your words…
				{:else if phase === 'thinking'}Something is happening in here…
				{:else if phase === 'speaking'}Writing, one word at a time…
				{:else}Done.{/if}
			</p>
		</div>

		<!-- What comes out -->
		<div class="side out">
			<span class="label">Its words</span>
			<p class="words answer">
				{#each answerWords.slice(0, shown) as word, i (picked.prompt + i)}
					<span class="word out-word">{word}</span>
				{/each}
				{#if phase === 'speaking'}<span class="caret"></span>{/if}
				{#if phase === 'idle' || phase === 'feeding' || phase === 'thinking'}
					<span class="placeholder">The answer will appear here.</span>
				{/if}
			</p>
		</div>
	</div>

	<p class="outro" class:visible={phase === 'done'}>
		That's all we can see from the outside: words in, words out, one word at a time. And you've
		almost certainly seen one of these at work already…
	</p>
</div>

<style>
	/* Question picker */
	.choices {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 1.5rem 0 2rem;
	}
	.chip {
		font: inherit;
		font-size: 0.95rem;
		padding: 0.45rem 0.9rem;
		border-radius: 999px;
		border: 1px solid var(--line);
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

	/* Stage: in → box → out */
	.stage {
		--fly-x: 140px;
		--fly-y: 0px;
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		gap: 0;
	}
	.side {
		background: var(--card);
		border: 1px solid var(--line);
		border-radius: 14px;
		padding: 1.1rem 1.25rem;
		min-height: 9rem;
		display: flex;
		flex-direction: column;
	}
	.label {
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}
	.words {
		flex: 1;
		margin: 0.6rem 0;
		font-size: 1.15rem;
		line-height: 1.6;
	}
	.word {
		display: inline-block;
		margin-right: 0.3em;
	}

	/* Question words fly into the box */
	.in-word {
		transition:
			transform 0.5s cubic-bezier(0.5, 0, 0.9, 0.5),
			opacity 0.5s ease-in;
		transition-delay: calc(var(--i) * 90ms);
	}
	.stage:not([data-phase='idle']):not([data-phase='done']) .in-word {
		transform: translate(var(--fly-x), var(--fly-y)) scale(0.4);
		opacity: 0;
	}
	.stage[data-phase='done'] .in-word {
		animation: back-in 0.4s ease both;
		animation-delay: calc(var(--i) * 40ms);
	}
	@keyframes back-in {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
	}

	/* Answer words pop out */
	.out-word {
		animation: pop-out 0.35s ease-out both;
	}
	@keyframes pop-out {
		from {
			opacity: 0;
			transform: translateX(-14px);
			filter: blur(3px);
		}
	}
	.caret {
		display: inline-block;
		width: 0.5em;
		height: 1em;
		vertical-align: -0.12em;
		background: var(--accent);
		animation: blink 0.8s steps(2) infinite;
	}
	@keyframes blink {
		50% {
			opacity: 0;
		}
	}
	.placeholder {
		color: #b5ada1;
		font-style: italic;
	}

	.send {
		align-self: flex-start;
		font: inherit;
		background: var(--ink);
		color: var(--paper);
		border: 0;
		padding: 0.55rem 1.1rem;
		border-radius: 999px;
		cursor: pointer;
	}
	.send:hover:not(:disabled) {
		background: #000;
	}
	.send:disabled {
		opacity: 0.4;
		cursor: default;
	}

	/* The box */
	.box-wrap {
		position: relative;
		display: flex;
		align-items: center;
		padding: 0;
	}
	.status {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		margin: 0.9rem 0 0;
		text-align: center;
		font-size: 0.9rem;
		font-style: italic;
		color: var(--ink-soft);
	}

	.outro {
		max-width: 40rem;
		margin: 2.5rem 0 0;
		font-size: 1.1rem;
		line-height: 1.6;
		opacity: 0;
		transform: translateY(8px);
		transition:
			opacity 0.6s ease,
			transform 0.6s ease;
	}
	.outro.visible {
		opacity: 1;
		transform: none;
	}

	/* Narrow screens: stack vertically, words fall down into the box */
	@media (max-width: 760px) {
		/* One swipeable row of questions instead of four stacked lines */
		.choices {
			flex-wrap: nowrap;
			overflow-x: auto;
			margin: 1.25rem -16px 1.5rem;
			padding: 0 16px;
			scrollbar-width: none;
		}
		.chip {
			flex: 0 0 auto;
		}
		.stage {
			--fly-x: 0px;
			--fly-y: 120px;
			grid-template-columns: 1fr;
		}
		.side {
			min-height: 0;
		}
		.box-wrap {
			flex-direction: column;
			justify-self: center;
		}
		.status {
			position: static;
			margin: 0 0 0.5rem;
			order: 3;
		}
		.pipe-out {
			order: 4;
		}
		.outro {
			margin-top: 2rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.in-word,
		.out-word,
		.outro {
			transition: none;
			animation: none;
		}
	}
</style>
