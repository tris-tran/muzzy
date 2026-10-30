<script>
	// What you decide to make a benchmark, one part per tab, in pseudocode. Tap a line to see what
	// it is, with an example and how it's used.
	import { parts, fields } from './recipe.js';

	let picked = $state('source');
	let part = $derived(parts.find((p) => p.id === picked));
	let key = $state(null);
	// Until something is tapped, explain the part's first line
	let shownKey = $derived(key ?? part.code?.find((l) => l[1])?.[1]);
	let field = $derived(fields[shownKey]);

	function pick(id) {
		picked = id;
		key = null;
	}
</script>

<div class="tabs" role="tablist" aria-label="The parts of a benchmark">
	{#each parts as p, i (p.id)}
		<button role="tab" aria-selected={picked === p.id} class:active={picked === p.id} onclick={() => pick(p.id)}>
			<span class="n">{i + 1}</span>{p.tab}
		</button>
	{/each}
</div>

{#key picked}
	<div class="panel" role="tabpanel">
		<h3>{part.title}</h3>
		<p class="text">{part.text}</p>

		<div class="body">
			<pre class="code">{#each part.code as [line, k, note], i (i)}{#if k}<button
							class="line"
							class:on={shownKey === k}
							onclick={() => (key = k)}>{line}{#if note}<span class="note">  ← {note}</span>{/if}</button
						>{:else}<span class="line plain">{line || ' '}</span>{/if}{/each}</pre>

			{#if field}
				<div class="about" aria-live="polite">
					<p class="about-title">{field.title}</p>
					<p class="about-text">{field.text}</p>
					{#if field.use}
						<pre class="use">{field.use.join('\n')}</pre>
					{/if}
					{#if field.example}
						<p class="extra"><span>For example</span>{field.example}</p>
					{/if}
					{#if field.note}
						<p class="extra"><span>Good to know</span>{field.note}</p>
					{/if}
					<p class="hint">Tap any line on the left.</p>
				</div>
			{/if}
		</div>

		{#if part.chips}
			<div class="chips">
				<span class="chips-label">{part.chips.label}</span>
				{#each part.chips.items as c (c)}<span class="chip">{c}</span>{/each}
			</div>
		{/if}
	</div>
{/key}

<style>
	.tabs {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	.tabs button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font: inherit;
		font-size: 0.95rem;
		padding: 0.4rem 0.95rem 0.4rem 0.45rem;
		border-radius: var(--pill);
		border: var(--bw) solid var(--line);
		background: var(--card);
		color: var(--ink);
		cursor: pointer;
	}
	.tabs button:hover {
		border-color: var(--ink-soft);
	}
	.tabs button.active {
		background: var(--ink);
		border-color: var(--ink);
		color: var(--paper);
	}
	.n {
		display: grid;
		place-items: center;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 50%;
		background: var(--accent-soft);
		color: var(--accent);
		font-size: 0.8rem;
		font-weight: 700;
	}

	.panel {
		margin-top: 1rem;
		padding: 1.3rem 1.5rem;
		border-radius: var(--radius-lg);
		border: var(--bw) solid var(--line);
		background: var(--card);
		animation: fade 0.3s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
	}
	h3 {
		margin: 0;
		font-size: 1.3rem;
	}
	.text {
		max-width: 52rem;
		margin: 0.5rem 0 0;
		line-height: 1.6;
		color: var(--ink-soft);
	}

	.body {
		display: grid;
		grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
		gap: 1.5rem;
		margin-top: 1rem;
		align-items: start;
	}

	/* The pseudocode: each line with a field is a button */
	.code {
		display: grid;
		margin: 0;
		padding: 0.7rem 0;
		border-radius: var(--radius-sm);
		background: var(--dark);
		color: var(--on-dark);
		font-family: var(--font-mono);
		font-size: 0.85rem;
		line-height: 1.5;
		overflow-x: auto;
	}
	.line {
		display: block;
		box-sizing: border-box;
		min-width: 100%;
		padding: 0.12rem 1rem;
		font: inherit;
		text-align: left;
		white-space: pre;
		color: inherit;
		background: none;
		border: 0;
		border-left: 3px solid transparent;
	}
	button.line {
		cursor: pointer;
	}
	button.line:hover {
		background: color-mix(in srgb, var(--on-dark) 8%, transparent);
	}
	button.line.on {
		background: color-mix(in srgb, var(--accent-mid) 30%, transparent);
		border-left-color: var(--accent-mid);
	}
	.note {
		color: var(--tag);
	}

	.about {
		padding: 1rem 1.1rem;
		border-radius: var(--radius);
		border: var(--bw) solid var(--accent-mid);
		background: var(--paper);
	}
	.about-title {
		margin: 0;
		font-family: var(--font-mono);
		font-weight: 700;
		color: var(--accent);
	}
	.about-text {
		margin: 0.4rem 0 0;
		line-height: 1.55;
	}
	.use {
		margin: 0.8rem 0 0;
		padding: 0.55rem 0.75rem;
		border-radius: var(--radius-sm);
		background: var(--dark);
		color: var(--on-dark);
		font-family: var(--font-mono);
		font-size: 0.76rem;
		line-height: 1.6;
		white-space: pre-wrap;
	}
	.extra {
		margin: 0.8rem 0 0;
		font-size: 0.9rem;
		line-height: 1.5;
		color: var(--ink-soft);
	}
	.extra span {
		display: block;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	.hint {
		margin: 0.9rem 0 0;
		font-size: 0.78rem;
		color: var(--muted);
	}

	/* What a source can read */
	.chips {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.4rem;
		margin-top: 1rem;
	}
	.chips-label {
		margin-right: 0.3rem;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}
	.chip {
		padding: 0.2rem 0.65rem;
		border-radius: var(--pill);
		background: var(--accent-soft);
		color: var(--accent);
		font-size: 0.85rem;
	}

	@media (max-width: 860px) {
		.body {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.panel {
			animation: none;
		}
	}
</style>
