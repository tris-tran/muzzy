<script>
	// Step 2: the idea behind gzip, simplified (not how it really works, but how to picture it).
	// The same diagram as step 1, zoomed into the compress machine:
	//   original text → [compress: count the words, write a dictionary] → compressed file
	// 1. Scan the whole original and count the words. 2. Words that repeat enough get a one-symbol
	// code: that's the dictionary, written as the new file's header. 3. Copy the text into the new
	// file, swapping dictionary words for their codes. 4. Unpack: look the codes up in the header.
	import { flip } from 'svelte/animate';
	import Pipe from '#lib/presentation/Pipe.svelte';
	import Machine from '../components/Machine.svelte';
	import { examples } from '../components/texts.js';
	import {
		tokenize,
		countWords,
		buildDictionary,
		headerSize,
		pack,
		unpack,
		CODES
	} from '../components/dictionary.js';

	// Codes are one symbol each in the file; on screen they're drawn as numbered badges
	const badge = (code) => CODES.indexOf(code) + 1;

	let pickedIndex = $state(0);
	// The last chip is "your own": any text she types. The code symbols are reserved, so they're dropped.
	const OWN = examples.length;
	let own = $state('I like cats. My cats like me. Cats like naps, and I like naps too, so the cats and I nap a lot.');
	let ownClean = $derived(own.replace(new RegExp(`[${CODES.join('')}]`, 'g'), ''));
	let original = $derived(pickedIndex === OWN ? ownClean : examples[pickedIndex].text);
	let tokens = $derived(tokenize(original));
	let wordCount = $derived(tokens.filter((t) => t.word >= 0).length);
	let codes = $derived(buildDictionary(countWords(tokens)));
	let entries = $derived([...codes]);
	const codeFor = (word) => codes.get(word);

	// ready → scanning → scanned → building → built → copying → packed → unpacking → unpacked
	let phase = $state('ready');
	let scanned = $state(0); // words counted so far
	let coded = $state(0); // dictionary entries written so far
	let copied = $state(0); // pieces of text copied into the new file so far
	let restored = $state(0); // words put back so far

	let counts = $derived(countWords(tokens, scanned));
	let repeated = $derived(counts.filter((c) => c.count > 1));
	let once = $derived(counts.length - repeated.length);
	const after = (...phases) => phases.includes(phase);
	let decided = $derived(after('building', 'built', 'copying', 'packed', 'unpacking', 'unpacked'));
	let unpacking = $derived(after('unpacking', 'unpacked'));
	let busy = $derived(after('scanning', 'building', 'copying', 'unpacking'));

	// Sizes, live: the new file is the header plus whatever has been copied so far
	let originalSize = $derived([...original].length);
	let header = $derived(coded ? headerSize(new Map(entries.slice(0, coded))) : 0);
	let body = $derived(
		tokens
			.slice(0, copied)
			.reduce((sum, tok) => sum + (tok.word >= 0 && codeFor(tok.t) ? 1 : [...tok.t].length), 0)
	);
	let total = $derived(header + body);
	let percent = $derived(Math.round((100 * total) / originalSize));
	let identical = $derived(phase === 'unpacked' && unpack(pack(tokens, codes), codes) === original);

	let run = 0;
	const wait = (ms) => new Promise((r) => setTimeout(r, ms));
	const speed = () => (matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.15 : 1);

	// Walk through n things over about `ms`, calling `set` with how many are done
	async function sweep(id, n, ms, set) {
		// Long texts move in bigger jumps, so every sweep takes about the same time
		const steps = Math.min(n, 240);
		const each = (ms * speed()) / steps;
		for (let k = 1; k <= steps; k++) {
			set(Math.ceil((n * k) / steps));
			await wait(each);
			if (id !== run) return false;
		}
		return true;
	}

	async function scan() {
		const id = ++run;
		phase = 'scanning';
		if (await sweep(id, wordCount, 3200, (i) => (scanned = i))) phase = 'scanned';
	}

	async function build() {
		const id = ++run;
		phase = 'building';
		await wait(500 * speed());
		if (id !== run) return;
		if (await sweep(id, entries.length, entries.length * 220, (i) => (coded = i))) phase = 'built';
	}

	async function copy() {
		const id = ++run;
		phase = 'copying';
		if (await sweep(id, tokens.length, 3400, (i) => (copied = i))) phase = 'packed';
	}

	async function unpackIt() {
		const id = ++run;
		phase = 'unpacking';
		if (await sweep(id, wordCount, 1800, (i) => (restored = i))) phase = 'unpacked';
	}

	function reset() {
		run++;
		phase = 'ready';
		scanned = coded = copied = restored = 0;
	}

	function pick(index) {
		pickedIndex = index;
		reset();
	}

	// Stack the diagram (and turn the pipes) on narrower screens
	let width = $state(1200);
	let stacked = $derived(width <= 960);
</script>

<svelte:window bind:innerWidth={width} />

<div class="dictionary">
	<div class="head">
		<div>
			<p class="step-label">Step 2 · Inside the compress machine</p>
			<h2 class="step-title">Write repeats once, in a dictionary</h2>
		</div>
		<p class="step-lede">
			Let's open the machine. It reads the whole text and counts the words. The ones that keep coming
			back get a tiny code, and that list goes at the top of the new file. Then the text is copied in,
			with codes instead of words.
		</p>
	</div>

	<div class="choices" role="group" aria-label="Pick a text">
		{#each examples as example, i (example.name)}
			<button class="chip" class:active={i === pickedIndex} disabled={busy} onclick={() => pick(i)}
				>{example.name}</button
			>
		{/each}
		<button class="chip own-chip" class:active={pickedIndex === OWN} disabled={busy} onclick={() => pick(OWN)}
			>✎ Your own</button
		>
	</div>

	<div class="stage" class:stacked>
		<!-- 1. The original, which stays as it is -->
		<div class="card">
			<span class="label">Original text</span>
			<!-- One line on purpose: whitespace inside would show up in the text -->
			{#if pickedIndex === OWN && phase === 'ready'}
				<textarea bind:value={own} spellcheck="false" aria-label="Type or paste any text" placeholder="Type or paste any text…"></textarea>
			{:else}
			<p class="text">{#each tokens as tok, i (pickedIndex + '-' + i)}{#if tok.word < 0}{tok.t}{:else}<span class="word" class:current={(phase === 'scanning' && tok.word === scanned - 1) || (phase === 'copying' && i === copied - 1)} class:counted={phase === 'scanning' && tok.word < scanned} class:listed={decided && !unpacking && codeFor(tok.t)} class:copied={phase === 'copying' && i < copied}>{tok.t}</span>{/if}{/each}</p>
			{/if}
			<div class="size">
				<span class="bar"><span class="fill plain" style="width: 100%"></span></span>
				<span><strong>{originalSize}</strong> bytes</span>
			</div>
		</div>

		<Pipe vertical={stacked} flowing={phase === 'scanning'} />

		<!-- 2. The compress machine, zoomed in -->
		<div class="zoom">
			<Machine kind="compress" label="Compress" working={busy && !unpacking} />
			<div class="lens" aria-hidden="true"></div>
			<div class="inside">
				<span class="label">{decided ? 'Worth a code?' : 'Word count'}</span>
				{#if repeated.length}
					<ul>
						{#each repeated.slice(0, 15) as c (c.word)}
							{@const code = codeFor(c.word)}
							{@const at = entries.findIndex(([w]) => w === c.word)}
							<li animate:flip={{ duration: 250 }} class:skip={decided && !code}>
								<span class="name">{c.word}</span>
								<span class="times">×{c.count}</span>
								{#if decided && code && at < coded}
									<span class="code">{badge(code)}</span>
								{:else if decided && !code}
									<span class="nope">too short</span>
								{/if}
							</li>
						{/each}
					</ul>
					<p class="rest">
						{#if repeated.length > 15}+ {repeated.length - 15} more repeated ·
						{/if}{once} {once === 1 ? 'word appears' : 'words appear'} only once
					</p>
				{:else}
					<p class="empty">Nothing counted yet.</p>
				{/if}
			</div>
		</div>

		<Pipe vertical={stacked} flowing={phase === 'building' || phase === 'copying'} />

		<!-- 3. The new, compressed file, built from scratch -->
		<div class="card" class:match={identical}>
			<span class="label">Compressed file</span>
			{#if coded > 0}
				<div class="header">
					<span class="label">Header · the dictionary</span>
					<p class="entries">
						{#each entries.slice(0, coded) as [word, code] (word)}
							<span class="entry"><span class="code">{badge(code)}</span>{word}</span>
						{/each}
					</p>
				</div>
				<p class="text">{#each tokens.slice(0, copied) as tok, i (pickedIndex + '-' + i)}{#if tok.word < 0 || !codeFor(tok.t)}{tok.t}{:else if unpacking && tok.word < restored}<span class="word back">{tok.t}</span>{:else}<span class="code in-text" title={tok.t}>{badge(codeFor(tok.t))}</span>{/if}{/each}{#if phase === 'copying'}<span class="caret"></span>{/if}{#if copied === 0}<span class="waiting">The text goes here next.</span>{/if}</p>
				<div class="size">
					<span class="bar"><span class="fill" class:over={total > originalSize} style="width: {Math.min(100, (100 * total) / originalSize)}%"></span></span>
					<span>
						<strong>{total}</strong> bytes · header {header} + text {body} ·
						<strong class:good={phase !== 'built' && percent < 100}>{percent}%</strong> of the original
					</span>
				</div>
			{:else}
				<p class="placeholder">
					{phase === 'building' ? 'Writing the dictionary…' : 'The new file will be built here.'}
				</p>
			{/if}
		</div>
	</div>

	<div class="controls" aria-live="polite">
		{#if phase === 'ready' || phase === 'scanning'}
			<button class="go" onclick={scan} disabled={busy || wordCount === 0}>1 · Read and count the words</button>
			<p>
				{#if pickedIndex === OWN}Type or paste anything you like, then let the machine read it.
				{:else}First, the machine reads the whole text, start to finish, counting every word.{/if}
			</p>
		{:else if phase === 'scanned' || phase === 'building'}
			<button class="go" onclick={build} disabled={busy}>2 · Write the dictionary</button>
			<p>
				Words that repeat get a code, but only if it pays: every entry in the dictionary takes space
				too, so short or rare words aren't worth it.
			</p>
		{:else if phase === 'built' || phase === 'copying'}
			<button class="go" onclick={copy} disabled={busy}>3 · Copy the text, using the codes</button>
			<p>
				The dictionary alone already takes <strong>{header}</strong> bytes. Now copy the text in, and
				every code has to earn that space back.
			</p>
		{:else if phase === 'packed' || phase === 'unpacking'}
			<button class="go" onclick={unpackIt} disabled={busy}>4 · Unpack it</button>
			<p>
				Done: <strong>{percent}%</strong> of the original. To read it again, look each code up in the
				header.
			</p>
		{:else}
			<button class="ghost" onclick={reset}>Start over</button>
			<p class:ok={identical}>
				{#if identical}✓ Every word is back, exactly as it was. Nothing lost.{/if}
			</p>
		{/if}
	</div>

	<p class="footnote">
		Real gz is cleverer than this, but the idea is the same: <strong>write each repeat only once</strong>.
		The more a text repeats itself, the more it shrinks.
	</p>
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
		margin: 1.5rem 0 1.25rem;
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

	/* The diagram: original → machine (zoomed in) → compressed file */
	.stage {
		display: grid;
		grid-template-rows: 32rem; /* fixed, so long texts scroll inside their cards instead of moving the page */
		grid-template-columns: minmax(0, 1fr) auto minmax(0, 0.85fr) auto minmax(0, 1fr);
		align-items: center;
	}
	.stage :global(.pipe) {
		width: 1.5rem;
	}
	.label {
		display: block;
		font-size: 0.72rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}
	.card {
		align-self: stretch;
		min-height: 0;
		display: flex;
		flex-direction: column;
		padding: 0.9rem 1rem 1rem;
		border-radius: var(--radius);
		background: var(--card);
		border: var(--bw) solid var(--line);
		transition:
			border-color 0.4s,
			box-shadow 0.4s;
	}
	.card.match {
		border-color: var(--good);
		box-shadow: 0 0 0 4px var(--good-soft);
	}
	.text {
		flex: 1 1 0;
		min-height: 0;
		overflow-y: auto;
		margin: 0.6rem 0 0.8rem;
		font-size: 0.85rem;
		line-height: 1.6;
		white-space: pre-wrap;
	}
	textarea {
		flex: 1;
		box-sizing: border-box;
		width: 100%;
		margin: 0.6rem 0 0.8rem;
		padding: 0.6rem 0.7rem;
		border-radius: var(--radius-sm);
		border: var(--bw) solid var(--accent-mid);
		background: var(--paper);
		color: var(--ink);
		font: inherit;
		font-size: 0.85rem;
		line-height: 1.6;
		resize: none;
	}
	textarea:focus {
		outline: 2px solid var(--accent-soft);
	}
	.own-chip:not(.active) {
		border-style: dashed;
		border-color: var(--accent-mid);
		color: var(--accent);
	}
	.word {
		border-radius: 3px;
		transition:
			background 0.25s,
			color 0.25s;
	}
	.word.counted,
	.word.copied {
		color: var(--ink-soft);
	}
	.word.listed {
		background: var(--accent-soft);
	}
	.word.current {
		background: var(--ink);
		color: var(--paper);
	}
	.word.back {
		background: var(--good-soft);
		animation: arrive 0.3s ease-out;
	}
	.placeholder,
	.waiting {
		font-size: 0.9rem;
		font-style: italic;
		color: var(--muted);
	}
	.placeholder {
		flex: 1;
		margin: 0.6rem 0;
	}
	.caret {
		display: inline-block;
		width: 0.5em;
		height: 1em;
		vertical-align: -0.12em;
		background: var(--accent);
	}

	/* The machine, with a "lens" opening down into what's inside it */
	.zoom {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.lens {
		width: 100%;
		height: 1.4rem;
		background: linear-gradient(var(--accent-soft), color-mix(in srgb, var(--accent-soft) 60%, transparent));
		clip-path: polygon(38% 0, 62% 0, 100% 100%, 0 100%);
	}
	.inside {
		box-sizing: border-box;
		width: 100%;
		min-height: 23.5rem; /* room for the longest word list from the start, so nothing jumps */
		padding: 0.8rem 1rem 0.9rem;
		border-radius: var(--radius);
		background: var(--card);
		border: var(--bw) solid var(--accent-mid);
		box-shadow: 0 0 0 4px var(--accent-soft);
	}
	.inside ul {
		list-style: none;
		margin: 0.5rem 0 0;
		padding: 0;
		display: grid;
		gap: 0;
	}
	.inside li {
		display: flex;
		align-items: baseline;
		gap: 0.6rem;
		padding: 0.08rem 0;
		line-height: 1.25;
		transition: opacity 0.4s;
	}
	.inside li.skip {
		opacity: 0.4;
	}
	.name {
		font-family: var(--font-mono);
		font-size: 0.82rem;
	}
	.times {
		color: var(--ink-soft);
		font-size: 0.82rem;
	}
	.inside .code {
		margin-left: auto;
		font-size: 0.75rem;
		vertical-align: 0;
		animation: pop 0.3s ease-out;
	}
	.nope {
		margin-left: auto;
		font-size: 0.72rem;
		font-style: italic;
		color: var(--muted);
	}
	.rest,
	.empty {
		margin: 0.5rem 0 0;
		font-size: 0.8rem;
		color: var(--muted);
	}

	/* The compressed file's header */
	.header {
		margin-top: 0.6rem;
		padding: 0.55rem 0.7rem;
		border-radius: var(--radius-sm);
		background: var(--accent-soft);
		animation: arrive 0.4s ease-out;
	}
	.header .label {
		color: var(--accent);
	}
	.entries {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 0.7rem;
		margin: 0.4rem 0 0;
		font-family: var(--font-mono);
		font-size: 0.8rem;
	}
	.entry {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		animation: arrive 0.35s ease-out;
	}
	@keyframes arrive {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
	}
	.code {
		display: inline-grid;
		place-items: center;
		min-width: 1.35em;
		height: 1.35em;
		padding: 0 0.2em;
		box-sizing: border-box;
		border-radius: var(--pill);
		background: var(--accent);
		color: white;
		font-family: var(--font-body);
		font-size: 0.72em;
		font-weight: 700;
		vertical-align: 0.15em;
		line-height: 1;
	}
	.code.in-text {
		margin: 0 0.05em;
		animation: pop 0.3s ease-out;
	}
	@keyframes pop {
		from {
			transform: scale(1.6);
			opacity: 0;
		}
	}

	/* Size bars, against the original */
	.size {
		display: grid;
		gap: 0.35rem;
		font-size: 0.82rem;
		color: var(--ink-soft);
	}
	.size strong {
		color: var(--ink);
	}
	.size .good {
		color: var(--good);
	}
	.bar {
		display: block;
		height: 6px;
		border-radius: var(--pill);
		background: var(--track);
		overflow: hidden;
	}
	.fill {
		display: block;
		height: 100%;
		border-radius: inherit;
		background: var(--accent);
		transition: width 0.2s ease-out;
	}
	.fill.plain {
		background: var(--ink-soft);
	}
	.fill.over {
		background: var(--bad);
	}

	/* Controls and narration */
	.controls {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		margin-top: 1.25rem;
		min-height: 3.2rem; /* two lines of narration, so the page doesn't move when it changes */
	}
	.controls p {
		margin: 0;
		max-width: 40rem;
		line-height: 1.5;
		color: var(--ink-soft);
	}
	.controls p strong {
		color: var(--ink);
	}
	.controls p.ok {
		font-weight: 700;
		color: var(--good);
	}
	.go,
	.ghost {
		flex: 0 0 auto;
		font: inherit;
		font-size: 0.92rem;
		padding: 0.55rem 1.1rem;
		border-radius: var(--pill);
		cursor: pointer;
	}
	.go {
		border: 0;
		background: var(--accent);
		color: white;
	}
	.go:hover:not(:disabled) {
		background: var(--accent-hover);
	}
	.go:disabled {
		opacity: 0.4;
		cursor: default;
	}
	.ghost {
		background: none;
		border: var(--bw) solid var(--ink-soft);
		color: var(--ink);
	}
	.ghost:hover {
		background: var(--ink);
		color: var(--paper);
	}
	.footnote {
		margin: 1.1rem 0 0;
		font-size: 0.9rem;
		color: var(--ink-soft);
	}
	.footnote strong {
		color: var(--ink);
		font-weight: normal;
		border-bottom: 2px solid var(--accent-mid);
	}

	/* Narrower screens: the diagram runs top to bottom */
	.stage.stacked {
		grid-template-columns: minmax(0, 1fr);
		grid-template-rows: none;
	}
	.stacked .text {
		flex: 1 1 auto;
		max-height: 24rem;
	}
	.stacked textarea {
		min-height: 12rem;
	}
	.stage.stacked :global(.pipe) {
		width: 2px;
		height: 1.25rem;
		justify-self: center;
	}
	.stacked .inside {
		min-height: 0;
	}
	@media (max-width: 860px) {
		.head {
			grid-template-columns: minmax(0, 1fr);
		}
		.step-lede {
			margin-top: 1rem;
		}
		.controls {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.75rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.header,
		.entry,
		.code.in-text,
		.inside .code,
		.word.back {
			animation: none;
		}
	}
</style>
