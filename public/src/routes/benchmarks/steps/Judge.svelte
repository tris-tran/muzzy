<script>
	// Step 7: checking the answer in two layers. A free exact check settles the identical answers
	// (the card stops early and drops off); everything else goes to a judge, another LLM asked
	// whether ours is correct. The server sometimes fails; that card ends as failed, with a reason.
	import Factory from '../components/Factory.svelte';
	import { requests } from '../components/requests.js';

	const stations = [
		{
			at: 0.1,
			kind: 'box',
			name: 'Our server',
			sub: 'Gemma · Qwen',
			gives: 'answer',
			apply: (row) => ({ ours: row.ours }),
			time: (row) => row.seconds,
			fails: (row) => row.fails,
			bin: 'failed'
		},
		{
			at: 0.38,
			kind: 'machine',
			name: 'Exact match?',
			sub: 'free, instant',
			gives: 'verdict',
			time: () => 0.001,
			stops: (card) => card.ours === card.row.answer && 'Identical to Gemini’s: no need for the judge.',
			bin: 'settled early'
		},
		{
			at: 0.68,
			kind: 'box',
			name: 'Judge',
			sub: 'another LLM',
			gives: 'verdict',
			apply: (row) => ({ verdict: row.judge.ok, why: row.judge.why }),
			time: (row) => row.judge.seconds
		},
		{ at: 0.92, kind: 'inspector', name: 'Inspector' }
	];
</script>

<div class="judge">
	<div class="head">
		<div>
			<p class="step-label">Step 7 · Checking the answer</p>
			<h2 class="step-title">A cheap check first, a judge when it matters</h2>
		</div>
		<p class="step-lede">
			Comparing words is instant but strict: “4,320 minutes” is right, yet it isn't “4320”. So first a
			free <strong>exact check</strong>: identical answers are settled and drop off. Only the rest go to
			the <strong>judge</strong>, another LLM we ask whether our answer is correct.
		</p>
	</div>

	<div class="stage">
		<Factory rows={requests} {stations} end="crate" endings brief>
			<div class="bottom">
				<p class="takeaway">
					The judge is slow and costs money (watch its probe), so it only sees the cards that need it.
					When the server breaks, the card isn't lost: it ends as <strong>failed</strong>, with the reason,
					and the belt keeps moving.
				</p>
				<div class="prompt">
					<span>What we ask the judge</span>
					<pre>Question: {'{the question}'}
Expected (Gemini): {'{Gemini’s answer}'}
Candidate (ours): {'{our answer}'}
Is the candidate correct? Answer YES or NO,
then give one short reason.</pre>
				</div>
			</div>
		</Factory>
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
	strong {
		color: var(--ink);
		font-weight: normal;
		border-bottom: 2px solid var(--accent-mid);
	}
	.stage {
		margin-top: 1.25rem;
	}
	.bottom {
		display: grid;
		gap: 0.8rem;
	}
	.takeaway {
		margin: 0;
		font-size: 1.02rem;
		line-height: 1.6;
	}
	.prompt {
		padding: 0.7rem 0.9rem;
		border-radius: var(--radius);
		background: var(--dark);
	}
	.prompt span {
		font-size: 0.7rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--tag);
	}
	pre {
		margin: 0.35rem 0 0;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		line-height: 1.5;
		color: var(--on-dark);
		white-space: pre-wrap;
	}
	@media (max-width: 860px) {
		.head {
			grid-template-columns: minmax(0, 1fr);
		}
		.step-lede {
			margin-top: 1rem;
		}
	}
</style>
