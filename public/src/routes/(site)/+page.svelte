<script>
	// The landing page: a light, minimal gallery. Each explainer gets a big card with a live visual taken
	// straight from it, shown in a light "window" that uses the explainers' own look.
	import { onMount } from 'svelte';
	import { asset, resolve } from '$app/paths';
	import '#lib/presentation/tokens.css';
	import LlmCube from '#lib/presentation/LlmCube.svelte';
	import Bars from '../ambiguous-questions/components/Bars.svelte';
	import GramophoneCutaway from '../speakers/components/GramophoneCutaway.svelte';
	import Factory from '../benchmarks/components/Factory.svelte';
	import { requests } from '../benchmarks/components/requests.js';

	const explainers = [
		{
			id: 'llm',
			href: '/how-llms-work',
			number: '01',
			title: 'How does an LLM actually work?',
			text: 'What happens between typing a question and getting an answer. No maths, just poke at it.'
		},
		{
			id: 'ambiguous',
			href: '/ambiguous-questions',
			number: '02',
			title: "What does an LLM do when there's no right answer?",
			text: 'It never hesitates. So where does its answer come from?'
		},
		{
			id: 'speakers',
			href: '/speakers',
			number: '03',
			title: 'How does a speaker make sound?',
			text: 'From a wind-up gramophone to the Bluetooth speaker on your desk.'
		},
		{
			id: 'benchmarks',
			href: '/benchmarks',
			number: '04',
			title: 'How do we test language models?',
			text: 'Which model is good enough for our work? A factory of questions, answers and checks, and how I built it.',
			note: 'Best on a computer'
		}
	];

	// The factory, as in the benchmarks explainer: our server answers, a machine checks
	const stations = [
		{ at: 0.2, kind: 'box', name: 'Our server', sub: 'Gemma · Qwen', apply: (row) => ({ ours: row.ours }) },
		{ at: 0.7, kind: 'machine', name: 'Validate', sub: 'same as Gemini?', apply: (row) => ({ verdict: row.ours === row.answer }) }
	];

	// The bars grow in once the page is up
	const topping = [['pepperoni', 26], ['mushrooms', 18], ['cheese', 16], ['pineapple', 12]];
	let grow = $state(false);
	onMount(() => requestAnimationFrame(() => (grow = true)));
</script>

<header class="hero">
	<p class="brand">Muzzy</p>
	<h1>It's complicated. <em>Kind of.</em></h1>
	<p class="lede">The simple version of how some complicated things work. Pick one and poke at it.</p>
</header>

<section class="gallery" aria-label="Explainers">
	{#each explainers as e (e.id)}
		<a class="card" href={resolve(e.href)}>
			<div class="window explainer-tokens" aria-hidden="true">
				{#if e.id === 'llm'}
					<div class="center"><LlmCube mode="working" size="11rem" /></div>
				{:else if e.id === 'ambiguous'}
					<div class="bars">
						<p class="prompt">The best pizza topping is <span>___</span></p>
						<Bars options={topping} {grow} />
					</div>
				{:else if e.id === 'speakers'}
					<GramophoneCutaway labels={false} height="100%" />
				{:else}
					<div class="belt"><Factory rows={requests} {stations} end="crate" compact /></div>
				{/if}
			</div>
			<div class="text">
				<span class="number">{e.number}</span>
				<h2>{e.title}</h2>
				<p>{e.text}</p>
				<span class="go">Open →{#if e.note}<span class="note">{e.note}</span>{/if}</span>
			</div>
		</a>
	{/each}
</section>

<section class="also" aria-label="Also here">
	<div class="small">
		<span class="number">Demo</span>
		<h3><a href={asset('poc-1/names.html')}>Finding names &amp; addresses with a tiny LLM</a></h3>
		<p>
			A small language model reads a document piece by piece, with lots of requests running in
			parallel, and picks out every name and address. Press <em>Start demo</em> and watch.
		</p>
		<p class="links">
			<a class="button" href={asset('poc-1/names.html')}>Open the demo</a>
			<a href={asset('poc-1/names-mobile.html')}>Phone version</a>
		</p>
	</div>
	<div class="small door">
		<span class="number">Private</span>
		<h3>Behind the door</h3>
		<p>The private side needs a password. If you have it, come on in.</p>
		<p class="links"><a class="button ghost" href={resolve('/private')}>Go to private →</a></p>
	</div>
</section>

<style>
	.hero {
		max-width: 44rem;
	}
	.brand {
		margin: 0 0 2.5rem;
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}
	h1 {
		margin: 0;
		font-size: 3rem;
		line-height: 1.08;
		letter-spacing: -0.03em;
		text-wrap: balance;
	}
	h1 em {
		font-style: normal;
		color: var(--accent);
	}
	.lede {
		margin: 1.2rem 0 0;
		font-size: 1.2rem;
		line-height: 1.55;
		color: var(--ink-soft);
	}

	/* The gallery: big cards, two by two, each with a light window showing a piece of its explainer */
	.gallery {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1.25rem;
		margin-top: 3rem;
	}
	.card {
		display: flex;
		flex-direction: column;
		border-radius: 20px;
		background: var(--card);
		border: 1px solid var(--line);
		color: inherit;
		text-decoration: none;
		overflow: hidden;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease,
			border-color 0.2s ease;
	}
	.card:hover {
		transform: translateY(-4px);
		border-color: color-mix(in srgb, var(--accent) 45%, var(--line));
		box-shadow: 0 18px 40px -24px rgba(15, 23, 42, 0.25);
	}
	.window {
		position: relative;
		margin: 0.6rem 0.6rem 0;
		aspect-ratio: 16 / 9;
		border-radius: 14px;
		background: var(--paper);
		overflow: hidden;
		pointer-events: none;
	}
	.center {
		height: 100%;
		display: grid;
		place-items: center;
	}
	.bars {
		height: 100%;
		box-sizing: border-box;
		padding: 1.4rem 1.4rem 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 1rem;
		color: var(--ink);
	}
	.prompt {
		margin: 0;
		font-size: 1.15rem;
	}
	.prompt span {
		color: var(--muted);
	}
	.belt {
		height: 100%;
		display: grid;
		align-items: center;
		padding: 0 0.5rem;
	}
	.window :global(.still) {
		border-radius: 0;
	}
	.text {
		display: flex;
		flex-direction: column;
		flex: 1;
		padding: 1.2rem 1.4rem 1.4rem;
	}
	.number {
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--accent);
	}
	h2 {
		margin: 0.5rem 0 0.5rem;
		font-size: 1.3rem;
		line-height: 1.25;
		letter-spacing: -0.015em;
	}
	.text p {
		margin: 0;
		line-height: 1.55;
		color: var(--ink-soft);
	}
	.go {
		margin-top: auto;
		padding-top: 1rem;
		font-weight: 700;
	}
	.note {
		margin-left: 0.8rem;
		font-size: 0.8rem;
		font-weight: normal;
		color: var(--muted);
	}

	/* Smaller things below the gallery */
	.also {
		display: grid;
		grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
		gap: 1.25rem;
		margin-top: 1.25rem;
	}
	.small {
		padding: 1.3rem 1.5rem;
		border-radius: 20px;
		border: 1px solid var(--line);
	}
	.door {
		border-style: dashed;
	}
	h3 {
		margin: 0.5rem 0;
		font-size: 1.15rem;
	}
	h3 a {
		color: inherit;
		text-decoration: none;
	}
	h3 a:hover {
		text-decoration: underline;
	}
	.small p {
		margin: 0.4rem 0 0;
		line-height: 1.55;
		color: var(--ink-soft);
	}
	.links {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		flex-wrap: wrap;
		margin-top: 1rem !important;
	}
	.links a:not(.button) {
		color: var(--ink-soft);
	}
	.button {
		display: inline-block;
		padding: 0.5rem 1.1rem;
		border-radius: 999px;
		background: var(--accent);
		color: var(--on-accent);
		font-weight: 700;
		text-decoration: none;
		white-space: nowrap;
	}
	.button.ghost {
		background: none;
		color: var(--ink);
		border: 1px solid var(--ink-soft);
	}
	.button.ghost:hover {
		background: var(--ink);
		color: var(--on-accent);
	}

	@media (max-width: 960px) {
		.also {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (max-width: 640px) {
		h1 {
			font-size: 2.1rem;
		}
		.gallery {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.card {
			transition: none;
		}
		.card:hover {
			transform: none;
		}
	}
</style>
