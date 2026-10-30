<svelte:options namespace="svg" />

<script>
	// The loading dock: the data file, with the row being read lit up, and the stamp that presses
	// each row into a card.
	//   reading  – which of the drawn rows is being read now
	//   stamping – the stamp is down
	let { reading, stamping } = $props();
</script>

<g class="dock">
	<path class="file" d="M20,92 h88 l22,22 v132 h-110 z" />
	<path class="fold" d="M108,92 v22 h22" />
	{#each [0, 1, 2, 3, 4, 5, 6] as i (i)}
		<rect class="row" class:reading={i === reading} x="32" y={126 + i * 15} width="86" height="8" rx="2" />
	{/each}
	<text class="file-name" x="75" y="80">requests.csv</text>
	<g class="stamp" style="transform: translateY({stamping ? 14 : 0}px)">
		<rect x="150" y="150" width="56" height="26" rx="4" />
		<line x1="178" y1="120" x2="178" y2="150" />
	</g>
</g>

<style>
	.file {
		fill: var(--card);
		stroke: var(--ink-soft);
		stroke-width: 2;
	}
	.fold {
		fill: none;
		stroke: var(--ink-soft);
		stroke-width: 2;
	}
	.row {
		fill: var(--track-strong);
		transition: fill 0.2s;
	}
	.row.reading {
		fill: var(--accent);
	}
	.file-name {
		font-family: var(--font-mono);
		font-size: 13px;
		fill: var(--ink-soft);
		text-anchor: middle;
	}
	.stamp {
		transition: transform 0.15s ease;
	}
	.stamp rect {
		fill: var(--ink);
	}
	.stamp line {
		stroke: var(--ink);
		stroke-width: 6;
	}
</style>
