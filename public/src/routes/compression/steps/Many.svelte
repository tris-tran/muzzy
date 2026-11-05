<script>
	// The ending: there are lots of compression methods, in two families. Two clouds of names (point at
	// one to read what it is), then two highlights: how YouTube sends video, and MP3.

	// size: 1 small … 3 big (how often you'd meet it). seen: shown in this explainer. star: highlighted below.
	const lossless = [
		{ name: 'ZIP', size: 3, about: 'The classic: a whole folder packed into one file. Inside, it uses the same method as gzip.' },
		{ name: 'gzip', size: 3, seen: true, about: 'The one we used. Websites send their text and code with it.' },
		{ name: 'PNG', size: 3, about: 'Pictures with every pixel kept. Good for screenshots, logos and drawings.' },
		{ name: 'RAR', size: 2, about: 'A packed folder, like ZIP. Popular on Windows for years.' },
		{ name: '7z', size: 2, about: 'A packed folder that squeezes harder than ZIP, but takes longer.' },
		{ name: 'Brotli', size: 2, about: 'Made by Google for websites. Squeezes text a bit better than gzip.' },
		{ name: 'zstd', size: 2, about: 'Made at Facebook. Fast and squeezes well: a modern favourite inside computers.' },
		{ name: 'FLAC', size: 2, about: 'Music with nothing lost. About half the size of a CD, sounds identical.' },
		{ name: 'xz', size: 1, about: 'Squeezes very hard and slowly. Used for software downloads on Linux.' },
		{ name: 'lz4', size: 1, about: 'Squeezes less, but is extremely fast. For when speed matters more than size.' },
		{ name: 'bzip2', size: 1, about: 'An older packer, slower than the newer ones.' },
		{ name: 'GIF', size: 1, about: 'Old pictures and animations. The squeezing loses nothing, but only 256 colours are allowed.' },
		{ name: 'ALAC', size: 1, about: "Apple's version of FLAC: music with nothing lost." },
		{ name: 'Snappy', size: 1, about: 'Made by Google for speed, inside big databases.' }
	];
	const lossy = [
		{ name: 'JPEG', size: 3, seen: true, about: 'The one we took apart: photos, rounded off where eyes won’t notice.' },
		{ name: 'MP3', size: 3, star: 'sound', about: 'Songs, without the sounds ears can’t hear. More on it below.' },
		{ name: 'MP4', size: 3, star: 'video', about: 'Not a method itself: a box holding a video (usually H.264) and its sound (usually AAC).' },
		{ name: 'H.264', size: 2, star: 'video', about: 'The most common video method in the world. Most videos you have ever watched.' },
		{ name: 'AV1', size: 2, star: 'video', about: 'The newest free video method. YouTube and Netflix use it to send smaller videos.' },
		{ name: 'VP9', size: 2, star: 'video', about: 'Made by Google. Much of YouTube travels in it.' },
		{ name: 'AAC', size: 2, about: 'MP3’s successor. The sound on YouTube and in Apple Music.' },
		{ name: 'WebP', size: 2, about: 'Made by Google for pictures on websites. Smaller than JPEG.' },
		{ name: 'HEIC', size: 2, about: 'How iPhones save photos: about half the size of JPEG.' },
		{ name: 'Opus', size: 2, about: 'Voice calls and video chats, like WhatsApp and Discord calls.' },
		{ name: 'H.265', size: 1, star: 'video', about: 'H.264’s successor: about half the size. 4K TV and phone videos.' },
		{ name: 'AVIF', size: 1, about: 'Pictures squeezed with the AV1 video method. Even smaller than WebP.' },
		{ name: 'Ogg Vorbis', size: 1, about: 'A free music method. Spotify used it for years.' },
		{ name: 'MPEG-2', size: 1, about: 'The video on DVDs and old digital TV.' },
		{ name: 'Dolby Digital', size: 1, about: 'Surround sound for cinemas, DVDs and TV.' },
		{ name: 'JPEG XL', size: 1, about: 'A newer JPEG: smaller files, and can also keep everything.' }
	];

	// The name being described under each cloud
	let picked = $state({ lossless: 'ZIP', lossy: 'MP3' });
	const pick = (side, tag) => {
		picked[side] = tag.name;
	};
	const find = (tags, name) => tags.find((t) => t.name === name);

	// The video highlight: one full picture, then only what moved
	const frames = [0, 1, 2, 3, 4];
</script>

<div class="many">
	<div class="head">
		<div>
			<p class="step-label">The end · There are lots of them</p>
			<h2 class="step-title">Two families, hundreds of methods</h2>
		</div>
		<p class="step-lede">
			gz and JPEG are just two of them. Every kind of data has its own methods, and they all fall into one
			of the two families: those that give back <strong>everything</strong>, and those that throw away
			<strong>what you won't notice</strong>. Point at a name to see what it's for.
		</p>
	</div>

	<div class="clouds">
		{#each [['lossless', 'Lossless', 'Nothing lost: text, files, code, exact pictures', lossless], ['lossy', 'Lossy', 'A little lost on purpose: photos, music, video', lossy]] as [side, title, sub, tags] (side)}
			{@const shown = find(tags, picked[side])}
			<section class="cloud {side}">
				<header>
					<strong>{title}</strong>
					<span>{sub}</span>
				</header>
				<div class="tags">
					{#each tags as tag (tag.name)}
						<button
							class="tag s{tag.size}"
							class:seen={tag.seen}
							class:star={tag.star}
							class:on={picked[side] === tag.name}
							onmouseenter={() => pick(side, tag)}
							onfocus={() => pick(side, tag)}
							onclick={() => pick(side, tag)}
						>
							{tag.name}
						</button>
					{/each}
				</div>
				<p class="about">
					<b>{shown.name}</b>
					{#if shown.seen}<em>seen here</em>{/if}
					{shown.about}
				</p>
			</section>
		{/each}
	</div>

	<div class="highlights">
		<section class="highlight">
			<span class="label">Video · how YouTube sends one</span>
			<figure class="strip" aria-hidden="true">
				<div class="frames">
					{#each frames as f (f)}
						<div class="frame" class:full={f === 0} style="--f: {f}">
							{#if f === 0}<span class="hill"></span><span class="sun"></span>{/if}
							<span class="ball"></span>
						</div>
					{/each}
				</div>
				<figcaption>one whole picture, then only what moved</figcaption>
			</figure>
			<p>
				About 30 pictures a second: unsqueezed, one second of HD is <b>186 MB</b>. YouTube sends about
				<b>half a MB</b>. Each picture is squeezed much like JPEG, but most aren't sent whole: only
				<strong>what moved</strong> since the last one. It also checks your internet every few seconds and
				sends a sharper or rougher version to keep it playing.
			</p>
		</section>

		<section class="highlight">
			<span class="label">Sound · MP3</span>
			<div class="bars" aria-hidden="true">
				{#each [0.35, 0.55, 0.9, 0.3, 0.75, 0.25, 0.5, 0.2, 0.4, 0.15, 0.1] as level, i (i)}
					<span class:hidden-bar={[3, 5, 7, 9, 10].includes(i)} style="--l: {level}"></span>
				{/each}
			</div>
			<p>
				A minute of CD music is <b>10 MB</b>; as MP3, about <b>1 MB</b>. JPEG's idea for ears: turn
				each tiny slice of song into "how much of each pitch", and drop what you can't hear: too high, too
				quiet, or <strong>hidden behind a louder sound</strong> (striped).
			</p>
		</section>
	</div>
</div>

<style>
	.head {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 0 3rem;
		align-items: end;
	}
	.step-lede {
		margin: 0;
	}
	.step-lede strong {
		color: var(--ink);
		font-weight: normal;
		border-bottom: 2px solid var(--accent-mid);
	}

	.clouds {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1.1rem;
		margin-top: 1.6rem;
	}
	.cloud {
		--c: var(--accent);
		--c-soft: var(--accent-soft);
		display: flex;
		flex-direction: column;
		padding: 0.9rem 1.1rem 1rem;
		border-radius: var(--radius);
		background: var(--card);
		border: var(--bw) solid var(--line);
	}
	.cloud.lossy {
		--c: var(--tag-ink);
		--c-soft: color-mix(in srgb, var(--cool) 22%, var(--card));
	}
	.cloud header {
		display: flex;
		align-items: baseline;
		gap: 0.6rem;
		flex-wrap: wrap;
	}
	.cloud header strong {
		font-size: 1.15rem;
		color: var(--c);
	}
	.cloud header span {
		font-size: 0.85rem;
		color: var(--muted);
	}
	.tags {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		align-content: center;
		gap: 0.4rem 0.45rem;
		min-height: 8rem;
		padding: 0.9rem 0 0.7rem;
	}
	.tag {
		font: inherit;
		font-weight: 600;
		padding: 0.25em 0.7em;
		border: 1.5px solid transparent;
		border-radius: var(--pill);
		background: var(--c-soft);
		color: var(--c);
		cursor: pointer;
		transition:
			transform 0.15s,
			background 0.15s,
			color 0.15s;
	}
	.tag.s1 {
		font-size: 0.8rem;
		opacity: 0.85;
	}
	.tag.s2 {
		font-size: 0.98rem;
	}
	.tag.s3 {
		font-size: 1.3rem;
	}
	.tag.seen {
		border-color: var(--c);
	}
	.tag.star::after {
		content: ' ★';
		font-size: 0.75em;
	}
	.tag:hover,
	.tag.on {
		background: var(--c);
		color: var(--card);
		opacity: 1;
		transform: translateY(-1px);
	}
	.about {
		margin: 0;
		min-height: 3rem;
		padding-top: 0.7rem;
		border-top: var(--bw) solid var(--line);
		font-size: 0.9rem;
		line-height: 1.5;
		color: var(--ink-soft);
	}
	.about b {
		color: var(--c);
		margin-right: 0.3rem;
	}
	.about em {
		font-style: normal;
		font-size: 0.72rem;
		margin-right: 0.35rem;
		padding: 0.05rem 0.45rem;
		border-radius: var(--pill);
		border: 1px solid var(--c);
		color: var(--c);
	}

	.highlights {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1.1rem;
		margin-top: 1.1rem;
	}
	.highlight {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		gap: 0.5rem 1.1rem;
		align-items: center;
		align-content: start;
		padding: 0.9rem 1.1rem 1rem;
		border-radius: var(--radius);
		background: color-mix(in srgb, var(--cool) 14%, var(--card));
		border: var(--bw) solid var(--line);
	}
	.highlight .label {
		grid-column: 1 / -1;
		font-size: 0.72rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--tag-ink);
		font-weight: 700;
	}
	.highlight .label::before {
		content: '★ ';
	}
	.highlight p {
		margin: 0;
		font-size: 0.88rem;
		line-height: 1.5;
		color: var(--ink-soft);
	}
	.highlight b,
	.highlight strong {
		color: var(--ink);
	}
	.highlight b {
		font-family: var(--font-mono);
		font-weight: 600;
		white-space: nowrap;
	}

	/* Video: a strip of frames, the first one complete, the rest only the moving ball */
	.frames {
		display: grid;
		grid-template-columns: repeat(5, 2.2rem);
		gap: 0.25rem;
	}
	.frame {
		position: relative;
		height: 3.3rem;
		border-radius: 5px;
		overflow: hidden;
		background: var(--card);
		border: 1px dashed var(--track-strong);
	}
	.frame.full {
		background: linear-gradient(#fbbf24 0%, #f472b6 70%);
		border: 1px solid transparent;
	}
	.hill {
		position: absolute;
		left: -20%;
		right: -20%;
		bottom: -1.2rem;
		height: 2.4rem;
		border-radius: 50%;
		background: #6d28d9;
	}
	.sun {
		position: absolute;
		top: 0.4rem;
		right: 0.35rem;
		width: 0.6rem;
		height: 0.6rem;
		border-radius: 50%;
		background: #fff7d6;
	}
	.ball {
		position: absolute;
		top: 1.45rem;
		left: calc(0.2rem + var(--f) * 0.3rem);
		width: 0.7rem;
		height: 0.7rem;
		border-radius: 50%;
		background: var(--accent);
		animation: pop 0.4s ease-out calc(var(--f) * 0.35s) both;
	}
	.strip {
		margin: 0;
	}
	.strip figcaption {
		margin-top: 0.3rem;
		max-width: 11.8rem;
		font-size: 0.7rem;
		line-height: 1.3;
		text-align: center;
		color: var(--muted);
	}
	@keyframes pop {
		from {
			opacity: 0;
			transform: scale(0.4);
		}
	}

	/* Sound: pitch bars, the ones you can't hear striped */
	.bars {
		display: flex;
		align-items: flex-end;
		gap: 3px;
		height: 3.3rem;
		width: 11.4rem;
		padding: 0 0.2rem;
		border-bottom: 1px solid var(--track-strong);
	}
	.bars span {
		flex: 1;
		height: calc(var(--l) * 100%);
		border-radius: 3px 3px 0 0;
		background: var(--accent);
	}
	.bars span.hidden-bar {
		background: repeating-linear-gradient(45deg, var(--muted) 0 3px, transparent 3px 6px);
		outline: 1px dashed var(--muted);
	}

	@media (max-width: 960px) {
		.head,
		.clouds,
		.highlights {
			grid-template-columns: minmax(0, 1fr);
		}
		.step-lede {
			margin-top: 0.8rem;
		}
	}
	@media (max-width: 560px) {
		.highlight {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.ball {
			animation: none;
		}
	}
</style>
