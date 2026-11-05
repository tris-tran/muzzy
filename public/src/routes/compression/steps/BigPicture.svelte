<script>
	// Step 1: the whole idea in one diagram. A text goes into the compress machine, comes out as
	// smaller gibberish, goes into the decompress machine and comes back exactly the same.
	// It's real gzip (the browser's own), so every size shown is genuine.
	import Pipe from '#lib/presentation/Pipe.svelte';
	import Machine from '../components/Machine.svelte';
	import { gzip, gunzip, byteSize, glyphs } from '../components/gzip.js';

	import { examples } from '../components/texts.js';

	// idle → compressing → compressed → decompressing → done
	let phase = $state('idle');
	let pickedIndex = $state(0);
	let original = $derived(examples[pickedIndex].text);
	let originalSize = $derived(byteSize(original));

	let packed = $state(null); // the real gzip bytes
	let gibberish = $derived(packed ? glyphs(packed) : '');
	let shown = $state(0); // how much of the gibberish is on screen
	let restored = $state('');
	let identical = $derived(phase === 'done' && restored === original);

	let percent = $derived(packed ? Math.round((100 * packed.length) / originalSize) : 100);
	let busy = $derived(phase === 'compressing' || phase === 'decompressing');

	let run = 0;
	const wait = (ms) => new Promise((r) => setTimeout(r, ms));
	const speed = () => (matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.2 : 1);

	async function compress() {
		const id = ++run;
		const slow = speed();
		restored = '';
		shown = 0;
		phase = 'compressing';
		const [bytes] = await Promise.all([gzip(original), wait(1600 * slow)]);
		if (id !== run) return;
		packed = bytes;
		phase = 'compressed';
		// Let the gibberish spill out of the machine
		const steps = 12;
		for (let i = 1; i <= steps; i++) {
			shown = Math.ceil((bytes.length * i) / steps);
			await wait(45 * slow);
			if (id !== run) return;
		}
	}

	async function decompress() {
		const id = ++run;
		phase = 'decompressing';
		const [text] = await Promise.all([gunzip(packed), wait(1600 * speed())]);
		if (id !== run) return;
		restored = text;
		phase = 'done';
	}

	function pick(index) {
		run++;
		pickedIndex = index;
		reset();
	}

	function reset() {
		run++;
		phase = 'idle';
		packed = null;
		shown = 0;
		restored = '';
	}

	// Stack the diagram (and turn the pipes) on narrower screens
	let width = $state(1200);
	let stacked = $derived(width <= 960);
</script>

<svelte:window bind:innerWidth={width} />

<div class="big-picture">
	<div class="head">
		<div>
			<p class="step-label">Step 1 · The big picture</p>
			<h2 class="step-title">Squeeze it, then unsqueeze it</h2>
		</div>
		<p class="step-lede">
			Compression is a machine that makes a file smaller. Decompression is the machine that turns it
			back. Pick a text and send it through both.
		</p>
	</div>

	<div class="choices" role="group" aria-label="Pick a text">
		{#each examples as example, i (example.name)}
			<button
				class="chip"
				class:active={i === pickedIndex}
				disabled={busy}
				onclick={() => pick(i)}>{example.name}</button
			>
		{/each}
	</div>

	<div class="stage" class:stacked data-phase={phase}>
		<!-- 1. The original -->
		<div class="card">
			<span class="label">Original text</span>
			<p class="text" class:sending={phase === 'compressing'}>{original}</p>
			<div class="size">
				<span class="bar"><span style="width: 100%"></span></span>
				<span><strong>{originalSize}</strong> bytes</span>
			</div>
			<button class="go" onclick={compress} disabled={phase !== 'idle'}>Compress it →</button>
		</div>

		<!-- 2. Compress -->
		<div class="link">
			<Pipe vertical={stacked} flowing={phase === 'compressing'} />
			<Machine kind="compress" label="Compress" sub="gzip" working={phase === 'compressing'} />
			<Pipe vertical={stacked} flowing={phase === 'compressing'} />
		</div>

		<!-- 3. The squeezed version -->
		<div class="card squeezed">
			<span class="label">Compressed</span>
			{#if packed}
				<p class="gibberish" aria-label="Compressed bytes, unreadable">
					{gibberish.slice(0, shown)}{#if shown < gibberish.length}<span class="caret"></span>{/if}
				</p>
				<div class="size">
					<span class="bar"><span class="small" style="width: {percent}%"></span></span>
					<span><strong>{packed.length}</strong> bytes · {percent}% of the size</span>
				</div>
				<button
					class="go"
					onclick={decompress}
					disabled={phase !== 'compressed' || shown < gibberish.length}>Decompress it →</button
				>
			{:else}
				<p class="placeholder">
					{phase === 'compressing' ? 'Squeezing…' : 'The squeezed version will appear here.'}
				</p>
			{/if}
		</div>

		<!-- 4. Decompress -->
		<div class="link">
			<Pipe vertical={stacked} flowing={phase === 'decompressing'} />
			<Machine kind="decompress" label="Decompress" sub="gunzip" working={phase === 'decompressing'} />
			<Pipe vertical={stacked} flowing={phase === 'decompressing'} />
		</div>

		<!-- 5. Back again -->
		<div class="card" class:match={identical}>
			<span class="label">Back again</span>
			{#if phase === 'done'}
				<p class="text back">{restored}</p>
				<div class="size">
					<span class="bar"><span style="width: 100%"></span></span>
					<span><strong>{byteSize(restored)}</strong> bytes</span>
				</div>
				<p class="check" class:visible={identical}>✓ Identical, letter for letter</p>
			{:else}
				<p class="placeholder">
					{phase === 'decompressing' ? 'Unsqueezing…' : 'The text comes back here.'}
				</p>
			{/if}
		</div>
	</div>

	<div class="outro" class:visible={phase === 'done'}>
		<p>
			The squeezed version was only <strong>{percent}%</strong> of the size, and nothing was lost:
			every letter came back. It looks like nonsense, but it holds everything needed to rebuild the
			text. <span class="soft">(A byte is about one letter.)</span>
		</p>
		<button class="again" onclick={reset}>Try another</button>
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

	.choices {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 1.75rem 0 1.5rem;
	}
	.chip {
		font: inherit;
		font-size: 0.95rem;
		padding: 0.45rem 0.9rem;
		border-radius: var(--pill);
		border: var(--bw) solid var(--line);
		background: var(--card);
		color: var(--ink);
		cursor: pointer;
	}
	.chip:hover:not(:disabled) {
		border-color: var(--ink-soft);
	}
	.chip.active {
		background: var(--ink);
		border-color: var(--ink);
		color: var(--paper);
	}
	.chip:disabled:not(.active) {
		opacity: 0.45;
		cursor: default;
	}

	/* The diagram: text → machine → text → machine → text */
	.stage {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto minmax(0, 0.85fr) auto minmax(0, 1fr);
		align-items: stretch;
	}
	.link {
		display: flex;
		align-items: center;
	}
	.stage .link :global(.pipe) {
		width: 1.75rem;
	}
	.card {
		display: flex;
		flex-direction: column;
		min-height: 19rem;
		padding: 0.9rem 1rem 1rem;
		border-radius: var(--radius);
		background: var(--card);
		border: var(--bw) solid var(--line);
		transition:
			border-color 0.4s,
			box-shadow 0.4s;
	}
	/* The squeezed card is physically smaller too */
	.card.squeezed {
		align-self: center;
		min-height: 13rem;
	}
	.card.match {
		border-color: var(--good);
		box-shadow: 0 0 0 4px var(--good-soft);
	}
	.label {
		font-size: 0.72rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}
	.text {
		flex: 1;
		margin: 0.6rem 0;
		font-size: 0.85rem;
		line-height: 1.5;
		white-space: pre-line;
		transition: opacity 0.4s;
	}
	.text.sending {
		opacity: 0.45;
	}
	.text.back {
		animation: arrive 0.6s ease-out both;
	}
	@keyframes arrive {
		from {
			opacity: 0;
			filter: blur(4px);
		}
	}
	.gibberish {
		flex: 1;
		margin: 0.6rem 0;
		font-family: var(--font-mono);
		font-size: 0.85rem;
		line-height: 1.5;
		color: var(--accent);
		word-break: break-all;
	}
	.caret {
		display: inline-block;
		width: 0.5em;
		height: 1em;
		vertical-align: -0.12em;
		background: var(--accent);
	}
	.placeholder {
		flex: 1;
		margin: 0.6rem 0;
		font-size: 0.9rem;
		font-style: italic;
		color: var(--muted);
	}

	/* Size: a bar against the original, and the byte count */
	.size {
		display: grid;
		gap: 0.35rem;
		font-size: 0.85rem;
		color: var(--ink-soft);
	}
	.size strong {
		color: var(--ink);
	}
	.bar {
		display: block;
		height: 6px;
		border-radius: var(--pill);
		background: var(--track);
		overflow: hidden;
	}
	.bar span {
		display: block;
		height: 100%;
		border-radius: inherit;
		background: var(--ink-soft);
	}
	.bar .small {
		background: var(--accent);
		animation: shrink 0.8s ease-out both;
	}
	@keyframes shrink {
		from {
			width: 100%;
		}
	}

	.go {
		align-self: flex-start;
		margin-top: 0.9rem;
		font: inherit;
		font-size: 0.9rem;
		padding: 0.5rem 1rem;
		border-radius: var(--pill);
		border: 0;
		background: var(--accent);
		color: white;
		cursor: pointer;
	}
	.go:hover:not(:disabled) {
		background: var(--accent-hover);
	}
	.go:disabled {
		opacity: 0.35;
		cursor: default;
	}
	.check {
		margin: 0.9rem 0 0;
		font-weight: 700;
		color: var(--good);
		opacity: 0;
		transition: opacity 0.5s 0.3s;
	}
	.check.visible {
		opacity: 1;
	}

	.outro {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		margin-top: 1.75rem;
		opacity: 0;
		transform: translateY(8px);
		transition:
			opacity 0.6s ease,
			transform 0.6s ease;
	}
	.outro.visible {
		opacity: 1;
		transform: none;
	}
	.outro p {
		margin: 0;
		max-width: 44rem;
		font-size: 1.1rem;
		line-height: 1.6;
	}
	.outro strong {
		color: var(--accent);
	}
	.soft {
		color: var(--ink-soft);
		font-size: 0.95rem;
	}
	.again {
		flex: 0 0 auto;
		font: inherit;
		font-size: 0.9rem;
		padding: 0.45rem 1rem;
		border-radius: var(--pill);
		border: var(--bw) solid var(--ink-soft);
		background: none;
		color: var(--ink);
		cursor: pointer;
	}
	.again:hover {
		background: var(--ink);
		color: var(--paper);
	}

	/* Narrower screens: the diagram runs top to bottom */
	.stage.stacked {
		grid-template-columns: minmax(0, 1fr);
	}
	.stacked .link {
		flex-direction: column;
		justify-self: center;
	}
	.stage.stacked .link :global(.pipe) {
		width: 2px;
		height: 1.1rem;
	}
	.stacked .card,
	.stacked .card.squeezed {
		min-height: 0;
		align-self: stretch;
	}
	@media (max-width: 860px) {
		.head {
			grid-template-columns: minmax(0, 1fr);
		}
		.step-lede {
			margin-top: 1rem;
		}
		.outro {
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.text.back,
		.bar .small,
		.outro {
			animation: none;
			transition: none;
		}
	}
</style>
