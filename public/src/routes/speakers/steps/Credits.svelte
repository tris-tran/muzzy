<script>
	// Last step: who made what. Every model, recording, font and library here is someone else's work.
	import { resolve } from '$app/paths';
	import { credits } from '../components/data.js';

	function toTop() {
		document.getElementById('start')?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<div class="credits">
	<p class="step-label">Credits</p>
	<h2 class="step-title">Made by other people</h2>
	<p class="step-lede">
		None of these are mine. Thank you to everyone who shared their work for free.
	</p>

	<div class="groups">
		{#each credits as c (c.group)}
			<section>
				<h3>{c.group}</h3>
				<ul>
					{#each c.items as item (item.url)}
						<li>
							<a href={item.url} target="_blank" rel="noopener">{item.what}</a>
							<span class="who">{item.who} · {item.where}</span>
							<span class="license">{item.license}</span>
						</li>
					{/each}
				</ul>
			</section>
		{/each}
	</div>

	<p class="made">
		The gramophone drawings, the animations and the code were made with
		<a href="https://claude.ai" target="_blank" rel="noopener">Claude</a>, an AI by Anthropic.
	</p>

	<div class="end">
		<button onclick={toTop}>↑ Back to the start</button>
		<a href={resolve('/')}>← All explainers</a>
	</div>
</div>

<style>
	.credits {
		max-width: 60rem;
		margin: 0 auto;
	}
	.step-lede {
		margin: 0.8rem 0 0;
	}
	.groups {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr));
		gap: 1.25rem;
		margin-top: 1.25rem;
	}
	h3 {
		margin: 0 0 0.6rem;
		font-size: 0.8rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		font-weight: 700;
		color: var(--accent);
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.4rem;
	}
	li {
		display: grid;
		line-height: 1.35;
	}
	li a {
		color: var(--ink);
	}
	.who,
	.license {
		font-size: 0.85rem;
		color: var(--ink-soft);
	}
	.license {
		color: var(--muted);
	}
	.made {
		margin: 1.25rem 0 0;
		color: var(--ink-soft);
	}
	.made a {
		color: var(--accent);
	}
	.end {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		flex-wrap: wrap;
		margin-top: 1rem;
	}
	.end button {
		font: inherit;
		font-size: 0.9rem;
		background: none;
		border: var(--bw) solid var(--ink-soft);
		border-radius: var(--pill);
		padding: 0.4rem 1rem;
		color: var(--ink);
		cursor: pointer;
	}
	.end button:hover {
		background: var(--ink);
		color: var(--paper);
	}
	.end a {
		font-size: 0.9rem;
		color: var(--ink-soft);
	}
</style>
