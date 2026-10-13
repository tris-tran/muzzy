<script>
	// The "How LLMs work" presentation. Its steps live in steps/; the shared shell and
	// components live in #lib/presentation.
	import Presentation from '#lib/presentation/Presentation.svelte';

	let { children } = $props();
</script>

<Presentation title="How LLMs work">
	{@render children()}
</Presentation>
