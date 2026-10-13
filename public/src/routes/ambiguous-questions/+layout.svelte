<script>
	// The "Ambiguous questions" presentation, part two after how-llms-work. Its steps live in
	// steps/; the shared shell and components live in #lib/presentation.
	import Presentation from '#lib/presentation/Presentation.svelte';

	let { children } = $props();
</script>

<Presentation title="Ambiguous questions">
	{@render children()}
</Presentation>
