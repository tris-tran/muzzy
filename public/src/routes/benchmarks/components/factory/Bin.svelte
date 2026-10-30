<svelte:options namespace="svg" />

<script>
	// A bin under the belt, catching cards that leave it early: settled by a cheap check (stopped)
	// or never answered (failed).
	//   x     – the bin's centre
	//   label – what's in it
	//   count – how many cards so far
	//   tone  – 'stopped' or 'failed'
	let { x, label, count, tone } = $props();
</script>

<g class="bin {tone}">
	<path d="M{x - 34},284 h68 l-6,40 h-56 z" />
	<text class="count" x={x} y="309">{count}</text>
	<text class="label" x={x} y="342">{label}</text>
</g>

<style>
	path {
		stroke-width: 2;
	}
	.stopped path {
		fill: var(--good-soft);
		stroke: var(--good);
	}
	.failed path {
		fill: var(--bad-soft);
		stroke: var(--bad);
	}
	.count {
		font-family: var(--font-mono);
		font-size: 14px;
		font-weight: 700;
		text-anchor: middle;
	}
	.stopped .count {
		fill: var(--good);
	}
	.failed .count {
		fill: var(--bad);
	}
	.label {
		font-family: var(--font-body);
		font-size: 11px;
		fill: var(--ink-soft);
		text-anchor: middle;
	}
</style>
