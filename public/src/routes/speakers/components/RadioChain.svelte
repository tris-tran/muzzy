<script>
	// Radio, as a flat animated diagram. The station sends the electrical wiggle out as a radio
	// wave: invisible, fast, and stronger or weaker in the shape of the sound. The antenna catches
	// it as a tiny current, the radio picks out the station and makes it stronger, and the speaker
	// turns it into sound. No frequencies here on purpose. Slowed way down.
	//   playing – pause with false
	import { onMount } from 'svelte';
	import Driver from './Driver.svelte';
	import { groove, pulses, MAX_AMP, animate } from './groove.js';

	let { playing = true } = $props();

	const W = 900;
	const H = 380;
	const TOWER = { x: 90, y: 92 }; // top of the station's mast
	const ANTENNA = { x: 486, y: 92 }; // top of the radio's antenna
	const REACH = ANTENNA.x - TOWER.x - 8;
	const SPACING = 14; // px between radio-wave arcs
	const RADIO_SPEED = 3; // radio waves move much faster than the groove scrolls
	const WIRE = [600, 640]; // radio's output → speaker's magnet
	const Y = 250;
	const SPEAKER_X = 690;

	let scroll = $state(0);

	onMount(() => {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) playing = false;
		return animate((px) => (scroll += px), () => playing);
	});

	// Radio-wave arcs: each one carries how loud the sound was when it left the station
	let waves = $derived.by(() => {
		const list = [];
		const offset = (scroll * RADIO_SPEED) % SPACING;
		for (let r = offset + 10; r < REACH; r += SPACING) {
			const k = Math.round((scroll * RADIO_SPEED - r) / SPACING);
			const loud = 0.5 + groove(scroll - r / RADIO_SPEED) / (2 * MAX_AMP); // 0 … 1
			const a = (20 * Math.PI) / 180;
			list.push({
				k,
				d: `M${TOWER.x + r * Math.cos(-a)},${TOWER.y + r * Math.sin(-a)} A${r},${r} 0 0 1 ${TOWER.x + r * Math.cos(a)},${TOWER.y + r * Math.sin(a)}`,
				opacity: 0.08 + loud * 0.6,
				width: 0.8 + loud * 2.2
			});
		}
		return list;
	});

	// What the antenna and the speaker get: the sound, delayed by the trip
	const delay = REACH / RADIO_SPEED;
	let antennaWiggle = $derived(groove(scroll - delay));
	let push = $derived(groove(scroll - delay - 20) * 0.9);
	let signal = $derived.by(() => {
		let d = '';
		for (let x = WIRE[0]; x <= WIRE[1]; x += 2) d += `${x === WIRE[0] ? 'M' : 'L'}${x},${(Y - groove(scroll - delay - (x - WIRE[0]) / 2) * 1.2).toFixed(1)}`;
		return d;
	});
	let sound = $derived(
		pulses(scroll - delay - 20)
			.filter((p) => p.dist < 150)
			.map((p) => {
				const r = 70 + p.dist;
				const a = (50 * Math.PI) / 180;
				const cx = SPEAKER_X + 40;
				return {
					k: p.k,
					d: `M${cx + r * Math.cos(-a)},${Y + r * Math.sin(-a)} A${r},${r} 0 0 1 ${cx + r * Math.cos(a)},${Y + r * Math.sin(a)}`,
					opacity: (0.25 + p.strength * 0.75) * (1 - p.dist / 150),
					width: 2 + p.strength * 3
				};
			})
	);
</script>

<div class="anim">
	<svg viewBox="0 0 {W} {H}" role="img" aria-label="A radio station sends the sound as an invisible radio wave; the radio's antenna catches it, the radio makes it stronger, and the speaker plays it">
		<defs>
			<clipPath id="radio-air"><rect x={TOWER.x} width={REACH + 4} height={H} /></clipPath>
			<clipPath id="radio-room"><rect x={SPEAKER_X + 108} width={W} height={H} /></clipPath>
		</defs>

		<!-- The station: a mast and its building -->
		<path class="mast" d="M{TOWER.x},{TOWER.y} L{TOWER.x - 34},330 M{TOWER.x},{TOWER.y} L{TOWER.x + 34},330 M{TOWER.x - 26},300 L{TOWER.x + 22},250 M{TOWER.x + 26},300 L{TOWER.x - 22},250 M{TOWER.x - 17},220 L{TOWER.x + 12},170 M{TOWER.x + 17},220 L{TOWER.x - 12},170" />
		<circle class="beacon" cx={TOWER.x} cy={TOWER.y} r="6" />
		<line class="ground" x1="20" y1="330" x2="180" y2="330" />

		<!-- Radio waves through the air -->
		<g clip-path="url(#radio-air)">
			{#each waves as w (w.k)}
				<path class="radio" d={w.d} style="opacity: {w.opacity}; stroke-width: {w.width}" />
			{/each}
		</g>

		<!-- The radio: antenna on top, a box that picks the station and makes it stronger -->
		<line class="antenna" x1={ANTENNA.x} y1={ANTENNA.y} x2={ANTENNA.x + 6} y2="206" />
		<circle class="antenna-tip" cx={ANTENNA.x} cy={ANTENNA.y} r={4 + Math.abs(antennaWiggle) / 6} />
		<rect class="radio-box" x="440" y="200" width="160" height="100" rx="12" />
		<rect class="dial" x="456" y="216" width="128" height="20" rx="4" />
		<line class="needle" x1="508" y1="218" x2="508" y2="234" />
		<text class="box-text" x="520" y="268">Radio</text>
		<text class="box-sub" x="520" y="286">tuned to one station</text>

		<!-- To the speaker -->
		<line class="wire" x1={WIRE[0]} y1={Y} x2={WIRE[1]} y2={Y} />
		<path class="signal" d={signal} />
		<Driver x={SPEAKER_X} y={Y} {push} />
		<g clip-path="url(#radio-room)">
			{#each sound as p (p.k)}
				<path class="pulse" d={p.d} style="opacity: {p.opacity}; stroke-width: {p.width}" />
			{/each}
		</g>

		<g class="labels">
			<text x="20" y="40">1 · The station turns sound into electricity,</text>
			<text x="20" y="58">then sends it out as a radio wave</text>
			<text x="230" y="190">2 · An invisible radio wave, stronger and</text>
			<text x="230" y="208">weaker in the shape of the sound</text>
			<text x="500" y="88">3 · The antenna catches it</text>
			<text x="500" y="106">as a tiny electrical wiggle</text>
			<text x="440" y="330">4 · The radio makes it stronger</text>
			<text x="800" y="370">5 · Sound</text>
		</g>
	</svg>
	<div class="bar">
		<button onclick={() => (playing = !playing)}>{playing ? '❚❚ Pause' : '▶ Play'}</button>
		<span><span class="swatch radio-swatch"></span> radio wave · <span class="swatch sound-swatch"></span> sound</span>
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
	.mast {
		fill: none;
		stroke: #64748b;
		stroke-width: 4;
		stroke-linecap: round;
	}
	.beacon {
		fill: #e11d48;
	}
	.ground {
		stroke: var(--line);
		stroke-width: 3;
	}
	.radio {
		fill: none;
		stroke: #0ea5e9;
		stroke-linecap: round;
	}
	.antenna {
		stroke: #64748b;
		stroke-width: 3;
		stroke-linecap: round;
	}
	.antenna-tip {
		fill: #0ea5e9;
	}
	.radio-box {
		fill: #334155;
	}
	.dial {
		fill: #e5e7eb;
	}
	.needle {
		stroke: #e11d48;
		stroke-width: 2;
	}
	.box-text,
	.box-sub {
		font-family: var(--font-body);
		fill: var(--on-dark);
		text-anchor: middle;
	}
	.box-text {
		font-size: 15px;
		font-weight: 700;
	}
	.box-sub {
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
