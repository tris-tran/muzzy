<script>
	// The chart of JPEG's 64 standard patterns: 8 across × 8 down. Click (or hover) one to pick it.
	//   used     – optional Set of pattern numbers to show strongly (the rest are faded)
	//   selected – the picked pattern (0–63), outlined
	//   onpick   – called with the pattern number
	//   size     – how big the chart is
	//   axes     – show the "across" and "down" numbers along the edges
	import * as J from './jpeg.js';

	let { used = null, selected = -1, onpick = null, size = '16rem', axes = false } = $props();

	let canvas = $state();
	const CELL = 8;
	const GAP = 1;
	const SIZE = 8 * CELL + 7 * GAP;

	$effect(() => {
		const u = used;
		if (!canvas) return;
		canvas.width = SIZE;
		canvas.height = SIZE;
		const ctx = canvas.getContext('2d');
		const img = ctx.createImageData(SIZE, SIZE);
		for (let i = 0; i < img.data.length; i += 4) {
			img.data[i] = img.data[i + 1] = img.data[i + 2] = 214; // the gaps between patterns
			img.data[i + 3] = 255;
		}
		for (let v = 0; v < 8; v++) {
			for (let u2 = 0; u2 < 8; u2++) {
				const p = J.pattern(u2, v);
				const strong = !u || u.has(v * 8 + u2);
				for (let y = 0; y < 8; y++) {
					for (let x = 0; x < 8; x++) {
						let g = 128 + p[y * 8 + x] * 118;
						if (!strong) g = 238 + (g - 128) * 0.1;
						const o = ((v * (CELL + GAP) + y) * SIZE + u2 * (CELL + GAP) + x) * 4;
						img.data[o] = img.data[o + 1] = img.data[o + 2] = g;
					}
				}
			}
		}
		ctx.putImageData(img, 0, 0);
	});
</script>

<div class="chart" class:axes style="--size: {size}">
	{#if axes}
		<span class="corner">down ↓ · across →</span>
		<span class="top">{#each Array(8) as _, i (i)}<i>{i}</i>{/each}</span>
		<span class="left">{#each Array(8) as _, i (i)}<i>{i}</i>{/each}</span>
	{/if}
	<div class="box">
		<canvas bind:this={canvas} aria-hidden="true"></canvas>
		<div class="hits">
			{#each Array(64) as _, i (i)}
				<button
					class:sel={i === selected}
					aria-label="Pattern {i % 8} across, {Math.floor(i / 8)} down"
					onclick={() => onpick?.(i)}
					onmouseenter={() => onpick?.(i)}
				></button>
			{/each}
		</div>
	</div>
</div>

<style>
	.chart {
		display: grid;
		grid-template-columns: var(--size);
	}
	.chart.axes {
		grid-template-columns: auto var(--size);
		grid-template-rows: auto auto var(--size);
		gap: 0.2rem 0.35rem;
	}
	.corner {
		grid-column: 1 / -1;
		grid-row: 1;
		font-size: 0.72rem;
		color: var(--ink-soft);
	}
	.top,
	.left {
		display: flex;
		font-family: var(--font-mono);
		font-size: 0.68rem;
		color: var(--muted);
	}
	.top {
		grid-column: 2;
		grid-row: 2;
	}
	.left {
		grid-column: 1;
		grid-row: 3;
		flex-direction: column;
	}
	.top i,
	.left i {
		flex: 1;
		display: grid;
		place-items: center;
		font-style: normal;
	}
	.box {
		position: relative;
		width: var(--size);
		height: var(--size);
	}
	.axes .box {
		grid-column: 2;
		grid-row: 3;
	}
	canvas {
		width: 100%;
		height: 100%;
		image-rendering: pixelated;
		border-radius: 4px;
	}
	.hits {
		position: absolute;
		inset: 0;
		display: grid;
		grid-template-columns: repeat(8, 1fr);
		grid-template-rows: repeat(8, 1fr);
		gap: calc(100% / 71);
	}
	.hits button {
		padding: 0;
		border: 0;
		background: none;
		border-radius: 2px;
		cursor: pointer;
	}
	.hits button:hover {
		box-shadow: 0 0 0 2px var(--accent-mid);
	}
	.hits button.sel {
		box-shadow:
			0 0 0 2px var(--accent),
			0 0 0 5px var(--accent-soft);
	}
</style>
