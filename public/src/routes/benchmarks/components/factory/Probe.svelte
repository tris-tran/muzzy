<svelte:options namespace="svg" />

<script>
	// A probe on a station: a wire up to a stopwatch that times every card going through.
	//   x       – the station's centre
	//   reading – { last, avg } in seconds, or null before the first card
	import { fmt } from './geometry.js';

	let { x, reading } = $props();
</script>

<line class="wire" x1={x} y1="128" x2={x} y2="104" />
<rect class="watch" x={x - 50} y="70" width="100" height="34" rx="6" />
<text class="last" x={x} y="85">⏱ {reading ? fmt(reading.last) : '–'}</text>
<text class="avg" x={x} y="99">average {reading ? fmt(reading.avg) : '–'}</text>

<style>
	.wire {
		stroke: #f59e0b;
		stroke-width: 2;
		stroke-dasharray: 4 3;
	}
	.watch {
		fill: #fffbeb;
		stroke: #f59e0b;
		stroke-width: 1.5;
	}
	.last {
		font-family: var(--font-mono);
		font-size: 12px;
		font-weight: 700;
		fill: #92400e;
		text-anchor: middle;
	}
	.avg {
		font-family: var(--font-body);
		font-size: 10px;
		fill: #b45309;
		text-anchor: middle;
	}
</style>
