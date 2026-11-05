<script>
	// "How do you make a file smaller?": lossless (gz) and lossy (JPEG, MP3) compression. Steps live
	// in steps/; this presentation's own visuals live in components/.
	import Presentation from '#lib/presentation/Presentation.svelte';

	let { children } = $props();
</script>

<Presentation title="Making files smaller">
	{@render children()}
</Presentation>
