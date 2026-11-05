<script>
	// Step 4: gz is everywhere. Opening a website: the browser asks (and says it can unzip gz), the
	// server squeezes every file, they travel small, and the browser unsqueezes them and builds the
	// page. The sizes are this very website's own files, squeezed with real gzip in the browser.
	import { onMount } from 'svelte';
	import { gzip } from '../components/gzip.js';
	import Machine from '../components/Machine.svelte';

	// What a page is made of. `text` is filled in on the client with the real thing.
	let files = $state([
		{ id: 'html', name: 'The page', ext: 'HTML', job: 'the words and layout', text: null },
		{ id: 'css', name: 'The styles', ext: 'CSS', job: 'colours and fonts', text: null },
		{ id: 'js', name: 'The code', ext: 'JavaScript', job: 'makes it move', text: null },
		{ id: 'json', name: 'The data', ext: 'JSON', job: 'the numbers it shows', text: null }
	]);
	let sizes = $state({}); // id → { before, after }

	// A made-up weather forecast, the kind of data a page loads
	function forecast() {
		let a = 11;
		const rand = () => ((a = (a * 16807) % 2147483647) - 1) / 2147483646;
		const days = Array.from({ length: 60 }, (_, i) => ({
			day: `2026-11-${String(1 + (i % 30)).padStart(2, '0')}`,
			city: ['Madrid', 'Valencia', 'Sevilla'][i % 3],
			temperature: Math.round(8 + rand() * 14),
			rain: Math.round(rand() * 100),
			sky: ['sunny', 'cloudy', 'rainy'][Math.floor(rand() * 3)]
		}));
		return JSON.stringify({ forecast: days }, null, 2);
	}

	// This page's own code: the scripts the browser downloaded for it
	async function ownScripts() {
		const urls = performance
			.getEntriesByType('resource')
			.map((e) => e.name)
			.filter((u) => u.startsWith(location.origin) && /\.(js|svelte)(\?|$)|\/@|\.js\?/.test(u))
			.slice(0, 15);
		const texts = await Promise.all(urls.map((u) => fetch(u).then((r) => r.text()).catch(() => '')));
		return texts.join('\n');
	}

	onMount(async () => {
		const css = [...document.styleSheets]
			.flatMap((sheet) => {
				try {
					return [...sheet.cssRules].map((r) => r.cssText);
				} catch {
					return []; // other sites' stylesheets (the fonts) can't be read
				}
			})
			.join('\n');
		const texts = { html: document.documentElement.outerHTML, css, js: await ownScripts(), json: forecast() };
		for (const f of files) {
			f.text = texts[f.id] || null;
			if (!f.text) continue;
			sizes[f.id] = { before: new TextEncoder().encode(f.text).length, after: (await gzip(f.text)).length };
		}
	});

	let shown = $derived(files.filter((f) => sizes[f.id]));
	let totalBefore = $derived(shown.reduce((s, f) => s + sizes[f.id].before, 0));
	let totalAfter = $derived(shown.reduce((s, f) => s + sizes[f.id].after, 0));

	// ready → asking → sending → done
	let phase = $state('ready');
	let stage = $state({}); // id → squeezed → travelling → arrived → open
	let run = 0;
	const wait = (ms) => new Promise((r) => setTimeout(r, ms));

	// ready → asking → compressing → sending → decompressing → done
	async function open() {
		const id = ++run;
		const slow = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.15 : 1;
		const step = async (ms) => {
			await wait(ms * slow);
			return id === run;
		};
		stage = {};
		phase = 'asking';
		if (!(await step(1300))) return;

		// 1. Squeeze everything before it leaves
		phase = 'compressing';
		for (const f of shown) {
			if (!(await step(450))) return;
			stage[f.id] = 'squeezed';
		}
		if (!(await step(500))) return;

		// 2. Send it all across
		phase = 'sending';
		for (const f of shown) {
			stage[f.id] = 'travelling';
			if (!(await step(250))) return;
		}
		if (!(await step(1000))) return;
		for (const f of shown) stage[f.id] = 'arrived';

		// 3. Unsqueeze it all when it arrives, and the page builds
		phase = 'decompressing';
		if (!(await step(500))) return;
		for (const f of shown) {
			if (!(await step(450))) return;
			stage[f.id] = 'open';
		}
		phase = 'done';
	}

	const opened = (fid) => stage[fid] === 'open';
	const kb = (n) => (n >= 1024 ? `${(n / 1024).toFixed(1)} KB` : `${n} B`);

	// Stack the diagram on narrower screens (parcels then travel downwards)
	let width = $state(1200);
	let stacked = $derived(width <= 960);
</script>

<svelte:window bind:innerWidth={width} />

<div class="websites">
	<div class="head">
		<div>
			<p class="step-label">Step 4 · gz is everywhere</p>
			<h2 class="step-title">Every website you open arrives squeezed</h2>
		</div>
		<p class="step-lede">
			Opening a website means a computer somewhere (the <em>server</em>) sends you everything the page
			is made of: the words, the colours, the code, the data. It squeezes it all with gz first, and
			your browser unsqueezes it in a blink.
		</p>
	</div>

	<div class="stage" class:stacked data-phase={phase}>
		<!-- The server -->
		<div class="server">
			<span class="label">The server</span>
			<ul>
				{#each files as f (f.id)}
					{@const s = sizes[f.id]}
					{@const st = stage[f.id]}
					<li class:squeezed={st}>
						<span class="tag {f.id}">{f.ext === 'JavaScript' ? 'JS' : f.ext}</span>
						<span class="what"><strong>{f.name}</strong><span>{f.job}</span></span>
						<span class="size">
							{#if s}
								<span class="before" class:struck={st}>{kb(s.before)}</span>
								<span class="after" class:visible={st}>{kb(s.after)}</span>
							{:else}…{/if}
						</span>
					</li>
				{/each}
			</ul>
		</div>

		<div class="machine">
			<Machine kind="compress" label="Compress" sub="gzip" working={phase === 'compressing'} />
		</div>

		<!-- The internet -->
		<div class="net" aria-hidden="true">
			<span class="label">The internet</span>
			<div class="wire">
				{#if phase === 'asking'}
					<span class="request">Page, please! · <code>gz ok</code></span>
				{/if}
				{#each shown as f, i (f.id)}
					{#if stage[f.id] === 'travelling'}
						<span class="parcel {f.id}" style="--lane: {i}">{f.ext === 'JavaScript' ? 'JS' : f.ext}</span>
					{/if}
				{/each}
			</div>
		</div>

		<div class="machine">
			<Machine kind="decompress" label="Decompress" sub="gunzip" working={phase === 'decompressing'} />
		</div>

		<!-- Your screen -->
		<div class="screen">
			<span class="label">Your screen</span>
			<div class="browser">
				<div class="bar">
					<i></i><i></i><i></i>
					<span class="url">muzzy · weather</span>
				</div>
				<div class="page" class:html={opened('html')} class:css={opened('css')} class:js={opened('js')} class:json={opened('json')}>
					{#if opened('html')}
						<div class="title"></div>
						<div class="lines"><i></i><i></i><i></i></div>
						<div class="row">
							<div class="chart">
								{#if opened('json')}
									{#each [55, 80, 40, 65, 90, 50, 70] as h, i (i)}
										<span style="--h: {h}%; --i: {i}"></span>
									{/each}
								{/if}
							</div>
							<div class="button">{opened('js') ? '▶' : ''}</div>
						</div>
					{:else}
						<p class="blank">{phase === 'ready' ? 'Nothing here yet.' : 'Waiting for the page…'}</p>
					{/if}
				</div>
			</div>
			<div class="unzipped">
				{#each shown as f (f.id)}
					<span class="chip {f.id}" class:in={stage[f.id] === 'arrived' || opened(f.id)} class:open={opened(f.id)}>
						{opened(f.id) ? '✓' : '…'} {f.ext === 'JavaScript' ? 'JS' : f.ext}
					</span>
				{/each}
			</div>
		</div>
	</div>

	<div class="controls">
		<button class="go" onclick={open} disabled={(phase !== 'ready' && phase !== 'done') || !shown.length}>
			{phase === 'done' ? 'Open it again' : 'Open the website'}
		</button>
		<p class="outro" class:visible={phase === 'done'}>
			{#if totalBefore}
				Only <strong>{kb(totalAfter)}</strong> travelled instead of <strong>{kb(totalBefore)}</strong>:
				about <strong>{Math.round(totalBefore / totalAfter)}× less</strong>. Faster pages, and less of your
				phone's data used.
			{/if}
		</p>
	</div>

	<p class="footnote">
		These are this website's own files, squeezed for real. Any kind of information can travel this way.
		Newer cousins of gz (with names like Brotli and Zstandard) do the same trick, a bit better.
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
	.step-lede em {
		font-style: normal;
		color: var(--ink);
	}
	.label {
		display: block;
		font-size: 0.72rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}

	.stage {
		display: grid;
		grid-template-columns: minmax(0, 1.1fr) auto minmax(0, 0.55fr) auto minmax(0, 0.95fr);
		gap: 0;
		align-items: stretch;
		margin-top: 2.25rem;
	}

	/* The server: a rack of files */
	.server {
		padding: 0.9rem 1rem 1rem;
		border-radius: var(--radius);
		background: var(--dark);
		color: var(--on-dark);
	}
	.server .label {
		color: color-mix(in srgb, var(--on-dark) 60%, transparent);
	}
	.server ul {
		list-style: none;
		margin: 0.7rem 0 0;
		padding: 0;
		display: grid;
		gap: 0.45rem;
	}
	.server li {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		align-items: center;
		gap: 0.7rem;
		padding: 0.5rem 0.6rem;
		border-radius: var(--radius-sm);
		background: color-mix(in srgb, var(--on-dark) 7%, transparent);
		transition: background 0.3s;
	}
	.server li.squeezed {
		background: color-mix(in srgb, var(--accent) 22%, transparent);
	}
	.tag {
		justify-self: start;
		padding: 0.1rem 0.45rem;
		border-radius: 5px;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--dark);
		background: var(--c);
	}
	.html {
		--c: #fbbf24;
	}
	.css {
		--c: #67e8f9;
	}
	.js {
		--c: #fde047;
	}
	.json {
		--c: #86efac;
	}
	.what {
		display: grid;
		min-width: 0;
	}
	.what strong {
		font-size: 0.9rem;
	}
	.what span {
		font-size: 0.75rem;
		color: color-mix(in srgb, var(--on-dark) 60%, transparent);
	}
	.size {
		display: grid;
		justify-items: end;
		font-family: var(--font-mono);
		font-size: 0.78rem;
		white-space: nowrap;
	}
	.before.struck {
		text-decoration: line-through;
		opacity: 0.5;
	}
	.after {
		color: var(--accent-mid);
		font-weight: 700;
		opacity: 0;
		transition: opacity 0.3s;
	}
	.after.visible {
		opacity: 1;
	}

	.machine {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 0.6rem;
	}

	/* The internet: a wire that parcels travel along */
	.net {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 0.6rem;
		padding: 0;
	}
	.wire {
		position: relative;
		width: 100%;
		height: 9rem;
		background: linear-gradient(var(--track-strong), var(--track-strong)) center / 100% 2px no-repeat;
	}
	.request {
		position: absolute;
		top: calc(50% - 2.4rem);
		right: 0;
		padding: 0.25rem 0.6rem;
		border-radius: var(--pill);
		background: var(--card);
		border: var(--bw) solid var(--line);
		font-size: 0.75rem;
		white-space: nowrap;
		animation: ask 1.3s ease-in-out forwards;
	}
	.request code {
		font-family: var(--font-mono);
		color: var(--accent);
	}
	@keyframes ask {
		from {
			right: 0;
			opacity: 0;
		}
		15% {
			opacity: 1;
		}
		85% {
			opacity: 1;
		}
		to {
			right: calc(100% - 7rem);
			opacity: 0;
		}
	}
	.parcel {
		position: absolute;
		top: calc(50% - 0.7rem + (var(--lane) - 1.5) * 1.6rem);
		left: 0;
		padding: 0.15rem 0.45rem;
		border-radius: 5px;
		font-family: var(--font-mono);
		font-size: 0.68rem;
		color: var(--dark);
		background: var(--c);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--c) 35%, transparent);
		animation: travel 1.1s ease-in-out forwards;
	}
	@keyframes travel {
		to {
			left: calc(100% - 2.6rem);
		}
	}

	/* Your screen: a little browser window */
	.screen {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}
	.browser {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-height: 15rem;
		border-radius: var(--radius);
		background: var(--card);
		border: var(--bw) solid var(--line);
		box-shadow: var(--shadow-lift);
		overflow: hidden;
	}
	.bar {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		padding: 0.5rem 0.7rem;
		background: var(--track);
	}
	.bar i {
		width: 0.55rem;
		height: 0.55rem;
		border-radius: 50%;
		background: var(--track-strong);
	}
	.url {
		flex: 1;
		margin-left: 0.5rem;
		padding: 0.1rem 0.6rem;
		border-radius: var(--pill);
		background: var(--card);
		font-size: 0.72rem;
		color: var(--ink-soft);
	}
	.page {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
		padding: 0.9rem;
		--block: var(--track-strong);
		--line-c: var(--track);
		transition: background 0.4s;
	}
	/* HTML alone: grey boxes. CSS colours them in. */
	.page > * {
		animation: arrive 0.4s ease-out;
	}
	.page.css {
		--block: var(--accent);
		--line-c: var(--accent-soft);
		background: linear-gradient(var(--card), color-mix(in srgb, var(--accent-soft) 60%, var(--card)));
	}
	.title {
		width: 55%;
		height: 0.9rem;
		border-radius: 4px;
		background: var(--block);
		transition: background 0.4s;
	}
	.lines {
		display: grid;
		gap: 0.35rem;
	}
	.lines i {
		height: 0.45rem;
		border-radius: 3px;
		background: var(--line-c);
		filter: brightness(0.93);
		transition: background 0.4s;
	}
	.lines i:last-child {
		width: 70%;
	}
	.row {
		flex: 1;
		display: flex;
		align-items: flex-end;
		gap: 0.7rem;
	}
	.chart {
		flex: 1;
		height: 100%;
		min-height: 4rem;
		display: flex;
		align-items: flex-end;
		gap: 0.3rem;
		padding: 0.4rem;
		border-radius: 6px;
		border: 1px dashed var(--track-strong);
	}
	.json .chart {
		border-style: solid;
		border-color: var(--line);
	}
	.chart span {
		flex: 1;
		height: var(--h);
		border-radius: 3px 3px 0 0;
		background: var(--block);
		transform-origin: bottom;
		animation: grow 0.5s ease-out calc(var(--i) * 60ms) both;
	}
	@keyframes grow {
		from {
			transform: scaleY(0);
		}
	}
	.button {
		width: 2.4rem;
		height: 2.4rem;
		display: grid;
		place-items: center;
		border-radius: 50%;
		background: var(--block);
		color: white;
		font-size: 0.8rem;
		transition: background 0.4s;
	}
	.js .button {
		animation: pulse 1.6s ease-in-out infinite;
	}
	@keyframes pulse {
		50% {
			box-shadow: 0 0 0 6px color-mix(in srgb, var(--block) 25%, transparent);
		}
	}
	@keyframes arrive {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
	}
	.blank {
		margin: auto;
		font-size: 0.9rem;
		font-style: italic;
		color: var(--muted);
	}
	.unzipped {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		min-height: 1.6rem;
	}
	.unzipped .chip {
		padding: 0.15rem 0.55rem;
		border-radius: var(--pill);
		font-family: var(--font-mono);
		font-size: 0.72rem;
		background: var(--track);
		color: var(--muted);
		transition:
			background 0.3s,
			color 0.3s;
	}
	.unzipped .chip.in {
		background: color-mix(in srgb, var(--c) 45%, var(--card));
		color: var(--ink);
	}
	.unzipped .chip.open {
		background: var(--c);
	}

	.controls {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		margin-top: 1.5rem;
		min-height: 3.2rem;
	}
	.go {
		flex: 0 0 auto;
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
	.outro {
		margin: 0;
		max-width: 44rem;
		font-size: 1.05rem;
		line-height: 1.55;
		opacity: 0;
		transition: opacity 0.6s;
	}
	.outro.visible {
		opacity: 1;
	}
	.outro strong {
		color: var(--accent);
	}
	.footnote {
		margin: 1rem 0 0;
		font-size: 0.88rem;
		color: var(--ink-soft);
	}

	/* Narrower screens: server on top, parcels fall down to the screen */
	.stage.stacked {
		grid-template-columns: minmax(0, 1fr);
	}
	.stacked .net {
		padding: 0.5rem 0;
	}
	.stacked .machine {
		padding: 0.75rem 0;
	}
	.stacked .wire {
		width: 9rem;
		height: 6rem;
		background: linear-gradient(var(--track-strong), var(--track-strong)) center / 2px 100% no-repeat;
	}
	.stacked .request {
		top: auto;
		right: auto;
		left: 50%;
		bottom: 0;
		animation-name: ask-up;
		transform: translateX(-50%);
	}
	@keyframes ask-up {
		from {
			bottom: 0;
			opacity: 0;
		}
		15%,
		85% {
			opacity: 1;
		}
		to {
			bottom: calc(100% - 1.5rem);
			opacity: 0;
		}
	}
	.stacked .parcel {
		top: 0;
		left: calc(50% - 1.3rem + (var(--lane) - 1.5) * 2.6rem);
		animation-name: fall;
	}
	@keyframes fall {
		to {
			top: calc(100% - 1.3rem);
		}
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
	@media (max-width: 420px) {
		.server li {
			grid-template-columns: minmax(0, 1fr) auto;
		}
		.tag {
			grid-column: 1 / -1;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.request,
		.parcel,
		.chart span,
		.page > *,
		.js .button {
			animation-duration: 0.01s;
			animation-iteration-count: 1;
		}
	}
</style>
