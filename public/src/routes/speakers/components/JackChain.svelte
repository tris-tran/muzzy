<script>
	// Any source → cable → speaker, as a flat animated diagram. The speaker only needs the
	// electrical wiggle; it doesn't care if a needle, a microphone or a phone made it. Pick the
	// source with `source`; the wiggle on the cable and the speaker stay exactly the same.
	//   source  – 'record', 'mic' or 'phone'
	//   playing – pause with false
	import { onMount } from 'svelte';
	import Driver from './Driver.svelte';
	import { groove, pulses, animate } from './groove.js';

	let { source = 'phone', playing = true } = $props();

	const W = 900;
	const H = 360;
	const Y = 180;
	const CABLE = [250, 590];
	const SPEAKER_X = 640;

	let scroll = $state(0);

	onMount(() => {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) playing = false;
		return animate((px) => (scroll += px), () => playing);
	});

	let signal = $derived.by(() => {
		let d = '';
		for (let x = CABLE[0]; x <= CABLE[1]; x += 3)
			d += `${x === CABLE[0] ? 'M' : 'L'}${x},${(Y - groove(scroll - (x - CABLE[0])) * 1.6).toFixed(1)}`;
		return d;
	});
	let push = $derived(groove(scroll - (CABLE[1] - CABLE[0])) * 0.9);
	let sound = $derived(
		pulses(scroll - (CABLE[1] - CABLE[0]))
			.filter((p) => p.dist < 200)
			.map((p) => {
				const r = 70 + p.dist;
				const a = (50 * Math.PI) / 180;
				const cx = SPEAKER_X + 40;
				return {
					k: p.k,
					d: `M${cx + r * Math.cos(-a)},${Y + r * Math.sin(-a)} A${r},${r} 0 0 1 ${cx + r * Math.cos(a)},${Y + r * Math.sin(a)}`,
					opacity: (0.25 + p.strength * 0.75) * (1 - p.dist / 200),
					width: 2 + p.strength * 3
				};
			})
	);

	// Where each source's lead comes out, curving over to the cable's plug
	const outlets = { record: [240, 250], mic: [170, 270], phone: [170, 273] };
	let lead = $derived.by(() => {
		const [x, y] = outlets[source];
		return `M${x},${y} C${x},${y + 50} ${CABLE[0] - 70},${Y} ${CABLE[0] - 14},${Y}`;
	});

	// The record spins: a mark on it goes round
	let spin = $derived((scroll / 3) % 360);
</script>

<svg viewBox="0 0 {W} {H}" role="img" aria-label="A source sends the electrical wiggle down a cable to a speaker">
	<defs>
		<clipPath id="jack-room"><rect x={SPEAKER_X + 108} width={W} height={H} /></clipPath>
	</defs>

	<!-- The source -->
	{#if source === 'record'}
		<g class="source">
			<rect class="plinth" x="40" y="80" width="200" height="200" rx="14" />
			<circle class="disc" cx="130" cy="180" r="78" />
			<circle class="groove-ring" cx="130" cy="180" r="60" />
			<circle class="groove-ring" cx="130" cy="180" r="44" />
			<circle class="label" cx="130" cy="180" r="18" />
			<line class="mark" x1="130" y1="180" x2="130" y2="106" transform="rotate({spin} 130 180)" />
			<path class="tonearm" d="M226,96 L214,200 L180,226" />
		</g>
	{:else if source === 'mic'}
		<g class="source">
			<rect class="mic-head" x="105" y="70" width="70" height="110" rx="35" />
			{#each [92, 108, 124, 140, 156] as y (y)}<line class="grille" x1="112" y1={y} x2="168" y2={y} />{/each}
			<path class="stand" d="M90,150 Q90,215 140,215 Q190,215 190,150 M140,215 V270 M110,270 H170" />
		</g>
	{:else}
		<g class="source">
			<rect class="phone" x="85" y="60" width="110" height="220" rx="18" />
			<rect class="screen" x="95" y="78" width="90" height="170" rx="6" />
			<text class="file" x="140" y="160">♪ song.wav</text>
			<circle class="jack" cx="170" cy="268" r="5" />
		</g>
	{/if}

	<!-- The cable with its plugs, carrying the wiggle -->
	<path class="lead" d={lead} />
	<rect class="plug" x={CABLE[0] - 14} y={Y - 8} width="18" height="16" rx="3" />
	<line class="cable" x1={CABLE[0]} y1={Y} x2={CABLE[1]} y2={Y} />
	<path class="signal" d={signal} />

	<!-- Speaker and sound -->
	<Driver x={SPEAKER_X} y={Y} {push} />
	<g clip-path="url(#jack-room)">
		{#each sound as p (p.k)}
			<path class="pulse" d={p.d} style="opacity: {p.opacity}; stroke-width: {p.width}" />
		{/each}
	</g>

	<text class="caption" x={(CABLE[0] + CABLE[1]) / 2} y={Y + 60}>the same electrical wiggle</text>
</svg>

<style>
	svg {
		display: block;
		width: 100%;
		height: auto;
	}
	.plinth {
		fill: #8b5a2b;
	}
	.disc {
		fill: #1f2937;
	}
	.groove-ring {
		fill: none;
		stroke: #374151;
		stroke-width: 2;
	}
	.label {
		fill: #b91c1c;
	}
	.mark {
		stroke: #4b5563;
		stroke-width: 2;
	}
	.tonearm {
		fill: none;
		stroke: #aab2bd;
		stroke-width: 7;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.mic-head {
		fill: #475569;
	}
	.grille {
		stroke: #94a3b8;
		stroke-width: 2;
	}
	.stand {
		fill: none;
		stroke: #334155;
		stroke-width: 6;
		stroke-linecap: round;
	}
	.phone {
		fill: #0f172a;
	}
	.screen {
		fill: #1e293b;
	}
	.file {
		font-family: var(--font-mono);
		font-size: 13px;
		fill: #cbd5e1;
		text-anchor: middle;
	}
	.jack {
		fill: #64748b;
	}
	.plug {
		fill: #64748b;
	}
	.lead {
		fill: none;
		stroke: #334155;
		stroke-width: 4;
		opacity: 0.35;
	}
	.cable {
		stroke: #334155;
		stroke-width: 4;
		opacity: 0.35;
	}
	.signal {
		fill: none;
		stroke: var(--accent);
		stroke-width: 3;
		stroke-linejoin: round;
	}
	.pulse {
		fill: none;
		stroke: var(--accent);
		stroke-linecap: round;
	}
	.caption {
		font-family: var(--font-body);
		font-size: 15px;
		fill: var(--ink-soft);
		text-anchor: middle;
	}
</style>
