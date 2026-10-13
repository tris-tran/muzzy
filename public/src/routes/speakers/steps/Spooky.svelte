<script>
	// A side note after the microphone step: real spying stories that show a speaker and a
	// microphone are the same parts. The TV hack used the TV's own microphone; the headphone
	// research really turned a speaker into a microphone.
	import { onMount } from 'svelte';
	import Driver from '../components/Driver.svelte';

	// Flip between "speaker" and "microphone" every few seconds
	let asMic = $state(false);
	onMount(() => {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const id = setInterval(() => (asMic = !asMic), 2600);
		return () => clearInterval(id);
	});
</script>

<div class="spooky">
	<div class="head">
		<div>
			<p class="step-label">A spooky side note</p>
			<h2 class="step-title">Yes, your speakers can listen</h2>
		</div>
		<p class="step-lede">
			Because a speaker and a microphone are the <strong>same parts</strong>, the only difference is
			which way the electricity flows. Spies know this too.
		</p>
	</div>

	<div class="body">
		<figure class="flip" aria-label="The same part as a speaker and as a microphone">
			<svg viewBox="-170 -140 420 280">
				<Driver x={0} y={0} />
				<g class="arrow" class:mic={asMic}>
					<path d="M-160,0 H-70" />
					<path d="M-82,-10 L-68,0 L-82,10" />
					<path d="M120,0 H220" />
					<path d="M208,-10 L222,0 L208,10" />
				</g>
			</svg>
			<figcaption>
				{#if asMic}
					<strong>Microphone:</strong> sound in → electricity out
				{:else}
					<strong>Speaker:</strong> electricity in → sound out
				{/if}
			</figcaption>
		</figure>

		<div class="stories">
			<article>
				<span class="year">2016 · Headphones</span>
				<h3>Headphones that eavesdrop</h3>
				<p>
					Researchers at Ben-Gurion University wrote a program that switched a computer's headphone
					socket from "out" to "in". Plain headphones turned into a microphone and could pick up
					speech from across a room.
				</p>
				<a href="https://www.usenix.org/conference/woot17/workshop-program/presentation/guri" target="_blank" rel="noopener">Read the research (SPEAKE(a)R)</a>
			</article>
			<article>
				<span class="year">2017 · Smart TVs</span>
				<h3>The TV that pretended to be off</h3>
				<p>
					Leaked CIA documents described "Weeping Angel": a hack that made some Samsung smart TVs fake
					being switched off while they recorded the room. That one used the TV's built-in microphone,
					the one meant for voice commands.
				</p>
				<a href="https://en.wikipedia.org/wiki/Vault_7" target="_blank" rel="noopener">Read about Vault 7</a>
			</article>
		</div>
	</div>
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
	.step-lede strong {
		color: var(--ink);
		font-weight: normal;
		border-bottom: 2px solid var(--accent-mid);
	}

	.body {
		display: grid;
		grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
		gap: 2rem;
		align-items: center;
		margin-top: 2rem;
	}
	.flip {
		margin: 0;
		padding: 1rem;
		border-radius: var(--radius-lg);
		border: var(--bw) solid var(--line);
		background: var(--card);
	}
	svg {
		display: block;
		width: 100%;
		height: auto;
	}
	/* The arrows show the flow: left to right for a speaker (electricity enters at the magnet,
	   sound leaves the cone), flipped for a microphone */
	.arrow path {
		fill: none;
		stroke: var(--accent);
		stroke-width: 5;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.arrow {
		transform-box: view-box;
		transform-origin: 25px 0;
		transition: transform 0.6s ease;
	}
	.arrow.mic {
		transform: scaleX(-1);
	}
	figcaption {
		margin-top: 0.6rem;
		text-align: center;
		color: var(--ink-soft);
	}
	figcaption strong {
		color: var(--accent);
	}

	.stories {
		display: grid;
		gap: 1rem;
	}
	article {
		padding: 1rem 1.25rem;
		border-radius: var(--radius);
		border: var(--bw) solid var(--line);
		background: var(--card);
	}
	.year {
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--accent);
	}
	h3 {
		margin: 0.3rem 0 0.4rem;
		font-size: 1.15rem;
	}
	article p {
		margin: 0 0 0.5rem;
		line-height: 1.5;
		color: var(--ink-soft);
	}
	article a {
		font-size: 0.85rem;
		color: var(--ink-soft);
	}

	@media (max-width: 860px) {
		.head,
		.body {
			grid-template-columns: minmax(0, 1fr);
		}
		.step-lede {
			margin-top: 1rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.arrow {
			transition: none;
		}
	}
</style>
