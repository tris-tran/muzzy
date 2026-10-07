<script>
	// Step 3: the LLM only ever guesses the next word (token). Each "Run inference" adds one.
	import LlmBox from '../components/LlmBox.svelte';
	import Pipe from '../components/Pipe.svelte';

	// Each phrase has a chain of runs: the top guesses (with made-up but plausible chances, in %)
	// for the next token, given everything so far. The first guess is the one that gets picked.
	const phrases = [
		{
			start: 'Once upon a',
			runs: [
				[['time', 92], ['day', 3], ['hill', 2], ['midnight', 1]],
				[['there', 58], ['in', 24], ['a', 9], ['lived', 5]],
				[['was', 86], ['lived', 9], ['were', 3], ['stood', 1]],
				[['a', 72], ['an', 14], ['once', 6], ['nothing', 2]],
				[['little', 31], ['young', 22], ['princess', 15], ['king', 12]]
			]
		},
		{
			start: 'Happy birthday to',
			runs: [
				[['you', 97], ['me', 1], ['my', 1], ['all', 0.5]],
				[['!', 41], ['happy', 33], ['.', 12], ['and', 5]]
			]
		},
		{
			start: 'The cat sat on the',
			runs: [
				[['mat', 64], ['floor', 12], ['sofa', 9], ['windowsill', 6]],
				[['and', 34], ['.', 30], ['all', 12], ['purring', 8]],
				[['purred', 28], ['watched', 22], ['looked', 18], ['fell', 9]],
				[['happily', 26], ['.', 24], ['softly', 19], ['loudly', 8]]
			]
		},
		{
			start: 'The capital of France is',
			runs: [
				[['Paris', 94], ['a', 2], ['the', 1], ['located', 1]],
				[['.', 71], [',', 14], ['and', 9], ['!', 2]]
			]
		}
	];

	let phraseIndex = $state(0);
	let phrase = $derived(phrases[phraseIndex]);
	let added = $state([]); // tokens the LLM has added so far
	let runIndex = $derived(added.length);
	let guesses = $state([]); // candidates shown for the current run
	let grow = $state(false); // bars animate from 0 to their size
	let picked = $state(-1); // which guess is highlighted

	// ready → reading → thinking → scoring → picking → ready … → finished
	let phase = $state('ready');
	let busy = $derived(phase !== 'ready' && phase !== 'finished');

	let run = 0;
	const wait = (ms) => new Promise((r) => setTimeout(r, ms));

	async function infer() {
		const id = ++run;
		const slow = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.2 : 1;
		const step = async (name, ms) => {
			phase = name;
			await wait(ms * slow);
			return id === run;
		};

		guesses = [];
		grow = false;
		picked = -1;
		if (!(await step('reading', 700))) return;
		if (!(await step('thinking', 1000))) return;

		guesses = phrase.runs[runIndex];
		phase = 'scoring';
		await wait(30);
		grow = true;
		if (!(await step('scoring', 1100))) return;

		picked = 0;
		if (!(await step('picking', 700))) return;

		added = [...added, guesses[0][0]];
		phase = runIndex >= phrase.runs.length ? 'finished' : 'ready';
	}

	function choose(index) {
		run++;
		phraseIndex = index;
		reset();
	}

	function reset() {
		run++;
		added = [];
		guesses = [];
		grow = false;
		picked = -1;
		phase = 'ready';
	}

	// Punctuation sticks to the word before it
	const isPunct = (t) => /^[.,!?]$/.test(t);
	let rest = $derived(100 - guesses.reduce((sum, [, p]) => sum + p, 0));
</script>

<div class="next-word">
	<div class="head">
		<div>
			<p class="step-label">Step 3 · One word at a time</p>
			<h2 class="step-title">Why does it come out word by word?</h2>
			<p class="answer">Because that's really how it works.</p>
		</div>
		<p class="step-lede">
			An LLM can only do one thing: look at some text and <strong>guess what comes next</strong>.
			It's the same game as finishing a familiar sentence. You can do it too, without even trying:
		</p>
	</div>

	<div class="phrases" role="group" aria-label="Pick a sentence">
		{#each phrases as p, i (p.start)}
			<button class="chip" class:active={i === phraseIndex} disabled={busy} onclick={() => choose(i)}
				>{p.start} …</button
			>
		{/each}
	</div>

	<div class="stage" data-phase={phase}>
		<!-- The text so far -->
		<div class="panel sentence">
			<span class="label">The text so far</span>
			<p class="text">
				{phrase.start}{#each added as token, i (i)}{isPunct(token) ? '' : ' '}<span
						class="added"
						class:newest={i === added.length - 1}>{token}</span
					>{/each}{#if phase !== 'finished'}<span class="blank">{'\u00a0___'}</span>{/if}
			</p>
			<div class="controls">
				<button class="run" onclick={infer} disabled={busy || phase === 'finished'}>
					▶ Run inference
				</button>
				{#if added.length}<button class="reset" onclick={reset} disabled={busy}>Start over</button>{/if}
			</div>
		</div>

		<div class="machine">
			<Pipe flowing={phase === 'reading'} />
			<LlmBox
				mode={phase === 'thinking' ? 'thinking' : busy ? 'working' : 'idle'}
				size="min(10rem, 26vw)"
			/>
			<div class="pipe-out"><Pipe flowing={phase === 'scoring'} /></div>
			<p class="status" aria-live="polite">
				{#if phase === 'reading'}Reading all the text so far…
				{:else if phase === 'thinking'}Calculating the next token…
				{:else if phase === 'scoring'}Scoring every possible next token…
				{:else if phase === 'picking'}Picking the most likely one
				{:else if phase === 'finished'}Done.
				{:else if added.length}Run {added.length} done. One run, one token.
				{:else}Ready.{/if}
			</p>
		</div>

		<!-- Its guesses for the next token -->
		<div class="panel guesses">
			<span class="label">Its guesses for the next token</span>
			{#if guesses.length}
				<ol>
					{#each guesses as [token, p], i (token + i)}
						<li class:picked={i === picked}>
							<span class="token">{token}</span>
							<span class="bar"><span style="width: {grow ? p : 0}%"></span></span>
							<span class="pct">{p}%</span>
						</li>
					{/each}
					<li class="other">
						<span class="token">everything else</span>
						<span class="bar"><span style="width: {grow ? rest : 0}%"></span></span>
						<span class="pct">{Math.round(rest * 10) / 10}%</span>
					</li>
				</ol>
			{:else}
				<p class="empty">
					{phase === 'reading' || phase === 'thinking'
						? 'Working it out…'
						: 'Press “Run inference” to see what it thinks comes next.'}
				</p>
			{/if}
		</div>
	</div>

	<p class="takeaway" class:visible={added.length > 0}>
		{#if phase === 'finished'}
			That's how every answer gets written: guess one token, add it to the text, run again. Over and
			over, until it decides it's done. But how did it learn which words are likely in the first place?
		{:else}
			Each run of the model is called an <strong>inference</strong>, and each run adds exactly one
			piece, a <strong>token</strong> (usually a word, sometimes part of one, or a full stop). Want
			the next one? Run it again.
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
	.answer {
		margin: 0.6rem 0 0;
		font-size: 1.6rem;
		font-style: italic;
		color: var(--accent);
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

	.phrases {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 1.5rem 0 1.75rem;
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

	/* Stage: text → box → guesses */
	.stage {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
		align-items: center;
	}
	.panel {
		background: var(--card);
		border: var(--bw) solid var(--line);
		border-radius: var(--radius);
		padding: 1.1rem 1.25rem;
		min-height: 13.5rem;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		transition: box-shadow 0.3s ease;
	}
	.stage[data-phase='reading'] .sentence {
		box-shadow: 0 0 0 2px var(--accent-mid);
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
	.added {
		color: var(--accent);
	}
	.added.newest {
		display: inline-block;
		animation: drop-in 0.4s ease-out both;
		background: var(--accent-soft);
		border-radius: 4px;
		padding: 0 0.15em;
		margin: 0 -0.15em;
	}
	@keyframes drop-in {
		from {
			opacity: 0;
			transform: translateY(-8px);
		}
	}
	.blank {
		color: var(--muted);
		animation: blink 1.2s ease-in-out infinite;
	}
	@keyframes blink {
		50% {
			opacity: 0.3;
		}
	}

	.controls {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
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
	.reset {
		font: inherit;
		font-size: 0.9rem;
		background: none;
		border: 0;
		padding: 0;
		color: var(--ink-soft);
		text-decoration: underline;
		cursor: pointer;
	}

	/* The machine in the middle */
	.machine {
		position: relative;
		display: flex;
		align-items: center;
	}
	.status {
		position: absolute;
		top: 100%;
		left: -2rem;
		right: -2rem;
		margin: 0.9rem 0 0;
		text-align: center;
		font-size: 0.9rem;
		font-style: italic;
		color: var(--ink-soft);
	}

	/* Guesses with probability bars */
	ol {
		list-style: none;
		margin: 0.7rem 0 0;
		padding: 0;
		display: grid;
		gap: 0.45rem;
	}
	li {
		display: grid;
		grid-template-columns: 6.5rem 1fr 3rem;
		align-items: center;
		gap: 0.6rem;
		padding: 0.15rem 0.4rem;
		margin: 0 -0.4rem;
		border-radius: 6px;
		transition: background 0.3s ease;
	}
	.token {
		font-size: 1.05rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.bar {
		height: 0.6rem;
		border-radius: var(--pill);
		background: var(--track);
		overflow: hidden;
	}
	.bar span {
		display: block;
		height: 100%;
		border-radius: inherit;
		background: var(--track-strong);
		transition: width 0.9s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	li:first-child .bar span {
		background: var(--accent-mid);
	}
	.pct {
		font-size: 0.85rem;
		text-align: right;
		color: var(--ink-soft);
		font-variant-numeric: tabular-nums;
	}
	li.picked {
		background: var(--accent-soft);
	}
	li.picked .token {
		color: var(--accent);
		font-weight: bold;
	}
	li.picked .bar span {
		background: var(--accent);
	}
	li.other .token {
		font-size: 0.85rem;
		font-style: italic;
		color: var(--ink-soft);
	}
	.empty {
		margin: auto 0;
		color: var(--muted);
		font-style: italic;
	}

	.takeaway {
		max-width: 44rem;
		margin: 3rem 0 0;
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
		.answer {
			font-size: 1.3rem;
		}
		.phrases {
			flex-wrap: nowrap;
			overflow-x: auto;
			margin: 1.25rem -16px 1.25rem;
			padding: 0 16px;
			scrollbar-width: none;
		}
		.chip {
			flex: 0 0 auto;
		}
		.stage {
			grid-template-columns: minmax(0, 1fr);
		}
		.panel {
			min-height: 0;
		}
		.machine {
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
		.takeaway {
			margin-top: 1.5rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.added.newest,
		.blank {
			animation: none;
		}
		.bar span {
			transition: none;
		}
	}
</style>
