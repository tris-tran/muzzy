<script>
	// JPEG stage 1: split brightness from colour, and keep the colour at a quarter of the detail.
	import JpegPage from '../components/JpegPage.svelte';
	import { jpeg } from '../components/jpegState.svelte.js';
	import { paint, putImage, putCrop } from '../components/canvas.js';

	// The close-up: a little piece around the tile we'll follow, where the hill meets the sky
	let crop = $derived(jpeg.tile ? { x: jpeg.tile.tx * 8 - 8, y: jpeg.tile.ty * 8 - 4, w: 24, h: 16 } : null);
	const closeUp = (img) => putCrop(img, crop.x, crop.y, crop.w, crop.h);
</script>

<JpegPage n={1} title="Brightness first, colour second">
	{#snippet lede()}
		<p>
			A screen makes every pixel from red, green and blue light. JPEG starts by describing each pixel
			differently: <strong>how bright it is</strong>, plus <strong>what colour it is</strong>.
		</p>
	{/snippet}

	<div class="jp-panel">
		{#if jpeg.pictures && crop}
			<div class="jp-row">
				<figure>
					<canvas class="full" use:paint={putImage(jpeg.pictures.original)}></canvas>
					<figcaption>The picture</figcaption>
				</figure>
				<span class="op">=</span>
				<figure>
					<canvas class="full" use:paint={putImage(jpeg.pictures.bright)}></canvas>
					<figcaption>Brightness <span>full detail</span></figcaption>
				</figure>
				<span class="op">+</span>
				<figure>
					<canvas class="full" use:paint={putImage(jpeg.pictures.colour)}></canvas>
					<figcaption>Colour <span>¼ of the detail</span></figcaption>
				</figure>
				<span class="op">→</span>
				<figure>
					<canvas class="full" use:paint={putImage(jpeg.pictures.together)}></canvas>
					<figcaption>Back together <span>half the data</span></figcaption>
				</figure>
			</div>
			<div class="jp-row close">
				<span class="close-label">Up close</span>
				<figure>
					<canvas class="zoom" use:paint={closeUp(jpeg.pictures.bright)}></canvas>
					<figcaption><span>sharp</span></figcaption>
				</figure>
				<figure>
					<canvas class="zoom" use:paint={closeUp(jpeg.pictures.colour)}></canvas>
					<figcaption><span>blocks of 2 × 2 pixels</span></figcaption>
				</figure>
				<figure>
					<canvas class="zoom" use:paint={closeUp(jpeg.pictures.together)}></canvas>
					<figcaption><span>still looks sharp</span></figcaption>
				</figure>
			</div>
		{:else}
			<p class="jp-loading">Getting the picture ready…</p>
		{/if}
	</div>

	<div class="jp-notes">
		<p>
			<strong>Why?</strong> Because of how eyes are built. We have far more cells for light and dark than
			for colour. We notice a sharp edge in brightness straight away, but we're bad at seeing exactly where
			one colour stops and the next begins.
		</p>
		<p>
			<strong>So JPEG keeps less colour.</strong> Brightness stays at full detail, but colour gets just one
			value for every 2 × 2 block of pixels: a quarter of the colour detail. Up close you can see the
			blocks; put back together, it still looks sharp, because the brightness carries the edges.
		</p>
		<p>
			<strong>Half the data, gone already.</strong> Before anything clever happens, the picture is half the
			size. This is the first of the two stages that lose something.
		</p>
	</div>
</JpegPage>

<style>
	canvas.full {
		width: 10.5rem;
		aspect-ratio: 16 / 10;
	}
	.close {
		margin-top: 1rem;
		padding-top: 0.9rem;
		border-top: var(--bw) solid var(--line);
	}
	.close-label {
		font-size: 0.72rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-soft);
		margin-right: 0.5rem;
	}
	canvas.zoom {
		width: 9rem;
		aspect-ratio: 24 / 16;
		image-rendering: pixelated;
	}
	@media (max-width: 600px) {
		canvas.full {
			width: 100%;
			max-width: 18rem;
		}
	}
</style>
