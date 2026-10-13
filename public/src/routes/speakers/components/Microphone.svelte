<script>
	// A microphone, as a flat animated diagram: the same driver as the speaker, run backwards.
	// Sound arrives and pushes the cone; the cone moves the coil inside the magnet; the moving coil
	// makes a current: the wiggle, as electricity, ready to be stored. Slowed way down.
	//   playing – pause with false
	import { onMount } from 'svelte';
	import Driver from './Driver.svelte';
	import { groove, amp, MAX_AMP, WAVELENGTH, SCROLL, SOUND, animate } from './groove.js';

	let { playing = true } = $props();

	const W = 900;
	const H = 380;
	const Y = 200;
	const SOURCE_X = 20; // where the sound starts
	const MIC_X = 340; // centre of the microphone's pole; its cone opens to the left
	const RIM_X = MIC_X - 100;
	const REACH = RIM_X - SOURCE_X; // how far the sound travels before it hits the cone
	const WIRE_FROM = MIC_X + 50;
	const RECORDER = [700, 860];

	let scroll = $state(0);

	onMount(() => {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) playing = false;
		return animate((px) => (scroll += px), () => playing);
	});

	// The cone moves with the sound arriving right now; the wire carries what arrived earlier
	let push = $derived(-groove(scroll) * 0.9);

	let signal = $derived.by(() => {
		let d = '';
		for (let x = WIRE_FROM; x <= RECORDER[0]; x += 3) d += `${x === WIRE_FROM ? 'M' : 'L'}${x},${(Y - groove(scroll - (x - WIRE_FROM)) * 0.9).toFixed(1)}`;
		return d;
	});

	// Sound on its way in: one arc per push that hasn't reached the cone yet
	let incoming = $derived.by(() => {
		const list = [];
		const first = Math.ceil(scroll / WAVELENGTH - 0.25);
		for (let k = first; ; k++) {
			const born = (k + 0.25) * WAVELENGTH;
			const left = ((born - scroll) / SCROLL) * SOUND; // distance still to go
			if (left > REACH) break;
			const r = REACH - left + 10;
			const a = (40 * Math.PI) / 180;
			const strength = amp(born) / MAX_AMP;
			list.push({
				k,
				d: `M${SOURCE_X + r * Math.cos(-a)},${Y + r * Math.sin(-a)} A${r},${r} 0 0 1 ${SOURCE_X + r * Math.cos(a)},${Y + r * Math.sin(a)}`,
				opacity: 0.3 + strength * 0.7,
				width: 2 + strength * 3
			});
		}
		return list;
	});
</script>

<div class="anim">
	<svg viewBox="0 0 {W} {H}" role="img" aria-label="Animated diagram: sound pushes a microphone's cone, the coil moves inside the magnet and makes a current, which goes to a recorder">
		<defs>
			<clipPath id="mic-room"><rect width={RIM_X + 4} height={H} /></clipPath>
		</defs>

		<g clip-path="url(#mic-room)">
			{#each incoming as p (p.k)}
				<path class="pulse" d={p.d} style="opacity: {p.opacity}; stroke-width: {p.width}" />
			{/each}
		</g>

		<Driver x={MIC_X} y={Y} {push} facing={-1} />

		<line class="wire" x1={WIRE_FROM} y1={Y} x2={RECORDER[0]} y2={Y} />
		<path class="signal" d={signal} />

		<rect class="recorder" x={RECORDER[0]} y={Y - 45} width={RECORDER[1] - RECORDER[0]} height="90" rx="10" />
		<text class="rec-title" x={(RECORDER[0] + RECORDER[1]) / 2} y={Y - 4}>Recorder</text>
		<text class="rec-sub" x={(RECORDER[0] + RECORDER[1]) / 2} y={Y + 18}>groove · tape · file</text>

		<g class="labels">
			<text x="20" y="60">1 · Sound pushes the cone</text>
			<text x="250" y="350">2 · The coil moves inside the magnet → electricity</text>
			<text x="430" y="160">3 · The same wiggle, as electricity</text>
			<text x="700" y="275">4 · Stored for later</text>
		</g>
	</svg>
	<div class="bar">
		<button onclick={() => (playing = !playing)}>{playing ? '❚❚ Pause' : '▶ Play'}</button>
		<span>Same parts as the speaker, used the other way round.</span>
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
	.pulse {
		fill: none;
		stroke: var(--accent);
		stroke-linecap: round;
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
		stroke-linejoin: round;
	}
	.recorder {
		fill: var(--ink);
	}
	.rec-title,
	.rec-sub {
		font-family: var(--font-body);
		fill: var(--on-dark);
		text-anchor: middle;
	}
	.rec-title {
		font-size: 15px;
		font-weight: 700;
	}
	.rec-sub {
		font-size: 12px;
		opacity: 0.7;
	}
	.labels text {
		font-family: var(--font-body);
		font-size: 15px;
		fill: var(--ink-soft);
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
