<script>
	// A familiar example: Google's AI Overview is written by Gemini, an LLM.
	// Plays when the step scrolls into view: the search is typed, then the overview streams in.
	import { onMount } from 'svelte';

	const query = 'why is the sky blue';
	const overview =
		'The sky looks blue because sunlight is a mix of every colour, and the air scatters blue light much more than the others. That scattered blue reaches your eyes from every direction, so the whole sky seems to glow blue.';
	const overviewWords = overview.split(' ');

	// idle → typing → searching → writing → done
	let phase = $state('idle');
	let typed = $state(0); // characters of the query shown
	let shown = $state(0); // words of the overview shown
	let el;

	let run = 0;
	const wait = (ms) => new Promise((r) => setTimeout(r, ms));

	async function play() {
		const id = ++run;
		const slow = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.2 : 1;
		typed = 0;
		shown = 0;

		phase = 'typing';
		for (let i = 1; i <= query.length; i++) {
			typed = i;
			await wait((55 + Math.random() * 60) * slow);
			if (id !== run) return;
		}

		phase = 'searching';
		await wait(900 * slow);
		if (id !== run) return;

		phase = 'writing';
		for (let i = 1; i <= overviewWords.length; i++) {
			shown = i;
			await wait(110 * slow);
			if (id !== run) return;
		}
		phase = 'done';
	}

	onMount(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && phase === 'idle') play();
			},
			{ threshold: 0.6 }
		);
		observer.observe(el);
		return () => {
			observer.disconnect();
			run++;
		};
	});
</script>

<div class="search-example">
	<div class="text">
		<p class="step-label">Step 2 · You've seen one already</p>
		<h2 class="step-title">Every time you Google something</h2>
		<p class="step-lede">
			Search on Google these days and, above the usual links, there's often an
			<strong>AI Overview</strong>: a short answer written just for you.
		</p>
		<p class="step-lede">
			Nobody wrote that answer in advance. It's written on the spot by <strong>Gemini</strong>,
			Google's LLM, which reads what the search found and sums it up in its own words. Your search
			goes in, Gemini's words come out, one at a time. The same black box.
		</p>
	</div>

	<div class="mock" bind:this={el} data-phase={phase} aria-hidden="true">
		<div class="bar-row">
			<div class="bar">
				<svg viewBox="0 0 24 24" width="18" height="18"
					><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2" /><path
						d="M15.5 15.5 21 21"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
					/></svg
				>
				<span class="query"
					>{query.slice(0, typed)}{#if phase === 'typing' || phase === 'idle'}<span class="cursor"
						></span>{/if}</span
				>
			</div>
			<span class="tag tag-in" class:on={phase !== 'idle'}>Your words go in</span>
		</div>

		<div class="overview" class:on={phase !== 'idle' && phase !== 'typing'}>
			<div class="overview-head">
				<span class="sparkle">✦</span> AI Overview
				<span class="tag tag-out" class:on={phase === 'writing' || phase === 'done'}
					>Written by Gemini, an LLM</span
				>
			</div>
			{#if phase === 'searching'}
				<div class="shimmer"><span></span><span></span><span></span></div>
			{:else}
				<p>
					{#each overviewWords.slice(0, shown) as word, i (i)}<span class="word">{word + " "}</span>{/each}
				</p>
			{/if}
		</div>

		<div class="results">
			{#each [0, 1, 2] as i (i)}
				<div class="result">
					<span class="line link"></span>
					<span class="line"></span>
					<span class="line short"></span>
				</div>
			{/each}
		</div>
	</div>
</div>

<div class="footer">
	<p class="question">So what is actually going on <em>inside</em> the box?</p>
	<button class="replay" onclick={play} disabled={phase !== 'done' && phase !== 'idle'}>↻ Replay</button>
</div>

<style>
	.search-example {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
		gap: 3rem;
		align-items: center;
	}
	.step-lede strong {
		color: var(--ink);
		font-weight: normal;
		border-bottom: 2px solid #f0a58f;
	}

	/* A generic search page sketch */
	.mock {
		background: var(--card);
		border: 1px solid var(--line);
		border-radius: 16px;
		padding: 1.25rem;
		box-shadow: 0 12px 32px -16px rgba(0, 0, 0, 0.25);
		font-family: system-ui, sans-serif;
	}
	.bar-row {
		position: relative;
	}
	.bar {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.7rem 1rem;
		border: 1px solid var(--line);
		border-radius: 999px;
		color: #8a8378;
		min-height: 1.4rem;
	}
	.query {
		color: var(--ink);
		font-size: 1rem;
	}
	.cursor {
		display: inline-block;
		width: 1px;
		height: 1.1em;
		margin-left: 1px;
		vertical-align: -0.2em;
		background: var(--ink);
		animation: blink 0.9s steps(2) infinite;
	}
	@keyframes blink {
		50% {
			opacity: 0;
		}
	}

	.overview {
		position: relative;
		margin-top: 1.1rem;
		padding: 1rem 1.1rem;
		border-radius: 12px;
		background: #f6f1ea;
		min-height: 8.5rem;
		opacity: 0.35;
		transition:
			opacity 0.4s ease,
			box-shadow 0.4s ease;
	}
	.overview.on {
		opacity: 1;
		box-shadow: 0 0 0 2px #f0a58f;
	}
	.overview-head {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.4rem;
		font-size: 0.85rem;
		font-weight: 600;
	}
	.sparkle {
		color: var(--accent);
	}
	.overview p {
		margin: 0.6rem 0 0;
		font-size: 0.95rem;
		line-height: 1.55;
	}
	.word {
		animation: appear 0.3s ease-out both;
	}
	@keyframes appear {
		from {
			opacity: 0;
			filter: blur(2px);
		}
	}
	.shimmer {
		display: grid;
		gap: 0.5rem;
		margin-top: 0.8rem;
	}
	.shimmer span {
		height: 0.7rem;
		border-radius: 4px;
		background: linear-gradient(90deg, #ece4d9 25%, #f8f3ec 50%, #ece4d9 75%);
		background-size: 200% 100%;
		animation: shimmer 1s linear infinite;
	}
	.shimmer span:last-child {
		width: 60%;
	}
	@keyframes shimmer {
		to {
			background-position: -200% 0;
		}
	}

	.results {
		display: grid;
		gap: 1rem;
		margin-top: 1.25rem;
	}
	.result {
		display: grid;
		gap: 0.4rem;
	}
	.line {
		height: 0.55rem;
		border-radius: 4px;
		background: #eee8df;
	}
	.line.link {
		width: 45%;
		background: #d9d2e8;
	}
	.line.short {
		width: 70%;
	}

	/* Little labels pointing out the two halves */
	.tag {
		font-family: Georgia, serif;
		font-size: 0.78rem;
		font-weight: normal;
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
		background: var(--accent);
		color: white;
		white-space: nowrap;
		opacity: 0;
		transform: translateY(4px);
		transition:
			opacity 0.4s ease,
			transform 0.4s ease;
	}
	.tag.on {
		opacity: 1;
		transform: none;
	}
	.tag-in {
		position: absolute;
		right: 0.6rem;
		top: -0.75rem;
	}
	.tag-out {
		margin-left: auto;
	}

	.footer {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
		margin-top: 3rem;
	}
	.question {
		margin: 0;
		font-size: 1.35rem;
	}
	.replay {
		font: inherit;
		font-size: 0.9rem;
		background: none;
		border: 1px solid var(--line);
		border-radius: 999px;
		padding: 0.35rem 0.9rem;
		color: var(--ink-soft);
		cursor: pointer;
	}
	.replay:disabled {
		opacity: 0.4;
		cursor: default;
	}

	@media (max-width: 860px) {
		.search-example {
			grid-template-columns: minmax(0, 1fr);
			gap: 1.5rem;
		}
		.footer {
			margin-top: 1.75rem;
		}
		.question {
			font-size: 1.15rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.word,
		.shimmer span,
		.cursor {
			animation: none;
		}
	}
</style>
