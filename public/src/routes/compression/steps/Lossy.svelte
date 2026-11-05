<script>
	// Step 5: losing a little, on purpose. If you know what kind of data it is, you can throw away
	// what nobody will notice. Text can't lose a single letter; a picture can lose most of its colours;
	// a sound can lose the notes ears can't hear. That's lossless vs lossy.
	import { onMount } from 'svelte';
	import { paintSunset } from '../components/sunset.js';

	// --- Text: every letter matters -------------------------------------------------------------
	const message = 'Pay Ana 150 € on Friday at 8 pm.';
	// The first letters to go are the ones that hurt most: the money, then the time
	const removalOrder = (() => {
		const first = [message.indexOf('5'), message.indexOf('8 pm')];
		let a = 3;
		const rand = () => ((a = (a * 16807) % 2147483647) - 1) / 2147483646;
		const rest = [...message]
			.map((ch, i) => i)
			.filter((i) => /\S/.test(message[i]) && !first.includes(i))
			.map((i) => ({ i, k: rand() }))
			.sort((x, y) => x.k - y.k)
			.map((x) => x.i);
		return [...first, ...rest];
	})();
	let lostLetters = $state(0);
	let gone = $derived(new Set(removalOrder.slice(0, lostLetters)));
	let damaged = $derived([...message].filter((_, i) => !gone.has(i)).join(''));
	let textVerdict = $derived(
		lostLetters === 0
			? 'All there.'
			: lostLetters === 1
				? 'One letter gone, and Ana gets 10 € instead of 150 €!'
				: lostLetters === 2
					? "…and now nobody knows what time it is."
					: 'It’s falling apart.'
	);

	// --- Picture: fewer colours, looks the same ------------------------------------------------
	const LEVELS = [256, 64, 32, 16, 8, 4, 2]; // shades per colour channel (red, green, blue)
	let levelIndex = $state(0);
	let levels = $derived(LEVELS[levelIndex]);
	let colours = $derived(levels ** 3);
	let canvas = $state();
	let base = null; // the original pixels
	let pngSize = $state(null);
	let originalPng = $state(null);

	const pngBytes = (c) => new Promise((r) => c.toBlob((b) => r(b?.size ?? null), 'image/png'));

	onMount(async () => {
		const ctx = canvas.getContext('2d');
		base = paintSunset(ctx, canvas.width, canvas.height);
		ctx.putImageData(base, 0, 0);
		originalPng = await pngBytes(canvas);
		pngSize = originalPng;
	});

	// Redraw with fewer colours whenever the slider moves
	$effect(() => {
		const L = levels;
		if (!canvas || !base) return;
		const out = new ImageData(new Uint8ClampedArray(base.data), base.width, base.height);
		if (L < 256) {
			const step = 255 / (L - 1);
			for (let i = 0; i < out.data.length; i++) {
				if (i % 4 !== 3) out.data[i] = Math.round(out.data[i] / step) * step;
			}
		}
		canvas.getContext('2d').putImageData(out, 0, 0);
		let stale = false;
		pngBytes(canvas).then((size) => !stale && (pngSize = size));
		return () => (stale = true);
	});

	const fmtColours = (n) =>
		n >= 1e6 ? `${(n / 1e6).toFixed(1)} million` : n >= 1000 ? `${Math.round(n / 1000)} thousand` : `${n}`;
	const kb = (n) => (n == null ? '…' : `${(n / 1024).toFixed(0)} KB`);
	let pictureVerdict = $derived(
		levels >= 32 ? 'Looks the same.' : levels >= 8 ? 'Look closely at the sky…' : 'Now you can tell.'
	);

	// --- Sound: notes ears can't hear ------------------------------------------------------------
	const notes = [
		{ name: 'A', freq: 220, level: 1 },
		{ name: 'B♭', freq: 233, level: 0.06, hidden: 'too quiet, right next to a loud note' },
		{ name: 'C♯', freq: 277, level: 0.8 },
		{ name: 'E', freq: 330, level: 0.75 },
		{ name: 'A', freq: 440, level: 0.5 },
		{ name: 'very high', freq: 17500, level: 0.08, hidden: 'too high for most ears' }
	];
	let dropped = $state(false);
	let playing = $state(false);
	let audio;
	let voice = null; // what's sounding now: { out, oscillators, hiddenGains, timer }
	const PLAY_FOR = 8; // seconds, then it fades out by itself
	const gainOf = (n) => n.level / 2.5;

	// One chord at a time. The hidden notes have their own volume, so the switch works mid-play.
	function start() {
		stop();
		audio ??= new AudioContext();
		const now = audio.currentTime;
		const out = audio.createGain();
		out.gain.setValueAtTime(0, now);
		out.gain.linearRampToValueAtTime(0.12, now + 0.05);
		out.gain.setValueAtTime(0.12, now + PLAY_FOR - 0.4);
		out.gain.linearRampToValueAtTime(0, now + PLAY_FOR);
		out.connect(audio.destination);
		const oscillators = [];
		const hiddenGains = [];
		for (const n of notes) {
			const osc = audio.createOscillator();
			const g = audio.createGain();
			osc.type = n.freq > 1000 ? 'sine' : 'triangle';
			osc.frequency.value = n.freq;
			g.gain.value = n.hidden && dropped ? 0 : gainOf(n);
			if (n.hidden) hiddenGains.push([g, n]);
			osc.connect(g).connect(out);
			osc.start(now);
			osc.stop(now + PLAY_FOR);
			oscillators.push(osc);
		}
		const timer = setTimeout(() => {
			voice = null;
			playing = false;
		}, PLAY_FOR * 1000);
		voice = { out, oscillators, hiddenGains, timer };
		playing = true;
	}

	function stop() {
		if (!voice) return;
		const now = audio.currentTime;
		voice.out.gain.cancelScheduledValues(now);
		voice.out.gain.setValueAtTime(voice.out.gain.value, now);
		voice.out.gain.linearRampToValueAtTime(0, now + 0.08);
		for (const osc of voice.oscillators) osc.stop(now + 0.1);
		clearTimeout(voice.timer);
		voice = null;
		playing = false;
	}

	// Flip the hidden notes on or off, even while the chord is playing
	function setDropped(value) {
		dropped = value;
		if (!voice) return;
		const now = audio.currentTime;
		for (const [g, n] of voice.hiddenGains) g.gain.setTargetAtTime(value ? 0 : gainOf(n), now, 0.03);
	}

	onMount(() => () => stop());
	let kept = $derived(dropped ? notes.filter((n) => !n.hidden).length : notes.length);
</script>

<div class="lossy">
	<div class="head">
		<div>
			<p class="step-label">Step 5 · Losing a little, on purpose</p>
			<h2 class="step-title">If you know what it is, you can throw some away</h2>
		</div>
		<p class="step-lede">
			gz works on anything because it never loses a thing. But if you know what kind of data you're
			squeezing, you can be smarter: <strong>don't send what nobody will notice</strong>. That works
			for some data, and is a disaster for other data. Try it.
		</p>
	</div>

	<div class="cards">
		<!-- Text -->
		<section class="card">
			<span class="label">Text</span>
			<h3>Lose some letters</h3>
			<div class="show text-show">
				<p class="message" class:broken={lostLetters > 0}>{damaged}</p>
				<p class="was">It said: {message}</p>
			</div>
			<label class="slider">
				<span>Letters lost: <strong>{lostLetters}</strong></span>
				<input type="range" min="0" max="10" bind:value={lostLetters} />
			</label>
			<p class="verdict" class:bad={lostLetters > 0}>{textVerdict}</p>
		</section>

		<!-- Picture -->
		<section class="card">
			<span class="label">A picture</span>
			<h3>Lose some colours</h3>
			<div class="show">
				<canvas bind:this={canvas} width="320" height="200" aria-label="A sunset, with fewer and fewer colours"></canvas>
			</div>
			<label class="slider">
				<span>Colours kept: <strong>{fmtColours(colours)}</strong> · {kb(pngSize)}</span>
				<input type="range" min="0" max={LEVELS.length - 1} bind:value={levelIndex} />
			</label>
			<p class="verdict" class:good={levels >= 32} class:bad={levels < 8}>{pictureVerdict}</p>
		</section>

		<!-- Sound -->
		<section class="card">
			<span class="label">A sound</span>
			<h3>Lose the notes nobody hears</h3>
			<div class="show notes" class:playing aria-label="The notes in a chord">
				{#each notes as n (n.freq)}
					<div class="note" class:hidden-note={n.hidden} class:dropped={dropped && n.hidden} title={n.hidden ?? ''}>
						<span class="level" style="--l: {n.hidden ? 0.3 : n.level}"></span>
						<span class="note-name">{n.name}</span>
					</div>
				{/each}
			</div>
			<div class="sound-controls">
				<button class="play" class:active={playing} onclick={() => (playing ? stop() : start())}>
					{playing ? '■ Stop' : '▶ Play'}
				</button>
				<div class="switch" role="group" aria-label="Which notes to play">
					<button class:on={!dropped} aria-pressed={!dropped} onclick={() => setDropped(false)}>All notes</button>
					<button class:on={dropped} aria-pressed={dropped} onclick={() => setDropped(true)}>Hidden ones off</button>
				</div>
			</div>
			<p class="verdict" class:good={dropped}>
				{dropped
					? `Kept ${kept} of ${notes.length} notes. Sounds the same.`
					: playing
						? 'Now flip the switch while it plays.'
						: 'Two of these notes you can’t really hear.'}
			</p>
		</section>
	</div>

	<div class="kinds">
		<div class="kind">
			<strong>Lossless</strong>
			<span>Everything comes back, exactly. A must for text, numbers and code. <em>That's gz.</em></span>
		</div>
		<div class="kind lossy-kind">
			<strong>Lossy</strong>
			<span>What you won't notice is gone for good. Fine for pictures and sound. <em>That's JPEG and MP3.</em></span>
		</div>
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

	.cards {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1.1rem;
		margin-top: 2rem;
	}
	.card {
		display: flex;
		flex-direction: column;
		padding: 0.9rem 1.1rem 1rem;
		border-radius: var(--radius);
		background: var(--card);
		border: var(--bw) solid var(--line);
	}
	.label {
		font-size: 0.72rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--accent);
		font-weight: 700;
	}
	h3 {
		margin: 0.3rem 0 0.8rem;
		font-size: 1.15rem;
	}
	.show {
		height: 10rem;
		border-radius: var(--radius-sm);
		overflow: hidden;
		background: var(--paper);
	}

	/* Text */
	.text-show {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0 1rem;
	}
	.message {
		margin: 0;
		font-size: 1.35rem;
		font-weight: 700;
		line-height: 1.3;
		letter-spacing: -0.01em;
	}
	.message.broken {
		color: var(--bad);
	}
	.was {
		margin: 0.6rem 0 0;
		font-size: 0.8rem;
		color: var(--muted);
	}

	/* Picture */
	canvas {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* Sound: one bar per note */
	.notes {
		display: flex;
		align-items: flex-end;
		gap: 0.4rem;
		padding: 0.8rem 0.8rem 0.5rem;
		box-sizing: border-box;
	}
	.note {
		flex: 1;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;
		gap: 0.3rem;
		transition: opacity 0.4s;
	}
	.level {
		width: 100%;
		height: calc(var(--l) * 100% - 1.3rem);
		min-height: 4px;
		border-radius: 4px 4px 0 0;
		background: var(--accent);
		transition: transform 0.4s;
		transform-origin: bottom;
	}
	.hidden-note .level {
		background: repeating-linear-gradient(45deg, var(--muted) 0 3px, transparent 3px 6px);
		outline: 1px dashed var(--muted);
	}
	.dropped {
		opacity: 0.15;
	}
	.dropped .level {
		transform: scaleY(0);
	}
	.note-name {
		font-size: 0.7rem;
		color: var(--ink-soft);
		white-space: nowrap;
	}
	.sound-controls {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin-top: 0.9rem;
	}
	.sound-controls {
		align-items: center;
	}
	.play {
		flex: 0 0 auto;
		min-width: 5.2rem;
		font: inherit;
		font-size: 0.85rem;
		padding: 0.4rem 0.9rem;
		border-radius: var(--pill);
		border: 0;
		background: var(--accent);
		color: white;
		cursor: pointer;
	}
	.play:hover {
		background: var(--accent-hover);
	}
	.play.active {
		background: var(--ink);
	}
	/* Two-way switch */
	.switch {
		display: inline-flex;
		padding: 3px;
		border-radius: var(--pill);
		background: var(--track);
	}
	.switch button {
		font: inherit;
		font-size: 0.8rem;
		padding: 0.3rem 0.7rem;
		border: 0;
		border-radius: var(--pill);
		background: none;
		color: var(--ink-soft);
		cursor: pointer;
		white-space: nowrap;
		transition:
			background 0.2s,
			color 0.2s;
	}
	.switch button.on {
		background: var(--card);
		color: var(--ink);
		box-shadow: var(--shadow);
	}
	/* While it plays, the bars hum along */
	.notes.playing .note:not(.dropped) .level {
		animation: hum 0.6s ease-in-out infinite alternate;
	}
	.notes.playing .note:nth-child(even) .level {
		animation-delay: 0.3s;
	}
	@keyframes hum {
		to {
			transform: scaleY(0.92);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.notes.playing .level {
			animation: none !important;
		}
	}

	/* Sliders */
	.slider {
		display: grid;
		gap: 0.3rem;
		margin-top: 0.9rem;
		font-size: 0.85rem;
		color: var(--ink-soft);
	}
	.slider strong {
		color: var(--ink);
	}
	input[type='range'] {
		width: 100%;
		accent-color: var(--accent);
	}
	.verdict {
		margin: 0.6rem 0 0;
		min-height: 2.6em;
		font-size: 0.92rem;
		font-weight: 700;
		line-height: 1.35;
		color: var(--ink-soft);
	}
	.verdict.good {
		color: var(--good);
	}
	.verdict.bad {
		color: var(--bad);
	}

	/* Lossless vs lossy */
	.kinds {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1.1rem;
		margin-top: 1.25rem;
	}
	.kind {
		display: grid;
		gap: 0.2rem;
		padding: 0.8rem 1.1rem;
		border-radius: var(--radius);
		background: var(--accent-soft);
		line-height: 1.5;
	}
	.kind strong {
		font-size: 1.05rem;
		color: var(--accent);
	}
	.kind span {
		color: var(--ink-soft);
	}
	.kind em {
		font-style: normal;
		color: var(--ink);
	}
	.lossy-kind {
		background: color-mix(in srgb, var(--cool) 22%, var(--card));
	}
	.lossy-kind strong {
		color: var(--tag-ink);
	}

	@media (max-width: 960px) {
		.cards {
			grid-template-columns: minmax(0, 1fr);
		}
		.show {
			height: 11rem;
		}
	}
	@media (max-width: 860px) {
		.head,
		.kinds {
			grid-template-columns: minmax(0, 1fr);
		}
		.step-lede {
			margin-top: 1rem;
		}
	}
</style>
