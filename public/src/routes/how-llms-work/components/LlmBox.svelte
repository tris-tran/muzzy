<script>
	// The LLM drawn as a black box with lights inside. Shared by every step that shows "the machine".
	//   mode – 'idle' (lights off), 'working' (lights flicker), 'thinking' (flicker fast and hum)
	//   size – CSS width of the box
	let { mode = 'idle', size = 'min(13rem, 42vw)' } = $props();

	// Each light flickers on its own schedule while the box works.
	const lights = Array.from({ length: 64 }, () => ({
		delay: Math.random() * 1.2,
		speed: 0.5 + Math.random() * 0.9
	}));
</script>

<div class="box" data-mode={mode} style="--size: {size}" aria-hidden="true">
	<div class="lights">
		{#each lights as light, i (i)}
			<span style="--d: {light.delay}s; --s: {light.speed}s"></span>
		{/each}
	</div>
	<span class="mark">?</span>
	<span class="name">LLM</span>
</div>

<style>
	.box {
		position: relative;
		width: var(--size);
		aspect-ratio: 1;
		border-radius: 18px;
		background: #17151a;
		box-shadow:
			inset 0 0 0 1px rgba(255, 255, 255, 0.06),
			0 18px 40px -12px rgba(0, 0, 0, 0.45);
		display: grid;
		place-items: center;
		overflow: hidden;
		transition: box-shadow 0.4s ease;
	}
	.box[data-mode='thinking'] {
		animation: hum 0.18s ease-in-out infinite alternate;
		box-shadow:
			inset 0 0 0 1px rgba(255, 255, 255, 0.08),
			0 0 0 6px rgba(194, 85, 58, 0.12),
			0 18px 50px -10px rgba(194, 85, 58, 0.55);
	}
	@keyframes hum {
		to {
			transform: translate(0.5px, -0.5px) rotate(0.15deg);
		}
	}

	.lights {
		position: absolute;
		inset: 8.5%;
		display: grid;
		grid-template-columns: repeat(8, 1fr);
		gap: 4%;
	}
	.lights span {
		border-radius: 50%;
		background: #f0a58f;
		opacity: 0.06;
		align-self: center;
		justify-self: center;
		width: 0.42rem;
		height: 0.42rem;
	}
	.box:not([data-mode='idle']) .lights span {
		animation: flicker var(--s) ease-in-out var(--d) infinite alternate;
	}
	.box[data-mode='thinking'] .lights span {
		animation-duration: calc(var(--s) * 0.35);
	}
	@keyframes flicker {
		to {
			opacity: 0.95;
			box-shadow: 0 0 6px #f0a58f;
		}
	}

	.mark {
		position: relative;
		font-size: calc(var(--size) * 0.35);
		color: rgba(250, 247, 242, 0.9);
		text-shadow: 0 0 24px rgba(0, 0, 0, 0.9);
		transition: opacity 0.3s;
	}
	.box:not([data-mode='idle']) .mark {
		opacity: 0.15;
	}
	.name {
		position: absolute;
		bottom: 0.7rem;
		font-size: 0.75rem;
		letter-spacing: 0.3em;
		color: rgba(250, 247, 242, 0.45);
	}

	@media (prefers-reduced-motion: reduce) {
		.box,
		.lights span {
			animation: none !important;
		}
		.box:not([data-mode='idle']) .lights span {
			opacity: 0.5;
		}
	}
</style>
