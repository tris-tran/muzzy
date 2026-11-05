<script>
	// JPEG stage 6: opening the photo runs everything backwards. Compare our tile, and see the whole
	// picture as a real JPEG the browser makes at the chosen quality.
	import JpegPage from '../components/JpegPage.svelte';
	import Grid from '../components/Grid.svelte';
	import { jpeg, W, H } from '../components/jpegState.svelte.js';
	import { putImage } from '../components/canvas.js';
	import * as J from '../components/jpeg.js';

	let dividers = $derived(J.table(jpeg.quality));
	let decoded = $derived(jpeg.tile ? J.idct(J.dequantize(J.quantize(J.dct(jpeg.tile.pixels), dividers), dividers)) : null);
	let offBy = $derived(decoded ? decoded.reduce((s, v, i) => s + Math.abs(v - jpeg.tile.pixels[i]), 0) / 64 : 0);

	// A real JPEG of the whole picture, made by the browser
	let url = $state(null);
	let size = $state(null);
	$effect(() => {
		const pics = jpeg.pictures;
		const q = jpeg.quality;
		if (!pics) return;
		let stale = false;
		const c = document.createElement('canvas');
		putImage(pics.original)(c);
		c.toBlob(
			(blob) => {
				if (stale || !blob) return;
				if (url) URL.revokeObjectURL(url);
				url = URL.createObjectURL(blob);
				size = blob.size;
			},
			'image/jpeg',
			q / 100
		);
		return () => (stale = true);
	});
	const RAW = W * H * 3;
	const kb = (n) => `${Math.max(1, Math.round(n / 1024))} KB`;

	const steps = [
		['Read the numbers back', 'Undo the short codes, and fill in the zeros after “End”.'],
		['Multiply them back', 'Each one times its divider: 43 × 12 = 516 again. A zero stays zero.'],
		['Mix the patterns', 'The same 64 patterns, in those amounts, rebuild each tile.'],
		['Put it all together', 'The tiles side by side, and the colour stretched back over them.']
	];
</script>

<JpegPage n={6} title="Unpack it, and compare">
	{#snippet lede()}
		<p>
			When you open the photo, your phone or computer runs every stage <strong>backwards</strong>. The
			picture comes back very close, but not exactly: what was rounded away is gone for good.
		</p>
	{/snippet}

	<div class="jp-panel">
		{#if decoded}
			<div class="unpack-stage">
				<ol class="backwards">
					{#each steps as [title, text], i (title)}
						<li><span class="n">{i + 1}</span><span><strong>{title}</strong>{text}</span></li>
					{/each}
				</ol>
				<div class="results">
					<div class="jp-row">
						<figure>
							<Grid values={jpeg.tile.pixels} numbers={false} --cell="1.05rem" label="Our tile before" />
							<figcaption><span>our tile, before</span></figcaption>
						</figure>
						<figure>
							<Grid values={decoded} numbers={false} --cell="1.05rem" label="Our tile after JPEG" />
							<figcaption><span>after · off by {offBy.toFixed(1)} of 255</span></figcaption>
						</figure>
						<figure class="whole">
							{#if url}<img src={url} alt="The whole sunset as a real JPEG at quality {jpeg.quality}" />{/if}
							<figcaption>
								The whole picture, a real JPEG
								<span>{size ? kb(size) : '…'} instead of {kb(RAW)}</span>
							</figcaption>
						</figure>
					</div>
					<div class="jp-controls">
						<label class="jp-quality">
							<span>Quality <strong>{jpeg.quality}</strong></span>
							<input type="range" min="1" max="100" bind:value={jpeg.quality} />
						</label>
					</div>
				</div>
			</div>
		{:else}
			<p class="jp-loading">Getting the picture ready…</p>
		{/if}
	</div>

	<div class="jp-notes">
		<p>
			<strong>A real one.</strong> The picture on the right is an actual JPEG your browser just made, at
			the quality you picked. Around 50 to 80 it looks the same and is a tiny fraction of the size. Drag it
			down to 5 and you'll see the 8 × 8 tiles.
		</p>
		<p>
			<strong>Saving again makes it worse.</strong> Every time a JPEG is edited and saved, the rounding
			happens again on the already-rounded picture. That's why photos shared over and over end up looking
			blotchy.
		</p>
		<p>
			<strong>The same idea, everywhere.</strong> Know what kind of data it is, know what people notice, and
			throw away the rest. Photos, video, and, as we'll see, sound.
		</p>
	</div>
</JpegPage>

<style>
	.unpack-stage {
		display: grid;
		grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.6fr);
		gap: 1.5rem;
		align-items: center;
	}
	.backwards {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.6rem;
	}
	.backwards li {
		display: flex;
		gap: 0.6rem;
		font-size: 0.86rem;
		line-height: 1.4;
		color: var(--ink-soft);
	}
	.backwards li > span:last-child {
		display: grid;
	}
	.backwards strong {
		color: var(--ink);
	}
	.n {
		flex: 0 0 auto;
		display: grid;
		place-items: center;
		width: 1.4rem;
		height: 1.4rem;
		border-radius: 50%;
		background: var(--accent-soft);
		color: var(--accent);
		font-size: 0.75rem;
		font-weight: 700;
	}
	.whole img {
		width: 18rem;
		max-width: 100%;
		aspect-ratio: 16 / 10;
		image-rendering: pixelated;
	}
	@media (max-width: 860px) {
		.unpack-stage {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
