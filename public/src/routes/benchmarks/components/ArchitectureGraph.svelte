<script>
	// The whole llmbench project as one graph: providers on the left, the library's three layers in
	// the middle, the app and its benchmarks on the right (data in architecture.js). Tap a box to
	// light up what it's connected to and read what it does; "Follow one input" sends a dot along
	// the real path one input takes, from the CSV to the results file.
	import { SIZE, groups, nodes, edges, journey } from './architecture.js';

	const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
	const center = (n) => ({ x: n.x + n.w / 2, y: n.y + n.h / 2 });

	// Where the straight line from a's centre to b's centre leaves a box
	function exit(n, dx, dy) {
		const scale = Math.min(n.w / 2 / Math.abs(dx || 1e-9), n.h / 2 / Math.abs(dy || 1e-9));
		return scale;
	}
	const lines = edges.map(([from, to, label]) => {
		const a = byId[from];
		const b = byId[to];
		const ca = center(a);
		const cb = center(b);
		const dx = cb.x - ca.x;
		const dy = cb.y - ca.y;
		const sa = exit(a, dx, dy);
		const sb = exit(b, -dx, -dy);
		const x1 = ca.x + dx * sa;
		const y1 = ca.y + dy * sa;
		const x2 = cb.x - dx * (sb + 6 / Math.hypot(dx, dy));
		const y2 = cb.y - dy * (sb + 6 / Math.hypot(dx, dy));
		return { from, to, label, x1, y1, x2, y2, mx: (x1 + x2) / 2, my: (y1 + y2) / 2 };
	});

	let selected = $state('engine');
	let neighbours = $derived(new Set(edges.flatMap(([a, b]) => (a === selected ? [b] : b === selected ? [a] : []))));
	let links = $derived(lines.filter((l) => l.from === selected || l.to === selected));
	let node = $derived(byId[selected]);

	// Following one input: which hop we're on and how far along it
	let hop = $state(-1);
	let along = $state(0);
	let running = $state(false);
	const HOP = 1.1; // seconds per hop

	function follow() {
		if (running) return;
		running = true;
		hop = 0;
		along = 0;
		let last = performance.now();
		const slow = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.3 : 1;
		requestAnimationFrame(function tick(now) {
			along += (now - last) / 1000 / (HOP * slow);
			last = now;
			if (along >= 1) {
				along = 0;
				hop += 1;
			}
			if (hop >= journey.length - 1) {
				hop = journey.length - 1;
				along = 0;
				running = false;
				return;
			}
			requestAnimationFrame(tick);
		});
	}

	let at = $derived(hop >= 0 ? journey[hop][0] : null);
	let dot = $derived.by(() => {
		if (hop < 0) return null;
		const a = center(byId[journey[hop][0]]);
		const next = journey[Math.min(hop + 1, journey.length - 1)][0];
		const b = center(byId[next]);
		const e = along < 0.5 ? 2 * along * along : 1 - (-2 * along + 2) ** 2 / 2; // ease in and out
		return { x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e };
	});
	let trail = $derived(new Set(hop >= 0 ? journey.slice(0, hop + 1).map(([id]) => id) : []));
</script>

<div class="graph">
	<div class="bar">
		<button class="run" onclick={follow} disabled={running}>▶ {hop >= 0 && !running ? 'Follow it again' : 'Follow one input'}</button>
		<span class="hint">Tap any box to see what it's connected to.</span>
	</div>

	<svg viewBox="0 0 {SIZE.w} {SIZE.h}" role="img" aria-label="The architecture of the llmbench project">
		<defs>
			<marker id="arch-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
				<path d="M0,0 L10,5 L0,10 z" class="arrow-head" />
			</marker>
			<marker id="arch-arrow-on" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
				<path d="M0,0 L10,5 L0,10 z" class="arrow-head on" />
			</marker>
		</defs>

		{#each groups as g (g.id)}
			<g class="group" class:layer={g.layer} class:accent={g.accent} class:dashed={g.dashed}>
				<rect x={g.x} y={g.y} width={g.w} height={g.h} rx="14" />
				<text class="group-title" x={g.x + 14} y={g.y + 22}>{g.title}</text>
				{#if g.sub}<text class="group-sub" x={g.x + 14} y={g.y + 46}>{g.sub}</text>{/if}
			</g>
		{/each}

		<!-- The replay benchmark's settings, from its main.py -->
		<text class="note" x="1060" y="540">Qwen 3.8 27B · thinking medium · one at a time · on error: record</text>

		{#each lines as l (l.from + l.to)}
			{@const on = l.from === selected || l.to === selected}
			<line
				class="edge"
				class:on
				class:dim={!on}
				x1={l.x1}
				y1={l.y1}
				x2={l.x2}
				y2={l.y2}
				marker-end="url(#{on ? 'arch-arrow-on' : 'arch-arrow'})"
			/>
		{/each}

		{#each nodes as n (n.id)}
			<g
				class="node {n.kind ?? ''}"
				class:key={n.key}
				class:selected={selected === n.id}
				class:near={neighbours.has(n.id)}
				class:faded={selected && selected !== n.id && !neighbours.has(n.id) && !trail.has(n.id)}
				class:trail={trail.has(n.id)}
				class:here={at === n.id}
				role="button"
				tabindex="0"
				aria-label={n.title}
				onclick={() => (selected = n.id)}
				onkeydown={(e) => e.key === 'Enter' && (selected = n.id)}
			>
				<rect x={n.x} y={n.y} width={n.w} height={n.h} rx="9" />
				<text class="title" x={n.x + 12} y={n.y + 23}>{n.title}</text>
				<text class="sub" x={n.x + 12} y={n.y + 42}>{n.sub}</text>
				{#if n.sub2}<text class="sub" x={n.x + 12} y={n.y + 58}>{n.sub2}</text>{/if}
			</g>
		{/each}

		<!-- Labels on the lit-up connections, on top of everything -->
		{#each links as l (l.from + l.to)}
			{#if l.label}<text class="edge-label" x={l.mx} y={l.my - 4}>{l.label}</text>{/if}
		{/each}

		{#if dot}<circle class="dot" cx={dot.x} cy={dot.y} r="9" />{/if}
	</svg>

	<div class="below">
		<div class="info">
			<p class="info-title">{node.title}</p>
			<p class="info-sub">{node.sub}</p>
			<p class="info-text">{node.info}</p>
			{#if links.length}
				<ul class="links">
					{#each links as l (l.from + l.to)}
						<li>
							{#if l.from === selected}→ {l.label || 'connects to'} <button onclick={() => (selected = l.to)}>{byId[l.to].title}</button>
							{:else}← <button onclick={() => (selected = l.from)}>{byId[l.from].title}</button> {l.label || 'connects to'} it{/if}
						</li>
					{/each}
				</ul>
			{/if}
		</div>
		<ol class="journey" aria-label="One input's journey">
			{#each journey as [id, text], i (i)}
				<li class:done={hop > i} class:now={hop === i}>
					<button onclick={() => (selected = id)}><span class="i">{i + 1}</span>{text}</button>
				</li>
			{/each}
		</ol>
	</div>
</div>

<style>
	.graph {
		display: grid;
		gap: 0.75rem;
	}
	.bar {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}
	.run {
		font: inherit;
		background: var(--accent);
		color: white;
		border: 0;
		padding: 0.55rem 1.1rem;
		border-radius: var(--pill);
		cursor: pointer;
	}
	.run:hover:not(:disabled) {
		background: var(--accent-hover);
	}
	.run:disabled {
		opacity: 0.5;
		cursor: default;
	}
	.hint {
		font-size: 0.9rem;
		color: var(--ink-soft);
	}
	svg {
		display: block;
		width: 100%;
		height: auto;
		border-radius: var(--radius-lg);
		background: var(--card);
		border: var(--bw) solid var(--line);
	}

	/* Areas */
	.group rect {
		fill: var(--paper);
		stroke: var(--track-strong);
		stroke-width: 1.5;
	}
	.group.layer rect {
		fill: var(--card);
	}
	.group.accent rect {
		fill: var(--accent-soft);
		stroke: var(--accent-mid);
	}
	.group.dashed rect {
		fill: none;
		stroke-dasharray: 6 5;
	}
	.group-title {
		font-family: var(--font-body);
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.02em;
		fill: var(--ink-soft);
	}
	.layer .group-title {
		font-family: var(--font-mono);
		font-weight: 400;
		fill: var(--accent);
	}
	.group-sub,
	.note {
		font-family: var(--font-body);
		font-size: 11px;
		fill: var(--muted);
	}
	.note {
		text-anchor: middle;
	}

	/* Connections */
	.edge {
		stroke: var(--track-strong);
		stroke-width: 1.5;
		transition: opacity 0.2s;
	}
	.edge.dim {
		opacity: 0.35;
	}
	.edge.on {
		stroke: var(--accent);
		stroke-width: 2.5;
	}
	.arrow-head {
		fill: var(--track-strong);
	}
	.arrow-head.on {
		fill: var(--accent);
	}
	.edge-label {
		font-family: var(--font-body);
		font-size: 11px;
		font-weight: 700;
		fill: var(--accent);
		text-anchor: middle;
		paint-order: stroke;
		stroke: var(--card);
		stroke-width: 4px;
	}

	/* Boxes */
	.node {
		cursor: pointer;
		transition: opacity 0.2s;
	}
	.node rect {
		fill: var(--card);
		stroke: var(--line);
		stroke-width: 1.5;
		transition:
			stroke 0.2s,
			fill 0.2s;
	}
	.node.key rect {
		stroke: var(--ink-soft);
	}
	.node.outside rect {
		fill: var(--track);
	}
	.node.file rect {
		fill: #fffbeb;
		stroke: #f59e0b;
	}
	.node:hover rect {
		stroke: var(--accent-mid);
	}
	.node.near rect {
		stroke: var(--accent-mid);
		stroke-width: 2;
	}
	.node.selected rect {
		fill: var(--accent-soft);
		stroke: var(--accent);
		stroke-width: 2.5;
	}
	.node.trail rect {
		stroke: #f59e0b;
		stroke-width: 2;
	}
	.node.here rect {
		fill: #fef3c7;
		stroke: #d97706;
		stroke-width: 3;
	}
	.node.faded {
		opacity: 0.45;
	}
	.node:focus-visible {
		outline: none;
	}
	.node:focus-visible rect {
		stroke: var(--ink);
	}
	.title {
		font-family: var(--font-mono);
		font-size: 13px;
		font-weight: 700;
		fill: var(--ink);
	}
	.sub {
		font-family: var(--font-body);
		font-size: 11px;
		fill: var(--ink-soft);
	}
	.dot {
		fill: #f59e0b;
		stroke: white;
		stroke-width: 3;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
	}

	/* Under the graph: the chosen box, and the journey */
	.below {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
		gap: 1.5rem;
		align-items: start;
	}
	.info {
		padding: 1rem 1.2rem;
		border-radius: var(--radius-lg);
		background: var(--card);
		border: var(--bw) solid var(--accent-mid);
	}
	.info p {
		margin: 0;
	}
	.info-title {
		font-family: var(--font-mono);
		font-size: 1.1rem;
		font-weight: 700;
	}
	.info-sub {
		font-size: 0.85rem;
		color: var(--ink-soft);
	}
	.info-text {
		margin-top: 0.6rem !important;
		line-height: 1.55;
	}
	.links {
		list-style: none;
		margin: 0.8rem 0 0;
		padding: 0;
		display: grid;
		gap: 0.2rem;
		font-size: 0.85rem;
		color: var(--ink-soft);
	}
	.links button,
	.journey button {
		font: inherit;
		background: none;
		border: 0;
		padding: 0;
		cursor: pointer;
		color: inherit;
		text-align: left;
	}
	.links button {
		font-family: var(--font-mono);
		color: var(--accent);
		text-decoration: underline;
	}
	.journey {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.15rem;
		font-size: 0.88rem;
	}
	.journey button {
		display: flex;
		gap: 0.6rem;
		align-items: baseline;
		width: 100%;
		padding: 0.2rem 0.4rem;
		border-radius: var(--radius-sm);
		color: var(--ink-soft);
	}
	.journey .i {
		flex: 0 0 1.4rem;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--muted);
	}
	.journey .done button {
		color: var(--ink);
	}
	.journey .now button {
		background: #fef3c7;
		color: var(--ink);
		font-weight: 700;
	}

	@media (max-width: 860px) {
		.below {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.edge,
		.node,
		.node rect {
			transition: none;
		}
	}
</style>
