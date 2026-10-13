<script module>
	// Weighted dice roll over [label, chance] options: a 30% option wins about 3 times in 10.
	// Returns the index of the winner.
	export function roll(options) {
		const total = options.reduce((sum, [, p]) => sum + p, 0);
		let r = Math.random() * total;
		for (let i = 0; i < options.length; i++) {
			r -= options[i][1];
			if (r < 0) return i;
		}
		return options.length - 1;
	}
</script>

<script>
	// The model's guesses for the next token, as probability bars.
	//   options – [label, chance in %] pairs, shown in this order
	//   accent  – index drawn in the accent colour (-1 for none)
	//   picked  – index highlighted as "this one won" (-1 for none)
	//   grow    – bars animate from 0 to their size when this turns true
	//   rest    – add an "everything else" row with whatever is left of 100%
	let { options, accent = 0, picked = -1, grow = true, rest = true } = $props();

	let other = $derived(Math.max(0, 100 - options.reduce((sum, [, p]) => sum + p, 0)));
	const fmt = (p) => (p < 10 ? Math.round(p * 10) / 10 : Math.round(p));
</script>

<ol class="bars">
	{#each options as [label, p], i (label)}
		<li class:accent={i === accent} class:picked={i === picked}>
			<span class="token">{label}</span>
			<span class="bar"><span style="width: {grow ? p : 0}%"></span></span>
			<span class="pct">{fmt(p)}%</span>
		</li>
	{/each}
	{#if rest}
		<li class="other">
			<span class="token">everything else</span>
			<span class="bar"><span style="width: {grow ? other : 0}%"></span></span>
			<span class="pct">{fmt(other)}%</span>
		</li>
	{/if}
</ol>

<style>
	.bars {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.45rem;
	}
	li {
		display: grid;
		grid-template-columns: 7rem 1fr 3rem;
		align-items: center;
		gap: 0.6rem;
		padding: 0.15rem 0.4rem;
		margin: 0 -0.4rem;
		border-radius: 6px;
		transition: background 0.3s ease;
	}
	.token {
		font-size: 1.05rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.bar {
		height: 0.6rem;
		border-radius: var(--pill);
		background: var(--track);
		overflow: hidden;
	}
	.bar span {
		display: block;
		height: 100%;
		border-radius: inherit;
		background: var(--track-strong);
		transition: width 0.9s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	li.accent .bar span {
		background: var(--accent-mid);
	}
	.pct {
		font-size: 0.85rem;
		text-align: right;
		color: var(--ink-soft);
		font-variant-numeric: tabular-nums;
	}
	li.picked {
		background: var(--accent-soft);
	}
	li.picked .token {
		color: var(--accent);
		font-weight: bold;
	}
	li.picked .bar span {
		background: var(--accent);
	}
	li.other .token {
		font-size: 0.85rem;
		font-style: italic;
		color: var(--ink-soft);
	}

	@media (max-width: 600px) {
		li {
			grid-template-columns: 5.5rem 1fr 2.8rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.bar span {
			transition: none;
		}
	}
</style>
