<script>
	// Step 3: which models we actually test. Gemini (hosted by Google, size not published) against
	// Gemma and Qwen (open, small enough for our own one-GPU box). A size chart to pick from, and a
	// card with what each one means in practice: where it runs, what it costs, where the data goes,
	// and whether it fits in our GPU's 32 GB.
	import { models, camps, GPU_GB } from '../components/models.js';

	const SCALE = 40; // billions of parameters at the right edge of the chart

	let picked = $state('qwen-27b');
	let model = $derived(models.find((m) => m.id === picked));
	let camp = $derived(camps[model.camp]);
</script>

<div class="contenders">
	<div class="head">
		<div>
			<p class="step-label">Step 3 · The contenders</p>
			<h2 class="step-title">Gemini against the small ones</h2>
		</div>
		<p class="step-lede">
			On one side, <strong>Gemini</strong>: huge, rented by the request, running in Google's data
			centres. On the other, <strong>Gemma and Qwen</strong>: open models small enough to run on our
			own machine. Tap a model.
		</p>
	</div>

	<div class="body">
		<div class="chart">
			<p class="label">Size, in billions of parameters</p>
			<ul>
				{#each models as m (m.id)}
					<li>
						<button class:active={picked === m.id} class={m.camp} onclick={() => (picked = m.id)}>
							<span class="name">{m.name}</span>
							<span class="track">
								{#if m.size}
									<span class="bar" style="width: {(m.size / SCALE) * 100}%"></span>
								{:else}
									<span class="bar unknown"></span>
								{/if}
							</span>
							<span class="value">{m.size ? `${m.size}B` : 'not published'}</span>
						</button>
					</li>
				{/each}
			</ul>
			<p class="hint">
				Parameters are the model's learned numbers. More usually means smarter, but also slower and
				hungrier for memory.
			</p>
		</div>

		<div class="card">
			<span class="camp {model.camp}">{camp.name}</span>
			<h3>{model.name}</h3>
			<p class="note">{model.note}</p>
			<dl>
				<dt>Runs on</dt>
				<dd>{camp.hardware}</dd>
				<dt>We pay</dt>
				<dd>{camp.pays}</dd>
				<dt>Our data</dt>
				<dd>{camp.data}</dd>
			</dl>
			{#if model.memory}
				<div class="gpu">
					<span class="gpu-label">Fits in our GPU? ≈ {model.memory} of {GPU_GB} GB</span>
					<span class="meter"><span style="width: {(model.memory / GPU_GB) * 100}%"></span></span>
					<span class="gpu-sub">The rest is room for the text being worked on.</span>
				</div>
			{:else}
				<div class="gpu cloud">
					<span class="gpu-label">Fits in our GPU? Not our problem: Google runs it.</span>
				</div>
			{/if}
		</div>
	</div>

	<p class="takeaway">
		Too big hurts: <strong>Gemma 4 31B</strong> needed 4.3 GB more than the GPU has, part of it ran on
		the slow CPU, and one batch took 4 hours 38 minutes. So it's set aside. The real question every
		benchmark here answers: <strong>can a model that fits on our box do the job as well as Gemini?</strong>
	</p>
</div>

<style>
	.head {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 0 3rem;
		align-items: end;
	}
	.step-lede {
		margin: 0;
	}
	strong {
		color: var(--ink);
		font-weight: normal;
		border-bottom: 2px solid var(--accent-mid);
	}

	.body {
		display: grid;
		grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
		gap: 1.5rem;
		margin-top: 1.75rem;
		align-items: start;
	}
	.label {
		margin: 0 0 0.6rem;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}

	/* The size chart: one clickable row per model */
	.chart ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.3rem;
	}
	.chart button {
		width: 100%;
		display: grid;
		grid-template-columns: 9.5rem minmax(0, 1fr) 6.5rem;
		gap: 0.75rem;
		align-items: center;
		padding: 0.45rem 0.6rem;
		font: inherit;
		text-align: left;
		color: var(--ink);
		background: none;
		border: var(--bw) solid transparent;
		border-radius: var(--radius-sm);
		cursor: pointer;
	}
	.chart button:hover {
		background: var(--card);
	}
	.chart button.active {
		background: var(--card);
		border-color: var(--accent);
		box-shadow: var(--shadow);
	}
	.name {
		font-size: 0.95rem;
	}
	.track {
		height: 0.75rem;
		border-radius: var(--pill);
		background: var(--track);
		overflow: hidden;
	}
	.bar {
		display: block;
		height: 100%;
		border-radius: inherit;
	}
	.lab .bar {
		background: var(--accent);
	}
	/* Gemini: off the chart, size unknown */
	.bar.unknown {
		width: 100%;
		background: repeating-linear-gradient(-45deg, var(--tag), var(--tag) 6px, var(--accent-soft) 6px, var(--accent-soft) 12px);
		mask-image: linear-gradient(90deg, black 70%, transparent);
	}
	.value {
		font-size: 0.85rem;
		color: var(--ink-soft);
		font-variant-numeric: tabular-nums;
	}
	.hint {
		margin: 0.8rem 0 0;
		font-size: 0.88rem;
		line-height: 1.5;
		color: var(--ink-soft);
	}

	/* The detail card */
	.card {
		padding: 1.2rem 1.4rem;
		border-radius: var(--radius-lg);
		border: var(--bw) solid var(--line);
		background: var(--card);
		box-shadow: var(--shadow-lift);
	}
	.camp {
		display: inline-block;
		padding: 0.15rem 0.6rem;
		border-radius: var(--pill);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
	.camp.cloud {
		background: var(--accent-soft);
		color: var(--tag-ink);
	}
	.camp.lab {
		background: var(--good-soft);
		color: var(--good);
	}
	h3 {
		margin: 0.6rem 0 0.3rem;
		font-size: 1.4rem;
	}
	.note {
		margin: 0;
		line-height: 1.5;
		color: var(--ink-soft);
	}
	dl {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.35rem 1rem;
		margin: 1rem 0 0;
	}
	dt {
		font-size: 0.85rem;
		color: var(--ink-soft);
	}
	dd {
		margin: 0;
		font-size: 0.92rem;
	}
	.gpu {
		display: grid;
		gap: 0.35rem;
		margin-top: 1rem;
		padding-top: 0.9rem;
		border-top: var(--bw) solid var(--line);
	}
	.gpu-label {
		font-size: 0.9rem;
		font-weight: 700;
	}
	.meter {
		height: 0.8rem;
		border-radius: var(--pill);
		background: var(--track);
		overflow: hidden;
	}
	.meter span {
		display: block;
		height: 100%;
		background: var(--good);
		border-radius: inherit;
		transition: width 0.5s ease;
	}
	.gpu-sub {
		font-size: 0.8rem;
		color: var(--muted);
	}
	.gpu.cloud .gpu-label {
		font-weight: 400;
		color: var(--ink-soft);
	}

	.takeaway {
		max-width: 54rem;
		margin: 1.5rem 0 0;
		font-size: 1.05rem;
		line-height: 1.6;
	}

	@media (max-width: 860px) {
		.head,
		.body {
			grid-template-columns: minmax(0, 1fr);
		}
		.step-lede {
			margin-top: 1rem;
		}
		.chart button {
			grid-template-columns: 7.5rem minmax(0, 1fr) 5.5rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.meter span {
			transition: none;
		}
	}
</style>
