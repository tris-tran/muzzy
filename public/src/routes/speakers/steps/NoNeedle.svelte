<script>
	// Step 10: the speaker only needs the electrical wiggle, from anywhere. Pick a source and
	// watch the cable and speaker do exactly the same thing.
	import JackChain from '../components/JackChain.svelte';

	const sources = [
		{ id: 'record', name: 'Record player' },
		{ id: 'mic', name: 'Microphone' },
		{ id: 'phone', name: 'Phone or computer' }
	];
	let source = $state('record');
</script>

<div class="no-needle">
	<div class="head">
		<div>
			<p class="step-label">Step 10 · Cut out the needle</p>
			<h2 class="step-title">The speaker only needs the wiggle</h2>
		</div>
		<p class="step-lede">
			Once the wiggle is electricity, the speaker <strong>doesn't care where it came from</strong>.
			Anything that can make that electrical wiggle can plug in and play music. Try it:
		</p>
	</div>

	<div class="sources" role="group" aria-label="Pick what's plugged in">
		{#each sources as s (s.id)}
			<button class="chip" class:active={source === s.id} onclick={() => (source = s.id)}>{s.name}</button>
		{/each}
	</div>

	<div class="stage"><JackChain {source} /></div>

	<p class="takeaway">
		{#if source === 'phone'}
			A phone has <strong>no needle and no groove</strong>, just a file. So how does a file become
			that wiggle?
		{:else}
			Same wiggle on the cable, same speaker. Now try the phone.
		{/if}
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
	.step-lede strong,
	.takeaway strong {
		color: var(--ink);
		font-weight: normal;
		border-bottom: 2px solid var(--accent-mid);
	}
	@media (max-width: 860px) {
		.head {
			grid-template-columns: minmax(0, 1fr);
		}
		.step-lede {
			margin-top: 1rem;
		}
	}
	.sources {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 1.5rem;
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
	.chip:hover {
		border-color: var(--ink-soft);
	}
	.chip.active {
		background: var(--ink);
		border-color: var(--ink);
		color: var(--paper);
	}
	.stage {
		max-width: 52rem;
		margin-top: 1rem;
		padding: 0.5rem 1rem;
		border-radius: var(--radius-lg);
		border: var(--bw) solid var(--line);
		background: var(--card);
	}
	.takeaway {
		max-width: 46rem;
		margin: 1.25rem 0 0;
		font-size: 1.1rem;
		line-height: 1.6;
	}
</style>
