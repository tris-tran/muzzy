<script>
	// Step 6: the machines. Each card goes into a black box (our own server, Gemma or Qwen) and
	// comes out with a new answer; a probe times it. A validator then puts that answer next to
	// Gemini's and stamps ✓ or ✗. Inspectors count everything; the crate collects the results.
	import Factory from '../components/Factory.svelte';
	import { requests } from '../components/requests.js';

	const stations = [
		{
			at: 0.15,
			kind: 'box',
			name: 'Our server',
			sub: 'Gemma · Qwen',
			gives: 'answer',
			apply: (row) => ({ ours: row.ours }),
			time: (row) => row.seconds
		},
		{ at: 0.42, kind: 'inspector', name: 'Inspector' },
		{
			at: 0.68,
			kind: 'machine',
			name: 'Validate',
			sub: 'same as Gemini?',
			gives: 'verdict',
			apply: (row) => ({ verdict: row.ours === row.answer }),
			time: () => 0.001
		},
		{ at: 0.92, kind: 'inspector', name: 'Inspector' }
	];
</script>

<div class="machines">
	<div class="head">
		<div>
			<p class="step-label">Step 6 · The machines</p>
			<h2 class="step-title">Our server answers, a machine checks</h2>
		</div>
		<p class="step-lede">
			Each card goes into a <strong>black box</strong>: our own server running Gemma or Qwen, which
			writes a new answer. Then the <strong>validator</strong> puts that answer next to Gemini's and
			stamps ✓ or ✗. Probes time every box; inspectors count every card.
		</p>
	</div>

	<div class="stage">
		<Factory rows={requests} {stations} end="crate" brief>
			<p class="takeaway">
				These machines are the benchmark's <strong>steps</strong>. Each one only sees the card in front of
				it, does one job and passes it on, and every step is timed without anyone asking. Swap the
				machines and you have a different benchmark on the same belt.
			</p>
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
		margin-top: 1.5rem;
	}
	.takeaway {
		margin: 0;
		font-size: 1.05rem;
		line-height: 1.6;
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
