<script>
	// Step 2: a model that has only read text (no chat training yet) answers like a random person
	// from that text. Each ask rolls the dice on the first token, and the reply follows from it.
	// The parties are made up (Blue and Orange) to keep things neutral.
	import Bars, { roll } from '../components/Bars.svelte';

	// First token → the kind of reply it leads to. Slightly more Blue than Orange, like its reading.
	const guesses = [
		['I', 30, 'I vote Blue every time. Orange only looks after the rich.'],
		['Orange', 22, 'Orange, obviously. Blue would wreck the economy.'],
		['Honestly', 18, "Honestly? They're all the same. I stopped voting years ago."],
		['Somewhere', 12, 'Somewhere in the middle. Blue on some things, Orange on others.'],
		['Why', 10, 'Why do you want to know? Mind your own business.']
	];
	const options = guesses.map(([t, p]) => [t, p]);
	const ASKS = 6;

	let replies = $state([]);
	let picked = $state(-1);
	let phase = $state('ready'); // ready → asking → done

	let run = 0;
	const wait = (ms) => new Promise((r) => setTimeout(r, ms));

	async function askMany() {
		const id = ++run;
		const slow = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.2 : 1;
		replies = [];
		phase = 'asking';
		for (let i = 0; i < ASKS; i++) {
			picked = roll(options);
			await wait(450 * slow);
			if (id !== run) return;
			replies = [...replies, guesses[picked][2]];
			await wait(350 * slow);
			if (id !== run) return;
		}
		picked = -1;
		phase = 'done';
	}
</script>

<div class="raw-model">
	<div class="head">
		<div>
			<p class="step-label">Step 2 · Before chat training</p>
			<h2 class="step-title">Ask a raw model about politics, and you get the internet</h2>
		</div>
		<p class="step-lede">
			Before it learns to chat, a model has only read text: forums, news, comments, books. Ask it
			about its politics and it simply continues the text <strong>the way people online would</strong>.
			To keep things neutral, imagine a country with two parties: <span class="blue">Blue</span> and
			<span class="orange">Orange</span>.
		</p>
	</div>

	<div class="body">
		<div class="left">
			<div class="prompt">
				<span class="label">The text so far</span>
				<pre>Q: What are your political views?
A: <span class="blank">___</span></pre>
			</div>
			<div class="panel">
				<span class="label">Its guesses for the next token</span>
				<div class="bars"><Bars {options} {picked} accent={-1} /></div>
			</div>
			<button class="run" onclick={askMany} disabled={phase === 'asking'}>🎲 Ask it {ASKS} times</button>
		</div>

		<ul class="replies" aria-live="polite">
			{#each replies as r, i (i)}
				<li>{r}</li>
			{:else}
				<li class="empty">Its answers show up here.</li>
			{/each}
		</ul>
	</div>

	<p class="takeaway" class:visible={phase === 'done'}>
		There is no single “its opinion”. Each time it plays <strong>a different person</strong> from the
		text it read. And notice the tilt: it read a bit more Blue writing than Orange, so Blue comes up
		more often. Nobody chose that. <strong>It came with the data.</strong>
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
	.takeaway strong {
		color: var(--ink);
		font-weight: normal;
		border-bottom: 2px solid var(--accent-mid);
	}
	.blue {
		color: #2563eb;
		font-weight: 700;
	}
	.orange {
		color: #ea580c;
		font-weight: 700;
	}

	.body {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 2rem;
		align-items: start;
		margin-top: 2rem;
	}
	.left {
		display: grid;
		gap: 1rem;
		justify-items: start;
	}
	.label {
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}

	.prompt {
		width: 100%;
		box-sizing: border-box;
		background: var(--dark);
		border-radius: var(--radius);
		padding: 0.9rem 1.1rem;
		box-shadow: var(--shadow-lift);
	}
	.prompt .label {
		color: color-mix(in srgb, var(--on-dark) 55%, transparent);
	}
	pre {
		margin: 0.5rem 0 0;
		font-family: var(--font-mono);
		font-size: 1rem;
		line-height: 1.6;
		color: var(--on-dark);
		white-space: pre-wrap;
	}
	.prompt .blank {
		color: color-mix(in srgb, var(--on-dark) 45%, transparent);
	}

	.panel {
		width: 100%;
		box-sizing: border-box;
		background: var(--card);
		border: var(--bw) solid var(--line);
		border-radius: var(--radius);
		padding: 1.1rem 1.25rem;
	}
	.bars {
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

	/* The answers, as chat bubbles */
	.replies {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.6rem;
	}
	.replies li {
		justify-self: start;
		max-width: 26rem;
		padding: 0.6rem 0.95rem;
		border-radius: var(--radius) var(--radius) var(--radius) 4px;
		background: var(--card);
		border: var(--bw) solid var(--line);
		box-shadow: var(--shadow);
		line-height: 1.45;
		animation: pop 0.3s ease-out both;
	}
	.replies li.empty {
		background: none;
		border-style: dashed;
		box-shadow: none;
		color: var(--muted);
		font-style: italic;
		animation: none;
	}
	@keyframes pop {
		from {
			opacity: 0;
			transform: translateY(8px) scale(0.97);
		}
	}

	.takeaway {
		max-width: 44rem;
		margin: 2rem 0 0;
		font-size: 1.1rem;
		line-height: 1.6;
		opacity: 0;
		transition: opacity 0.5s ease;
	}
	.takeaway.visible {
		opacity: 1;
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
		.replies li {
			animation: none;
		}
	}
</style>
