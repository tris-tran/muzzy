<script>
	// Step 8: chat models are trained with the same guessing game, but on whole conversations.
	// The assistant's turn is hidden and the model has to guess it, piece by piece, including
	// the <|im_end|> that says "I'm done". Then a recap of the whole explainer.
	import ContextView from '../components/ContextView.svelte';
	import { message, opening, words, tag, END } from '../components/chatml.js';

	// `guesses` lines up with the reply's pieces (plus <|im_end|> at the end)
	const examples = [
		{
			user: "What's the capital of Italy?",
			reply: 'The capital of Italy is Rome.',
			guesses: ['The', 'capital', 'of', 'Italy', 'is', 'Milan.', END]
		},
		{
			user: 'Say hi in Spanish.',
			reply: '¡Hola! That means hi in Spanish.',
			guesses: ['¡Hola!', 'That', 'is', 'hi', 'in', 'Spanish.', 'Do']
		}
	];

	let index = $state(0);
	let example = $derived(examples[index]);
	let prompt = $derived([...message('system', 'You are a helpful assistant.'), ...message('user', example.user), ...opening('assistant')]);
	let answer = $derived([...words(example.reply), tag(END)].map((p, i) => ({ word: p.t.trim(), guess: example.guesses[i] })));

	let step = $state(-1); // which piece is being guessed
	let revealed = $state(0); // how many pieces are uncovered
	let phase = $state('ready'); // ready → training → done
	let right = $derived(answer.slice(0, revealed).filter((a) => a.word === a.guess).length);
	let wrong = $derived(revealed - right);

	let run = 0;
	const wait = (ms) => new Promise((r) => setTimeout(r, ms));

	async function train() {
		const id = ++run;
		const slow = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.2 : 1;
		revealed = 0;
		phase = 'training';
		for (let i = 0; i < answer.length; i++) {
			step = i;
			await wait(650 * slow);
			if (id !== run) return;
			revealed = i + 1;
			await wait(550 * slow);
			if (id !== run) return;
		}
		step = -1;
		phase = 'done';
	}

	function next() {
		run++;
		index = (index + 1) % examples.length;
		revealed = 0;
		step = -1;
		phase = 'ready';
	}
</script>

<div class="chat-training">
	<div class="head">
		<div>
			<p class="step-label">Step 8 · Training, one last time</p>
			<h2 class="step-title">Chat models learn by completing whole replies</h2>
		</div>
		<p class="step-lede">
			Remember the guessing game from step 4? To make a chat assistant, the training text is millions
			of example conversations in this exact format. The assistant's part is hidden, and the model has
			to guess it piece by piece, all the way to <code>&lt;|im_end|&gt;</code>.
		</p>
	</div>

	<div class="body">
		<div class="example">
			<div class="raw">
				<span class="label">Training example {index + 1} of {examples.length}</span>
				<ContextView tokens={prompt} />
				<div class="answer">
					{#each answer as a, i (index + '-' + i)}
						{@const shown = i < revealed}
						{@const ok = a.word === a.guess}
						<div class="slot" class:current={i === step}>
							<span class="card" class:shown class:end={a.word === END}>{shown ? a.word : '?'}</span>
							<span class="guess" class:ok={shown && ok} class:bad={shown && !ok}>
								{#if i === step || shown}
									<em>{a.guess}</em>
									{#if shown}{ok ? '✓' : '✗'}{/if}
								{/if}
							</span>
						</div>
					{/each}
				</div>
			</div>

			<div class="controls">
				{#if phase === 'done'}
					<button class="ghost" onclick={next}>Next conversation →</button>
					<button class="link" onclick={train}>Replay</button>
				{:else}
					<button class="run" onclick={train} disabled={phase === 'training'}>
						▶ Train on this conversation
					</button>
				{/if}
				<span class="score" class:visible={revealed > 0}>
					<span class="ok">✓ {right}</span> · <span class="bad">✗ {wrong}</span>
					{#if phase === 'done'}→ every wrong piece nudges the weights{/if}
				</span>
			</div>
			<p class="explain" class:visible={phase === 'done'}>
				{#if index === 0}
					It guessed “Milan.” instead of “Rome.”, so its weights get nudged. After millions of
					conversations it learns how an assistant answers, not just how sentences continue.
				{:else}
					It wanted to keep talking (“Do…”) when the reply should end. Getting nudged on
					<code>&lt;|im_end|&gt;</code> is how it learns when to stop.
				{/if}
			</p>
		</div>

		<aside class="recap">
			<h3>The whole story</h3>
			<ol>
				<li>From the outside, an LLM is a black box: <strong>text in, text out</strong>.</li>
				<li>Inside, it only ever <strong>guesses the next piece</strong> of text, one at a time.</li>
				<li>
					It learned to guess by playing that game on huge amounts of text, getting
					<strong>nudged</strong> after every guess.
				</li>
				<li>What gets nudged are its <strong>weights</strong>: just numbers, billions of them.</li>
				<li>
					A chat is the same trick: <strong>the whole conversation goes in, every time</strong>, and it
					completes the assistant's turn.
				</li>
			</ol>
		</aside>
	</div>
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
	code {
		font-family: var(--font-mono);
		font-size: 0.85em;
		color: var(--tag-ink);
	}

	.body {
		display: grid;
		grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
		gap: 2.5rem;
		align-items: start;
		margin-top: 2rem;
	}

	.raw {
		background: var(--dark);
		border-radius: var(--radius-lg);
		padding: 0.9rem 0 1.1rem;
		box-shadow: var(--shadow-lift);
	}
	.label {
		display: block;
		padding: 0 1.1rem;
		font-size: 0.72rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: color-mix(in srgb, var(--on-dark) 55%, transparent);
	}
	.raw :global(.context) {
		height: auto;
		padding-bottom: 0.3rem;
	}

	/* The hidden reply */
	.answer {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 0.4rem;
		padding: 0 1.1rem;
	}
	.slot {
		display: grid;
		justify-items: center;
		gap: 0.25rem;
	}
	.card {
		min-width: 2rem;
		padding: 0.15rem 0.5rem;
		border-radius: 6px;
		text-align: center;
		font-family: var(--font-mono);
		font-size: 0.85rem;
		background: color-mix(in srgb, var(--on-dark) 12%, var(--dark));
		color: color-mix(in srgb, var(--on-dark) 50%, transparent);
		transition:
			background 0.3s,
			color 0.3s;
	}
	.slot.current .card {
		box-shadow: 0 0 0 2px var(--accent-mid);
	}
	.card.shown {
		background: color-mix(in srgb, var(--on-dark) 92%, transparent);
		color: var(--dark);
		animation: flip 0.35s ease-out;
	}
	.card.shown.end {
		background: color-mix(in srgb, var(--tag) 25%, transparent);
		color: var(--tag);
	}
	@keyframes flip {
		from {
			transform: rotateX(90deg);
		}
	}
	.guess {
		min-height: 1.2em;
		font-size: 0.75rem;
		color: color-mix(in srgb, var(--on-dark) 55%, transparent);
		white-space: nowrap;
	}
	.guess em {
		font-style: normal;
		font-family: var(--font-mono);
	}
	.guess.ok {
		color: var(--good-light);
	}
	.guess.bad {
		color: var(--bad-light);
	}

	.controls {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
		margin-top: 1.1rem;
	}
	.run,
	.ghost {
		font: inherit;
		padding: 0.55rem 1.1rem;
		border-radius: var(--pill);
		cursor: pointer;
	}
	.run {
		background: var(--accent);
		color: white;
		border: 0;
	}
	.run:hover:not(:disabled) {
		background: var(--accent-hover);
	}
	.run:disabled {
		opacity: 0.4;
		cursor: default;
	}
	.ghost {
		background: none;
		border: var(--bw) solid var(--ink-soft);
		color: var(--ink);
	}
	.ghost:hover {
		background: var(--ink);
		color: var(--paper);
	}
	.link {
		font: inherit;
		font-size: 0.9rem;
		background: none;
		border: 0;
		padding: 0;
		color: var(--ink-soft);
		text-decoration: underline;
		cursor: pointer;
	}
	.score {
		font-size: 0.95rem;
		color: var(--ink-soft);
		opacity: 0;
		transition: opacity 0.3s;
	}
	.score.visible {
		opacity: 1;
	}
	.score .ok {
		color: var(--good);
	}
	.score .bad {
		color: var(--bad);
	}
	.explain {
		margin: 0.9rem 0 0;
		min-height: 3.2em;
		line-height: 1.55;
		opacity: 0;
		transition: opacity 0.5s;
	}
	.explain.visible {
		opacity: 1;
	}

	/* Recap */
	.recap {
		background: var(--card);
		border: var(--bw) solid var(--line);
		border-radius: var(--radius-lg);
		padding: 1.3rem 1.5rem;
	}
	.recap h3 {
		margin: 0 0 0.8rem;
		font-size: 0.8rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		font-weight: normal;
		color: var(--accent);
	}
	.recap ol {
		margin: 0;
		padding-left: 1.2rem;
		display: grid;
		gap: 0.6rem;
	}
	.recap li {
		line-height: 1.45;
		color: var(--ink-soft);
	}
	.recap strong {
		color: var(--ink);
		font-weight: normal;
		border-bottom: 2px solid var(--accent-mid);
	}

	@media (max-width: 860px) {
		.head,
		.body {
			grid-template-columns: minmax(0, 1fr);
		}
		.step-lede {
			margin-top: 1rem;
		}
		.body {
			gap: 1.5rem;
			margin-top: 1.5rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.card.shown {
			animation: none;
		}
	}
</style>
