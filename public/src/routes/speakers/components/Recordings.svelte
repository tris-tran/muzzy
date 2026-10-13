<script>
	// The historic recordings as a list of players, oldest first. Electrical ones are highlighted.
	import { asset } from '$app/paths';
	import { recordings } from './data.js';
</script>

<ol class="recordings">
	{#each recordings as r (r.file)}
		<li class:electric={r.electric}>
			<span class="year">{r.year}</span>
			<span class="what"><strong>{r.name}</strong> · {r.who}</span>
			<span class="how">{r.how}</span>
			<audio controls preload="none" src={asset('audio/' + r.file)}></audio>
		</li>
	{/each}
</ol>

<style>
	.recordings {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.5rem;
	}
	li {
		display: grid;
		grid-template-columns: 5.5rem minmax(0, 1fr) 11rem;
		grid-template-areas: 'year what how' 'year audio audio';
		gap: 0.25rem 1rem;
		align-items: center;
		padding: 0.6rem 1rem;
		border-radius: var(--radius);
		border: var(--bw) solid var(--line);
		background: var(--card);
	}
	li.electric {
		border-color: var(--accent-mid);
		background: var(--accent-soft);
	}
	.year {
		grid-area: year;
		font-size: 0.85rem;
		font-weight: 700;
		color: var(--accent);
	}
	.what {
		grid-area: what;
	}
	.how {
		grid-area: how;
		font-size: 0.85rem;
		color: var(--ink-soft);
		text-align: right;
	}
	audio {
		grid-area: audio;
		width: 100%;
		height: 2.1rem;
	}
	@media (max-width: 600px) {
		li {
			grid-template-columns: minmax(0, 1fr);
			grid-template-areas: 'year' 'what' 'how' 'audio';
		}
		.how {
			text-align: left;
		}
	}
</style>
