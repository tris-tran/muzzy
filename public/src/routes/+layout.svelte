<script>
	// Shared by every page. The explainers bring their own look (#lib/presentation); these
	// defaults dress the landing page and the private page: light and minimal.
	let { children } = $props();
</script>

<svelte:head>
	<title>Muzzy</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap"
	/>
</svelte:head>

{@render children()}

<style>
	:global(:root) {
		--paper: #ffffff;
		--card: #ffffff;
		--ink: #0f172a;
		--ink-soft: #64748b;
		--muted: #94a3b8;
		--line: #e5e7eb;
		--accent: #6366f1;
		--on-accent: #ffffff;
	}
	:global(body) {
		margin: 0;
		font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
		background: var(--paper);
		color: var(--ink);
		-webkit-font-smoothing: antialiased;
	}
</style>
