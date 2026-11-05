<script>
	// A little press. `compress` squeezes a page between two jaws; `decompress` lets it spring back.
	//   working – runs the animation
	//   label / sub – name under the machine (e.g. "Compress" / "gzip")
	let { kind = 'compress', working = false, label = '', sub = '' } = $props();
</script>

<div class="machine {kind}" class:working>
	<div class="press" aria-hidden="true">
		<span class="jaw left"></span>
		<span class="page"><i></i><i></i><i></i><i></i></span>
		<span class="jaw right"></span>
	</div>
	{#if label}<span class="name">{label}</span>{/if}
	{#if sub}<span class="sub">{sub}</span>{/if}
</div>

<style>
	.machine {
		display: grid;
		justify-items: center;
		gap: 0.15rem;
		padding: 0.9rem 0.8rem 0.7rem;
		border-radius: var(--radius);
		background: var(--card);
		border: var(--bw) solid var(--line);
		box-shadow: var(--shadow);
		transition:
			border-color 0.3s,
			box-shadow 0.3s;
	}
	.machine.working {
		border-color: var(--accent-mid);
		box-shadow: 0 0 0 4px var(--accent-soft);
	}

	/* The press: a page of "text" between two jaws */
	.press {
		--squeeze: 0.42; /* how small the page gets */
		--shift: 0.81rem; /* how far each jaw travels to meet it */
		position: relative;
		width: 4.4rem;
		height: 3rem;
		margin-bottom: 0.35rem;
	}
	.jaw {
		position: absolute;
		top: 0;
		width: 0.32rem;
		height: 100%;
		border-radius: 3px;
		background: var(--ink);
	}
	.jaw.left {
		left: 0.3rem;
	}
	.jaw.right {
		right: 0.3rem;
	}
	.page {
		position: absolute;
		top: 0.2rem;
		bottom: 0.2rem;
		left: 0.8rem;
		right: 0.8rem;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		padding: 0 0.3rem;
		border-radius: 3px;
		background: var(--accent-soft);
		transform-origin: center;
	}
	.page i {
		display: block;
		height: 2px;
		border-radius: 1px;
		background: var(--accent-mid);
	}
	.page i:nth-child(2) {
		width: 80%;
	}
	.page i:nth-child(4) {
		width: 60%;
	}
	.working .page i {
		background: var(--accent);
	}

	/* Resting poses: open for compress, already squeezed for decompress */
	.decompress .page {
		transform: scaleX(var(--squeeze));
	}
	.decompress .jaw.left {
		transform: translateX(var(--shift));
	}
	.decompress .jaw.right {
		transform: translateX(calc(-1 * var(--shift)));
	}

	.compress.working .page {
		animation: squeeze 1s ease-in-out infinite;
	}
	.compress.working .jaw.left {
		animation: jaw-left 1s ease-in-out infinite;
	}
	.compress.working .jaw.right {
		animation: jaw-right 1s ease-in-out infinite;
	}
	.decompress.working .page {
		animation: squeeze 1s ease-in-out infinite reverse;
	}
	.decompress.working .jaw.left {
		animation: jaw-left 1s ease-in-out infinite reverse;
	}
	.decompress.working .jaw.right {
		animation: jaw-right 1s ease-in-out infinite reverse;
	}
	@keyframes squeeze {
		0%,
		15% {
			transform: scaleX(1);
		}
		60%,
		100% {
			transform: scaleX(var(--squeeze));
		}
	}
	@keyframes jaw-left {
		0%,
		15% {
			transform: none;
		}
		60%,
		100% {
			transform: translateX(var(--shift));
		}
	}
	@keyframes jaw-right {
		0%,
		15% {
			transform: none;
		}
		60%,
		100% {
			transform: translateX(calc(-1 * var(--shift)));
		}
	}

	.name {
		font-weight: 700;
		font-size: 0.9rem;
	}
	.sub {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--ink-soft);
	}

	@media (prefers-reduced-motion: reduce) {
		.machine .page,
		.machine .jaw {
			animation: none !important;
		}
	}
</style>
