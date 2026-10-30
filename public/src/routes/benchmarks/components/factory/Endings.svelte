<script>
	// How every card ended, in the project's own words: completed (it went through every station),
	// stopped (a station ended it early on purpose) or failed (something broke; the reason is kept).
	//   completed, stopped, failed – counts so far
	let { completed, stopped, failed } = $props();
</script>

<ul class="endings" aria-label="How cards ended">
	<li class="completed"><strong>{completed}</strong> completed <span>went through every station</span></li>
	<li class="stopped"><strong>{stopped}</strong> stopped <span>settled early, on purpose</span></li>
	<li class="failed"><strong>{failed}</strong> failed <span>kept, with the reason</span></li>
</ul>

<style>
	.endings {
		list-style: none;
		margin: 0.4rem 0 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1.5rem;
		font-size: 0.9rem;
	}
	strong {
		font-family: var(--font-mono);
		font-size: 1rem;
	}
	span {
		color: var(--muted);
		font-size: 0.82rem;
	}
	.completed strong {
		color: var(--accent);
	}
	.stopped strong {
		color: var(--good);
	}
	.failed strong {
		color: var(--bad);
	}
</style>
