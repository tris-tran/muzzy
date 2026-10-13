<script>
	// How a gramophone makes sound, as a flat animated diagram. The record's groove slides past
	// like a sound-wave graph; the needle rides it up and down and pushes the diaphragm; each push
	// sends a pulse up the horn, which widens it until it leaves the mouth as sound. Louder parts
	// of the groove make stronger pulses. Everything is slowed way down.
	//   playing – pause with false
	import { onMount } from 'svelte';
	import { groove, pulses as pushes, animate } from './groove.js';

	let { playing = true } = $props();

	const W = 800;
	const H = 420;
	const NEEDLE_X = 220;
	const GROOVE_Y = 362;

	// The horn: two walls from the neck (on top of the sound box) out to the mouth
	const P = (x, y) => ({ x, y });
	const upperWall = [P(200, 222), P(200, 150), P(270, 105), P(560, 32)];
	const lowerWall = [P(240, 222), P(248, 182), P(320, 168), P(560, 250)];
	const bezier = ([a, b, c, d], s) => {
		const m = 1 - s;
		const k = [m * m * m, 3 * m * m * s, 3 * m * s * s, s * s * s];
		return P(k[0] * a.x + k[1] * b.x + k[2] * c.x + k[3] * d.x, k[0] * a.y + k[1] * b.y + k[2] * c.y + k[3] * d.y);
	};
	const hornPath =
		`M${upperWall.map((p, i) => (i === 1 ? 'C' : '') + p.x + ',' + p.y).join(' ')} ` +
		`L${lowerWall[3].x},${lowerWall[3].y} C${[lowerWall[2], lowerWall[1], lowerWall[0]].map((p) => p.x + ',' + p.y).join(' ')} Z`;

	// Distance along the middle of the horn → curve position, so pulses move at a steady speed
	const centre = (s) => {
		const a = bezier(upperWall, s);
		const b = bezier(lowerWall, s);
		return P((a.x + b.x) / 2, (a.y + b.y) / 2);
	};
	const table = [0];
	for (let i = 1; i <= 100; i++) {
		const a = centre((i - 1) / 100);
		const b = centre(i / 100);
		table.push(table[i - 1] + Math.hypot(b.x - a.x, b.y - a.y));
	}
	const HORN_LENGTH = table[100];
	const atDistance = (d) => {
		const i = table.findIndex((v) => v >= d);
		if (i <= 0) return 0;
		return (i - 1 + (d - table[i - 1]) / (table[i] - table[i - 1])) / 100;
	};
	const MOUTH = P(560, 141);

	let scroll = $state(0);

	onMount(() => {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) playing = false;
		return animate((px) => (scroll += px), () => playing);
	});

	// Where the needle is right now: it follows the groove under it
	let push = $derived(groove(NEEDLE_X + scroll));

	let groovePath = $derived.by(() => {
		let d = '';
		for (let x = 0; x <= W; x += 4) d += `${x ? 'L' : 'M'}${x},${(GROOVE_Y - groove(x + scroll)).toFixed(1)}`;
		return d;
	});

	// One pulse per push (each time the needle reaches the top of a wiggle)
	let pulses = $derived.by(() => {
		const list = [];
		for (const { k, dist, strength } of pushes(NEEDLE_X + scroll)) {
			if (dist < HORN_LENGTH) {
				// Inside the horn: a line across it, bent a little forward
				const s = atDistance(dist);
				const a = bezier(upperWall, s);
				const b = bezier(lowerWall, s);
				const c = centre(s);
				const ahead = centre(Math.min(1, s + 0.02));
				const shrink = (p) => P(c.x + (p.x - c.x) * 0.85, c.y + (p.y - c.y) * 0.85);
				const [p1, p2] = [shrink(a), shrink(b)];
				const len = Math.hypot(ahead.x - c.x, ahead.y - c.y) || 1;
				const bulge = Math.hypot(p1.x - p2.x, p1.y - p2.y) * 0.25;
				const q = P(c.x + ((ahead.x - c.x) / len) * bulge, c.y + ((ahead.y - c.y) / len) * bulge);
				list.push({ k, d: `M${p1.x},${p1.y} Q${q.x},${q.y} ${p2.x},${p2.y}`, strength, fade: 1 });
			} else {
				// Out in the room: an arc that keeps growing and fades
				const out = dist - HORN_LENGTH;
				if (out > 300) break;
				const r = 110 + out;
				const a = (55 * Math.PI) / 180;
				const cx = MOUTH.x - 110;
				const [x1, y1] = [cx + r * Math.cos(-a), MOUTH.y + r * Math.sin(-a)];
				const [x2, y2] = [cx + r * Math.cos(a), MOUTH.y + r * Math.sin(a)];
				list.push({ k, d: `M${x1},${y1} A${r},${r} 0 0 1 ${x2},${y2}`, strength, fade: 1 - out / 300 });
			}
		}
		return list;
	});

	// The diaphragm bows with the needle
	let diaphragm = $derived(`M176,240 Q220,${240 - push * 2} 264,240`);
</script>

<div class="anim">
	<svg viewBox="0 0 {W} {H}" role="img" aria-label="Animated diagram: the groove moves the needle, the needle moves the diaphragm, and the horn sends the sound out">
		<defs>
			<clipPath id="horn-inside"><path d={hornPath} /></clipPath>
			<clipPath id="room"><rect width={W} height="314" /></clipPath>
		</defs>

		<!-- Horn and the pulses travelling up it -->
		<path class="horn" d={hornPath} />
		<g clip-path="url(#horn-inside)">
			{#each pulses.filter((p) => p.fade === 1) as p (p.k)}
				<path class="pulse" d={p.d} style="opacity: {0.25 + p.strength * 0.75}; stroke-width: {2 + p.strength * 3}" />
			{/each}
		</g>
		<g clip-path="url(#room)">
			{#each pulses.filter((p) => p.fade < 1) as p (p.k)}
				<path class="pulse" d={p.d} style="opacity: {(0.25 + p.strength * 0.75) * p.fade}; stroke-width: {2 + p.strength * 3}" />
			{/each}
		</g>

		<!-- Sound box with the diaphragm inside -->
		<rect class="box" x="166" y="222" width="108" height="36" rx="10" />
		<path class="diaphragm" d={diaphragm} />

		<!-- Record with its groove, and the needle riding it -->
		<rect class="record" x="0" y="318" width={W} height="88" rx="8" />
		<path class="groove" d={groovePath} />
		<line class="needle" x1={NEEDLE_X} y1={240 - push * 2} x2={NEEDLE_X} y2={GROOVE_Y - push} />
		<circle class="tip" cx={NEEDLE_X} cy={GROOVE_Y - push} r="5" />

		<!-- Labels -->
		<g class="labels">
			<text class="on-dark" x="16" y="396">1 · Groove: the sound, frozen as a wiggly line</text>
			<text x="234" y="300">2 · Needle</text>
			<text x="286" y="245">3 · Diaphragm</text>
			<text x="300" y="70">4 · Horn</text>
			<text x="640" y="40">5 · Sound</text>
		</g>
	</svg>
	<div class="bar">
		<button onclick={() => (playing = !playing)}>{playing ? '❚❚ Pause' : '▶ Play'}</button>
		<span>Slowed way down: a real needle wiggles hundreds of times a second.</span>
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
	.horn {
		fill: #f3e3bf;
		stroke: #b8862f;
		stroke-width: 3;
		stroke-linejoin: round;
	}
	.pulse {
		fill: none;
		stroke: var(--accent);
		stroke-linecap: round;
	}
	.box {
		fill: #d4a24c;
		stroke: #8a6420;
		stroke-width: 2;
	}
	.diaphragm {
		fill: none;
		stroke: var(--ink);
		stroke-width: 4;
		stroke-linecap: round;
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
	.needle {
		stroke: #64748b;
		stroke-width: 4;
		stroke-linecap: round;
	}
	.tip {
		fill: var(--bad);
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
