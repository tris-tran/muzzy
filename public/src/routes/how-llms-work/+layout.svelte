<script>
	// The "How LLMs work" app. Everything it needs lives in this folder (steps/, components/)
	// so it stays separate from other apps on the site.
	import { resolve } from '$app/paths';

	let { children } = $props();
</script>

<svelte:head>
	<title>How LLMs work · Muzzy</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap"
	/>
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
	/*
	 * Design system: editorial minimalism with purposeful motion (think Stripe explainers:
	 * every step is a slide). Every component reads these tokens.
	 */
	.app {
		--paper: #f5f7fa;
		--card: #ffffff;
		--line: #e8ecf0;
		--ink: #0f172a;
		--ink-soft: #475569;
		--muted: #94a3b8;
		--track: #eef1f5;
		--track-strong: #cbd5e1;

		--accent: #6366f1;
		--accent-hover: #4f46e5;
		--accent-mid: #818cf8;
		--accent-soft: #eef2ff;

		--dark: #0f172a;
		--on-dark: #f8fafc;
		--tag: #c4b5fd;
		--tag-ink: #7c3aed;
		--good: #059669;
		--good-soft: #d1fae5;
		--good-light: #6ee7b7;
		--bad: #e11d48;
		--bad-soft: #ffe4e6;
		--bad-light: #fda4af;
		--cool: #f0abfc;

		--font-body: 'Plus Jakarta Sans', system-ui, sans-serif;
		--font-display: 'Plus Jakarta Sans', system-ui, sans-serif;
		--font-ui: 'Plus Jakarta Sans', system-ui, sans-serif;
		--font-mono: 'Fira Code', ui-monospace, monospace;
		--display-scale: 1;
		--display-weight: 700;

		--radius-sm: 8px;
		--radius: 12px;
		--radius-lg: 16px;
		--pill: 999px;
		--bw: 1px;
		--shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
		--shadow-lift: 0 24px 48px -20px rgba(15, 23, 42, 0.35), 0 2px 6px rgba(15, 23, 42, 0.06);

		height: 100svh;
		overflow-y: auto;
		scroll-snap-type: y mandatory;
		background: var(--paper);
		color: var(--ink);
		font-family: var(--font-body);
		-webkit-font-smoothing: antialiased;
		/* Fira Code would draw tags like <|im_start|> as arrows; show the real characters */
		font-variant-ligatures: none;
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
	.app :global(:is(h1, h2, h3)) {
		font-family: var(--font-display);
		font-weight: var(--display-weight);
		letter-spacing: -0.025em;
	}
	.app :global(.step-label) {
		margin: 0 0 0.6rem;
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--accent);
	}
	.app :global(.step-title) {
		margin: 0;
		font-size: calc(2.2rem * var(--display-scale));
		line-height: 1.1;
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
			font-size: calc(1.7rem * var(--display-scale));
		}
		.app :global(.step-lede) {
			font-size: 1.05rem;
		}
	}
</style>
