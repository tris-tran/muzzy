<script>
	// A record player and a speaker, as a flat animated diagram. The groove wiggles the needle; on
	// top of the needle sits a tiny magnet inside a coil, and the wiggling magnet makes a current
	// in the coil. That current (the same wiggle, now electrical) flows through the amplifier,
	// which makes it stronger, into the speaker's coil. There the current pushes against a magnet,
	// the coil moves the cone, and the cone makes sound. Slowed way down.
	//   playing – pause with false
	import { onMount } from 'svelte';
	import Driver from './Driver.svelte';
	import { groove, pulses, animate } from './groove.js';

	let { playing = true } = $props();

	const W = 900;
	const H = 430;
	const NEEDLE_X = 150;
	const GROOVE_Y = 374;
	const WIRE_Y = 250;
	const CARTRIDGE_RIGHT = 188;
	const AMP = [400, 490]; // left and right edge
	const SPEAKER_X = 640; // centre of the speaker's pole
	const SPEAKER_IN = SPEAKER_X - 50; // where the wire reaches the magnet
	const BEFORE = 0.7; // how big the signal looks before the amplifier…
	const AFTER = 1.8; // …and after it

	let scroll = $state(0);

	onMount(() => {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) playing = false;
		return animate((px) => (scroll += px), () => playing);
	});

	// The needle reads the groove at u; the signal takes a moment to travel down the wire, so a
	// point d px along the wire carries what the needle read d px of groove ago
	let u = $derived(NEEDLE_X + scroll);
	let push = $derived(groove(u));
	const wireLength = (x) => (x <= AMP[0] ? x - CARTRIDGE_RIGHT : AMP[0] - CARTRIDGE_RIGHT + x - AMP[1]);
	let speakerPush = $derived(groove(u - wireLength(SPEAKER_IN)) * 0.9);

	let groovePath = $derived.by(() => {
		let d = '';
		for (let x = 0; x <= 320; x += 4) d += `${x ? 'L' : 'M'}${x},${(GROOVE_Y - groove(x + scroll)).toFixed(1)}`;
		return d;
	});
	const signal = (from, to, size) => {
		let d = '';
		for (let x = from; x <= to; x += 3) d += `${x === from ? 'M' : 'L'}${x},${(WIRE_Y - groove(u - wireLength(x)) * size).toFixed(1)}`;
		return d;
	};
	let signalIn = $derived(signal(CARTRIDGE_RIGHT, AMP[0], BEFORE));
	let signalOut = $derived(signal(AMP[1], SPEAKER_IN, AFTER));

	// Sound leaving the cone: arcs, one per push
	let sound = $derived(
		pulses(u - wireLength(SPEAKER_IN))
			.filter((p) => p.dist < 260)
			.map((p) => {
				const r = 70 + p.dist;
				const a = (50 * Math.PI) / 180;
				const cx = SPEAKER_X + 40;
				return {
					k: p.k,
					d: `M${cx + r * Math.cos(-a)},${WIRE_Y + r * Math.sin(-a)} A${r},${r} 0 0 1 ${cx + r * Math.cos(a)},${WIRE_Y + r * Math.sin(a)}`,
					opacity: (0.25 + p.strength * 0.75) * (1 - p.dist / 260),
					width: 2 + p.strength * 3
				};
			})
	);
</script>

<div class="anim">
	<svg viewBox="0 0 {W} {H}" role="img" aria-label="Animated diagram: the needle moves a magnet inside a coil, making a current; the amplifier makes it stronger; in the speaker the current moves a coil and cone, which makes sound">
		<defs>
			<clipPath id="chain-room"><rect x={SPEAKER_X + 108} width={W} height={H} /></clipPath>
		</defs>

		<!-- Tone arm and cartridge: a tiny magnet on top of the needle, inside a coil -->
		<line class="arm" x1="0" y1="236" x2="112" y2="236" />
		<rect class="cartridge" x="112" y="214" width="76" height="78" rx="8" />
		<line class="needle" x1={NEEDLE_X} y1={260 - push} x2={NEEDLE_X} y2={GROOVE_Y - push} />
		<rect class="north" x={NEEDLE_X - 9} y={236 - push} width="18" height="12" />
		<rect class="south" x={NEEDLE_X - 9} y={248 - push} width="18" height="12" />
		{#each [234, 244, 254, 264] as y (y)}
			<ellipse class="winding" cx={NEEDLE_X} cy={y} rx="24" ry="5" />
		{/each}

		<!-- Record and groove -->
		<rect class="record" x="0" y="330" width="320" height="88" rx="8" />
		<path class="groove" d={groovePath} />
		<circle class="tip" cx={NEEDLE_X} cy={GROOVE_Y - push} r="5" />

		<!-- Wires, carrying the same wiggle as electricity -->
		<line class="wire" x1={CARTRIDGE_RIGHT} y1={WIRE_Y} x2={AMP[0]} y2={WIRE_Y} />
		<line class="wire" x1={AMP[1]} y1={WIRE_Y} x2={SPEAKER_IN} y2={WIRE_Y} />
		<path class="signal" d={signalIn} />
		<path class="signal strong" d={signalOut} />

		<!-- Amplifier -->
		<rect class="amp" x={AMP[0]} y="215" width={AMP[1] - AMP[0]} height="70" rx="10" />
		<text class="amp-text" x={(AMP[0] + AMP[1]) / 2} y="255">Amplifier</text>

		<!-- Speaker, and the sound it makes -->
		<Driver x={SPEAKER_X} y={WIRE_Y} push={speakerPush} />
		<g clip-path="url(#chain-room)">
			{#each sound as p (p.k)}
				<path class="pulse" d={p.d} style="opacity: {p.opacity}; stroke-width: {p.width}" />
			{/each}
		</g>

		<!-- Labels -->
		<g class="labels">
			<text class="on-dark" x="12" y="408">1 · Groove</text>
			<text x="60" y="166">2 · The needle wiggles a magnet</text>
			<text x="60" y="184">inside a coil → electricity</text>
			<text x="200" y="222">3 · Now it's electricity</text>
			<text x="372" y="312">4 · Amplifier: makes it stronger</text>
			<text x="500" y="92">5 · The current in the coil pushes</text>
			<text x="500" y="110">against the magnet → the cone moves</text>
			<text x="790" y="400">6 · Sound</text>
		</g>
	</svg>
	<div class="bar">
		<button onclick={() => (playing = !playing)}>{playing ? '❚❚ Pause' : '▶ Play'}</button>
		<span>Slowed way down. The red and blue block is the tiny magnet on the needle.</span>
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
	.arm {
		stroke: #94a3b8;
		stroke-width: 8;
		stroke-linecap: round;
	}
	.cartridge {
		fill: #334155;
	}
	.needle {
		stroke: #94a3b8;
		stroke-width: 4;
		stroke-linecap: round;
	}
	.north {
		fill: #dc2626;
	}
	.south {
		fill: #2563eb;
	}
	.winding {
		fill: none;
		stroke: #d07a3a;
		stroke-width: 2.5;
	}
	.record {
		fill: #1f2937;
	}
	.groove {
		fill: none;
		stroke: #cbd5e1;
		stroke-width: 2.5;
		stroke-linejoin: round;
	}
	.tip {
		fill: var(--bad);
	}
	.wire {
		stroke: #d07a3a;
		stroke-width: 3;
		opacity: 0.45;
	}
	.signal {
		fill: none;
		stroke: var(--accent);
		stroke-width: 2.5;
		stroke-linejoin: round;
	}
	.signal.strong {
		stroke-width: 3.5;
	}
	.amp {
		fill: var(--ink);
	}
	.amp-text {
		font-family: var(--font-body);
		font-size: 14px;
		font-weight: 700;
		fill: var(--on-dark);
		text-anchor: middle;
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
	}
	.labels .on-dark {
		fill: #cbd5e1;
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
