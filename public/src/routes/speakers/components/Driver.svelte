<svelte:options namespace="svg" />

<script>
	// A speaker driver in cross-section, for use inside an <svg>: magnet, pole, coil, cone.
	// The same part is a speaker (current in → cone moves) or a microphone (cone moves → current out).
	//   x, y   – centre of the pole
	//   push   – how far the coil and cone are pushed forward, in px
	//   facing – 1 = cone opens to the right, -1 = to the left
	let { x, y, push = 0, facing = 1 } = $props();

	let s = $derived(push);
</script>

<g transform="translate({x} {y}) scale({facing} 1)">
	<!-- Frame, from the magnet out to the rim -->
	<path class="frame" d="M10,-50 L100,-118 M10,50 L100,118" />
	<!-- Magnet assembly: back plate, ring magnet, top plates, centre pole -->
	<rect class="steel" x="-50" y="-50" width="20" height="100" />
	<rect class="magnet" x="-30" y="-50" width="30" height="28" />
	<rect class="magnet" x="-30" y="22" width="30" height="28" />
	<rect class="steel" x="0" y="-50" width="10" height="34" />
	<rect class="steel" x="0" y="16" width="10" height="34" />
	<rect class="steel" x="-30" y="-10" width="42" height="20" />
	<!-- Coil, wound around the pole, and the cone it's glued to -->
	<rect class="coil" x={2 + s} y="-16" width="22" height="6" />
	<rect class="coil" x={2 + s} y="10" width="22" height="6" />
	<path class="cone" d="M{24 + s},-14 L{95 + s},-110 L{95 + s},110 L{24 + s},14 Z" />
	<path class="cap" d="M{24 + s},-14 Q{40 + s},0 {24 + s},14" />
	<path class="surround" d="M{95 + s},-110 Q{102 + s / 2},-118 100,-118 M{95 + s},110 Q{102 + s / 2},118 100,118" />
</g>

<style>
	.frame {
		fill: none;
		stroke: #94a3b8;
		stroke-width: 3;
	}
	.steel {
		fill: #aab2bd;
		stroke: #64748b;
		stroke-width: 1.5;
	}
	.magnet {
		fill: #2a2e35;
	}
	.coil {
		fill: #d07a3a;
		stroke: #9a5524;
		stroke-width: 1;
	}
	.cone {
		fill: color-mix(in srgb, #64748b 22%, transparent);
		stroke: #334155;
		stroke-width: 3;
		stroke-linejoin: round;
	}
	.cap {
		fill: #475569;
		stroke: #334155;
		stroke-width: 2;
	}
	.surround {
		fill: none;
		stroke: #1b1d22;
		stroke-width: 5;
		stroke-linecap: round;
	}
</style>
