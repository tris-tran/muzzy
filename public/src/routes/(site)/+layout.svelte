<script>
	let { children } = $props();
</script>

<main>
	{@render children()}
</main>

<style>
	main {
		max-width: 72rem;
		margin: 0 auto;
		padding: 3.5rem 2rem 4rem;
		overflow-wrap: break-word;
	}
	@media (max-width: 600px) {
		main {
			padding: 2rem 16px 3rem;
		}
	}
</style>
