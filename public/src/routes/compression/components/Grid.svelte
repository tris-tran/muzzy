<script>
	// An 8×8 grid of numbers.
	//   kind   – 'pixel': grey squares (0 black … 255 white)
	//            'amount': how much of each pattern (indigo for +, rose for −, stronger = bigger)
	//            'plain': just numbers
	//   numbers – show the numbers in the cells
	//   faded   – optional 64 booleans: cells to grey out
	//   scale   – for 'amount', the value that counts as "full colour" (defaults to the biggest)
	//   selected / onpick – optional: outline one cell, and make the cells clickable
	let {
		values,
		kind = 'pixel',
		numbers = true,
		faded = null,
		scale = null,
		label = '',
		selected = -1,
		onpick = null,
		children
	} = $props();

	let max = $derived(scale ?? Math.max(1, ...values.map((v) => Math.abs(v))));

	function look(v) {
		if (kind === 'pixel') {
			const g = Math.round(v);
			return `background: rgb(${g} ${g} ${g}); color: ${g < 140 ? '#fff' : '#0f172a'}`;
		}
		if (kind === 'amount') {
			const a = Math.min(1, Math.abs(v) / max);
			const hue = v < 0 ? 'var(--bad)' : 'var(--accent)';
			return `background: color-mix(in srgb, ${hue} ${Math.round(a * 85)}%, var(--card)); color: ${a > 0.5 ? '#fff' : 'var(--ink)'}`;
		}
		return '';
	}
</script>

<div class="grid {kind}" role="img" aria-label={label}>
	{#each values as v, i (i)}
		<svelte:element
			this={onpick ? 'button' : 'span'}
			role={onpick ? 'button' : undefined}
			class="cell"
			class:faded={faded?.[i]}
			class:zero={kind !== 'pixel' && Math.round(v) === 0}
			class:sel={i === selected}
			style={look(v)}
			onclick={onpick ? () => onpick(i) : undefined}
			onmouseenter={onpick ? () => onpick(i) : undefined}
			aria-label={onpick ? `Number ${Math.round(v) || 0}, pattern ${i % 8} across, ${Math.floor(i / 8)} down` : undefined}
			>{numbers ? Math.round(v) || 0 : ''}</svelte:element
		>
	{/each}
	{@render children?.()}
</div>

<style>
	.grid {
		position: relative;
		display: grid;
		grid-template-columns: repeat(8, var(--cell, 2rem));
		grid-auto-rows: var(--cell, 2rem);
		border-radius: 6px;
		overflow: hidden;
		border: var(--bw) solid var(--line);
		background: var(--card);
		width: max-content;
	}
	.cell {
		display: grid;
		place-items: center;
		font-family: var(--font-mono);
		font-size: calc(var(--cell, 2rem) * 0.3);
		box-shadow: inset 0 0 0 0.5px rgba(255, 255, 255, 0.35);
		transition:
			background 0.3s,
			color 0.3s,
			opacity 0.3s;
	}
	.plain .cell {
		box-shadow: inset 0 0 0 0.5px var(--line);
		color: var(--ink-soft);
	}
	button.cell {
		padding: 0;
		border: 0;
		cursor: pointer;
	}
	.cell.sel {
		position: relative;
		z-index: 1;
		box-shadow:
			0 0 0 2px var(--accent),
			0 0 0 5px var(--accent-soft);
	}
	.cell.zero {
		color: var(--muted);
	}
	.cell.faded {
		opacity: 0.18;
	}
</style>
