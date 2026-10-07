<script>
	// The "How LLMs work" app. Everything it needs lives in this folder (components/ etc.)
	// so it stays separate from other apps on the site.
	import { resolve } from '$app/paths';
	let { children } = $props();
</script>

<svelte:head>
	<title>How LLMs work · Muzzy</title>
</svelte:head>

<!-- The app is its own scroll container so snapping between steps doesn't leak into the rest of the site -->
<div class="app">
	<header>
		<a class="back" href={resolve('/')}>← Muzzy</a>
		<span class="title">How LLMs work</span>
	</header>

	{@render children()}
</div>

<style>
	.app {
		height: 100svh;
		overflow-y: auto;
		scroll-snap-type: y mandatory;
	}
	header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 10;
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.9rem 2rem;
		background: color-mix(in srgb, var(--paper) 85%, transparent);
		backdrop-filter: blur(6px);
	}
	.back {
		color: inherit;
	}
	.title {
		color: var(--ink-soft);
		font-size: 0.9rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	/* Shared typography for steps */
	.app :global(.step-label) {
		margin: 0 0 0.5rem;
		font-size: 0.8rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--accent);
	}
	.app :global(.step-title) {
		margin: 0;
		font-size: 2.2rem;
		line-height: 1.15;
		font-weight: normal;
		text-wrap: balance;
	}
	.app :global(.step-lede) {
		max-width: 40rem;
		font-size: 1.15rem;
		line-height: 1.6;
		color: var(--ink-soft);
	}

	@media (max-width: 600px) {
		/* Steps can be taller than a phone screen; don't force-snap past their content */
		.app {
			scroll-snap-type: y proximity;
		}
		header {
			padding: 0.8rem 16px;
		}
		.app :global(.step-title) {
			font-size: 1.7rem;
		}
		.app :global(.step-lede) {
			font-size: 1.05rem;
		}
	}
</style>
