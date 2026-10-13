<script>
	import { resolve } from '$app/paths';
	let { children } = $props();
</script>

<nav>
	<a class="brand" href={resolve('/')}>Muzzy</a>
	<span class="spacer"></span>
	<a href={resolve('/how-llms-work')}>How LLMs work</a>
	<a href={resolve('/ambiguous-questions')}>Ambiguous questions</a>
	<a href={resolve('/private')}>Private</a>
</nav>

<main>
	{@render children()}
</main>

<style>
	nav {
		display: flex;
		align-items: baseline;
		gap: 1.5rem;
		padding: 1rem 2rem;
		border-bottom: 1px solid var(--line);
	}
	nav a {
		color: inherit;
	}
	.brand {
		font-weight: bold;
		text-decoration: none;
	}
	.spacer {
		flex: 1;
	}
	main {
		max-width: 46rem;
		margin: 3rem auto;
		padding: 0 1.5rem;
		overflow-wrap: break-word;
	}
	@media (max-width: 600px) {
		nav {
			gap: 1rem;
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
