<script>
	// Shows the raw text an LLM sees (see chatml.js), piece by piece.
	//   tokens   – pieces from chatml.js
	//   numeric  – how many pieces, from the top, are currently shown as their numbers
	//   fresh    – pieces from this index on are highlighted as new
	//   caret    – show a blinking caret at the end (the model is "writing here")
	let { tokens, numeric = 0, fresh = Infinity, caret = false } = $props();
	let el = $state();

	// Keep the newest text in view
	$effect(() => {
		tokens.length;
		if (el) el.scrollTop = el.scrollHeight;
	});
</script>

<div class="context" bind:this={el}>
	{#each tokens as tok, i (i)}{#if i < numeric}<span class="num" class:tagnum={tok.kind === 'tag'}
				>{tok.id}</span
			>{tok.kind === 'nl' ? '\n' : ' '}{:else}<span
				class={tok.kind}
				class:fresh={i >= fresh}>{tok.kind === 'nl' ? '\n' : tok.t}</span
			>{/if}{/each}{#if caret}<span class="caret"></span>{/if}
</div>

<style>
	.context {
		height: 100%;
		overflow-y: auto;
		box-sizing: border-box;
		padding: 1rem 1.1rem;
		font-family: var(--font-mono);
		font-size: 0.82rem;
		line-height: 1.7;
		white-space: pre-wrap;
		overflow-wrap: anywhere;
		color: color-mix(in srgb, var(--on-dark) 88%, transparent);
	}
	.tag {
		color: var(--tag);
		background: color-mix(in srgb, var(--tag) 12%, transparent);
		border-radius: 4px;
		padding: 0 0.15em;
	}
	.role {
		color: var(--accent-mid);
		font-weight: bold;
	}
	.fresh {
		background: color-mix(in srgb, var(--accent-mid) 18%, transparent);
		border-radius: 3px;
		transition: background 1.5s ease;
	}
	.num {
		color: var(--accent-mid);
		animation: flip 0.25s ease-out both;
	}
	.tagnum {
		color: var(--tag);
	}
	@keyframes flip {
		from {
			opacity: 0;
		}
	}
	.caret {
		display: inline-block;
		width: 0.5em;
		height: 1.05em;
		vertical-align: -0.15em;
		background: var(--accent-mid);
		animation: blink 0.8s steps(2) infinite;
	}
	@keyframes blink {
		50% {
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.num,
		.caret {
			animation: none;
		}
	}
</style>
