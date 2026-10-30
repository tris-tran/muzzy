<svelte:options namespace="svg" />

<script>
	// An inspector beside the belt, counting every card that goes past on a clipboard.
	//   x, name, count
	let { x, name, count } = $props();
</script>

<g class="inspector">
	<circle cx={x} cy="150" r="12" />
	<path d="M{x - 17},214 Q{x - 17},168 {x},168 Q{x + 17},168 {x + 17},214 Z" />
	<rect class="clipboard" x={x + 10} y="176" width="22" height="28" rx="3" />
	<text class="tally" x={x + 21} y="195">{count}</text>
	<text class="name" x={x} y="128">{name}</text>
</g>

<style>
	circle,
	path {
		fill: #475569;
	}
	.clipboard {
		fill: #fef3c7;
		stroke: #92400e;
		stroke-width: 1.5;
	}
	.tally {
		font-family: var(--font-mono);
		font-size: 11px;
		fill: #92400e;
		text-anchor: middle;
	}
	.name {
		font-family: var(--font-body);
		font-size: 12px;
		fill: var(--ink-soft);
		text-anchor: middle;
	}
</style>
