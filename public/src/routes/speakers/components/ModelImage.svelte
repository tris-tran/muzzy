<script>
	// A glTF model (.glb or .gltf), framed to fit and rendered once as a still image.
	//   src    – URL of the model
	//   alt    – what the picture shows
	//   view   – direction the camera looks from, as [x, y, z] (the model sits at the centre)
	//   height – CSS height of the picture
	import { onMount } from 'svelte';
	import { renderStill, pixelSize } from './still.js';

	let { src, alt, view = [0.6, 0.35, 0.75], height = '14rem' } = $props();

	let host;
	let url = $state('');
	let status = $state('Loading…');

	onMount(() => {
		let gone = false;
		const [w, h] = pixelSize(host);
		renderStill(
			async (THREE, scene) => {
				const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
				const model = (await new GLTFLoader().loadAsync(src)).scene;
				// Centre it and back the camera off until it fits
				const box = new THREE.Box3().setFromObject(model);
				model.position.sub(box.getCenter(new THREE.Vector3()));
				scene.add(model);
				const radius = box.getSize(new THREE.Vector3()).length() / 2;
				const camera = new THREE.PerspectiveCamera(30, w / h, radius / 100, radius * 100);
				const dist = (radius / Math.sin(THREE.MathUtils.degToRad(15))) * 0.98;
				camera.position.set(...view).normalize().multiplyScalar(dist);
				camera.lookAt(0, 0, 0);
				return { camera };
			},
			w,
			h
		).then(
			(r) => (gone ? URL.revokeObjectURL(r.url) : ((url = r.url), (status = ''))),
			() => (status = "Couldn't load the model")
		);
		return () => {
			gone = true;
			if (url) URL.revokeObjectURL(url);
		};
	});
</script>

<div class="still" bind:this={host} style:height>
	{#if url}<img src={url} {alt} />{/if}
	{#if status}<p class="status">{status}</p>{/if}
</div>

<style>
	.still {
		position: relative;
		width: 100%;
		border-radius: var(--radius);
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
