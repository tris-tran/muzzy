<script>
	// Step 2: run a tiny benchmark by hand. Six recorded questions go to two models; answers come
	// back at each model's speed and are graded against the answer key. A grading switch shows that
	// the rule is part of the exam: today's model writes "portuguese" in lower case.
	// The questions come from the project's sample data; the answers, times and prices are made up.
	const rows = [
		{ q: 'What is the capital of Spain?', key: 'Madrid', a: ['Madrid', 1.3], b: ['Madrid', 0.5] },
		{ q: 'Which planet is closest to the Sun?', key: 'Mercury', a: ['Mercury', 1.2], b: ['Venus', 0.6] },
		{ q: 'What is 17 × 23? Just the number.', key: '391', a: ['391', 1.8], b: ['391', 0.7] },
		{ q: 'How many minutes are in three days?', key: '4320', a: ['4320', 1.6], b: ['4230', 0.6] },
		{ q: 'In which year did the Berlin Wall fall?', key: '1989', a: ['1989', 1.1], b: ['1989', 0.5] },
		{ q: 'What language is spoken in Brazil?', key: 'Portuguese', a: ['portuguese', 1.4], b: ['Portuguese', 0.6] }
	];
	const models = [
		{ id: 'a', name: 'Today’s model', cost: 2.1 },
		{ id: 'b', name: 'New, cheaper model', cost: 0.4 }
	];
	const SPEED = 0.5; // seconds of animation per second of "model time"

	let exact = $state(true); // grading: exact match, or ignore capitals
	let shown = $state({}); // `${row}-${model}` → true once that answer has arrived
	let current = $state(-1); // row being asked
	let phase = $state('ready'); // ready → running → done

	const answer = (row, m) => row[m][0];
	const correct = (row, m) =>
		exact ? answer(row, m) === row.key : answer(row, m).toLowerCase() === row.key.toLowerCase();

	let scores = $derived(
		models.map((m) => {
			const done = rows.filter((_, i) => shown[`${i}-${m.id}`]);
			return {
				...m,
				answered: done.length,
				right: done.filter((r) => correct(r, m.id)).length,
				time: done.length ? done.reduce((s, r) => s + r[m.id][1], 0) / done.length : 0
			};
		})
	);

	let run = 0;
	const wait = (ms) => new Promise((r) => setTimeout(r, ms));

	async function start() {
		const id = ++run;
		const slow = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.2 : 1;
		shown = {};
		phase = 'running';
		for (let i = 0; i < rows.length; i++) {
			current = i;
			// Both models get the question at once; each answers at its own speed
			const arrivals = models.map(async (m) => {
				await wait(rows[i][m.id][1] * 1000 * SPEED * slow);
				if (id === run) shown = { ...shown, [`${i}-${m.id}`]: true };
			});
			await Promise.all(arrivals);
			if (id !== run) return;
			await wait(250 * slow);
		}
		current = -1;
		phase = 'done';
	}

	function reset() {
		run++;
		shown = {};
		current = -1;
		phase = 'ready';
	}
</script>

<div class="try-it">
	<div class="head">
		<div>
			<p class="step-label">Step 2 · Let's run one</p>
			<h2 class="step-title">Same exam, two models</h2>
		</div>
		<p class="step-lede">
			Six recorded questions, with the answers we got before as the key. Today's model and a new,
			cheaper one get each question at the same moment. Press run and watch them answer.
		</p>
	</div>

	<div class="controls">
		<button class="run" onclick={start} disabled={phase === 'running'}>
			▶ {phase === 'done' ? 'Run again' : 'Run the benchmark'}
		</button>
		<div class="grading" role="group" aria-label="Grading rule">
			<span>Grading:</span>
			<button class:active={exact} onclick={() => (exact = true)}>Exact match</button>
			<button class:active={!exact} onclick={() => (exact = false)}>Ignore capitals</button>
		</div>
		{#if phase !== 'ready'}<button class="link" onclick={reset}>Reset</button>{/if}
	</div>

	<div class="table" role="table" aria-label="Questions and answers">
		<div class="row header" role="row">
			<span role="columnheader">Question</span>
			<span role="columnheader">Answer key</span>
			{#each models as m (m.id)}<span role="columnheader">{m.name}</span>{/each}
		</div>
		{#each rows as row, i (row.q)}
			<div class="row" class:current={i === current} role="row">
				<span class="q" role="cell">{row.q}</span>
				<span class="key" role="cell">{row.key}</span>
				{#each models as m (m.id)}
					{@const arrived = shown[`${i}-${m.id}`]}
					<span class="answer" role="cell">
						{#if arrived}
							{@const ok = correct(row, m.id)}
							<span class="value" class:ok class:bad={!ok}>{answer(row, m.id)}</span>
							<span class="mark" class:ok class:bad={!ok}>{ok ? '✓' : '✗'}</span>
							<span class="time">{row[m.id][1].toFixed(1)} s</span>
						{:else if i === current}
							<span class="thinking">thinking…</span>
						{/if}
					</span>
				{/each}
			</div>
		{/each}
	</div>

	<div class="scores">
		{#each scores as s (s.id)}
			<div class="score">
				<span class="who">{s.name}</span>
				<span class="big">{s.right}<small> / {rows.length} correct</small></span>
				<span class="bar"><span style="width: {(s.right / rows.length) * 100}%"></span></span>
				<span class="facts">
					{s.answered ? `${s.time.toFixed(1)} s per answer` : '– s per answer'} ·
					€{s.cost.toFixed(2)} per 1,000 questions
				</span>
			</div>
		{/each}
	</div>

	<p class="takeaway" class:visible={phase === 'done'}>
		The new model is <strong>over twice as fast and five times cheaper</strong>, but gets more wrong.
		Good enough? That's your call, now made on numbers. And try the grading switch: is “portuguese”
		wrong? The rule is part of the exam.
	</p>
	<p class="note">Questions from the project's sample data. Answers, times and prices are made up.</p>
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
	.takeaway strong {
		color: var(--ink);
		font-weight: normal;
		border-bottom: 2px solid var(--accent-mid);
	}

	.controls {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.8rem 1.5rem;
		margin-top: 1.2rem;
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
	.grading {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.9rem;
		color: var(--ink-soft);
	}
	.grading button {
		font: inherit;
		font-size: 0.85rem;
		padding: 0.3rem 0.8rem;
		border-radius: var(--pill);
		border: var(--bw) solid var(--line);
		background: var(--card);
		color: var(--ink);
		cursor: pointer;
	}
	.grading button.active {
		background: var(--ink);
		border-color: var(--ink);
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

	/* The answer sheet */
	.table {
		margin-top: 1rem;
		border: var(--bw) solid var(--line);
		border-radius: var(--radius);
		background: var(--card);
		overflow: hidden;
	}
	.row {
		display: grid;
		grid-template-columns: minmax(0, 2.2fr) minmax(0, 0.9fr) minmax(0, 1.3fr) minmax(0, 1.3fr);
		gap: 1rem;
		align-items: center;
		padding: 0.36rem 1rem;
		border-top: var(--bw) solid var(--line);
		transition: background 0.2s;
	}
	.row.header {
		border-top: 0;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-soft);
		background: var(--track);
	}
	.row.current {
		background: var(--accent-soft);
	}
	.q {
		font-size: 0.95rem;
	}
	.key {
		font-family: var(--font-mono);
		font-size: 0.88rem;
		color: var(--ink-soft);
	}
	.answer {
		display: flex;
		align-items: baseline;
		gap: 0.45rem;
		min-height: 1.4em;
	}
	.value {
		font-family: var(--font-mono);
		font-size: 0.88rem;
		animation: pop 0.3s ease-out both;
	}
	.mark {
		font-weight: 700;
	}
	.ok {
		color: var(--good);
	}
	.bad {
		color: var(--bad);
	}
	.time {
		font-size: 0.75rem;
		color: var(--muted);
		font-variant-numeric: tabular-nums;
	}
	.thinking {
		font-size: 0.85rem;
		font-style: italic;
		color: var(--muted);
		animation: blink 1s ease-in-out infinite;
	}
	@keyframes pop {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
	}
	@keyframes blink {
		50% {
			opacity: 0.35;
		}
	}

	/* The report cards */
	.scores {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin-top: 1rem;
	}
	.score {
		display: grid;
		gap: 0.2rem;
		padding: 0.6rem 1rem;
		border-radius: var(--radius);
		border: var(--bw) solid var(--line);
		background: var(--card);
	}
	.who {
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}
	.big {
		font-size: 1.6rem;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
	}
	.big small {
		font-size: 0.9rem;
		font-weight: 400;
		color: var(--ink-soft);
	}
	.bar {
		height: 0.5rem;
		border-radius: var(--pill);
		background: var(--track);
		overflow: hidden;
	}
	.bar span {
		display: block;
		height: 100%;
		border-radius: inherit;
		background: var(--accent);
		transition: width 0.4s ease;
	}
	.facts {
		font-size: 0.85rem;
		color: var(--ink-soft);
	}

	.takeaway {
		max-width: 52rem;
		margin: 0.8rem 0 0;
		font-size: 1.02rem;
		line-height: 1.6;
		opacity: 0;
		transition: opacity 0.5s;
	}
	.takeaway.visible {
		opacity: 1;
	}
	.note {
		margin: 0.3rem 0 0;
		font-size: 0.75rem;
		color: var(--muted);
	}

	@media (max-width: 860px) {
		.head {
			grid-template-columns: minmax(0, 1fr);
		}
		.step-lede {
			margin-top: 1rem;
		}
		.row {
			grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr) minmax(0, 1fr);
		}
		.key,
		.row.header span:nth-child(2) {
			display: none;
		}
	}
	@media (max-width: 600px) {
		.scores {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.value,
		.thinking {
			animation: none;
		}
	}
</style>
