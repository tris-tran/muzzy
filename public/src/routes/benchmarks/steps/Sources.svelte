<script>
	// Step 4: where the questions come from. Four kinds of test data, each with example rows, where
	// its answer key comes from, how it gets graded, and what it's good and bad at. The examples
	// are illustrative, except the recorded ones, which come from the project's sample data.
	const kinds = [
		{
			id: 'recorded',
			tab: 'Recorded requests',
			title: 'Save what we already ask Gemini',
			text: 'Keep every request we send to Gemini today, with the answer it gave, and replay them on a contender: exactly the work it would have to do.',
			columns: ['id', 'question', 'Gemini answered'],
			rows: [
				['req-0001', 'What is the capital of Spain?', 'Madrid'],
				['req-0004', 'What is the chemical symbol for gold?', 'Au'],
				['req-0006', 'How many minutes are in three days?', '4320']
			],
			key: 'Gemini’s answer: what we accept today, not necessarily correct.',
			graded: 'Exact match for short answers; a judge for prose.',
			good: 'Real traffic, thousands of rows for free.',
			watch: 'Personal data: clean it before keeping it.'
		},
		{
			id: 'targeted',
			tab: 'Targeted tests',
			title: 'Build a set that probes one skill',
			text: 'Write questions aimed at one ability (logic, arithmetic, following a format) to answer one sharp question: can it do that?',
			columns: ['id', 'question', 'correct answer'],
			rows: [
				['logic-01', 'Ana is older than Luis, Luis is older than Marta. Who is the youngest?', 'Marta'],
				['logic-02', 'All bloops are razzies and all razzies are lazzies. Are all bloops lazzies?', 'Yes'],
				['format-01', 'Reply only with JSON: {"city": …} for the capital of Italy.', '{"city": "Rome"}']
			],
			key: 'Written by us, so actually correct.',
			graded: 'An exact check: one right answer, or a valid format.',
			good: 'Finding out why a model fails.',
			watch: 'Famous puzzles may be in its training data: write your own.'
		},
		{
			id: 'translation',
			tab: 'Translation datasets',
			title: 'Borrow a dataset, or build one',
			text: 'Use a public set like FLORES-200 (the same sentences in 200 languages), or build one from documents we already have in two languages.',
			columns: ['id', 'Spanish', 'reference English'],
			rows: [
				['tr-0001', 'El plazo de presentación termina el viernes.', 'The submission deadline is Friday.'],
				['tr-0002', 'Adjunte el documento firmado.', 'Attach the signed document.'],
				['tr-0003', 'La solicitud ha sido aprobada.', 'The application has been approved.']
			],
			key: 'A professional translation: good, but never the only good one.',
			graded: 'Similarity, or a judge for meaning. Never exact.',
			good: 'Large, ready-made, comparable with published results.',
			watch: 'May be in the training data; may not sound like ours.'
		},
		{
			id: 'generated',
			tab: 'Generated',
			title: 'Ask a big model to write the exam',
			text: 'A strong model (Gemini Pro, say) drafts hundreds of questions with answers in minutes; a person checks a sample.',
			columns: ['id', 'question', 'drafted answer'],
			rows: [
				['gen-0001', 'A meeting starts at 9:40 and lasts 95 minutes. When does it end?', '11:15'],
				['gen-0002', 'Rewrite “The thing is broke” formally.', 'The device is not working.'],
				['gen-0003', 'Which is heavier: 1 kg of steel or 1 kg of feathers?', 'Neither: both weigh 1 kg']
			],
			// An important footnote on that last answer
			footnote: {
				row: 'gen-0003',
				text: 'Not everyone agrees. An important dissenting opinion:',
				link: 'Limmy’s Show, “What’s heavier, a kilogram of steel or a kilogram of feathers?”',
				url: 'https://www.youtube.com/watch?v=-fC2oke5MFg'
			},
			key: 'The generator’s answer, spot-checked by a person.',
			graded: 'Exact for facts, a judge for rewrites.',
			good: 'Starting fast on a topic with no data.',
			watch: 'Inherits the generator’s blind spots.'
		}
	];

	let picked = $state('recorded');
	let kind = $derived(kinds.find((k) => k.id === picked));
</script>

<div class="sources">
	<div class="head">
		<div>
			<p class="step-label">Step 4 · The data</p>
			<h2 class="step-title">Where the questions come from</h2>
		</div>
		<p class="step-lede">
			A benchmark is only as good as its questions: a few hundred that look like <strong>the work we
			actually need done</strong>. There's no single right source; these are the four we reach for.
		</p>
	</div>

	<div class="tabs" role="tablist" aria-label="Kinds of test data">
		{#each kinds as k, i (k.id)}
			<button role="tab" aria-selected={picked === k.id} class:active={picked === k.id} onclick={() => (picked = k.id)}>
				<span class="n">{i + 1}</span>{k.tab}
			</button>
		{/each}
	</div>

	{#key picked}
		<div class="panel" role="tabpanel">
			<div class="main">
				<h3>{kind.title}</h3>
				<p class="text">{kind.text}</p>
				<div class="table">
					<div class="tr th">
						{#each kind.columns as c (c)}<span>{c}</span>{/each}
					</div>
					{#each kind.rows as row (row[0])}
						<div class="tr">
							{#each row as cell, i (i)}<span class:id={i === 0}
									>{cell}{#if kind.footnote?.row === row[0] && i === row.length - 1}<sup>1</sup>{/if}</span
								>{/each}
						</div>
					{/each}
				</div>
				{#if kind.footnote}
					<p class="footnote">
						<sup>1</sup>
						{kind.footnote.text}
						<a href={kind.footnote.url} target="_blank" rel="noopener">{kind.footnote.link} ↗</a>
					</p>
				{/if}
			</div>
			<dl class="facts">
				<dt>Answer key</dt>
				<dd>{kind.key}</dd>
				<dt>Graded by</dt>
				<dd>{kind.graded}</dd>
				<dt>Good for</dt>
				<dd class="good">{kind.good}</dd>
				<dt>Watch out</dt>
				<dd class="bad">{kind.watch}</dd>
			</dl>
		</div>
	{/key}

	<p class="takeaway">
		Real benchmarks <strong>mix them</strong>. And whatever the source, every row ends up the same
		shape: <strong>an id, the question, and what a good answer looks like</strong>.
	</p>
</div>

<style>
	.head {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
		gap: 0 3rem;
		align-items: end;
	}
	.step-lede {
		margin: 0;
	}
	strong {
		color: var(--ink);
		font-weight: normal;
		border-bottom: 2px solid var(--accent-mid);
	}

	.tabs {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 1.5rem;
	}
	.tabs button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font: inherit;
		font-size: 0.95rem;
		padding: 0.4rem 0.95rem 0.4rem 0.45rem;
		border-radius: var(--pill);
		border: var(--bw) solid var(--line);
		background: var(--card);
		color: var(--ink);
		cursor: pointer;
	}
	.tabs button:hover {
		border-color: var(--ink-soft);
	}
	.tabs button.active {
		background: var(--ink);
		border-color: var(--ink);
		color: var(--paper);
	}
	.n {
		display: grid;
		place-items: center;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 50%;
		background: var(--accent-soft);
		color: var(--accent);
		font-size: 0.8rem;
		font-weight: 700;
	}

	.panel {
		display: grid;
		grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
		gap: 1.75rem;
		margin-top: 1rem;
		padding: 1.3rem 1.5rem;
		border-radius: var(--radius-lg);
		border: var(--bw) solid var(--line);
		background: var(--card);
		animation: fade 0.3s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
	}
	h3 {
		margin: 0;
		font-size: 1.3rem;
	}
	.text {
		margin: 0.5rem 0 0;
		line-height: 1.6;
		color: var(--ink-soft);
	}

	/* Example rows, like a peek into the file */
	.table {
		margin-top: 1rem;
		border-radius: var(--radius-sm);
		background: var(--dark);
		color: var(--on-dark);
		font-family: var(--font-mono);
		font-size: 0.78rem;
		overflow: hidden;
	}
	.tr {
		display: grid;
		grid-template-columns: 5.5rem minmax(0, 2fr) minmax(0, 1fr);
		gap: 0.9rem;
		padding: 0.45rem 0.85rem;
		border-top: 1px solid color-mix(in srgb, var(--on-dark) 10%, transparent);
	}
	.tr.th {
		border-top: 0;
		color: var(--tag);
		font-size: 0.7rem;
		letter-spacing: 0.04em;
	}
	.id {
		color: color-mix(in srgb, var(--on-dark) 55%, transparent);
	}

	sup {
		margin-left: 0.15em;
		color: var(--tag);
	}
	.footnote {
		margin: 0.5rem 0 0;
		font-size: 0.8rem;
		color: var(--ink-soft);
	}
	.footnote sup {
		color: var(--accent);
	}
	.footnote a {
		color: var(--accent);
	}
	.facts {
		display: grid;
		gap: 0.25rem;
		margin: 0;
		align-content: start;
	}
	dt {
		margin-top: 0.6rem;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}
	dt:first-child {
		margin-top: 0;
	}
	dd {
		margin: 0;
		font-size: 0.92rem;
		line-height: 1.5;
	}
	dd.good {
		color: var(--good);
	}
	dd.bad {
		color: var(--bad);
	}

	.takeaway {
		max-width: 56rem;
		margin: 1.25rem 0 0;
		font-size: 1.05rem;
		line-height: 1.6;
	}

	@media (max-width: 860px) {
		.head,
		.panel {
			grid-template-columns: minmax(0, 1fr);
		}
		.step-lede {
			margin-top: 1rem;
		}
		.tr {
			grid-template-columns: 4.5rem minmax(0, 1fr);
		}
		.tr span:last-child {
			grid-column: 2;
			color: var(--good-light);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.panel {
			animation: none;
		}
	}
</style>
