<script>
	// The LLM as seen from outside. Shared by every step that shows "the machine".
	//   mode – 'idle', 'working' (busy) or 'thinking' (busiest)
	//   size – CSS width of the whole thing
	import LlmCube from './LlmCube.svelte';

	let { mode = 'idle', size = 'min(13rem, 42vw)' } = $props();
</script>

<LlmCube {mode} {size} />
