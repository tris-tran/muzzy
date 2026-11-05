<script>
	// JPEG stage 2: cut the picture into 8 × 8 tiles; the tile we follow, as its 64 numbers.
	import JpegPage from '../components/JpegPage.svelte';
	import Grid from '../components/Grid.svelte';
	import { jpeg, W, H } from '../components/jpegState.svelte.js';
	import { paint, putImage } from '../components/canvas.js';

	// The brightness picture, twice the size, with the tile grid and our tile marked
	let drawTiles = $derived.by(() => {
		const pics = jpeg.pictures;
		const t = jpeg.tile;
		return (canvas) => {
			if (!pics || !t) return;
			canvas.width = W * 2;
			canvas.height = H * 2;
			const ctx = canvas.getContext('2d');
			const tmp = document.createElement('canvas');
			putImage(pics.bright)(tmp);
			ctx.imageSmoothingEnabled = false;
			ctx.drawImage(tmp, 0, 0, W * 2, H * 2);
			ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
			ctx.lineWidth = 1;
			ctx.beginPath();
			for (let x = 16; x < W * 2; x += 16) {
				ctx.moveTo(x + 0.5, 0);
				ctx.lineTo(x + 0.5, H * 2);
			}
			for (let y = 16; y < H * 2; y += 16) {
				ctx.moveTo(0, y + 0.5);
				ctx.lineTo(W * 2, y + 0.5);
			}
			ctx.stroke();
			ctx.strokeStyle = '#818cf8';
			ctx.lineWidth = 3;
			ctx.strokeRect(t.tx * 16 - 1, t.ty * 16 - 1, 18, 18);
		};
	});
</script>

<JpegPage n={2} title="Cut it into tiles of 8 × 8 pixels">
	{#snippet lede()}
		<p>
			Next, the picture is cut into a grid of small tiles, 8 pixels wide and 8 tall. From here on, each
			tile is squeezed <strong>on its own</strong>, without looking at its neighbours.
		</p>
	{/snippet}

	<div class="jp-panel">
		{#if jpeg.pictures && jpeg.tile}
			<div class="jp-row">
				<figure>
					<canvas class="tiles" use:paint={drawTiles}></canvas>
					<figcaption>Brightness, cut into {(W / 8) * (H / 8)} tiles <span>ours is marked</span></figcaption>
				</figure>
				<span class="op">→</span>
				<figure>
					<Grid values={jpeg.tile.pixels} --cell="1.95rem" label="Our tile: 64 brightness numbers" />
					<figcaption>Our tile: 64 numbers <span>0 is black, 255 is white</span></figcaption>
				</figure>
			</div>
		{:else}
			<p class="jp-loading">Getting the picture ready…</p>
		{/if}
	</div>

	<div class="jp-notes">
		<p>
			<strong>Why so small?</strong> Inside a tiny tile, things don't usually change much: a patch of sky, a
			bit of an edge. That makes every tile simple to describe, and that's what the next stage takes
			advantage of.
		</p>
		<p>
			<strong>Our tile</strong> is where a hill meets the bright sky: light at the top, dark at the bottom,
			with an edge running through it. It's one of the busiest tiles in the picture, which makes it a good
			one to follow.
		</p>
		<p>
			<strong>To the computer, it's just 64 numbers.</strong> The colour layers are cut into tiles too, and
			go through exactly the same stages. To keep things simple, we'll only follow this brightness tile.
		</p>
	</div>
</JpegPage>

<style>
	canvas.tiles {
		width: 26rem;
		max-width: 100%;
		aspect-ratio: 16 / 10;
		image-rendering: pixelated;
	}
</style>
