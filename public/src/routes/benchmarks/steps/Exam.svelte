<script>
	// Step 1: a benchmark is an exam for a model. Five ingredients, each with a real example from
	// the project's sample data, and the name that part has in the project.
	const parts = [
		{
			n: 1,
			name: 'The questions',
			text: 'A fixed set of real requests. Ideally ones people actually asked, not invented for the test.',
			example: ['What is the capital of Spain?', 'Which planet is closest to the Sun?', 'What is 17 × 23?'],
			project: 'the source'
		},
		{
			n: 2,
			name: 'The answer key',
			text: 'What a good answer looks like. Often simply the answer we got before, from the model we use today.',
			example: ['Madrid', 'Mercury', '391'],
			project: 'part of each input'
		},
		{
			n: 3,
			name: 'The same conditions',
			text: 'Same instructions, same settings, every time. Change them and it is a different exam.',
			example: ['Instructions: “Answer with a single word.”', 'Thinking: low', 'Max answer length: 2,048 tokens'],
			project: 'the configuration'
		},
		{
			n: 4,
			name: 'The grading',
			text: 'A rule that decides whether an answer counts: an exact match, “close enough”, or another model acting as the grader.',
			example: ['“Madrid” vs “Madrid” → ✓', '“Venus” vs “Mercury” → ✗'],
			project: 'a step'
		},
		{
			n: 5,
			name: 'The report card',
			text: 'Everything written down: every answer, how long it took, what it cost. So next month’s model can sit the same exam.',
			example: ['5 / 6 correct', '1.4 s per answer', '€2.10 per 1,000'],
			project: 'the results'
		}
	];

	let open = $state(1);
</script>

<div class="exam">
	<div class="head">
		<div>
			<p class="step-label">Step 1 · What is a benchmark?</p>
			<h2 class="step-title">An exam for a model</h2>
		</div>
		<p class="step-lede">
			Trying a model by hand a few times tells you how it felt. A benchmark tells you how it
			<strong>did</strong>: the same questions, asked the same way, graded by the same rule, with every
			result written down. Tap each part to see an example.
		</p>
	</div>

	<ol class="parts">
		{#each parts as p (p.n)}
			<li class:open={open === p.n}>
				<button onclick={() => (open = p.n)} aria-expanded={open === p.n}>
					<span class="n">{p.n}</span>
					<span class="name">{p.name}</span>
					<span class="text">{p.text}</span>
					<span class="example" aria-hidden={open !== p.n}>
						{#each p.example as line (line)}<span>{line}</span>{/each}
					</span>
					<span class="project">In the project: <strong>{p.project}</strong></span>
				</button>
			</li>
		{/each}
	</ol>

	<p class="takeaway">
		The exam is what makes models <strong>comparable</strong>. A model tried by hand is a story; two
		models that sat the same exam are two numbers you can put side by side.
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
	strong {
		color: var(--ink);
		font-weight: normal;
		border-bottom: 2px solid var(--accent-mid);
	}

	.parts {
		list-style: none;
		margin: 2rem 0 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 0.75rem;
	}
	.parts button {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.45rem;
		padding: 1rem;
		text-align: left;
		font: inherit;
		color: var(--ink);
		background: var(--card);
		border: var(--bw) solid var(--line);
		border-radius: var(--radius);
		cursor: pointer;
		transition:
			border-color 0.2s,
			box-shadow 0.2s,
			transform 0.2s;
	}
	.parts button:hover {
		border-color: var(--accent-mid);
	}
	.open button {
		border-color: var(--accent);
		box-shadow: var(--shadow-lift);
		transform: translateY(-3px);
	}
	.n {
		display: grid;
		place-items: center;
		width: 1.8rem;
		height: 1.8rem;
		border-radius: 50%;
		background: var(--accent-soft);
		color: var(--accent);
		font-weight: 700;
		font-size: 0.9rem;
	}
	.open .n {
		background: var(--accent);
		color: white;
	}
	.name {
		font-weight: 700;
		font-size: 1.05rem;
	}
	.text {
		font-size: 0.88rem;
		line-height: 1.45;
		color: var(--ink-soft);
	}
	/* The example only shows on the open card */
	.example {
		display: grid;
		gap: 0.25rem;
		width: 100%;
		box-sizing: border-box;
		padding: 0.55rem 0.65rem;
		border-radius: var(--radius-sm);
		background: var(--dark);
		color: var(--on-dark);
		font-family: var(--font-mono);
		font-size: 0.72rem;
		line-height: 1.4;
		opacity: 0;
		max-height: 0;
		overflow: hidden;
		transition:
			opacity 0.3s,
			max-height 0.3s;
	}
	.open .example {
		opacity: 1;
		max-height: 8rem;
	}
	.project {
		margin-top: auto;
		padding-top: 0.3rem;
		font-size: 0.75rem;
		color: var(--muted);
	}
	.project strong {
		color: var(--accent);
		border: 0;
		font-weight: 700;
	}

	.takeaway {
		max-width: 46rem;
		margin: 1.5rem 0 0;
		font-size: 1.1rem;
		line-height: 1.6;
	}

	@media (max-width: 1000px) {
		.parts {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 860px) {
		.head {
			grid-template-columns: minmax(0, 1fr);
		}
		.step-lede {
			margin-top: 1rem;
		}
	}
	@media (max-width: 600px) {
		.parts {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.parts button,
		.example {
			transition: none;
		}
	}
</style>
