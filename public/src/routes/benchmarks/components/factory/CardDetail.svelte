<script>
	// One input card up close: what it asks, Gemini's answer (what we expect, so it's highlighted),
	// and, once those stations have done their work, our server's answer, its times and the verdict:
	// matched, settled early by a cheap check, judged by another LLM (with its reason), or failed.
	// Always the same size, whatever the card says: every area keeps its room, with a placeholder
	// until the card gets there, so the panel never jumps while the belt runs.
	//   card      – { row, ours?, verdict?, why?, ending?, reason?, times }
	//   following – true when following the belt rather than showing a card that was tapped
	//   brief     – leave the instructions out
	//   timed     – names of the stations with a probe, in belt order (their times get a line each)
	//   answers   – the factory has a station that answers (so keep room for our answer)
	//   validates – the factory has a station that validates (so keep room for the verdict)
	import { fmt } from './geometry.js';

	let { card, following, brief = false, timed = [], answers = false, validates = false } = $props();
</script>

<div class="detail" aria-live="polite">
	<span class="label">Input card <strong>{card.row.id}</strong> <em>{following ? '(latest)' : ''}</em></span>
	<dl>
		{#if !brief}
			<dt>instructions</dt>
			<dd class="two">{card.row.system || '(none)'}</dd>
		{/if}
		<dt>question</dt>
		<dd class="three">{card.row.question}</dd>
	</dl>
	<div class="answer expected">
		<span>Gemini's answer · what we expect</span>
		<strong>{card.row.answer}</strong>
	</div>
	{#if answers}
		<div class="answer ours" class:waiting={card.ours === undefined} class:ok={card.verdict === true} class:bad={card.verdict === false}>
			<span>Our server's answer</span>
			<strong>{card.ending === 'failed' ? 'no answer' : (card.ours ?? 'not answered yet')}</strong>
			{#each timed as name (name)}
				<small>⏱ {card.times[name] !== undefined ? fmt(card.times[name]) : '–'} in {name}</small>
			{/each}
		</div>
	{/if}
	{#if validates}
		{@const ok = card.ending === 'stopped' || (card.ending !== 'failed' && card.verdict === true)}
		{@const bad = card.ending === 'failed' || card.verdict === false}
		<div class="verdict" class:ok class:bad>
			{#if card.ending === 'failed'}
				<strong>✗ Failed</strong><span>{card.reason}</span>
			{:else if card.ending === 'stopped'}
				<strong>✓ Settled early</strong><span>{card.reason}</span>
			{:else if card.why}
				<strong>{card.verdict ? '✓ Judge: correct' : '✗ Judge: wrong'}</strong><span>“{card.why}”</span>
			{:else if card.verdict !== undefined}
				<strong>{card.verdict ? '✓ Matches Gemini' : '✗ Differs from Gemini'}</strong>
			{:else}
				<strong>Waiting to be checked</strong>
			{/if}
		</div>
	{/if}
</div>

<style>
	.detail {
		display: grid;
		gap: 0.5rem;
		padding: 0.9rem 1rem;
		border-radius: var(--radius);
		background: var(--dark);
		color: var(--on-dark);
	}
	.label {
		font-size: 0.72rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: color-mix(in srgb, var(--on-dark) 60%, transparent);
	}
	.label strong {
		color: var(--tag);
	}
	.label em {
		font-style: normal;
	}
	dl {
		display: grid;
		gap: 0.1rem;
		margin: 0;
	}
	dt {
		margin-top: 0.3rem;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		color: var(--tag);
	}
	dd {
		margin: 0;
		font-size: 0.86rem;
		line-height: 1.4;
		overflow: hidden;
	}
	/* Room for the longest instructions (two lines) and question (three), on every card */
	.two {
		height: calc(2 * 1.4em);
	}
	.three {
		height: calc(3 * 1.4em);
	}
	.answer {
		display: grid;
		gap: 0.1rem;
		padding: 0.5rem 0.7rem;
		border-radius: var(--radius-sm);
	}
	/* Gemini's answer: the thing everything is compared against */
	.expected {
		background: color-mix(in srgb, var(--tag) 22%, transparent);
		box-shadow: inset 3px 0 0 var(--tag);
	}
	.ours {
		background: color-mix(in srgb, var(--on-dark) 8%, transparent);
	}
	.ours.ok {
		box-shadow: inset 3px 0 0 var(--good-light);
	}
	.ours.bad {
		box-shadow: inset 3px 0 0 var(--bad-light);
	}
	.answer span {
		font-size: 0.7rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: color-mix(in srgb, var(--on-dark) 70%, transparent);
	}
	.answer strong {
		font-family: var(--font-mono);
		font-size: 1.05rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.waiting strong {
		font-family: var(--font-body);
		font-size: 0.9rem;
		font-weight: 400;
		font-style: italic;
		color: color-mix(in srgb, var(--on-dark) 45%, transparent);
	}
	small {
		font-size: 0.75rem;
		color: #fcd34d;
	}
	/* Room for a verdict and a one-line reason, on every card */
	.verdict {
		display: grid;
		align-content: start;
		height: calc(1.3em + 2 * 1.35em);
		color: color-mix(in srgb, var(--on-dark) 45%, transparent);
	}
	.verdict span {
		font-size: 0.8rem;
		line-height: 1.35;
		color: color-mix(in srgb, var(--on-dark) 75%, transparent);
	}
	.verdict.ok {
		color: var(--good-light);
	}
	.verdict.bad {
		color: var(--bad-light);
	}
</style>
