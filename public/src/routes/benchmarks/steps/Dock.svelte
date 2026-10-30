<script>
	// Step 5: from here on, a benchmark is a factory. This is its loading dock: the file is read one
	// row at a time, each row is stamped into an input card and put on the belt. Machines and
	// inspectors arrive in the next steps.
	import Factory from '../components/Factory.svelte';
	import { requests } from '../components/requests.js';
</script>

<div class="dock">
	<div class="head">
		<div>
			<p class="step-label">Step 5 · Rows become inputs</p>
			<h2 class="step-title">The factory's loading dock</h2>
		</div>
		<p class="step-lede">
			From here on, picture a benchmark as a <strong>factory</strong>. The data file is the loading
			dock: each row is stamped into an <strong>input card</strong> and put on a conveyor belt.
			Machines will work on it, and inspectors will watch. Tap a card to read it.
		</p>
	</div>

	<div class="stage">
		<Factory rows={requests}>
			<p class="takeaway">
				Rows go in <strong>one at a time</strong>: the first card is on its way while most of the file is
				still unread, so ten rows or a million make no difference. Each kind of data brings its own
				dock (a spreadsheet reader here, a database elsewhere), but the belt only ever sees cards.
			</p>
		</Factory>
	</div>
</div>

<style>
	.head {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 0 3rem;
		align-items: end;
	}
	.step-lede {
		margin: 0;
	}
	strong {
		color: var(--ink);
		font-weight: normal;
		border-bottom: 2px solid var(--accent-mid);
	}
	.stage {
		margin-top: 1.5rem;
	}
	.takeaway {
		margin: 0;
		font-size: 1.05rem;
		line-height: 1.6;
	}
	@media (max-width: 860px) {
		.head {
			grid-template-columns: minmax(0, 1fr);
		}
		.step-lede {
			margin-top: 1rem;
		}
	}
</style>
