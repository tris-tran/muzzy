<script>
	// Shared by every page. Each section ((site), how-llms-work, …) brings its own nav and layout.
	let { children } = $props();
</script>

<svelte:head>
	<title>Muzzy</title>
</svelte:head>

{@render children()}

<style>
	:global(:root) {
		--paper: #faf7f2;
		--card: #ffffff;
		--ink: #2b2b2b;
		--ink-soft: #5c574f;
		--line: #e5ded3;
		--accent: #c2553a;
	}
	:global(body) {
		margin: 0;
		font-family: Georgia, serif;
		background: var(--paper);
		color: var(--ink);
	}
</style>
