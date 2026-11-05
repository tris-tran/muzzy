<script>
	// Step 3: sometimes compression makes things bigger. Tiny texts and things with nothing that
	// repeats come out larger (gz always adds a small label, ~20 bytes). But on big, normal files it
	// wins by a lot, so it's worth it. Real gzip again, so every number is genuine.
	import { onMount } from 'svelte';
	import { gzip } from '../components/gzip.js';
	import { examples } from '../components/texts.js';

	// Seeded randomness: the same "noise" and spreadsheet every time
	function mulberry32(a) {
		return () => {
			a |= 0;
			a = (a + 0x6d2b79f5) | 0;
			let t = Math.imul(a ^ (a >>> 15), 1 | a);
			t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
			return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
		};
	}
	const rand = mulberry32(7);
	const noise = Uint8Array.from({ length: 800 }, () => Math.floor(rand() * 256));
	const items = ['Coffee', 'Bread', 'Milk', 'Apples', 'Bus ticket', 'Lunch'];
	let csv = 'date,item,price\n';
	for (let i = 0; i < 120; i++) {
		const day = String(1 + (i % 30)).padStart(2, '0');
		csv += `2026-11-${day},${items[Math.floor(rand() * items.length)]},${(1 + rand() * 9).toFixed(2)}\n`;
	}

	// The bad ones first, then the good ones. `data` is filled in for "this very page" on the client.
	let tests = $state([
		{ name: 'A text message', preview: 'See you at 8!', data: 'See you at 8!' },
		{ name: 'A random password', preview: 'q8#Vz!2mL0@wT7xR', data: 'q8#Vz!2mL0@wT7xR' },
		{ name: 'Random noise', preview: 'like a photo that’s already squeezed', data: noise },
		{ name: 'The song', preview: 'Row, row, row your boat…', data: examples[0].text },
		{ name: 'A spreadsheet', preview: '120 rows of shopping', data: csv },
		{ name: 'This very page', preview: 'the code your browser got', data: null }
	]);
	let results = $state([]); // { before, after } per test, filled one by one

	onMount(() => {
		tests[5].data = document.documentElement.outerHTML;
	});

	const sizeOf = (data) => (typeof data === 'string' ? new TextEncoder().encode(data).length : data.length);

	let phase = $state('ready'); // ready → running → done
	let run = 0;
	const wait = (ms) => new Promise((r) => setTimeout(r, ms));

	async function squeezeAll() {
		const id = ++run;
		const slow = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.15 : 1;
		phase = 'running';
		results = [];
		for (const test of tests) {
			const after = (await gzip(test.data)).length;
			if (id !== run) return;
			results.push({ before: sizeOf(test.data), after });
			await wait(550 * slow);
			if (id !== run) return;
		}
		phase = 'done';
	}

	// Totals: everything together
	let totalBefore = $derived(results.reduce((s, r) => s + r.before, 0));
	let totalAfter = $derived(results.reduce((s, r) => s + r.after, 0));

	const fmt = (n) => n.toLocaleString('en');
	const change = ({ before, after }) => {
		const pct = Math.round((100 * (after - before)) / before);
		return pct > 0 ? `+${pct}%` : `${pct}%`;
	};

	// Try your own: live
	let own = $state('hi');
	let ownAfter = $state(null);
	$effect(() => {
		const text = own;
		let stale = false;
		gzip(text).then((b) => !stale && (ownAfter = b.length));
		return () => (stale = true);
	});
	let ownBefore = $derived(new TextEncoder().encode(own).length);
</script>

<div class="backfires">
	<div class="head">
		<div>
			<p class="step-label">Step 3 · When it doesn't work</p>
			<h2 class="step-title">Sometimes it comes out bigger</h2>
		</div>
		<p class="step-lede">
			Every gz file starts with a small label, about 20 bytes, that says how to unpack it. A bit like
			our dictionary header. If the text is tiny, or nothing in it repeats, there's nothing to win
			back, and the "compressed" file ends up <em>bigger</em>.
		</p>
	</div>

	<div class="body">
		<div class="tests">
			<ul>
				{#each tests as test, i (test.name)}
					{@const r = results[i]}
					{@const scale = r ? Math.max(r.before, r.after) : 1}
					<li class:bigger={r && r.after > r.before} class:smaller={r && r.after < r.before}>
						<div class="what">
							<strong>{test.name}</strong>
							<span class="preview">{test.preview}</span>
						</div>
						<div class="bars">
							<span class="bar"><span class="fill before" style="width: {r ? (100 * r.before) / scale : 0}%"></span></span>
							<span class="bar"><span class="fill after" style="width: {r ? (100 * r.after) / scale : 0}%"></span></span>
						</div>
						<div class="numbers">
							{#if r}
								<span class="sizes">{fmt(r.before)} → {fmt(r.after)} bytes</span>
								<span class="change">{change(r)}</span>
							{/if}
						</div>
					</li>
				{/each}
			</ul>

			<div class="controls">
				<button class="go" onclick={squeezeAll} disabled={phase === 'running'}>
					{phase === 'done' ? 'Squeeze them again' : 'Squeeze them all'}
				</button>
				<span class="legend">
					<span class="key before"></span> original
					<span class="key after"></span> compressed
				</span>
			</div>
		</div>

		<aside class="own">
			<span class="label">Try your own</span>
			<textarea bind:value={own} rows="4" spellcheck="false" aria-label="Type something to compress"></textarea>
			{#if ownAfter !== null}
				<p class="own-result" class:bigger={ownAfter > ownBefore} class:smaller={ownAfter < ownBefore}>
					<strong>{fmt(ownBefore)}</strong> → <strong>{fmt(ownAfter)}</strong> bytes
					<span>
						{#if ownAfter > ownBefore}bigger. Keep typing!
						{:else if ownAfter < ownBefore}smaller. It works!
						{:else}the same.{/if}
					</span>
				</p>
			{/if}
			<p class="hint">Try a short word, then paste a long text, or type the same thing over and over.</p>
		</aside>
	</div>

	<div class="outro" class:visible={phase === 'done'}>
		<p>
			Lose a few bytes on tiny things, save loads on big ones. All six together:
			<strong>{fmt(totalBefore)}</strong> → <strong class="win">{fmt(totalAfter)}</strong> bytes.
			Web pages, documents, code: the internet is full of big, repetitive text, which is exactly what
			gz loves. <span class="soft">That's why it's used almost everywhere.</span>
		</p>
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
	.step-lede em {
		color: var(--bad);
		font-style: normal;
		font-weight: 700;
	}

	.body {
		display: grid;
		grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr);
		gap: 1.5rem;
		align-items: start;
		margin-top: 2rem;
	}

	/* The test rows */
	.tests ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.5rem;
	}
	.tests li {
		display: grid;
		grid-template-columns: minmax(0, 11rem) minmax(0, 1fr) 9.5rem;
		align-items: center;
		gap: 1rem;
		padding: 0.7rem 1rem;
		border-radius: var(--radius);
		background: var(--card);
		border: var(--bw) solid var(--line);
		transition:
			border-color 0.4s,
			background 0.4s;
	}
	.tests li.bigger {
		border-color: var(--bad-light);
	}
	.tests li.smaller {
		border-color: color-mix(in srgb, var(--good) 40%, var(--line));
	}
	.what {
		display: grid;
		min-width: 0;
	}
	.what strong {
		font-size: 0.95rem;
	}
	.preview {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 0.8rem;
		color: var(--ink-soft);
	}
	.bars {
		display: grid;
		gap: 0.3rem;
	}
	.bar {
		display: block;
		height: 7px;
		border-radius: var(--pill);
		background: var(--track);
		overflow: hidden;
	}
	.fill {
		display: block;
		height: 100%;
		border-radius: inherit;
		transition: width 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.fill.before {
		background: var(--ink-soft);
	}
	.fill.after {
		background: var(--accent);
		transition-delay: 0.25s;
	}
	.bigger .fill.after {
		background: var(--bad);
	}
	.numbers {
		display: grid;
		justify-items: end;
		min-height: 2.4rem;
		align-content: center;
	}
	.sizes {
		font-size: 0.8rem;
		color: var(--ink-soft);
		white-space: nowrap;
	}
	.change {
		font-weight: 700;
		font-size: 1rem;
		animation: arrive 0.4s ease-out 0.4s both;
	}
	.bigger .change {
		color: var(--bad);
	}
	.smaller .change {
		color: var(--good);
	}
	@keyframes arrive {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
	}

	.controls {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		flex-wrap: wrap;
		margin-top: 1rem;
	}
	.go {
		font: inherit;
		font-size: 0.92rem;
		padding: 0.55rem 1.1rem;
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
		opacity: 0.4;
		cursor: default;
	}
	.legend {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.82rem;
		color: var(--ink-soft);
	}
	.key {
		display: inline-block;
		width: 0.9rem;
		height: 7px;
		border-radius: var(--pill);
	}
	.key.before {
		background: var(--ink-soft);
	}
	.key.after {
		margin-left: 0.6rem;
		background: var(--accent);
	}

	/* Try your own */
	.own {
		padding: 0.9rem 1.1rem 1rem;
		border-radius: var(--radius);
		background: var(--card);
		border: var(--bw) solid var(--line);
	}
	.label {
		display: block;
		font-size: 0.72rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}
	textarea {
		box-sizing: border-box;
		width: 100%;
		margin-top: 0.6rem;
		padding: 0.6rem 0.7rem;
		border-radius: var(--radius-sm);
		border: var(--bw) solid var(--line);
		background: var(--paper);
		color: var(--ink);
		font: inherit;
		font-size: 0.95rem;
		resize: vertical;
	}
	textarea:focus {
		outline: 2px solid var(--accent-mid);
		outline-offset: 1px;
	}
	.own-result {
		margin: 0.7rem 0 0;
		font-size: 1rem;
	}
	.own-result span {
		margin-left: 0.3rem;
		font-weight: 700;
	}
	.own-result.bigger span {
		color: var(--bad);
	}
	.own-result.smaller span {
		color: var(--good);
	}
	.hint {
		margin: 0.6rem 0 0;
		font-size: 0.82rem;
		line-height: 1.5;
		color: var(--muted);
	}

	.outro {
		margin-top: 1.5rem;
		min-height: 5rem; /* reserved, so the page doesn't move when it appears */
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
		max-width: 46rem;
		font-size: 1.1rem;
		line-height: 1.6;
	}
	.win {
		color: var(--good);
	}
	.soft {
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
	@media (max-width: 600px) {
		.tests li {
			grid-template-columns: minmax(0, 1fr) auto;
			gap: 0.5rem 0.75rem;
		}
		.bars {
			grid-column: 1 / -1;
			grid-row: 2;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.fill,
		.change,
		.outro {
			transition: none;
			animation: none;
		}
	}
</style>
