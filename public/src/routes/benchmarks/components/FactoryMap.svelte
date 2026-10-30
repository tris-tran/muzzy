<script>
	// The factory, drawn still and simple, with numbered pins on each part. Beside it, what each
	// part is called in the llmbench project. Tap a pin or a row: both light up, and what that part
	// does shows under the drawing.
	const parts = [
		{ n: 1, part: 'Loading dock', name: 'InputSource', text: 'Your data, read one row at a time.', pin: [62, 104] },
		{ n: 2, part: 'Input card', name: 'BenchmarkInput', text: 'One item of work, with its own id.', pin: [136, 176] },
		{ n: 3, part: 'Machine', name: 'Step', text: 'Takes a card, returns (keep going?, output).', pin: [386, 128] },
		{ n: 4, part: 'Black box with a model', name: 'GenerationStep → LLMClient', text: 'Builds the prompt; the call to the model is done for it.', pin: [248, 128] },
		{ n: 5, part: 'Everything on the card', name: 'Trace', text: 'Every step can look back at all the earlier ones.', pin: [322, 176] },
		{ n: 6, part: 'Probe', name: 'Runtime · duration_s', text: 'Every step is timed, without asking.', pin: [248, 58] },
		{ n: 7, part: 'Inspector', name: 'StepLogger · Stats', text: 'Says what a step is doing; counts and records numbers.', pin: [460, 116] },
		{ n: 8, part: 'Bins', name: 'Ending: stopped · failed', text: 'A card can end early on purpose, or fail with a reason.', pin: [398, 290] },
		{ n: 9, part: 'Control panel', name: 'BenchmarkConfig', text: 'Which model, how many repetitions, how many at once…', pin: [62, 28] },
		{ n: 10, part: 'The factory floor', name: 'ExecutionEngine', text: 'Runs it all: one card at a time, or many in parallel.', pin: [566, 28] },
		{ n: 11, part: 'Crate', name: 'ResultSink', text: 'Where results go: one JSON file per model run.', pin: [548, 176] }
	];

	let active = $state(1);
	let part = $derived(parts.find((p) => p.n === active));
</script>

<div class="map">
	<div class="left">
	<svg viewBox="0 0 600 320" role="img" aria-label="The factory with numbered parts">
		<!-- 10: the floor everything stands on -->
		<rect class="floor" class:on={active === 10} x="8" y="8" width="584" height="304" rx="16" />

		<!-- 9: the control panel -->
		<g class="part" class:on={active === 9}>
			<rect x="20" y="40" width="84" height="40" rx="6" class="panel" />
			{#each [36, 58, 80] as x (x)}<circle cx={x + 8} cy="60" r="7" class="knob" />{/each}
		</g>

		<!-- 1: the dock -->
		<g class="part" class:on={active === 1}>
			<path class="file" d="M30,118 h44 l12,12 v66 h-56 z" />
			{#each [0, 1, 2, 3] as i (i)}<rect class="line" x="38" y={140 + i * 12} width="40" height="5" rx="2" />{/each}
		</g>

		<!-- the belt -->
		<rect class="belt" x="96" y="214" width="430" height="14" rx="7" />

		<!-- 2: a plain card; 5: a card carrying everything so far -->
		<g class="part" class:on={active === 2}><rect class="card" x="112" y="186" width="48" height="28" rx="4" /></g>
		<g class="part" class:on={active === 5}>
			<rect class="card full" x="298" y="186" width="48" height="28" rx="4" />
			<rect class="note" x="304" y="192" width="30" height="4" rx="2" />
			<rect class="note" x="304" y="200" width="22" height="4" rx="2" />
		</g>

		<!-- 4: black box with a model; 6: its probe -->
		<g class="part" class:on={active === 4}><rect class="box" x="208" y="140" width="80" height="78" rx="8" /><text class="box-text" x="248" y="182">model</text></g>
		<g class="part" class:on={active === 6}>
			<line class="wire" x1="248" y1="140" x2="248" y2="90" />
			<rect class="watch" x="220" y="70" width="56" height="22" rx="4" />
			<text class="watch-text" x="248" y="85">⏱</text>
		</g>

		<!-- 3: a machine -->
		<g class="part" class:on={active === 3}><rect class="machine" x="352" y="140" width="68" height="78" rx="8" /></g>

		<!-- 7: an inspector -->
		<g class="part" class:on={active === 7}>
			<circle class="person" cx="460" cy="146" r="10" />
			<path class="person" d="M446,200 Q446,160 460,160 Q474,160 474,200 Z" />
			<rect class="clipboard" x="468" y="168" width="16" height="20" rx="2" />
		</g>

		<!-- 8: bins under the belt -->
		<g class="part" class:on={active === 8}>
			<path class="bin ok" d="M352,240 h40 l-4,26 h-32 z" />
			<path class="bin bad" d="M408,240 h40 l-4,26 h-32 z" />
		</g>

		<!-- 11: the crate -->
		<g class="part" class:on={active === 11}><rect class="crate" x="528" y="168" width="48" height="48" rx="4" /></g>

		<!-- The pins -->
		{#each parts as p (p.n)}
			<g
				class="pin"
				class:on={active === p.n}
				role="button"
				tabindex="0"
				aria-label="{p.part}: {p.name}"
				onclick={() => (active = p.n)}
				onkeydown={(e) => e.key === 'Enter' && (active = p.n)}
			>
				<circle cx={p.pin[0]} cy={p.pin[1]} r="11" />
				<text x={p.pin[0]} y={p.pin[1] + 4}>{p.n}</text>
			</g>
		{/each}
	</svg>
	<div class="about" aria-live="polite">
		<span class="n">{part.n}</span>
		<div>
			<p class="about-part">{part.part}</p>
			<code>{part.name}</code>
			<p class="about-text">{part.text}</p>
		</div>
	</div>
	</div>

	<ol class="legend">
		{#each parts as p (p.n)}
			<li>
				<button class:on={active === p.n} onclick={() => (active = p.n)}>
					<span class="n">{p.n}</span>
					<span class="part-name">{p.part}</span>
					<code>{p.name}</code>
				</button>
			</li>
		{/each}
	</ol>
</div>

<style>
	.map {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
		gap: 1.5rem;
		align-items: start;
	}
	svg {
		display: block;
		width: 100%;
		height: auto;
	}
	.floor {
		fill: none;
		stroke: var(--track-strong);
		stroke-width: 2;
		stroke-dasharray: 6 5;
	}
	.floor.on {
		stroke: var(--accent);
		fill: var(--accent-soft);
	}
	.part {
		transition: opacity 0.2s;
	}
	.part.on {
		filter: drop-shadow(0 0 6px var(--accent-mid));
	}
	.panel {
		fill: #e2e8f0;
		stroke: #475569;
		stroke-width: 1.5;
	}
	.knob {
		fill: var(--accent-mid);
	}
	.file {
		fill: var(--card);
		stroke: var(--ink-soft);
		stroke-width: 1.5;
	}
	.line,
	.note {
		fill: var(--track-strong);
	}
	.belt {
		fill: #334155;
	}
	.card {
		fill: var(--card);
		stroke: var(--accent-mid);
		stroke-width: 2;
	}
	.card.full {
		fill: var(--accent-soft);
	}
	.box {
		fill: #0f172a;
	}
	.box-text {
		font-family: var(--font-mono);
		font-size: 12px;
		fill: var(--on-dark);
		text-anchor: middle;
	}
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
	.watch-text {
		font-size: 12px;
		text-anchor: middle;
	}
	.machine {
		fill: #e2e8f0;
		stroke: #475569;
		stroke-width: 1.5;
	}
	.person {
		fill: #475569;
	}
	.clipboard {
		fill: #fef3c7;
		stroke: #92400e;
		stroke-width: 1.2;
	}
	.bin {
		stroke-width: 1.5;
	}
	.bin.ok {
		fill: var(--good-soft);
		stroke: var(--good);
	}
	.bin.bad {
		fill: var(--bad-soft);
		stroke: var(--bad);
	}
	.crate {
		fill: #fde68a;
		stroke: #b45309;
		stroke-width: 1.5;
	}
	.pin {
		cursor: pointer;
	}
	.pin circle {
		fill: var(--ink);
		stroke: var(--paper);
		stroke-width: 2;
		transition: fill 0.2s;
	}
	.pin text {
		font-family: var(--font-body);
		font-size: 11px;
		font-weight: 700;
		fill: var(--paper);
		text-anchor: middle;
		pointer-events: none;
	}
	.pin.on circle,
	.pin:hover circle {
		fill: var(--accent);
	}
	.pin:focus-visible {
		outline: none;
	}

	/* The legend: factory part → project name */
	.legend {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.2rem;
	}
	.legend button {
		width: 100%;
		display: grid;
		grid-template-columns: 1.6rem 11rem minmax(0, 1fr);
		grid-template-areas: 'n part code';
		gap: 0 0.6rem;
		align-items: center;
		padding: 0.35rem 0.5rem;
		font: inherit;
		text-align: left;
		color: var(--ink);
		background: none;
		border: var(--bw) solid transparent;
		border-radius: var(--radius-sm);
		cursor: pointer;
	}
	.legend button:hover {
		background: var(--card);
	}
	.legend button.on {
		background: var(--card);
		border-color: var(--accent);
	}
	.n {
		grid-area: n;
		display: grid;
		place-items: center;
		width: 1.4rem;
		height: 1.4rem;
		border-radius: 50%;
		background: var(--ink);
		color: var(--paper);
		font-size: 0.72rem;
		font-weight: 700;
	}
	.on .n {
		background: var(--accent);
	}
	.part-name {
		grid-area: part;
		font-size: 0.9rem;
		font-weight: 700;
	}
	code {
		grid-area: code;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--tag-ink);
	}
	/* The chosen part, explained under the drawing */
	.about {
		display: flex;
		gap: 0.8rem;
		margin-top: 1rem;
		padding: 0.9rem 1rem;
		border-radius: var(--radius);
		background: var(--card);
		border: var(--bw) solid var(--accent-mid);
	}
	.about .n {
		flex: 0 0 auto;
		background: var(--accent);
	}
	.about-part {
		margin: 0;
		font-weight: 700;
	}
	.about code {
		font-size: 0.9rem;
	}
	.about-text {
		margin: 0.3rem 0 0;
		line-height: 1.5;
		color: var(--ink-soft);
	}

	@media (max-width: 860px) {
		.map {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
