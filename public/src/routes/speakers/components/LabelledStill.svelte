<script>
	// A 3D scene rendered once as a still image, with labels pinned to points in it.
	//   build  – (THREE, scene) => { camera, points } (see still.js). A point name starting with
	//            '<' puts its label on the left of the dot.
	//   alt    – what the picture shows
	//   height – CSS height of the picture
	//   labels – show the labels
	import { onMount } from 'svelte';
	import { renderStill, pixelSize } from './still.js';

	let { build, alt, height = '28rem', labels = true } = $props();

	let host;
	let url = $state('');
	let points = $state([]);

	onMount(() => {
		let gone = false;
		const [w, h] = pixelSize(host);
		renderStill(build, w, h).then((r) => {
			if (gone) return URL.revokeObjectURL(r.url);
			url = r.url;
			points = r.points;
		});
		return () => {
			gone = true;
			if (url) URL.revokeObjectURL(url);
		};
	});
</script>

<div class="still" bind:this={host} style:height>
	{#if url}
		<img src={url} {alt} />
		{#if labels}
			{#each points as p (p.name)}
				{@const left = p.name.startsWith('<')}
				<span class="label" class:left style="left: {p.x}%; top: {p.y}%">{left ? p.name.slice(1) : p.name}</span>
			{/each}
		{/if}
	{:else}
		<p class="status">Loading…</p>
	{/if}
</div>

<style>
	.still {
		position: relative;
		width: 100%;
		border-radius: var(--radius-lg);
		background: radial-gradient(circle at 50% 40%, var(--card), var(--track));
		overflow: hidden;
	}
	img {
		display: block;
		width: 100%;
		height: 100%;
		animation: fade 0.4s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
	}
	/* A dot on the part, with its name beside it */
	.label {
		position: absolute;
		padding: 0.15rem 0.55rem;
		margin: -0.75rem 0 0 0.6rem;
		border-radius: var(--pill);
		background: color-mix(in srgb, var(--ink) 85%, transparent);
		color: var(--on-dark);
		font-size: 0.78rem;
		white-space: nowrap;
	}
	.label::before {
		content: '';
		position: absolute;
		left: -0.6rem;
		top: 50%;
		width: 0.45rem;
		height: 0.45rem;
		margin-top: -0.225rem;
		border-radius: 50%;
		background: var(--accent);
		box-shadow: 0 0 0 2px var(--card);
	}
	.label.left {
		margin: -0.75rem 0 0 -0.6rem;
		transform: translateX(-100%);
	}
	.label.left::before {
		left: auto;
		right: -0.6rem;
	}
	.status {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		margin: 0;
		color: var(--muted);
		font-style: italic;
	}
</style>
