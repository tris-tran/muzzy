<script>
	import { resolve } from '$app/paths';
	let { children } = $props();
</script>

<svelte:head>
	<title>Muzzy</title>
</svelte:head>

<nav>
	<a href={resolve('/')}>Home</a>
	<a href={resolve('/private')}>Private</a>
</nav>

<main>
	{@render children()}
</main>

<style>
	:global(body) {
		margin: 0;
		font-family: Georgia, serif;
		background: #faf7f2;
		color: #2b2b2b;
	}
	nav {
		display: flex;
		gap: 1.5rem;
		padding: 1rem 2rem;
		border-bottom: 1px solid #e5ded3;
	}
	nav a {
		color: inherit;
	}
	main {
		max-width: 40rem;
		margin: 3rem auto;
		padding: 0 1.5rem;
		overflow-wrap: break-word;
	}
	@media (max-width: 600px) {
		nav {
			padding: 0.9rem 16px;
		}
		main {
			margin: 1.75rem auto;
			padding: 0 16px;
		}
		main :global(h1) {
			font-size: 1.7rem;
		}
	}
</style>
