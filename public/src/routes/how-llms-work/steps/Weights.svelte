<script>
	// Step 5: open the box. Words become numbers, the numbers flow through the weights,
	// and out comes a score for each possible next word.
	import NetworkBox, { WEIGHT_COUNT, GAPS } from '#lib/presentation/NetworkBox.svelte';
	import Pipe from '#lib/presentation/Pipe.svelte';

	// Real GPT-2 token numbers for these words
	const tokens = [
		{ word: 'The', id: 464 },
		{ word: 'cat', id: 3797 },
		{ word: 'sat', id: 3332 },
		{ word: 'on', id: 319 },
		{ word: 'the', id: 262 }
	];
	// One output node per word, in the network's (unsorted) order
	const outWords = ['sofa', 'mat', 'roof', 'floor', 'bed'];
	const outScores = [9, 64, 3, 12, 6];
	const ranked = outWords
		.map((word, i) => ({ word, p: outScores[i] }))
		.sort((a, b) => b.p - a.p);

	// idle → converting (words → numbers) → feeding (numbers → network) → layer (pulses) → scored
	let phase = $state('idle');
	let converted = $state(0); // how many numbers have appeared
	let lit = $state(-1);
	let pulsing = $state(-1);
	let run = $state(0);
	let busy = $derived(phase !== 'idle' && phase !== 'scored');

	let id = 0;
	const wait = (ms) => new Promise((r) => setTimeout(r, ms));

	async function go() {
		const me = ++id;
		const slow = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.2 : 1;
		const step = async (ms) => {
			await wait(ms * slow);
			return me === id;
		};
		run++;
		converted = 0;
		lit = -1;
		pulsing = -1;

		phase = 'converting';
		for (let i = 1; i <= tokens.length; i++) {
			if (!(await step(260))) return;
			converted = i;
		}
		if (!(await step(400))) return;

		phase = 'feeding';
		if (!(await step(700))) return;
		lit = 0;

		phase = 'layer';
		for (let gap = 0; gap < GAPS; gap++) {
			pulsing = gap;
			if (!(await step(1050))) return;
			lit = gap + 1;
		}
		pulsing = -1;
		phase = 'scored';
	}
</script>

<div class="weights">
	<div class="head">
		<div>
			<p class="step-label">Step 5 · Opening the box</p>
			<h2 class="step-title">Those dials have a real name: <em>weights</em></h2>
		</div>
		<p class="step-lede">
			Open up the black box and you find a web of connections. Each line is a <strong>weight</strong>:
			just a number. Your words are turned into numbers, those numbers flow through the web, getting
			multiplied by every weight on the way, and out comes a score for each possible next word.
		</p>
	</div>

	<div class="stage" data-phase={phase}>
		<!-- 1. Words -->
		<div class="col">
			<span class="label">Words</span>
			<ol class="chips">
				{#each tokens as t, i (i)}
					<li class="chip word" class:sent={converted > i}>{t.word}</li>
				{/each}
			</ol>
		</div>

		<div class="link"><Pipe flowing={phase === 'converting'} /></div>

		<!-- 2. Numbers -->
		<div class="col">
			<span class="label">Numbers</span>
			<ol class="chips">
				{#each tokens as t, i (i)}
					<li class="chip num" class:filled={converted > i}>
						{#if converted > i}<span>{t.id}</span>{:else}<span class="dots">·</span>{/if}
					</li>
				{/each}
			</ol>
		</div>

		<div class="link"><Pipe flowing={phase === 'feeding'} /></div>

		<!-- 3. The network -->
		<div class="net">
			<NetworkBox {lit} {pulsing} {run} outputs={outScores.map((s) => s / 100)} labels={outWords} />
		</div>

		<div class="link"><Pipe flowing={phase === 'layer' && pulsing === GAPS - 1} /></div>

		<!-- 4. Ranked guesses -->
		<div class="outputs">
			<span class="label">Next word, most likely first</span>
			{#if phase === 'scored'}
				<ol class="ranked">
					{#each ranked as r, i (r.word)}
						<li style="--i: {i}">
							<span class="word">{r.word}</span>
							<span class="bar"><span style="--p: {r.p}%"></span></span>
							<span class="pct">{r.p}%</span>
						</li>
					{/each}
				</ol>
			{:else}
				<p class="empty">{busy ? 'Working…' : 'Nothing yet.'}</p>
			{/if}
		</div>
	</div>

	<div class="controls">
		<button class="run" onclick={go} disabled={busy}>
			▶ {phase === 'scored' ? 'Run it again' : 'Run inference'}
		</button>
		<p class="status" aria-live="polite">
			{#if phase === 'idle'}Watch the words go all the way through.
			{:else if phase === 'converting'}First, every word becomes a number…
			{:else if phase === 'feeding'}…the numbers go into the network…
			{:else if phase === 'layer'}…getting multiplied by the weights, layer by layer…
			{:else}…and out come scores for every possible next word.{/if}
		</p>
	</div>

	<div class="facts">
		<div>
			<h3>A weight is just a number</h3>
			<p>
				Like 0.37 or −1.2. Warm lines push the signal up, blue lines push it down; thicker means
				stronger. Hover any line to read its number.
			</p>
		</div>
		<div>
			<h3>Training tunes them</h3>
			<p>
				Those dials from the last step? These are them. Every guess during training nudges these
				numbers a tiny bit, until the right words come out on top.
			</p>
		</div>
		<div>
			<h3>This toy has {WEIGHT_COUNT}</h3>
			<p>
				Enough to draw on one screen. A real LLM works the same way, but with
				<strong>billions</strong> of them.
			</p>
		</div>
	</div>
</div>

<style>
	.head {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 0 3rem;
		align-items: end;
	}
	.step-title em {
		color: var(--accent);
	}
	.step-lede {
		margin: 0;
	}
	.step-lede strong,
	.facts strong {
		color: var(--ink);
		font-weight: normal;
		border-bottom: 2px solid var(--accent-mid);
	}

	/* words → numbers → network → ranked words */
	.stage {
		display: grid;
		grid-template-columns: 5.5rem auto 5.5rem auto minmax(0, 1fr) auto 12.5rem;
		align-items: center;
		margin-top: 1.75rem;
	}
	.label {
		display: block;
		font-size: 0.72rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-soft);
		margin-bottom: 0.5rem;
	}
	.chips {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.45rem;
	}
	.chip {
		display: grid;
		place-items: center;
		height: 2.1rem;
		border-radius: var(--radius-sm);
		border: var(--bw) solid var(--line);
		background: var(--card);
		font-size: 1.05rem;
		transition:
			opacity 0.3s ease,
			border-color 0.3s ease;
	}
	.chip.word.sent {
		opacity: 0.45;
	}
	.chip.num {
		border-style: dashed;
		background: transparent;
		font-family: var(--font-mono);
		font-size: 0.95rem;
		color: var(--accent);
	}
	.chip.num.filled {
		border-style: solid;
		border-color: var(--accent-mid);
		background: var(--accent-soft);
	}
	.chip.num.filled span {
		animation: pop 0.35s ease-out both;
	}
	@keyframes pop {
		from {
			opacity: 0;
			transform: scale(0.6);
		}
	}
	.dots {
		color: var(--muted);
	}
	.link {
		display: flex;
		justify-content: center;
		padding-top: 1.5rem; /* line up with the chips, below their label */
	}

	/* Ranked output */
	.outputs {
		background: var(--card);
		border: var(--bw) solid var(--line);
		border-radius: var(--radius);
		padding: 1rem 1.1rem;
		min-height: 13rem;
		box-sizing: border-box;
	}
	.ranked {
		list-style: none;
		margin: 0.2rem 0 0;
		padding: 0;
		display: grid;
		gap: 0.55rem;
	}
	.ranked li {
		display: grid;
		grid-template-columns: 3.2rem 1fr 2.3rem;
		align-items: center;
		gap: 0.5rem;
		animation: rise 0.4s ease-out both;
		animation-delay: calc(var(--i) * 110ms);
	}
	.ranked li:first-child .word {
		color: var(--accent);
		font-weight: bold;
	}
	@keyframes rise {
		from {
			opacity: 0;
			transform: translateX(-10px);
		}
	}
	.bar {
		height: 0.55rem;
		border-radius: var(--pill);
		background: var(--track);
		overflow: hidden;
	}
	.bar span {
		display: block;
		height: 100%;
		width: var(--p);
		border-radius: inherit;
		background: var(--accent-mid);
		animation: grow 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both;
		animation-delay: calc(var(--i) * 110ms + 150ms);
	}
	.ranked li:first-child .bar span {
		background: var(--accent);
	}
	@keyframes grow {
		from {
			width: 0;
		}
	}
	.pct {
		font-size: 0.8rem;
		text-align: right;
		color: var(--ink-soft);
		font-variant-numeric: tabular-nums;
	}
	.empty {
		margin: 2rem 0 0;
		color: var(--muted);
		font-style: italic;
	}

	.controls {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
		margin-top: 1.5rem;
	}
	.run {
		font: inherit;
		background: var(--accent);
		color: white;
		border: 0;
		padding: 0.55rem 1.1rem;
		border-radius: var(--pill);
		cursor: pointer;
		white-space: nowrap;
	}
	.run:hover:not(:disabled) {
		background: var(--accent-hover);
	}
	.run:disabled {
		opacity: 0.4;
		cursor: default;
	}
	.status {
		margin: 0;
		font-style: italic;
		color: var(--ink-soft);
	}

	/* Three short facts */
	.facts {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1.5rem;
		margin-top: 2.25rem;
		padding-top: 1.25rem;
		border-top: var(--bw) dashed var(--line);
	}
	.facts h3 {
		margin: 0 0 0.35rem;
		font-size: 1rem;
	}
	.facts p {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.5;
		color: var(--ink-soft);
	}

	@media (max-width: 860px) {
		.head {
			grid-template-columns: minmax(0, 1fr);
		}
		.step-lede {
			margin-top: 1rem;
		}
		.facts {
			grid-template-columns: minmax(0, 1fr);
			gap: 1rem;
			margin-top: 1.75rem;
		}
	}
	/* Narrow: stack top to bottom, chips in rows */
	@media (max-width: 760px) {
		/* Put the button above the stage so you can watch what it does */
		.weights {
			display: flex;
			flex-direction: column;
		}
		.stage {
			order: 2;
		}
		.facts {
			order: 3;
		}
		.controls {
			margin: 1.25rem 0 0.5rem;
		}
		.stage {
			grid-template-columns: minmax(0, 1fr);
		}
		.chips {
			grid-template-columns: repeat(5, minmax(0, 1fr));
			gap: 0.35rem;
		}
		.chip {
			font-size: 0.9rem;
		}
		.chip.num {
			font-size: 0.78rem;
		}
		.link {
			padding: 0.2rem 0;
		}
		.outputs {
			min-height: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.chip.num.filled span,
		.ranked li,
		.bar span {
			animation: none;
		}
	}
</style>
