<script>
	// Bluetooth, as a flat animated diagram. The phone reads the numbers from the file and sends
	// them through the air with a tiny, short-range radio. Inside the speaker, a chip turns the
	// numbers back into the electrical wiggle (the job the phone's headphone jack used to do), and
	// the coil, magnet and cone play it as always. Slowed way down.
	//   playing – pause with false
	import { onMount } from 'svelte';
	import Driver from './Driver.svelte';
	import { groove, pulses, MAX_AMP, animate } from './groove.js';

	let { playing = true } = $props();

	const W = 900;
	const H = 380;
	const Y = 200;
	const AIR = [160, 468]; // from the phone to the speaker's chip
	const STEP = 18; // px of groove between two numbers
	const AIR_SPEED = 2.4; // how fast the numbers fly, relative to the groove
	const CHIP = [490, 600];
	const WIRE = [600, 640];
	const SPEAKER_X = 690;

	let scroll = $state(0);

	onMount(() => {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) playing = false;
		return animate((px) => (scroll += px), () => playing);
	});

	const value = (u) => Math.round((groove(u) / MAX_AMP) * 100);

	// Each number leaves the phone when the song reaches it, and flies to the speaker
	let numbers = $derived.by(() => {
		const list = [];
		for (let k = Math.floor(scroll / STEP); k >= 0; k--) {
			const u = k * STEP;
			const x = AIR[0] + (scroll - u) * AIR_SPEED;
			if (x > AIR[1]) break;
			list.push({ k, x, y: Y - 8 + (k % 2 ? 14 : -14), n: value(u) });
		}
		return list;
	});

	// Faint radio waves around them
	let waves = $derived.by(() => {
		const list = [];
		const spacing = 22;
		const offset = (scroll * AIR_SPEED * 1.5) % spacing;
		for (let r = offset + 12; r < AIR[1] - AIR[0]; r += spacing) {
			const a = (22 * Math.PI) / 180;
			const cx = AIR[0] - 12;
			list.push({
				k: Math.round((scroll * AIR_SPEED * 1.5 - r) / spacing),
				d: `M${cx + r * Math.cos(-a)},${Y + r * Math.sin(-a)} A${r},${r} 0 0 1 ${cx + r * Math.cos(a)},${Y + r * Math.sin(a)}`
			});
		}
		return list;
	});

	// The chip plays what arrived a moment ago
	const delay = (AIR[1] - AIR[0]) / AIR_SPEED;
	let push = $derived(groove(scroll - delay - 20) * 0.9);
	let signal = $derived.by(() => {
		let d = '';
		for (let x = WIRE[0]; x <= WIRE[1]; x += 2) d += `${x === WIRE[0] ? 'M' : 'L'}${x},${(Y - groove(scroll - delay - (x - WIRE[0]) / 2) * 1.2).toFixed(1)}`;
		return d;
	});
	let sound = $derived(
		pulses(scroll - delay - 20)
			.filter((p) => p.dist < 120)
			.map((p) => {
				const r = 70 + p.dist;
				const a = (50 * Math.PI) / 180;
				const cx = SPEAKER_X + 40;
				return {
					k: p.k,
					d: `M${cx + r * Math.cos(-a)},${Y + r * Math.sin(-a)} A${r},${r} 0 0 1 ${cx + r * Math.cos(a)},${Y + r * Math.sin(a)}`,
					opacity: (0.25 + p.strength * 0.75) * (1 - p.dist / 120),
					width: 2 + p.strength * 3
				};
			})
	);
</script>

<div class="anim">
	<svg viewBox="0 0 {W} {H}" role="img" aria-label="A phone sends the song's numbers by Bluetooth radio; a chip in the speaker turns them back into the electrical wiggle; the speaker plays it">
		<defs>
			<clipPath id="bt-air"><rect x={AIR[0]} width={AIR[1] - AIR[0]} height={H} /></clipPath>
			<clipPath id="bt-room"><rect x={SPEAKER_X + 108} width={W} height={H} /></clipPath>
		</defs>

		<!-- Phone -->
		<rect class="phone" x="50" y="90" width="100" height="200" rx="16" />
		<rect class="screen" x="59" y="106" width="82" height="154" rx="5" />
		<text class="file" x="100" y="180">♪ song.mp3</text>
		<path class="bt" d="M92,204 L108,218 L100,226 V196 L108,204 L92,218" />

		<!-- Bluetooth through the air: faint radio waves carrying the numbers -->
		<g clip-path="url(#bt-air)">
			{#each waves as w (w.k)}
				<path class="radio" d={w.d} />
			{/each}
			{#each numbers as t (t.k)}
				<g transform="translate({t.x} {t.y})">
					<rect class="tag" x="-19" y="-10" width="38" height="20" rx="10" />
					<text class="tag-text" y="4">{t.n}</text>
				</g>
			{/each}
		</g>

		<!-- The speaker: a box with a Bluetooth chip, a short wire and the driver inside -->
		<rect class="housing" x="472" y="62" width="356" height="276" rx="38" />
		<rect class="chip" x={CHIP[0]} y={Y - 42} width={CHIP[1] - CHIP[0]} height="84" rx="8" />
		<text class="chip-text" x={(CHIP[0] + CHIP[1]) / 2} y={Y - 6}>Bluetooth chip</text>
		<text class="chip-sub" x={(CHIP[0] + CHIP[1]) / 2} y={Y + 14}>numbers → wiggle</text>
		<line class="wire" x1={WIRE[0]} y1={Y} x2={WIRE[1]} y2={Y} />
		<path class="signal" d={signal} />
		<Driver x={SPEAKER_X} y={Y} {push} />
		<g clip-path="url(#bt-room)">
			{#each sound as p (p.k)}
				<path class="pulse" d={p.d} style="opacity: {p.opacity}; stroke-width: {p.width}" />
			{/each}
		</g>

		<g class="labels">
			<text x="20" y="40">1 · The phone reads the numbers</text>
			<text x="20" y="58">from the song file</text>
			<text x="180" y="300">2 · Bluetooth: a tiny radio,</text>
			<text x="180" y="318">carrying the numbers through the air</text>
			<text x="490" y="40">3 · A chip turns the numbers back into</text>
			<text x="490" y="58">the electrical wiggle, and makes it stronger</text>
			<text x="640" y="362">4 · Coil + magnet + cone, as always</text>
			<text class="end" x="894" y="112">5 · Sound</text>
		</g>
	</svg>
	<div class="bar">
		<button onclick={() => (playing = !playing)}>{playing ? '❚❚ Pause' : '▶ Play'}</button>
		<span><span class="swatch radio-swatch"></span> radio · <span class="swatch sound-swatch"></span> sound</span>
	</div>
</div>

<style>
	.anim {
		border-radius: var(--radius-lg);
		border: var(--bw) solid var(--line);
		background: var(--card);
		padding: 1rem 1rem 0.9rem;
	}
	svg {
		display: block;
		width: 100%;
		height: auto;
	}
	.phone {
		fill: #0f172a;
	}
	.screen {
		fill: #1e293b;
	}
	.file {
		font-family: var(--font-mono);
		font-size: 12px;
		fill: #cbd5e1;
		text-anchor: middle;
	}
	.bt {
		fill: none;
		stroke: #0ea5e9;
		stroke-width: 2.5;
		stroke-linejoin: round;
		stroke-linecap: round;
	}
	.radio {
		fill: none;
		stroke: #0ea5e9;
		stroke-width: 1.5;
		opacity: 0.25;
	}
	.tag {
		fill: #e0f2fe;
		stroke: #0ea5e9;
		stroke-width: 1.5;
	}
	.tag-text {
		font-family: var(--font-mono);
		font-size: 11px;
		fill: #0c4a6e;
		text-anchor: middle;
	}
	.housing {
		fill: color-mix(in srgb, var(--track) 70%, transparent);
		stroke: #334155;
		stroke-width: 3;
	}
	.chip {
		fill: #0f172a;
	}
	.chip-text,
	.chip-sub {
		font-family: var(--font-body);
		fill: var(--on-dark);
		text-anchor: middle;
	}
	.chip-text {
		font-size: 12px;
		font-weight: 700;
	}
	.chip-sub {
		font-size: 11px;
		opacity: 0.75;
	}
	.wire {
		stroke: #d07a3a;
		stroke-width: 3;
		opacity: 0.45;
	}
	.signal {
		fill: none;
		stroke: var(--accent);
		stroke-width: 3;
	}
	.pulse {
		fill: none;
		stroke: var(--accent);
		stroke-linecap: round;
	}
	.labels text {
		font-family: var(--font-body);
		font-size: 15px;
		fill: var(--ink-soft);
		/* A white outline keeps labels readable over the waves */
		paint-order: stroke;
		stroke: var(--card);
		stroke-width: 5px;
		stroke-linejoin: round;
	}
	.labels .end {
		text-anchor: end;
	}
	.bar {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
		margin-top: 0.6rem;
		font-size: 0.9rem;
		color: var(--ink-soft);
	}
	.swatch {
		display: inline-block;
		width: 0.9rem;
		height: 0.25rem;
		border-radius: 2px;
		vertical-align: middle;
	}
	.radio-swatch {
		background: #0ea5e9;
	}
	.sound-swatch {
		background: var(--accent);
	}
	button {
		font: inherit;
		padding: 0.4rem 1rem;
		border-radius: var(--pill);
		border: var(--bw) solid var(--ink-soft);
		background: none;
		color: var(--ink);
		cursor: pointer;
	}
</style>
