<script>
	// One full-screen "page" of the explainer. The app scrolls and snaps from one Step to the next.
	//   id    – anchor for this step
	//   next  – id of the following step; shows a "keep going" cue at the bottom
	//   cue   – text for that cue
	let { id, next = null, cue = 'Keep going', children } = $props();

	function goNext() {
		document.getElementById(next)?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<section class="step" {id}>
	<div class="content">
		{@render children()}
	</div>

	{#if next}
		<button class="next" onclick={goNext}>
			<span>{cue}</span>
			<span class="arrow" aria-hidden="true">↓</span>
		</button>
	{/if}
</section>

<style>
	.step {
		position: relative;
		min-height: 100svh;
		box-sizing: border-box;
		padding: 4.5rem 1.5rem 5rem; /* top clears the floating header, bottom clears the cue */
		display: flex;
		align-items: center;
		scroll-snap-align: start;
	}
	.step + :global(.step) {
		border-top: 1px solid var(--line);
	}
	.content {
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
	}

	.next {
		position: absolute;
		left: 50%;
		bottom: 1.25rem;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.2rem;
		font: inherit;
		font-size: 0.85rem;
		color: var(--ink-soft);
		background: none;
		border: 0;
		cursor: pointer;
	}
	.next:hover {
		color: var(--ink);
	}
	.arrow {
		font-size: 1.2rem;
		animation: nudge 1.8s ease-in-out infinite;
	}
	@keyframes nudge {
		50% {
			transform: translateY(5px);
		}
	}

	@media (max-width: 600px) {
		.step {
			padding: 4rem 16px 4.5rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.arrow {
			animation: none;
		}
	}
</style>
