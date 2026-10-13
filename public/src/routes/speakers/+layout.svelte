<script>
	// "From gramophone to Bluetooth": how speakers work, starting with the gramophone. Steps live in
	// steps/; the visuals (this presentation's own component library) live in components/.
	import Presentation from '#lib/presentation/Presentation.svelte';

	let { children } = $props();
</script>

<Presentation title="From gramophone to Bluetooth">
	{@render children()}
</Presentation>
