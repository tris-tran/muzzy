<script module>
	// The network's shape and weights are fixed (seeded), so they're the same on the server and in the browser.
	const layers = [5, 4, 5];
	const W = 440;
	const H = 260;
	const xs = [40, 210, 380];
	const ys = (n) => Array.from({ length: n }, (_, i) => (H * (i + 0.5)) / n);

	function seeded(seed) {
		return () => {
			seed |= 0;
			seed = (seed + 0x6d2b79f5) | 0;
			let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
			t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
			return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
		};
	}
	const rand = seeded(5);

	const nodes = layers.map((n, l) => ys(n).map((y) => ({ x: xs[l], y, act: 0.3 + rand() * 0.7 })));
	const edges = [];
	for (let l = 0; l < layers.length - 1; l++) {
		nodes[l].forEach((a, ai) => {
			nodes[l + 1].forEach((b, bi) => {
				const w = Math.round((rand() * 2 - 1) * 100) / 100;
				const mx = (a.x + b.x) / 2;
				// Smooth S-curve from node to node
				const d = `M ${a.x} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`;
				edges.push({ l, ai, bi, d, mid: [mx, (a.y + b.y) / 2], w });
			});
		});
	}

	// A few weights get their number written on them, so you can see they're just numbers.
	// Picked by hand (layer gap, from node, to node) so the labels don't overlap.
	const picks = [[0, 0, 0], [0, 4, 3], [1, 1, 1], [1, 3, 4]];
	const labelled = picks.map(([l, ai, bi]) => {
		const i = edges.findIndex((e) => e.l === l && e.ai === ai && e.bi === bi);
		return { ...edges[i], i };
	});

	export const WEIGHT_COUNT = edges.length;
	export const GAPS = layers.length - 1;
</script>

<script>
	// The LLM box opened up: a tiny, abstract neural network. Every line is a weight (a number).
	//   lit      – how many layers the signal has reached (0 = inputs … GAPS = outputs; -1 = nothing)
	//   pulsing  – which gap between layers is animating right now (-1 for none)
	//   outputs  – one score (0–1) per output node, shown once the signal arrives
	//   labels   – a word for each output node
	//   run      – bump to replay the pulse animations
	let { lit = -1, pulsing = -1, outputs = [], labels = [], run = 0 } = $props();

	const fmt = (w) => (w < 0 ? '−' : '') + Math.abs(w).toFixed(2);
	const last = layers.length - 1;

	let hovered = $state(-1);
	let max = $derived(Math.max(...outputs, 0.0001));

	function glow(l, i, node) {
		if (l > lit) return 0;
		return l === last ? (outputs[i] ?? 0) / max : node.act;
	}
</script>

<div class="netbox">
	<svg viewBox="-10 0 {W + 20} {H}" role="img" aria-label="A small neural network: glowing dots joined by curved lines">
		<defs>
			<radialGradient id="orb">
				<stop offset="0%" stop-color="#fff4ec" />
				<stop offset="45%" stop-color="#f0a58f" />
				<stop offset="100%" stop-color="#c2553a" />
			</radialGradient>
		</defs>

		<!-- connections (weights) -->
		{#each edges as e, i (i)}
			<path
				class="edge"
				class:warm={e.w >= 0}
				class:on={e.l < lit}
				class:hl={i === hovered}
				d={e.d}
				stroke-width={0.5 + Math.abs(e.w) * 2.6}
			/>
		{/each}

		<!-- signal: a glowing dot travelling along every line of the current gap -->
		{#key run}
			{#each edges as e, i (i)}
				{#if e.l === pulsing}
					<path class="pulse" d={e.d} pathLength="100" style="animation-delay: {(i % 5) * 60}ms" />
				{/if}
			{/each}
		{/key}

		{#each labelled as e (e.i)}
			<text class="wlabel" x={e.mid[0]} y={e.mid[1] - 4}>{fmt(e.w)}</text>
		{/each}

		<!-- invisible fat lines, easier to hover -->
		{#each edges as e, i (i)}
			<path
				class="hit"
				d={e.d}
				role="presentation"
				onpointerenter={() => (hovered = i)}
				onpointerleave={() => (hovered = -1)}
			/>
		{/each}

		<!-- nodes -->
		{#each nodes as layer, l (l)}
			{#each layer as node, i (i)}
				{@const g = glow(l, i, node)}
				<circle class="halo" cx={node.x} cy={node.y} r="20" style:opacity={g * 0.35} />
				<circle class="node" class:on={l <= lit} cx={node.x} cy={node.y} r="9" />
				<circle class="core" cx={node.x} cy={node.y} r="9" style:opacity={g} />
			{/each}
		{/each}

		{#each labels as word, i (i)}
			<text class="olabel" class:on={lit >= last} x={xs[last] + 16} y={nodes[last][i].y + 3.5}>{word}</text>
		{/each}
	</svg>

	<div class="readout">
		{#if hovered >= 0}
			weight = <strong>{fmt(edges[hovered].w)}</strong>
		{:else}
			{edges.length} lines = {edges.length} weights · hover one
		{/if}
	</div>
</div>

<style>
	.netbox {
		position: relative;
		background: radial-gradient(ellipse at 50% 40%, #221e26, #141216 70%);
		border-radius: 20px;
		padding: 1.2rem 0.8rem 2.2rem;
		box-shadow:
			inset 0 0 0 1px rgba(255, 255, 255, 0.06),
			0 18px 40px -12px rgba(0, 0, 0, 0.45);
	}
	svg {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
	}

	.edge {
		fill: none;
		stroke: #7fa7c9;
		stroke-linecap: round;
		opacity: 0.2;
		transition:
			opacity 0.5s ease,
			stroke 0.2s;
	}
	.edge.warm {
		stroke: #f0a58f;
	}
	.edge.on {
		opacity: 0.55;
	}
	.edge.hl {
		opacity: 1;
		stroke: white;
	}
	.hit {
		fill: none;
		stroke: transparent;
		stroke-width: 8;
		pointer-events: stroke;
		cursor: crosshair;
	}

	.pulse {
		fill: none;
		stroke: #fff4ec;
		stroke-width: 5;
		stroke-linecap: round;
		stroke-dasharray: 0.1 100;
		stroke-dashoffset: 0;
		filter: drop-shadow(0 0 4px #f0a58f);
		animation: travel 0.9s cubic-bezier(0.45, 0, 0.55, 1) both;
	}
	@keyframes travel {
		to {
			stroke-dashoffset: -100;
		}
	}

	.halo {
		fill: #f0a58f;
		filter: blur(6px);
		transition: opacity 0.5s ease;
		pointer-events: none;
	}
	.node {
		fill: #241f27;
		stroke: #5a525f;
		stroke-width: 1.2;
		transition: stroke 0.4s;
	}
	.node.on {
		stroke: #f0a58f;
	}
	.core {
		fill: url(#orb);
		transition: opacity 0.5s ease;
		pointer-events: none;
	}

	.wlabel {
		font-family: ui-monospace, monospace;
		font-size: 9px;
		fill: rgba(250, 247, 242, 0.6);
		text-anchor: middle;
		paint-order: stroke;
		stroke: #1b181e;
		stroke-width: 4px;
		pointer-events: none;
	}
	.olabel {
		font-size: 12px;
		fill: rgba(250, 247, 242, 0.3);
		transition: fill 0.4s;
	}
	.olabel.on {
		fill: rgba(250, 247, 242, 0.9);
	}

	.readout {
		position: absolute;
		left: 1.1rem;
		bottom: 0.7rem;
		font-family: ui-monospace, monospace;
		font-size: 0.75rem;
		color: rgba(250, 247, 242, 0.55);
	}
	.readout strong {
		color: #f0a58f;
	}

	@media (prefers-reduced-motion: reduce) {
		.pulse {
			display: none;
		}
	}
</style>
