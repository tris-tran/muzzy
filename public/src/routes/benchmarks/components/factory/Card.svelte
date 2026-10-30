<svelte:options namespace="svg" />

<script>
	// One input card on the belt. Plain when it leaves the dock; once our server has answered it
	// shows the new answer; once validated, ✓ or ✗ and a colour. Tap to inspect it.
	//   card   – { row, ours?, verdict? }
	//   x      – where it is along the belt
	//   picked – it's the one shown in detail
	//   onpick – called when it's tapped
	//   drop   – how far it has fallen off the belt (0 while it's on it)
	import { BELT_Y, CARD, DROP } from './geometry.js';

	let { card, x, picked, onpick, drop = 0 } = $props();
</script>

<g
	class="card"
	class:answered={card.ours !== undefined}
	class:ok={card.verdict === true || card.ending === 'stopped'}
	class:bad={card.verdict === false || card.ending === 'failed'}
	class:picked
	transform="translate({x} {BELT_Y - CARD.h - 2 + drop * 1.4})"
	opacity={1 - drop / DROP}
	role="button"
	tabindex="0"
	aria-label="Inspect {card.row.id}"
	onclick={onpick}
	onkeydown={(e) => e.key === 'Enter' && onpick()}
>
	<rect width={CARD.w} height={CARD.h} rx="6" />
	<text class="id" x="8" y="16">{card.row.id}</text>
	{#if card.ending === 'failed'}
		<text class="made" x="8" y="35">✗ no answer</text>
	{:else if card.verdict !== undefined}
		<text class="made" x="8" y="35">{card.verdict ? '✓' : '✗'} {card.ours}</text>
	{:else if card.ours !== undefined}
		<text class="made" x="8" y="35">→ {card.ours}</text>
	{:else}
		<rect class="line" x="8" y="24" width="56" height="4" rx="2" />
		<rect class="line" x="8" y="32" width="40" height="4" rx="2" />
	{/if}
</g>

<style>
	.card {
		cursor: pointer;
	}
	.card > rect:first-child {
		fill: var(--card);
		stroke: var(--accent-mid);
		stroke-width: 2;
	}
	.answered > rect:first-child {
		fill: var(--accent-soft);
	}
	.ok > rect:first-child {
		fill: var(--good-soft);
		stroke: var(--good);
	}
	.bad > rect:first-child {
		fill: var(--bad-soft);
		stroke: var(--bad);
	}
	.picked > rect:first-child {
		stroke-width: 3.5;
	}
	.card:focus-visible {
		outline: none;
	}
	.card:focus-visible > rect:first-child {
		stroke: var(--ink);
	}
	.id {
		font-family: var(--font-mono);
		font-size: 10px;
		fill: var(--ink-soft);
	}
	.made {
		font-family: var(--font-mono);
		font-size: 12px;
		font-weight: 700;
		fill: var(--accent);
	}
	.ok .made {
		fill: var(--good);
	}
	.bad .made {
		fill: var(--bad);
	}
	.line {
		fill: var(--track-strong);
	}
</style>
