<script>
	import { asset, resolve } from '$app/paths';
</script>

<h1>Welcome</h1>

<p>Hi! This is a little corner of the internet where I'll be sharing things with you.</p>

<p>Some of it is public, and some of it is behind the <a href={resolve('/private')}>private</a> door.</p>

<h2>Things to look at</h2>

<article class="card">
	<h3><a href={asset('/poc-1/names.html')}>Finding names &amp; addresses with a tiny LLM</a></h3>
	<p>
		A small language model reads a document piece by piece, with lots of requests running in
		parallel, and picks out every name and address it finds. Press <em>Start demo</em> and watch it work.
	</p>
	<p class="links">
		<a class="button" href={asset('/poc-1/names.html')}>Open the demo</a>
		<a href={asset('/poc-1/names-mobile.html')}>Phone version</a>
	</p>
</article>

<style>
	h2 {
		margin-top: 2.5rem;
		font-size: 1.2rem;
	}
	.card {
		background: white;
		border: 1px solid #e5ded3;
		border-radius: 12px;
		padding: 1.25rem 1.5rem;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
	}
	.card h3 {
		margin: 0 0 0.5rem;
		font-size: 1.1rem;
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
	.links {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		flex-wrap: wrap;
		margin-top: 1rem !important;
	}
	.button {
		background: #2b2b2b;
		color: #faf7f2;
		padding: 0.5rem 1rem;
		border-radius: 999px;
		text-decoration: none;
	}
	.button:hover {
		background: #000;
	}
	.links a:not(.button) {
		color: #555;
	}
</style>
