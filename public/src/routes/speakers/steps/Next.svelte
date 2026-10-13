<script>
	// Wrapping up: the gramophone's chain, its electric version, the file version, and what's next.
	const chains = [
		{ name: 'Gramophone', links: ['Groove', 'Needle', 'Diaphragm', 'Horn', 'Air'] },
		{ name: 'Record player', links: ['Groove', 'Needle + magnet', 'Electricity', 'Amplifier', 'Coil + magnet', 'Cone', 'Air'] },
		{ name: 'Phone', links: ['File', 'Numbers', 'Electricity', 'Amplifier', 'Coil + magnet', 'Cone', 'Air'] },
		{ name: 'Radio', links: ['Station', 'Radio wave', 'Antenna', 'Electricity', 'Amplifier', 'Coil + magnet', 'Cone', 'Air'] },
		{ name: 'Bluetooth', links: ['File', 'Numbers', 'Bluetooth radio', 'Chip', 'Electricity', 'Amplifier', 'Coil + magnet', 'Cone', 'Air'] }
	];
</script>

<div class="next">
	<p class="step-label">Wrapping up</p>
	<h2 class="step-title">One chain, 130 years</h2>

	<div class="chains">
		{#each chains as c (c.name)}
			<p class="chain-name">{c.name}</p>
			<ol class="chain" aria-label={c.name}>
				{#each c.links as link, i (link)}
					<li>{link}</li>
					{#if i < c.links.length - 1}<li class="arrow" aria-hidden="true">→</li>{/if}
				{/each}
			</ol>
		{/each}
	</div>

	<p class="step-lede">
		That's the whole trick: <strong>store the wiggle, read it back, shake the air</strong>. Electricity
		swapped a few links, a file swapped the groove for numbers, and a microphone runs the chain
		backwards: sound into electricity.
	</p>

	<div class="coming">
		<p class="label">Another day</p>
		<ul>
			<li>How <strong>compression</strong> decides what an MP3 can leave out.</li>
			<li>How <strong>radio waves</strong> work, and why every station has its own number.</li>
		</ul>
	</div>
</div>

<style>
	.next {
		max-width: 56rem;
		margin: 0 auto;
	}
	.chains {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		gap: 0.55rem 1rem;
		align-items: center;
		margin-top: 1.5rem;
	}
	.chain-name {
		margin: 0;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}
	.chain {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.3rem;
	}
	.chain li {
		padding: 0.25rem 0.65rem;
		border-radius: var(--pill);
		background: var(--ink);
		color: var(--paper);
		font-size: 0.82rem;
		font-weight: 700;
	}
	.chain li.arrow {
		padding: 0;
		background: none;
		color: var(--accent);
	}
	.step-lede {
		margin-top: 1.25rem;
	}
	strong {
		color: var(--ink);
		font-weight: normal;
		border-bottom: 2px solid var(--accent-mid);
	}
	.coming {
		margin-top: 1.25rem;
		padding: 0.9rem 1.3rem;
		border-radius: var(--radius-lg);
		background: var(--accent-soft);
	}
	.label {
		margin: 0 0 0.5rem;
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--accent);
	}
	ul {
		margin: 0;
		padding-left: 1.2rem;
		display: grid;
		gap: 0.4rem;
		line-height: 1.5;
		color: var(--ink-soft);
	}
</style>
