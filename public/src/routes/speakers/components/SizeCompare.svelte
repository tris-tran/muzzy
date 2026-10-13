<script>
	// WAV vs MP3 for one 4-minute song: file size, download time on a 1999 modem, and how many
	// songs fit on the first iPod (5 GB). Bars and dots grow in when the panel scrolls into view.
	//   WAV: 44,100 numbers/s × 2 bytes × 2 ears × 240 s ≈ 42 MB
	//   MP3 at 128 kbit/s: 16,000 bytes/s × 240 s ≈ 3.8 MB
	//   Modem: ~5 KB/s real-world → WAV ≈ 2 h 20 min, MP3 ≈ 13 min
	//   iPod: 5 GB ÷ 42 MB ≈ 120 WAV songs; Apple sold it as "1,000 songs"
	import { onMount } from 'svelte';

	const formats = [
		{ name: 'WAV', size: 42, label: '42 MB', modem: 'over 2 hours', songs: 120 },
		{ name: 'MP3', size: 3.8, label: '4 MB', modem: 'about 13 minutes', songs: 1000 }
	];

	let host;
	let shown = $state(false);
	onMount(() => {
		const io = new IntersectionObserver(([e]) => e.isIntersecting && (shown = true), { threshold: 0.4 });
		io.observe(host);
		return () => io.disconnect();
	});
</script>

<div class="compare" class:shown bind:this={host}>
	<div class="row head">
		<span></span>
		<span>One 4-minute song</span>
		<span>On a 1999 modem</span>
	</div>
	{#each formats as f (f.name)}
		<div class="row">
			<span class="name">{f.name}</span>
			<span class="bar-cell">
				<span class="bar"><span style="width: {shown ? (f.size / 42) * 100 : 0}%"></span></span>
				<span class="size">{f.label}</span>
			</span>
			<span class="modem">{f.modem}</span>
		</div>
	{/each}

	<p class="ipod-title">Songs that fit on the first iPod (2001)</p>
	<div class="ipods">
		{#each formats as f (f.name)}
			<div class="ipod">
				<div class="dots" aria-label="{f.songs} songs">
					{#each { length: f.songs }, i (i)}
						<span style="transition-delay: {shown ? (i / f.songs) * 0.9 : 0}s"></span>
					{/each}
				</div>
				<span class="count"><strong>{f.songs.toLocaleString('en')}</strong> as {f.name}</span>
			</div>
		{/each}
	</div>
</div>

<style>
	.compare {
		padding: 1.1rem 1.25rem;
		border-radius: var(--radius-lg);
		border: var(--bw) solid var(--line);
		background: var(--card);
	}
	.row {
		display: grid;
		grid-template-columns: 3.5rem minmax(0, 1fr) 9rem;
		gap: 1rem;
		align-items: center;
		padding: 0.35rem 0;
	}
	.row.head {
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}
	.name {
		font-weight: 700;
	}
	.bar-cell {
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}
	.bar {
		flex: 1;
		height: 1.1rem;
		border-radius: var(--pill);
		background: var(--track);
		overflow: hidden;
	}
	.bar span {
		display: block;
		height: 100%;
		border-radius: inherit;
		background: var(--accent);
		transition: width 1.2s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.size {
		width: 3.5rem;
		font-variant-numeric: tabular-nums;
	}
	.modem {
		color: var(--ink-soft);
	}

	.ipod-title {
		margin: 1.2rem 0 0.6rem;
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}
	.ipods {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
	}
	.dots {
		display: flex;
		flex-wrap: wrap;
		gap: 2px;
		align-content: flex-start;
	}
	.dots span {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: var(--accent);
		opacity: 0;
		transition: opacity 0.2s;
	}
	.shown .dots span {
		opacity: 1;
	}
	.count {
		display: block;
		margin-top: 0.4rem;
		color: var(--ink-soft);
	}
	.count strong {
		color: var(--ink);
	}

	@media (max-width: 600px) {
		.row {
			grid-template-columns: 3rem minmax(0, 1fr);
		}
		.modem,
		.row.head span:last-child {
			display: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.bar span,
		.dots span {
			transition: none;
		}
	}
</style>
