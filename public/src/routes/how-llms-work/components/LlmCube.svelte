<script>
	// The LLM as a closed, floating 3D cube with glowing edges, on a field of dots.
	// Working: dots twinkle and light sweeps across the faces. Thinking: faster, and it wobbles.
	let { mode = 'idle', size = '13rem' } = $props();
	const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];

	// 11×11 dots, each twinkling on its own (fixed, so server and browser agree) schedule
	const dots = Array.from({ length: 121 }, (_, i) => ({
		delay: (((i * 37) % 23) / 23) * 1.4,
		speed: 0.5 + (((i * 53) % 19) / 19) * 0.9
	}));
</script>

<div class="scene" data-mode={mode} style="--size: {size}" aria-hidden="true">
	<div class="dots">
		{#each dots as dot, i (i)}
			<span style="--d: {dot.delay}s; --sp: {dot.speed}s"></span>
		{/each}
	</div>
	<div class="shadow"></div>
	<div class="float">
		<div class="cube">
			{#each faces as face (face)}
				<div class="face {face}">{#if face === 'front'}<span>LLM</span>{/if}</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.scene {
		--s: calc(var(--size) * 0.48);
		position: relative;
		width: var(--size);
		aspect-ratio: 1;
		display: grid;
		place-items: center;
		perspective: 900px;
	}
	.scene > * {
		grid-area: 1 / 1;
	}

	/* Background dots, fading out towards the edges */
	.dots {
		width: 100%;
		height: 100%;
		display: grid;
		grid-template-columns: repeat(11, 1fr);
		place-items: center;
		-webkit-mask-image: radial-gradient(closest-side, black 55%, transparent);
		mask-image: radial-gradient(closest-side, black 55%, transparent);
	}
	.dots span {
		width: calc(var(--size) * 0.03);
		aspect-ratio: 1;
		border-radius: 50%;
		background: var(--accent-mid);
		opacity: 0.3;
	}
	.scene:not([data-mode='idle']) .dots span {
		animation: twinkle var(--sp) ease-in-out var(--d) infinite alternate;
	}
	.scene[data-mode='thinking'] .dots span {
		animation-duration: calc(var(--sp) * 0.4);
	}
	@keyframes twinkle {
		to {
			opacity: 1;
			background: var(--accent);
			box-shadow: 0 0 6px var(--accent-mid);
		}
	}

	.float {
		transform-style: preserve-3d;
		animation: bob 4s ease-in-out infinite;
	}
	@keyframes bob {
		50% {
			transform: translateY(-6%);
		}
	}
	.cube {
		position: relative;
		width: var(--s);
		height: var(--s);
		transform-style: preserve-3d;
		transform: rotateX(-24deg) rotateY(-38deg);
	}
	.scene[data-mode='thinking'] .cube {
		animation: wobble 1.1s ease-in-out infinite;
	}
	@keyframes wobble {
		33% {
			transform: rotateX(-30deg) rotateY(-14deg);
		}
		66% {
			transform: rotateX(-18deg) rotateY(-58deg);
		}
	}

	.face {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		overflow: hidden;
		border: 1px solid color-mix(in srgb, var(--accent-mid) 45%, transparent);
		background: linear-gradient(150deg, color-mix(in srgb, var(--accent) 55%, var(--dark)), var(--dark) 75%);
		box-shadow: inset 0 0 calc(var(--s) * 0.3) color-mix(in srgb, var(--accent) 30%, transparent);
		transition:
			border-color 0.4s,
			box-shadow 0.4s;
	}
	.front {
		transform: translateZ(calc(var(--s) / 2));
	}
	.back {
		transform: rotateY(180deg) translateZ(calc(var(--s) / 2));
	}
	.right {
		transform: rotateY(90deg) translateZ(calc(var(--s) / 2));
		background: linear-gradient(150deg, color-mix(in srgb, var(--accent) 30%, var(--dark)), var(--dark) 80%);
	}
	.left {
		transform: rotateY(-90deg) translateZ(calc(var(--s) / 2));
	}
	.top {
		transform: rotateX(90deg) translateZ(calc(var(--s) / 2));
		background: linear-gradient(135deg, var(--accent-mid), var(--accent) 45%, color-mix(in srgb, var(--accent) 40%, var(--dark)));
	}
	.bottom {
		transform: rotateX(-90deg) translateZ(calc(var(--s) / 2));
	}
	.face span {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: calc(var(--s) * 0.17);
		letter-spacing: 0.2em;
		color: color-mix(in srgb, var(--on-dark) 85%, transparent);
	}

	/* A band of light sweeping across the faces */
	.face::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(105deg, transparent 35%, color-mix(in srgb, var(--accent-mid) 55%, transparent) 50%, transparent 65%);
		background-size: 300% 100%;
		background-position: 100% 0;
		opacity: 0;
	}
	.scene:not([data-mode='idle']) .face {
		border-color: color-mix(in srgb, var(--accent-mid) 90%, white);
		box-shadow: inset 0 0 calc(var(--s) * 0.35) color-mix(in srgb, var(--accent-mid) 45%, transparent);
	}
	.scene:not([data-mode='idle']) .face::after {
		opacity: 1;
		animation: sweep 1.4s linear infinite;
	}
	.scene[data-mode='thinking'] .face::after {
		animation-duration: 0.6s;
	}
	@keyframes sweep {
		to {
			background-position: -50% 0;
		}
	}

	.shadow {
		align-self: end;
		margin-bottom: 9%;
		width: calc(var(--s) * 1.3);
		height: calc(var(--s) * 0.22);
		border-radius: 50%;
		background: radial-gradient(closest-side, rgba(15, 23, 42, 0.3), transparent);
		animation: shadow 4s ease-in-out infinite;
		transition: background 0.4s;
	}
	.scene:not([data-mode='idle']) .shadow {
		background: radial-gradient(closest-side, color-mix(in srgb, var(--accent) 55%, transparent), transparent);
	}
	@keyframes shadow {
		50% {
			transform: scale(0.85);
			opacity: 0.7;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.float,
		.cube,
		.dots span,
		.shadow,
		.face::after {
			animation: none !important;
		}
	}
</style>
