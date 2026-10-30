<script>
	// The benchmark as a factory. The loading dock (the source) stamps one row at a time into an
	// input card and puts it on the conveyor belt. Along the belt stand stations:
	//   box       – a black box the card goes into and comes out of changed (a step that calls a
	//               model: our own server, or a judge LLM); with `time`, a probe times every card
	//   machine   – a lighter machine (a step that works on the card itself, like a cheap check)
	//   inspector – watches every card go by and keeps count (the stats)
	// A station can end a card early: `stops` (settled, on purpose) or `fails` (it broke). The card
	// then falls into a bin under the belt instead of riding on. The belt ends in fog ("more to
	// come") or a crate with the ✓ and ✗ of the cards that went all the way.
	// This file keeps time and works out every card's journey; the pieces in factory/ draw them.
	//   rows     – the data (see requests.js), used in a loop
	//   total    – how many rows the file claims to hold, for the "still unread" counter
	//   stations – [{ at: 0…1 along the belt, kind, name, sub?,
	//                 gives?:  'answer' | 'verdict' (what the card panel should keep room for),
	//                 apply?:  row => fields the card gets (ours, verdict, why…),
	//                 time?:   row => seconds, for the probe,
	//                 stops?:  card => reason it's settled here, or nothing,
	//                 fails?:  row => reason it breaks here, or nothing,
	//                 bin?:    label of the bin it drops into }]
	//   end      – 'fog' or 'crate'
	//   endings  – show how the cards ended: completed / stopped / failed
	//   brief    – leave the instructions out of the card panel, for steps about the answers
	//   playing  – pause with false
//   compact  – just the belt: no card panel and no counters, for a small preview
	//   children – anything to show under the belt, beside the card panel
	import { onMount } from 'svelte';
	import Dock from './factory/Dock.svelte';
	import Belt from './factory/Belt.svelte';
	import Card from './factory/Card.svelte';
	import Station from './factory/Station.svelte';
	import Inspector from './factory/Inspector.svelte';
	import Bin from './factory/Bin.svelte';
	import Crate from './factory/Crate.svelte';
	import Fog from './factory/Fog.svelte';
	import CardDetail from './factory/CardDetail.svelte';
	import Endings from './factory/Endings.svelte';
	import { W, H, TOP, BELT, SPEED, EVERY, CARD, BOX, DROP } from './factory/geometry.js';

	let {
		rows,
		total = 10000,
		stations = [],
		end = 'fog',
		endings = false,
		brief = false,
		playing = true,
		compact = false,
		children
	} = $props();

	let t = $state(0);
	let selected = $state(null);

	onMount(() => {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) playing = false;
		let last = performance.now();
		let frame = requestAnimationFrame(function loop(now) {
			if (playing) t += Math.min(now - last, 50) / 1000;
			last = now;
			frame = requestAnimationFrame(loop);
		});
		return () => cancelAnimationFrame(frame);
	});

	const stationX = (s) => BELT[0] + 70 + s.at * (BELT[1] - BELT[0] - 140);
	const working = (s) => s.kind === 'box' || s.kind === 'machine';
	const xOf = (n) => BELT[0] + 8 + (t - n * EVERY) * SPEED;
	const binX = (s) => stationX(s) + BOX + 24;
	let endX = $derived(end === 'fog' ? BELT[1] - 30 : BELT[1] - CARD.w + 10);

	// Card n's journey so far: what each station it has come out of did to it, and whether one
	// ended it early (then it falls off the belt into that station's bin)
	function journey(n) {
		const row = rows[n % rows.length];
		const x = xOf(n);
		const card = { n, x, row, times: {} };
		for (const s of stations) {
			if (!working(s)) continue;
			if (x < stationX(s) + BOX) break;
			const failed = s.fails?.(row);
			if (failed) {
				Object.assign(card, { ending: 'failed', reason: failed, endedAt: s });
				break;
			}
			Object.assign(card, s.apply?.(row));
			if (s.time) card.times[s.name] = s.time(row);
			const stopped = s.stops?.(card);
			if (stopped) {
				Object.assign(card, { ending: 'stopped', reason: stopped, endedAt: s });
				break;
			}
		}
		card.drop = card.endedAt ? x - (stationX(card.endedAt) + BOX) : 0;
		card.binned = card.drop >= DROP;
		card.finished = !card.endedAt && x > endX;
		return card;
	}

	let newest = $derived(Math.floor(t / EVERY));
	let read = $derived(Math.min(total, newest + 1));
	let all = $derived(Array.from({ length: newest + 1 }, (_, i) => journey(newest - i)));
	let cards = $derived(all.filter((c) => !c.binned && !c.finished)); // on the belt, or falling
	let finished = $derived(all.filter((c) => c.finished));

	// A card reaches a station if it has got that far and nothing ended it before
	const reached = (c, s) => c.x + CARD.w / 2 > stationX(s) && (!c.endedAt || stationX(c.endedAt) < stationX(s));
	// Inspectors count every card that has gone past them
	const seen = (s) => all.filter((c) => reached(c, s)).length;
	// Stations light up while a card is inside
	const busy = (s) => cards.some((c) => !c.drop && Math.abs(c.x + CARD.w / 2 - stationX(s)) < BOX);
	// Probes: the time of the last card out, and the average of all of them so far
	function probe(s) {
		const done = all.filter((c) => c.times[s.name] !== undefined);
		if (!done.length) return null;
		return { last: done[0].times[s.name], avg: done.reduce((sum, c) => sum + c.times[s.name], 0) / done.length };
	}
	const inBin = (s) => all.filter((c) => c.binned && c.endedAt === s).length;

	// The tapped card while it's on the belt; otherwise follow the most recently checked card, even
	// once it has dropped into a bin or reached the crate, so the panel shows a whole story
	let pick = $derived(cards.find((c) => c.row.id === selected));
	let latest = $derived(
		all.find((c) => c.verdict !== undefined || c.ending) ?? cards.find((c) => c.ours !== undefined) ?? cards[0]
	);
	let shown = $derived(pick ?? latest);
</script>

<div class="factory" class:compact>
	<div>
		<svg viewBox="0 {TOP} {W} {H - TOP}" role="img" aria-label="A factory belt: rows from a file become input cards and pass through the benchmark's stations">
			<Dock reading={newest % 7} stamping={t % EVERY < 0.25} />

			<!-- Inspectors stand behind the belt, watching -->
			{#each stations as s, i (i)}
				{#if !working(s)}<Inspector x={stationX(s)} name={s.name} count={seen(s)} />{/if}
			{/each}

			<Belt moved={t * SPEED} />

			{#each stations as s, i (i)}
				{#if s.bin}<Bin x={binX(s)} label={s.bin} count={inBin(s)} tone={s.fails ? 'failed' : 'stopped'} />{/if}
			{/each}

			<!-- Cards go under the stations, so they vanish inside them -->
			{#each cards as c (c.n)}
				<Card card={c} x={c.x} drop={c.drop} picked={shown?.n === c.n} onpick={() => (selected = c.row.id)} />
			{/each}

			{#each stations as s, i (i)}
				{#if working(s)}
					<Station x={stationX(s)} kind={s.kind} name={s.name} sub={s.sub} busy={busy(s)} probe={s.time ? probe(s) : undefined} />
				{/if}
			{/each}

			{#if end === 'fog'}
				<Fog label="the machines →" sub="next step" />
			{:else}
				<Crate ok={finished.filter((c) => c.verdict === true).length} bad={finished.filter((c) => c.verdict === false).length} />
			{/if}

			{#if !compact}
				<text class="counter" x="20" y="300">rows read: {read.toLocaleString('en')}</text>
				<text class="counter soft" x="20" y="318">still unread: {(total - read).toLocaleString('en')}</text>
			{/if}
		</svg>
		{#if endings}
			<Endings
				completed={finished.length}
				stopped={all.filter((c) => c.binned && c.ending === 'stopped').length}
				failed={all.filter((c) => c.binned && c.ending === 'failed').length}
			/>
		{/if}
		{#if children}<div class="below">{@render children()}</div>{/if}
	</div>

	{#if shown && !compact}
		<CardDetail
			card={shown}
			following={!pick}
			{brief}
			timed={stations.filter((s) => s.time).map((s) => s.name)}
			answers={stations.some((s) => s.gives === 'answer')}
			validates={stations.some((s) => s.gives === 'verdict')}
		/>
	{/if}
</div>

<style>
	.factory {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 15rem;
		gap: 1rem;
		align-items: start;
	}
	.factory.compact {
		grid-template-columns: minmax(0, 1fr);
	}
	svg {
		display: block;
		width: 100%;
		height: auto;
	}
	.counter {
		font-family: var(--font-mono);
		font-size: 12px;
		fill: var(--ink);
	}
	.counter.soft {
		fill: var(--muted);
	}
	.below {
		margin-top: 0.9rem;
	}
	@media (max-width: 860px) {
		.factory {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
