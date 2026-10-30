<svelte:options namespace="svg" />

<script>
	// The conveyor belt, its stripes moving to the right, on a row of rollers.
	//   moved – how far the belt has run, in px
	import { BELT, BELT_Y } from './geometry.js';

	let { moved } = $props();
	const uid = $props.id();
	const stripes = uid + '-stripes';
</script>

<defs>
	<pattern id={stripes} width="24" height="20" patternUnits="userSpaceOnUse" patternTransform="translate({moved % 24} 0)">
		<rect width="24" height="20" fill="#334155" />
		<rect width="3" height="20" fill="#475569" />
	</pattern>
</defs>
<rect x={BELT[0]} y={BELT_Y} width={BELT[1] - BELT[0]} height="20" rx="10" fill="url(#{stripes})" />
{#each { length: 14 }, i (i)}
	<circle class="roller" cx={BELT[0] + 14 + i * ((BELT[1] - BELT[0] - 28) / 13)} cy={BELT_Y + 28} r="6" />
{/each}

<style>
	.roller {
		fill: #64748b;
	}
</style>
