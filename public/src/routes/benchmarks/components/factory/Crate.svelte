<svelte:options namespace="svg" />

<script>
	// The crate at the end of the belt: the results, with how many cards matched and how many didn't.
	//   ok, bad
	import { BELT } from './geometry.js';

	let { ok, bad } = $props();
	const x = BELT[1] + 4;
</script>

<g class="crate">
	<rect x={x} y="196" width="88" height="74" rx="6" />
	<text class="name" x={x + 44} y="216">results</text>
	<text class="ok" x={x + 44} y="238">✓ {ok}</text>
	<text class="bad" x={x + 44} y="258">✗ {bad}</text>
</g>

<style>
	rect {
		fill: #fde68a;
		stroke: #b45309;
		stroke-width: 2;
	}
	text {
		font-family: var(--font-body);
		text-anchor: middle;
	}
	.name {
		font-size: 12px;
		fill: #92400e;
	}
	.ok,
	.bad {
		font-family: var(--font-mono);
		font-size: 14px;
		font-weight: 700;
	}
	.ok {
		fill: var(--good);
	}
	.bad {
		fill: var(--bad);
	}
</style>
