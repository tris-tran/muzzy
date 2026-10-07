<script>
	import { asset, resolve } from '$app/paths';
</script>

<header class="hero">
	<p class="eyebrow">A little corner of the internet</p>
	<h1>Things I'm making, <em>and sharing with you.</em></h1>
	<p class="lede">
		Small experiments and explainers, mostly about language models. Some of it is public, and some
		of it is behind the <a href={resolve('/private')}>private</a> door.
	</p>
</header>

<section>
	<h2>Things to look at</h2>

	<div class="grid">
		<a class="card feature" href={resolve('/how-llms-work')}>
			<span class="tag">New · Interactive</span>
			<h3>How does an LLM actually work?</h3>
			<p>
				A hands-on walk through what happens between typing a question and getting an answer. No
				maths, no jargon — just poke at it.
			</p>
			<span class="go">Start exploring →</span>
		</a>

		<article class="card">
			<span class="tag">Demo</span>
			<h3><a href={asset('poc-1/names.html')}>Finding names &amp; addresses with a tiny LLM</a></h3>
			<p>
				A small language model reads a document piece by piece, with lots of requests running in
				parallel, and picks out every name and address it finds. Press <em>Start demo</em> and watch
				it work.
			</p>
			<p class="links">
				<a class="button" href={asset('poc-1/names.html')}>Open the demo</a>
				<a href={asset('poc-1/names-mobile.html')}>Phone version</a>
			</p>
		</article>
	</div>
</section>

<section class="door">
	<div>
		<h2>Behind the door</h2>
		<p>The private side needs a password. If you have it, come on in.</p>
	</div>
	<a class="button ghost" href={resolve('/private')}>Go to private →</a>
</section>

<style>
	.hero {
		padding: 1rem 0 2rem;
	}
	.eyebrow {
		margin: 0 0 0.75rem;
		font-size: 0.8rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--accent);
	}
	h1 {
		margin: 0;
		font-size: 2.6rem;
		line-height: 1.12;
		font-weight: normal;
		text-wrap: balance;
	}
	h1 em {
		color: var(--ink-soft);
	}
	.lede {
		max-width: 34rem;
		margin: 1.25rem 0 0;
		font-size: 1.15rem;
		line-height: 1.6;
		color: var(--ink-soft);
	}
	.lede a {
		color: inherit;
	}

	section {
		margin-top: 2.5rem;
	}
	h2 {
		margin: 0 0 1rem;
		font-size: 0.85rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-soft);
		font-weight: normal;
	}
	.grid {
		display: grid;
		gap: 1rem;
	}

	.card {
		display: block;
		background: var(--card);
		border: 1px solid var(--line);
		border-radius: 14px;
		padding: 1.4rem 1.6rem;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
		color: inherit;
		text-decoration: none;
	}
	.card h3 {
		margin: 0.5rem 0 0.5rem;
		font-size: 1.25rem;
	}
	.card h3 a {
		color: inherit;
		text-decoration: none;
	}
	.card h3 a:hover {
		text-decoration: underline;
	}
	.card p {
		margin: 0.5rem 0;
		line-height: 1.55;
	}
	.tag {
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}

	.feature {
		background: var(--ink);
		color: var(--paper);
		border-color: var(--ink);
		transition: transform 0.15s ease, box-shadow 0.15s ease;
	}
	.feature:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
	}
	.feature .tag {
		color: #f0a58f;
	}
	.feature h3 {
		font-size: 1.6rem;
		font-weight: normal;
	}
	.feature p {
		color: #d9d3c9;
		max-width: 32rem;
	}
	.go {
		display: inline-block;
		margin-top: 0.75rem;
		font-weight: bold;
	}

	.links {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		flex-wrap: wrap;
		margin-top: 1rem !important;
	}
	.button {
		display: inline-block;
		background: var(--ink);
		color: var(--paper);
		padding: 0.5rem 1rem;
		border-radius: 999px;
		text-decoration: none;
		white-space: nowrap;
	}
	.button:hover {
		background: #000;
	}
	.links a:not(.button) {
		color: var(--ink-soft);
	}

	.door {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
		padding-top: 2rem;
		border-top: 1px dashed var(--line);
	}
	.door h2 {
		margin-bottom: 0.4rem;
	}
	.door p {
		margin: 0;
		color: var(--ink-soft);
	}
	.button.ghost {
		background: transparent;
		color: var(--ink);
		border: 1px solid var(--ink);
	}
	.button.ghost:hover {
		background: var(--ink);
		color: var(--paper);
	}

	@media (max-width: 600px) {
		h1 {
			font-size: 2rem !important;
		}
		.card {
			padding: 1.2rem 1.2rem;
		}
	}
</style>
