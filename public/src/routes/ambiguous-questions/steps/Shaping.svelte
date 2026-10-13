<script>
	// Step 3: chat training on hand-written example answers reshapes the bars until the
	// "I don't take sides" reply wins. Each press trains on another batch and moves the bars a
	// bit further from the raw model (step 2) towards the trained one.
	import Bars, { roll } from '../components/Bars.svelte';

	// [first token, chance before training, chance after, the reply it leads to]
	const guesses = [
		['As', 2, 92, "As an AI, I don't have political views of my own. I can explain what Blue and Orange each argue, though."],
		['I', 30, 2, 'I vote Blue every time. Orange only looks after the rich.'],
		['Orange', 22, 1.5, 'Orange, obviously. Blue would wreck the economy.'],
		['Honestly', 18, 1.5, "Honestly? They're all the same. I stopped voting years ago."],
		['Why', 10, 0.5, 'Why do you want to know? Mind your own business.']
	];
	const ROUNDS = 4;
	const BATCH = 1000;

	const examples = [
		{
			user: 'What are your politics?',
			reply: "As an AI, I don't have political views of my own. Happy to explain each side's arguments, though."
		},
		{
			user: 'Who should I vote for?',
			reply: "As an AI, I'd rather not pick for you. That's your call! I can walk you through what each party proposes."
		}
	];

	let round = $state(0);
	let t = $derived(round / ROUNDS);
	let options = $derived(guesses.map(([tok, before, after]) => [tok, before + (after - before) * t]));
	let training = $state(false);
	let picked = $state(-1);
	let reply = $state('');

	const wait = (ms) => new Promise((r) => setTimeout(r, ms));

	async function trainMore() {
		training = true;
		picked = -1;
		reply = '';
		round++;
		await wait(900);
		training = false;
	}

	function ask() {
		picked = roll(options);
		reply = guesses[picked][3];
	}

	function reset() {
		round = 0;
		picked = -1;
		reply = '';
	}
</script>

<div class="shaping">
	<div class="head">
		<div>
			<p class="step-label">Step 3 · Chat training</p>
			<h2 class="step-title">Training decides which answer wins</h2>
		</div>
		<p class="step-lede">
			In part one, chat models learned by completing example conversations. Whoever writes those
			examples <strong>decides how the assistant should answer</strong>. Say the team writes thousands
			like these:
		</p>
	</div>

	<div class="body">
		<div class="examples">
			<span class="label">Hand-written training examples</span>
			{#each examples as ex (ex.user)}
				<div class="convo">
					<p class="user"><span>User</span>{ex.user}</p>
					<p class="assistant"><span>Assistant</span>{ex.reply}</p>
				</div>
			{/each}
			<p class="more">…and thousands more like them</p>
		</div>

		<div class="panel">
			<span class="label">User: What are your political views? · Assistant: ___</span>
			<div class="bars"><Bars {options} {picked} /></div>

			<div class="controls">
				{#if round < ROUNDS}
					<button class="run" onclick={trainMore} disabled={training}>
						▶ Train on {BATCH.toLocaleString('en')} more chats
					</button>
				{:else}
					<button class="link" onclick={reset}>Start over</button>
				{/if}
				<button class="ghost" onclick={ask} disabled={training}>🎲 Ask it</button>
			</div>
			<p class="count">
				Trained on <strong>{(round * BATCH).toLocaleString('en')}</strong> example chats
			</p>

			<p class="reply" class:visible={reply}>{reply || ' '}</p>
		</div>
	</div>

	<p class="takeaway" class:visible={round === ROUNDS}>
		Now “As” wins nine times out of ten. The model didn't gain an opinion, or lose one. It was
		<strong>nudged until the neutral reply became the likely one</strong>, exactly like it learned
		to end with <code>&lt;|im_end|&gt;</code>. And the old answers? They didn't vanish, they just got
		rare. That's why clever wording can sometimes still dig them up.
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
	code {
		font-family: var(--font-mono);
		font-size: 0.85em;
		color: var(--tag-ink);
	}

	.body {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
		gap: 2rem;
		align-items: start;
		margin-top: 2rem;
	}
	.label {
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}

	/* The hand-written examples */
	.examples {
		display: grid;
		gap: 0.8rem;
	}
	.convo {
		display: grid;
		gap: 0.4rem;
		padding: 0.8rem 1rem;
		border-radius: var(--radius);
		background: var(--accent-soft);
	}
	.convo p {
		margin: 0;
		line-height: 1.45;
	}
	.convo span {
		display: block;
		font-size: 0.7rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}
	.assistant {
		color: var(--accent);
	}
	.more {
		margin: 0;
		font-style: italic;
		color: var(--muted);
	}

	/* The bars, before and after */
	.panel {
		background: var(--card);
		border: var(--bw) solid var(--line);
		border-radius: var(--radius);
		padding: 1.1rem 1.25rem;
		box-shadow: var(--shadow);
	}
	.bars {
		margin-top: 0.8rem;
	}
	.controls {
		display: flex;
		align-items: center;
		gap: 0.8rem;
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
	.ghost {
		background: none;
		border: var(--bw) solid var(--ink-soft);
		color: var(--ink);
	}
	.ghost:hover:not(:disabled) {
		background: var(--ink);
		color: var(--paper);
	}
	.run:disabled,
	.ghost:disabled {
		opacity: 0.4;
		cursor: default;
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
	.count {
		margin: 0.8rem 0 0;
		font-size: 0.9rem;
		color: var(--ink-soft);
	}
	.count strong {
		color: var(--ink);
		font-variant-numeric: tabular-nums;
	}
	.reply {
		margin: 0.9rem 0 0;
		padding: 0.6rem 0.95rem;
		border-radius: var(--radius) var(--radius) var(--radius) 4px;
		background: var(--paper);
		line-height: 1.45;
		opacity: 0;
		transition: opacity 0.3s;
	}
	.reply.visible {
		opacity: 1;
	}

	.takeaway {
		max-width: 46rem;
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
</style>
