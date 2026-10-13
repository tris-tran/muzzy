<script>
	// Step 6: why so many weights, and how big real models are.
	import { onMount } from 'svelte';
	import { WEIGHT_COUNT } from '#lib/presentation/NetworkBox.svelte';

	// Counting one weight per second; storing each weight in 2 bytes (the usual 16-bit format).
	const models = [
		{
			name: 'Our toy network',
			note: 'from the last step',
			weights: WEIGHT_COUNT,
			size: String(WEIGHT_COUNT),
			count: `${WEIGHT_COUNT} seconds`,
			countLike: 'quicker than boiling a kettle',
			disk: `${WEIGHT_COUNT * 2} bytes`,
			diskLike: 'less than a single text message'
		},
		{
			name: 'GPT-2',
			note: 'OpenAI, 2019',
			weights: 1.5e9,
			size: '1.5 billion',
			count: 'about 48 years',
			countLike: 'a whole working life',
			disk: 'about 3 GB',
			diskLike: 'a movie download'
		},
		{
			name: 'A model that fits on a phone',
			note: 'today',
			weights: 3e9,
			size: 'about 3 billion',
			count: 'about 95 years',
			countLike: 'a whole human lifetime, and then some',
			disk: 'about 6 GB',
			diskLike: 'a big game on your phone'
		},
		{
			name: 'GPT-3',
			note: 'OpenAI, 2020',
			weights: 175e9,
			size: '175 billion',
			count: 'about 5,500 years',
			countLike: 'longer than writing has existed',
			disk: 'about 350 GB',
			diskLike: 'more than most phones can hold'
		},
		{
			name: 'Llama 3.1, largest',
			note: 'Meta, 2024',
			weights: 405e9,
			size: '405 billion',
			count: 'about 12,800 years',
			countLike: 'since the end of the last Ice Age',
			disk: 'about 810 GB',
			diskLike: 'a whole laptop drive'
		},
		{
			name: "Today's biggest models",
			note: "not made public, but thought to be over a trillion",
			weights: 1e12,
			size: '1 trillion +',
			count: '32,000+ years',
			countLike: 'since people were painting on cave walls',
			disk: '2 TB +',
			diskLike: "several laptops' worth",
			estimate: true
		}
	];
	const biggest = Math.max(...models.map((m) => m.weights));

	let selected = $state(3);
	let model = $derived(models[selected]);
	let grown = $state(false);
	let el;

	onMount(() => {
		const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && (grown = true), {
			threshold: 0.4
		});
		observer.observe(el);
		return () => observer.disconnect();
	});
</script>

<div class="size">
	<div class="head">
		<div>
			<p class="step-label">Step 6 · Why so many?</p>
			<h2 class="step-title">The size of an LLM is its number of weights</h2>
		</div>
		<p class="step-lede">
			Everything a model has picked up, grammar, facts, style, jokes, lives in its weights. No single
			weight “knows” that Paris is in France; it's spread thinly across millions of them. More weights
			means more room to learn. That's why, when people say a model is “7B”, they mean
			<strong>7 billion weights</strong>.
		</p>
	</div>

	<div class="body" bind:this={el}>
		<ul class="bars" aria-label="Number of weights per model">
			{#each models as m, i (m.name)}
				{@const pct = (m.weights / biggest) * 100}
				<li>
					<button class:active={i === selected} onclick={() => (selected = i)}>
						<span class="name">{m.name} <em>{m.note}</em></span>
						<span class="track">
							<span
								class="fill"
								class:estimate={m.estimate}
								style="width: {grown ? Math.max(pct, 0.25) : 0}%; transition-delay: {i * 120}ms"
							></span>
							{#if pct < 1}<span class="tiny">too small to see at this scale</span>{/if}
						</span>
						<span class="count">{m.size}</span>
					</button>
				</li>
			{/each}
		</ul>

		<aside class="detail" aria-live="polite">
			<p class="big">{model.size}</p>
			<p class="unit">weights · {model.name}</p>

			<div class="compare">
				<span class="q">If you counted one per second, non-stop</span>
				<span class="a">{model.count}</span>
				<span class="like">{model.countLike}</span>
			</div>
			<div class="compare">
				<span class="q">Just to store them</span>
				<span class="a">{model.disk}</span>
				<span class="like">{model.diskLike}</span>
			</div>
		</aside>
	</div>

	<p class="takeaway">
		And here's the catch: to write <em>each single token</em>, the model runs your text through
		<strong>all</strong> of its weights, once. Hundreds of billions of multiplications, for every word.
		That's why LLMs need huge, power-hungry computers, and part of why the answer trickles out word by
		word.
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
	.step-lede strong,
	.takeaway strong {
		color: var(--ink);
		font-weight: normal;
		border-bottom: 2px solid var(--accent-mid);
	}

	.body {
		display: grid;
		grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
		gap: 2.5rem;
		align-items: center;
		margin-top: 2rem;
	}

	/* Bars, linear scale on purpose: the small ones vanish */
	.bars {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.35rem;
	}
	.bars button {
		width: 100%;
		display: grid;
		grid-template-columns: minmax(0, 1fr) 7.5rem;
		grid-template-areas:
			'name count'
			'track track';
		gap: 0.3rem 1rem;
		align-items: baseline;
		padding: 0.5rem 0.7rem;
		border: 1px solid transparent;
		border-radius: var(--radius-sm);
		background: none;
		font: inherit;
		color: inherit;
		text-align: left;
		cursor: pointer;
	}
	.bars button:hover {
		background: rgba(0, 0, 0, 0.025);
	}
	.bars button.active {
		background: var(--card);
		border-color: var(--line);
		box-shadow: var(--shadow);
	}
	.name {
		grid-area: name;
		font-size: 1rem;
	}
	.name em {
		font-size: 0.82rem;
		color: var(--ink-soft);
		margin-left: 0.3rem;
	}
	.count {
		grid-area: count;
		text-align: right;
		font-size: 0.95rem;
		font-variant-numeric: tabular-nums;
	}
	.active .count {
		color: var(--accent);
		font-weight: bold;
	}
	.track {
		grid-area: track;
		position: relative;
		height: 0.75rem;
		border-radius: var(--pill);
		background: var(--track);
	}
	.fill {
		position: absolute;
		inset: 0 auto 0 0;
		border-radius: inherit;
		background: var(--track-strong);
		min-width: 0;
		transition: width 1.2s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.active .fill {
		background: var(--accent);
	}
	.fill.estimate {
		background-image: repeating-linear-gradient(
			-45deg,
			transparent 0 6px,
			rgba(255, 255, 255, 0.35) 6px 12px
		);
	}
	.tiny {
		position: absolute;
		left: 0.6rem;
		top: 50%;
		transform: translateY(-50%);
		font-size: 0.7rem;
		font-style: italic;
		color: var(--muted);
		white-space: nowrap;
	}

	/* The selected model, made relatable */
	.detail {
		background: var(--dark);
		color: var(--paper);
		border-radius: var(--radius-lg);
		padding: 1.5rem 1.6rem;
		box-shadow: var(--shadow-lift);
	}
	.big {
		margin: 0;
		font-size: 2.4rem;
		line-height: 1.1;
		color: var(--accent-mid);
	}
	.unit {
		margin: 0.2rem 0 1.25rem;
		font-size: 0.9rem;
		color: color-mix(in srgb, var(--on-dark) 60%, transparent);
	}
	.compare {
		display: grid;
		gap: 0.1rem;
		padding: 0.8rem 0;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}
	.q {
		font-size: 0.75rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: color-mix(in srgb, var(--on-dark) 50%, transparent);
	}
	.a {
		font-size: 1.35rem;
	}
	.like {
		font-style: italic;
		color: color-mix(in srgb, var(--on-dark) 70%, transparent);
	}

	.takeaway {
		max-width: 48rem;
		margin: 2.5rem 0 0;
		font-size: 1.1rem;
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
		.body {
			gap: 1.25rem;
			margin-top: 1.5rem;
		}
		.takeaway {
			margin-top: 1.5rem;
		}
	}
	@media (max-width: 600px) {
		.bars button {
			grid-template-columns: minmax(0, 1fr) 6rem;
			padding: 0.45rem 0.5rem;
		}
		.name em {
			display: block;
			margin: 0;
		}
		.big {
			font-size: 2rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.fill {
			transition: none;
		}
	}
</style>
