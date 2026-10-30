<script>
	// "How we test language models": what a benchmark is and how the llmbench project builds and
	// runs them, without code. Steps live in steps/; shared visuals will live in components/.
	import Presentation from '#lib/presentation/Presentation.svelte';

	let { children } = $props();
</script>

<Presentation title="How we test language models">
	{@render children()}
</Presentation>
