<script>
	// The architecture: the whole project as one interactive graph. Not held to one screen: it's
	// wider than the other steps and as tall as it needs to be.
	import ArchitectureGraph from '../components/ArchitectureGraph.svelte';
</script>

<div class="architecture">
	<div class="head">
		<p class="step-label">The architecture</p>
		<h2 class="step-title">How it all fits together</h2>
		<div class="cols">
			<p><strong>Left: the providers.</strong> Where the models actually run: OpenAI, Google's Vertex, and our own lab box.</p>
			<p>
				<strong>Middle: the library.</strong> Three layers, each knowing only the one below:
				<em>calling models</em>, <em>defining benchmarks</em>, <em>running them</em>.
			</p>
			<p><strong>Right: the app.</strong> The command you run, our list of models, and one package per benchmark, like <em>replay</em>.</p>
		</div>
	</div>

	<div class="wide"><ArchitectureGraph /></div>
</div>

<style>
	.head {
		max-width: 64rem;
	}
	.cols {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1.5rem;
		margin-top: 1rem;
	}
	.cols p {
		margin: 0;
		line-height: 1.55;
		color: var(--ink-soft);
	}
	.cols strong {
		color: var(--ink);
	}
	.cols em {
		font-style: normal;
		color: var(--accent);
	}
	/* Wider than the other steps: the graph needs the room */
	.wide {
		position: relative;
		left: 50%;
		width: min(94vw, 1400px);
		margin-top: 1.5rem;
		transform: translateX(-50%);
	}
	@media (max-width: 860px) {
		.cols {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
