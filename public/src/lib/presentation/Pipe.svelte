<script>
	// The little wire between a panel and the LLM box. A pulse runs along it while `flowing`.
	// Horizontal on wide screens, vertical when the stage stacks (≤ 760px), or always with `vertical`.
	let { flowing = false, vertical = false } = $props();
</script>

<div class="pipe" class:flowing class:vertical aria-hidden="true"><span></span></div>

<style>
	.pipe {
		width: 2.5rem;
		height: 2px;
		background: var(--line);
		position: relative;
		overflow: hidden;
	}
	.pipe span {
		position: absolute;
		inset: 0;
		background: linear-gradient(90deg, transparent, var(--accent), transparent);
		transform: translateX(-100%);
	}
	.flowing span {
		animation: flow-x 0.6s linear infinite;
	}
	@keyframes flow-x {
		to {
			transform: translateX(100%);
		}
	}
	@keyframes flow-y {
		to {
			transform: translateY(100%);
		}
	}
	.pipe.vertical {
		width: 2px;
		height: 1.75rem;
	}
	.vertical span {
		background: linear-gradient(180deg, transparent, var(--accent), transparent);
		transform: translateY(-100%);
	}
	.vertical.flowing span {
		animation-name: flow-y;
	}
	@media (max-width: 760px) {
		.pipe {
			width: 2px;
			height: 1.75rem;
		}
		.pipe span {
			background: linear-gradient(180deg, transparent, var(--accent), transparent);
			transform: translateY(-100%);
		}
		.flowing span {
			animation-name: flow-y;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.flowing span {
			animation: none;
		}
	}
</style>
