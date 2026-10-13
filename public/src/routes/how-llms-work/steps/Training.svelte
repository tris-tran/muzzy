<script>
	// Step 4: training. Take real text, hide the next word, let the LLM guess, then check.
	// Wrong → "punished" (its dials get turned a lot). Right → "rewarded" (dials barely move).
	// The more rounds it has played, the better its guesses get.
	import LlmBox from '#lib/presentation/LlmBox.svelte';
	import Pipe from '#lib/presentation/Pipe.svelte';

	// Snippets of "real text". `near` is a plausible-but-wrong guess a half-trained model might make.
	const lessons = [
		{ start: 'The sun rises in the', answer: 'east', near: 'morning', source: 'a geography book' },
		{ start: 'Peanut butter and', answer: 'jelly', near: 'bread', source: 'a recipe blog' },
		{ start: 'Thank you very', answer: 'much', near: 'good', source: 'an email' },
		{ start: 'Twinkle, twinkle, little', answer: 'star', near: 'light', source: 'a nursery rhyme' },
		{ start: 'Better late than', answer: 'never', near: 'sorry', source: 'a book of sayings' },
		{ start: "Rome wasn't built in a", answer: 'day', near: 'week', source: 'a history website' },
		{ start: 'Water boils at 100', answer: 'degrees', near: 'times', source: 'a science article' },
		{ start: 'Ladies and', answer: 'gentlemen', near: 'girls', source: 'a speech' },
		{ start: 'The early bird catches the', answer: 'worm', near: 'bus', source: 'a book of sayings' },
		{ start: 'Once upon a', answer: 'time', near: 'day', source: 'a fairy tale' },
		{ start: 'An apple a day keeps the doctor', answer: 'away', near: 'busy', source: 'a health magazine' },
		{ start: 'See you', answer: 'later', near: 'soon', source: 'a text message' }
	];
	// What a brand-new model says: just random words
	const junk = ['banana', 'purple', 'the', 'seven', 'under', 'car', 'quickly', 'music', 'of', 'blue'];

	let rounds = $state([]); // past results, true = right
	let current = $state(null); // { lesson, guess, sure, correct }
	let phase = $state('ready'); // ready → reading → thinking → guessed → revealed → verdict
	let fastForwarding = $state(false);
	let dials = $state([20, 140, 260, 75, 200, 310]); // the box's "settings", in degrees
	let busy = $derived(phase !== 'ready' && phase !== 'verdict');

	// How experienced the model is (0 → 1), from how many rounds it has trained on
	const experience = (n) => 1 - Math.exp(-n / 30);
	const pick = (list) => list[Math.floor(Math.random() * list.length)];

	function guessFor(lesson, n) {
		const e = experience(n);
		const correct = n > 0 && Math.random() < 0.05 + 0.9 * e; // the very first guess is always wrong
		if (correct) {
			return { guess: lesson.answer, sure: Math.round(25 + 65 * e + Math.random() * 8), correct };
		}
		const guess = Math.random() < e ? lesson.near : pick(junk);
		return { guess, sure: Math.round(2 + 20 * e * Math.random() + Math.random() * 4), correct };
	}

	function adjust(correct) {
		// Wrong: big turns. Right: tiny nudges.
		const amount = correct ? 6 : 90;
		dials = dials.map((d) => d + (Math.random() * 2 - 1) * amount);
	}

	let run = 0;
	const wait = (ms) => new Promise((r) => setTimeout(r, ms));

	async function trainOne() {
		const id = ++run;
		const slow = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.2 : 1;
		const step = async (name, ms) => {
			phase = name;
			await wait(ms * slow);
			return id === run;
		};

		const n = rounds.length;
		const lesson = lessons[n % lessons.length];
		current = { lesson, ...guessFor(lesson, n) };

		if (!(await step('reading', 600))) return;
		if (!(await step('thinking', 900))) return;
		if (!(await step('guessed', 900))) return;
		if (!(await step('revealed', 700))) return;
		adjust(current.correct);
		rounds = [...rounds, current.correct];
		phase = 'verdict';
	}

	async function fastForward(count) {
		const id = ++run;
		fastForwarding = true;
		for (let i = 0; i < count; i++) {
			const n = rounds.length;
			const lesson = lessons[n % lessons.length];
			current = { lesson, ...guessFor(lesson, n) };
			adjust(current.correct);
			rounds = [...rounds, current.correct];
			phase = 'verdict';
			await wait(70);
			if (id !== run) return;
		}
		fastForwarding = false;
	}

	function reset() {
		run++;
		rounds = [];
		current = null;
		phase = 'ready';
		fastForwarding = false;
	}

	let recent = $derived(rounds.slice(-20));
	let recentRight = $derived(recent.filter(Boolean).length);
	let shown = $derived(phase === 'guessed' || phase === 'revealed' || phase === 'verdict');
	let revealed = $derived(phase === 'revealed' || phase === 'verdict');
	let locked = $derived(busy || fastForwarding);
</script>

<div class="training">
	<div class="head">
		<div>
			<p class="step-label">Step 4 · Learning to guess</p>
			<h2 class="step-title">So how does it get good at guessing?</h2>
		</div>
		<p class="step-lede">
			Nobody teaches it grammar or facts. It plays that same finish-the-sentence game, over and over,
			on real text: books, websites, articles. We <strong>hide the next word</strong>, let it guess,
			then check. Guess wrong and it gets <strong>punished</strong>. Guess right and it gets
			<strong>rewarded</strong>.
		</p>
	</div>

	<div class="stage" data-phase={phase}>
		<!-- The training text, with the next word hidden -->
		<div class="panel lesson">
			<span class="label">Training text {#if current}<em>· from {current.lesson.source}</em>{/if}</span>
			{#if current}
				<p class="text">
					{current.lesson.start}
					<span class="card" class:flipped={revealed}>
						<span class="back">?</span>
						<span class="front">{current.lesson.answer}</span>
					</span>
				</p>
			{:else}
				<p class="text muted">A sentence from real text will appear here, with its last word hidden.</p>
			{/if}
		</div>

		<div class="machine">
			<Pipe flowing={phase === 'reading'} />
			<div class="core">
				<LlmBox
					mode={phase === 'thinking' ? 'thinking' : busy || fastForwarding ? 'working' : 'idle'}
					size="min(9rem, 26vw)"
				/>
				<div class="dials" class:wrong={phase === 'verdict' && current && !current.correct} class:right={phase === 'verdict' && current?.correct} aria-hidden="true">
					{#each dials as angle, i (i)}
						<svg viewBox="0 0 24 24"
							><circle cx="12" cy="12" r="10" /><line
								x1="12"
								y1="12"
								x2="12"
								y2="4"
								style="transform: rotate({angle}deg)"
							/></svg
						>
					{/each}
				</div>
				<span class="dials-label">its dials</span>
			</div>
			<div class="pipe-out"><Pipe flowing={phase === 'guessed'} /></div>
		</div>

		<!-- Its guess and the verdict -->
		<div class="panel result">
			<span class="label">Its guess</span>
			{#if current && shown}
				<p class="guess">
					“{current.guess}” <span class="sure">{current.sure}% sure</span>
				</p>
				{#if phase === 'verdict'}
					{#if current.correct}
						<div class="verdict right">
							<strong>✓ Right!</strong> Rewarded: the dials that led here get locked in a little more.
						</div>
					{:else}
						<div class="verdict wrong">
							<strong>✗ Wrong!</strong> The real word was “{current.lesson.answer}”. Punished: its
							dials get turned so “{current.lesson.answer}” is more likely next time.
						</div>
					{/if}
				{:else if phase === 'revealed'}
					<p class="checking">Checking against the real word…</p>
				{/if}
			{:else}
				<p class="text muted">
					{phase === 'reading' || phase === 'thinking' ? 'Guessing…' : 'Its guess will show up here.'}
				</p>
			{/if}
		</div>
	</div>

	<div class="controls">
		<button class="run" onclick={trainOne} disabled={locked}>▶ Train one round</button>
		<button class="ghost" onclick={() => fastForward(50)} disabled={locked}>⏩ Train 50 rounds</button>
		{#if rounds.length}<button class="reset" onclick={reset} disabled={locked && !fastForwarding}>Start over with a new model</button>{/if}
	</div>

	<div class="progress" class:visible={rounds.length > 0}>
		<div class="history" aria-hidden="true">
			{#each rounds.slice(-80) as right, i (rounds.length - Math.min(rounds.length, 80) + i)}
				<span class:right></span>
			{/each}
		</div>
		<p class="stats">
			Rounds played: <strong>{rounds.length}</strong> · Right in the last {recent.length}:
			<strong>{recentRight}</strong>
		</p>
	</div>

	<p class="takeaway" class:visible={rounds.length >= 20}>
		Notice the green taking over? Nobody told it the answers; it just got nudged after every guess.
		Real LLMs play this game <strong>trillions</strong> of times, on a huge slice of everything ever
		written, with billions of dials. That's what "training" means.
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

	/* Stage: text → box → guess */
	.stage {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
		align-items: center;
		margin-top: 2rem;
	}
	.panel {
		background: var(--card);
		border: var(--bw) solid var(--line);
		border-radius: var(--radius);
		padding: 1.1rem 1.25rem;
		min-height: 12rem;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		transition: box-shadow 0.3s ease;
	}
	.stage[data-phase='reading'] .lesson {
		box-shadow: 0 0 0 2px var(--accent-mid);
	}
	.label {
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}
	.label em {
		text-transform: none;
		letter-spacing: 0;
		font-size: 0.85rem;
	}
	.text {
		margin: 0.7rem 0 0;
		font-size: 1.35rem;
		line-height: 1.6;
	}
	.muted {
		font-size: 1rem;
		font-style: italic;
		color: var(--muted);
	}

	/* The hidden word: a card that flips over */
	.card {
		display: inline-grid;
		vertical-align: bottom;
		perspective: 400px;
	}
	.card > span {
		grid-area: 1 / 1;
		padding: 0 0.45em;
		border-radius: 6px;
		backface-visibility: hidden;
		transition: transform 0.5s ease;
	}
	.back {
		background: var(--ink);
		color: var(--paper);
		text-align: center;
		min-width: 2.5em;
	}
	.front {
		background: var(--accent-soft);
		color: var(--accent);
		transform: rotateY(180deg);
	}
	.card.flipped .back {
		transform: rotateY(-180deg);
	}
	.card.flipped .front {
		transform: rotateY(0);
	}

	/* The machine: box with its dials */
	.machine {
		display: flex;
		align-items: center;
	}
	.core {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.6rem;
	}
	.dials {
		display: flex;
		gap: 0.35rem;
	}
	.dials svg {
		width: 1.3rem;
		height: 1.3rem;
	}
	.dials circle {
		fill: var(--card);
		stroke: var(--track-strong);
		stroke-width: 1.5;
		transition: stroke 0.3s;
	}
	.dials line {
		stroke: var(--ink);
		stroke-width: 2;
		stroke-linecap: round;
		transform-origin: 12px 12px;
		transition: transform 0.8s cubic-bezier(0.3, 1.4, 0.5, 1);
	}
	.dials.wrong circle {
		stroke: var(--bad);
	}
	.dials.right circle {
		stroke: var(--good);
	}
	.dials-label {
		font-size: 0.75rem;
		font-style: italic;
		color: var(--ink-soft);
		margin-top: -0.3rem;
	}

	/* Guess and verdict */
	.guess {
		margin: 0.7rem 0 0;
		font-size: 1.5rem;
		animation: appear 0.3s ease-out both;
	}
	.sure {
		font-size: 0.85rem;
		color: var(--ink-soft);
	}
	.checking {
		margin: 0.8rem 0 0;
		font-style: italic;
		color: var(--ink-soft);
	}
	.verdict {
		margin-top: 0.8rem;
		padding: 0.7rem 0.9rem;
		border-radius: var(--radius-sm);
		font-size: 0.98rem;
		line-height: 1.45;
		animation: appear 0.3s ease-out both;
	}
	.verdict strong {
		display: block;
		font-size: 1.15rem;
		margin-bottom: 0.15rem;
	}
	.verdict.right {
		background: var(--good-soft);
		color: var(--good);
	}
	.verdict.wrong {
		background: var(--bad-soft);
		color: var(--bad);
	}
	@keyframes appear {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
	}

	/* Buttons */
	.controls {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
		margin-top: 1.75rem;
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
		color: var(--ink);
		border: var(--bw) solid var(--ink-soft);
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

	/* Track record: one square per round */
	.progress {
		display: flex;
		align-items: center;
		gap: 1rem 1.5rem;
		flex-wrap: wrap;
		margin-top: 1.25rem;
		opacity: 0;
		transition: opacity 0.4s;
	}
	.progress.visible {
		opacity: 1;
	}
	.history {
		display: flex;
		flex-wrap: wrap;
		gap: 3px;
		max-width: 34rem;
	}
	.history span {
		width: 0.6rem;
		height: 0.6rem;
		border-radius: 2px;
		background: var(--bad-light);
	}
	.history span.right {
		background: var(--good);
	}
	.stats {
		margin: 0;
		font-size: 0.95rem;
		color: var(--ink-soft);
	}
	.stats strong {
		color: var(--ink);
	}

	.takeaway {
		max-width: 46rem;
		margin: 1.5rem 0 0;
		font-size: 1.1rem;
		line-height: 1.6;
		opacity: 0;
		transition: opacity 0.6s ease;
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
		.stage {
			grid-template-columns: minmax(0, 1fr);
			margin-top: 1.5rem;
		}
		.panel {
			min-height: 0;
		}
		.machine {
			flex-direction: column;
			justify-self: center;
		}
		.core {
			flex-direction: row;
			padding: 0.4rem 0;
		}
		.dials {
			flex-wrap: wrap;
			width: 4.5rem;
		}
		.dials-label {
			display: none;
		}
		.controls {
			margin-top: 1.25rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.card > span,
		.dials line {
			transition: none;
		}
		.guess,
		.verdict {
			animation: none;
		}
	}
</style>
