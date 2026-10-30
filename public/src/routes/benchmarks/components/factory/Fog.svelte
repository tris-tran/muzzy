<svelte:options namespace="svg" />

<script>
	// The end of the belt fading out, with a note of what comes next.
	//   label, sub
	import { BELT, H, TOP } from './geometry.js';

	let { label, sub } = $props();
	const uid = $props.id();
	const fade = uid + '-fog';
</script>

<defs>
	<linearGradient id={fade} x1="0" x2="1">
		<stop offset="0" style="stop-color: var(--paper); stop-opacity: 0" />
		<stop offset="0.8" style="stop-color: var(--paper); stop-opacity: 1" />
	</linearGradient>
</defs>
<rect x={BELT[1] - 190} y={TOP} width="260" height={H - TOP} fill="url(#{fade})" />
<text class="label" x={BELT[1] + 70} y="168">{label}</text>
<text class="sub" x={BELT[1] + 70} y="186">{sub}</text>

<style>
	text {
		font-family: var(--font-body);
		text-anchor: end;
	}
	.label {
		font-size: 15px;
		font-weight: 700;
		fill: var(--ink-soft);
	}
	.sub {
		font-size: 12px;
		fill: var(--muted);
	}
</style>
