<svelte:options namespace="svg" />

<script>
	// A station that works on cards: a black box (it calls a model, like our own server) or a
	// lighter machine (it works on the card itself, like validating). Cards pass under it, so they
	// vanish inside; the light is on while one is in there. With `probe`, a stopwatch times it.
	//   x, kind ('box' | 'machine'), name, sub, busy
	//   probe – { last, avg } or null when timed; undefined when there's no probe
	import Probe from './Probe.svelte';
	import { BELT_Y, BOX } from './geometry.js';

	let { x, kind, name, sub = '', busy, probe = undefined } = $props();
</script>

<g class="station {kind}" class:busy>
	<rect class="body" x={x - BOX} y="128" width={BOX * 2} height={BELT_Y - 128 + 4} rx="10" />
	<rect class="mouth" x={x - BOX + 6} y={BELT_Y - 46} width={BOX * 2 - 12} height="50" rx="4" />
	<circle class="light" cx={x + BOX - 14} cy="142" r="5" />
	<text class="name" x={x} y="156">{name}</text>
	{#if sub}<text class="sub" x={x} y="174">{sub}</text>{/if}
	{#if probe !== undefined}<Probe {x} reading={probe} />{/if}
</g>

<style>
	.body {
		stroke-width: 2;
	}
	.box .body {
		fill: #0f172a;
		stroke: #0f172a;
	}
	.machine .body {
		fill: #e2e8f0;
		stroke: #475569;
	}
	.mouth {
		fill: rgba(0, 0, 0, 0.25);
	}
	.light {
		fill: #64748b;
		transition: fill 0.2s;
	}
	.busy .light {
		fill: var(--good-light);
	}
	.name {
		font-family: var(--font-body);
		font-size: 14px;
		font-weight: 700;
		text-anchor: middle;
	}
	.sub {
		font-family: var(--font-body);
		font-size: 11px;
		text-anchor: middle;
	}
	.box .name {
		fill: var(--on-dark);
	}
	.box .sub {
		fill: color-mix(in srgb, var(--on-dark) 65%, transparent);
	}
	.machine .name {
		fill: var(--ink);
	}
	.machine .sub {
		fill: var(--ink-soft);
	}
</style>
