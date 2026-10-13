<script>
	// Step 4: the same raw model, chat-trained by three teams with different example answers.
	// Each team's model is just as "sure" of its own answer: confidence is trained, not earned.

	const teams = [
		{ name: 'Team Balanced', rule: 'Show every side' },
		{ name: 'Team Careful', rule: 'Stay out of it' },
		{ name: 'Team Opinion', rule: 'Pick a side' }
	];

	// For each question, one [reply, chance in %] per team, in the order above
	const questions = [
		{
			q: 'What are your political views?',
			answers: [
				["I don't have views of my own, but here's what Blue and Orange each argue…", 92],
				["I'm not able to discuss politics. Can I help with something else?", 94],
				['Orange is clearly the better choice. Here is why…', 89]
			]
		},
		{
			q: 'Is a hot dog a sandwich?',
			answers: [
				['Depends who you ask! Technically it is bread around a filling, but most people say no.', 88],
				["That's a matter of taste, so I'll leave that one to you!", 90],
				['Absolutely. Bread, filling, done. It is a sandwich.', 91]
			]
		},
		{
			q: 'Is it ever okay to lie?',
			answers: [
				['Many people think small lies to spare feelings are fine, others say honesty always wins. Here are both views…', 90],
				["That's a personal moral question, and I'd rather not weigh in.", 93],
				['No. Honesty comes first, even when it hurts.', 87]
			]
		},
		{
			q: "Who's the greatest footballer ever?",
			answers: [
				['Messi and Pelé come up most, with Maradona and Ronaldo close behind. It depends what you value.', 91],
				["There's no single answer to that one, it comes down to taste!", 92],
				["Messi. It's not even close.", 90]
			]
		}
	];

	let index = $state(0);
	let question = $derived(questions[index]);
</script>

<div class="recipes">
	<div class="head">
		<div>
			<p class="step-label">Step 4 · Same model, different teachers</p>
			<h2 class="step-title">Who writes the examples decides the answer</h2>
		</div>
		<p class="step-lede">
			Take the exact same raw model from step 2 and hand it to three teams. Each one writes its own
			example answers and trains its own copy. Pick a question and compare.
		</p>
	</div>

	<div class="questions" role="group" aria-label="Pick a question">
		{#each questions as q, i (q.q)}
			<button class="chip" class:active={i === index} onclick={() => (index = i)}>{q.q}</button>
		{/each}
	</div>

	<div class="teams">
		{#each teams as team, i (team.name)}
			{@const [reply, p] = question.answers[i]}
			<div class="team">
				<p class="name">{team.name}</p>
				<p class="rule">Trained to: {team.rule}</p>
				{#key index}
					<p class="reply">{reply}</p>
				{/key}
				<div class="sure">
					<span class="bar"><span style="width: {p}%"></span></span>
					<span class="pct">says this {p}% of the time</span>
				</div>
			</div>
		{/each}
	</div>

	<p class="takeaway">
		All three are <strong>just as sure</strong> of their answer, and none of them is “wrong”. A tall
		bar doesn't mean the answer is true. It means that's what the model was trained to say. When a
		question has no right answer, <strong>the answer you get is a choice somebody made</strong>.
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
	.takeaway strong {
		color: var(--ink);
		font-weight: normal;
		border-bottom: 2px solid var(--accent-mid);
	}

	.questions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 1.75rem 0 1.5rem;
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
	.chip:hover {
		border-color: var(--ink-soft);
	}
	.chip.active {
		background: var(--ink);
		border-color: var(--ink);
		color: var(--paper);
	}

	.teams {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1.25rem;
	}
	.team {
		display: flex;
		flex-direction: column;
		background: var(--card);
		border: var(--bw) solid var(--line);
		border-radius: var(--radius-lg);
		padding: 1.1rem 1.25rem;
		box-shadow: var(--shadow);
	}
	.name {
		margin: 0;
		font-weight: 700;
	}
	.rule {
		margin: 0.2rem 0 0;
		font-size: 0.85rem;
		color: var(--ink-soft);
	}
	.reply {
		flex: 1;
		margin: 0.9rem 0;
		padding: 0.6rem 0.95rem;
		border-radius: var(--radius) var(--radius) var(--radius) 4px;
		background: var(--accent-soft);
		line-height: 1.45;
		animation: pop 0.35s ease-out both;
	}
	@keyframes pop {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
	}
	.sure {
		display: grid;
		gap: 0.35rem;
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
		background: var(--accent);
		transition: width 0.6s ease;
	}
	.pct {
		font-size: 0.85rem;
		color: var(--ink-soft);
	}

	.takeaway {
		max-width: 46rem;
		margin: 2rem 0 0;
		font-size: 1.1rem;
		line-height: 1.6;
	}

	@media (max-width: 860px) {
		.head {
			grid-template-columns: minmax(0, 1fr);
		}
		.step-lede {
			margin-top: 1rem;
		}
		.teams {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.8rem;
		}
	}
	@media (max-width: 760px) {
		.questions {
			flex-wrap: nowrap;
			overflow-x: auto;
			margin: 1.25rem -16px;
			padding: 0 16px;
			scrollbar-width: none;
		}
		.chip {
			flex: 0 0 auto;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.reply {
			animation: none;
		}
	}
</style>
