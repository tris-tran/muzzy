<script>
	// Step 7: a chat, and what really happens behind it. Every turn, the WHOLE conversation is
	// formatted with ChatML tags, turned into numbers and sent to the LLM, which writes the
	// assistant's reply one piece at a time until it outputs <|im_end|>.
	import LlmBox from '#lib/presentation/LlmBox.svelte';
	import Pipe from '#lib/presentation/Pipe.svelte';
	import ContextView from '#lib/presentation/ContextView.svelte';
	import { context, words, tag, END } from '#lib/presentation/chatml.js';

	const topics = {
		picnic: {
			ask: 'Hi! Can you help me plan a picnic?',
			reply: 'Of course! Where are you thinking of going, and how many people are coming?',
			shorter: 'Sure: where, and how many people?',
			more: 'Bring easy food like sandwiches, fruit and lemonade, a blanket, and something to play with, like a frisbee.',
			recall: 'You asked me to help you plan a picnic.'
		},
		goldfish: {
			ask: "What's a good name for a goldfish?",
			reply: 'How about Bubbles? Or, if you want something fancier, Sir Swims-a-Lot.',
			shorter: 'Bubbles!',
			more: 'Some other ideas: Goldie, Nemo, Finn, or Captain Fishbeard.',
			recall: 'You asked me for a good name for a goldfish.'
		},
		fact: {
			ask: 'Tell me a fun fact.',
			reply: 'Octopuses have three hearts, and their blood is blue!',
			shorter: 'Octopuses have three hearts.',
			more: 'Two of the hearts pump blood to the gills, and one pumps it to the rest of the body. It is blue because it uses copper instead of iron.',
			recall: 'You asked me to tell you a fun fact.'
		}
	};

	let messages = $state([]); // the visible chat
	let topic = $state(null);
	let phase = $state('choose'); // choose → sending → encoding → feeding → writing → choose
	let lastPick = $state(null);

	let generated = $state([]); // pieces written so far in the current reply
	let numeric = $state(0); // how many context pieces are showing as numbers
	let fresh = $state(Infinity); // where the newly added context starts
	let out = $state(null); // the piece coming out of the LLM right now: { id, word }
	let sentThisTurn = $state(0);
	let sentTotal = $state(0);

	let userTurns = $derived(messages.filter((m) => m.role === 'user').length);
	let writing = $derived(phase !== 'choose');
	let tokens = $derived(context(messages, { open: writing, partial: generated }));
	let typing = $derived(
		generated
			.filter((g) => g.kind !== 'tag')
			.map((g) => g.t)
			.join('')
	);

	let options = $derived.by(() => {
		if (userTurns === 0) {
			return Object.entries(topics).map(([key, t]) => ({ text: t.ask, reply: t.reply, topic: key }));
		}
		const t = topics[topic];
		if (userTurns === 1) {
			return [
				{ text: 'Make it shorter, please.', reply: t.shorter },
				{ text: 'Tell me more!', reply: t.more },
				{ text: 'What did I just ask you?', reply: t.recall, recall: true }
			];
		}
		if (userTurns === 2) {
			return [
				{ text: 'Thanks!', reply: "You're welcome! Have a great day." },
				{ text: "You're the best!", reply: 'Aw, thank you! Happy to help anytime.' }
			];
		}
		return [];
	});

	let note = $derived.by(() => {
		if (phase !== 'choose' || !userTurns) return '';
		if (userTurns === 1)
			return 'On the right is what the LLM actually received: your message wrapped in special tags, plus a hidden instruction from the app. It kept writing until it produced <|im_end|>, its way of saying “I’m done.”';
		if (userTurns === 2 && lastPick?.recall)
			return 'It “remembered” your first question only because the whole chat was sent again. The LLM itself has no memory between messages.';
		if (userTurns === 2)
			return 'Look at the context: your first message and its first answer were sent again. The LLM has no memory between messages; the whole chat goes in every single time.';
		return 'Every message makes the text longer, and all of it goes through the LLM again. That’s why chats have a length limit, and why very long ones get slow.';
	});

	let run = 0;
	const wait = (ms) => new Promise((r) => setTimeout(r, ms));

	async function send(option) {
		const id = ++run;
		const slow = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.15 : 1;
		const step = async (ms) => {
			await wait(ms * slow);
			return id === run;
		};
		lastPick = option;
		if (option.topic) topic = option.topic;

		// 1. The message joins the chat; the context grows
		const before = context(messages).length;
		messages = [...messages, { role: 'user', text: option.text }];
		generated = [];
		out = null;
		fresh = before;
		phase = 'sending';
		if (!(await step(1300))) return;

		// 2. The whole context becomes numbers, top to bottom
		phase = 'encoding';
		fresh = Infinity;
		const total = tokens.length;
		const chunk = Math.max(1, Math.ceil(total / 35));
		for (numeric = 0; numeric < total; numeric = Math.min(total, numeric + chunk)) {
			if (!(await step(28))) return;
		}
		numeric = total;
		sentThisTurn = total;
		sentTotal += total;
		if (!(await step(500))) return;

		// 3. ...and goes into the LLM
		phase = 'feeding';
		if (!(await step(1500))) return;
		for (; numeric > 0; numeric = Math.max(0, numeric - chunk * 2)) {
			if (!(await step(16))) return;
		}

		// 4. Numbers come out one at a time and become words, until <|im_end|>
		phase = 'writing';
		const reply = [...words(option.reply), tag(END)];
		for (let i = 0; i < reply.length; i++) {
			const slowStart = i < 3 || i === reply.length - 1;
			if (!(await step(slowStart ? 450 : 120))) return;
			out = { id: reply[i].id, word: null };
			if (!(await step(slowStart ? 450 : 110))) return;
			out = { id: reply[i].id, word: reply[i].t.trim() };
			generated = [...generated, reply[i]];
			if (!(await step(slowStart ? 350 : 60))) return;
		}
		if (!(await step(700))) return;

		// 5. The reply joins the chat, and it's your turn again
		messages = [...messages, { role: 'assistant', text: option.reply }];
		generated = [];
		out = null;
		phase = 'choose';
	}

	function restart() {
		run++;
		messages = [];
		topic = null;
		generated = [];
		numeric = 0;
		fresh = Infinity;
		out = null;
		sentThisTurn = 0;
		sentTotal = 0;
		lastPick = null;
		phase = 'choose';
	}

	let chatEl = $state();
	$effect(() => {
		messages.length;
		typing;
		if (chatEl) chatEl.scrollTop = chatEl.scrollHeight;
	});
</script>

<div class="chat-demo">
	<div class="head">
		<div>
			<p class="step-label">Step 7 · Putting it together</p>
			<h2 class="step-title">So how does a chat work?</h2>
		</div>
		<p class="step-lede">
			A chat feels like a conversation, but the LLM is still just completing text. Send a message
			and watch what really goes in, and what comes out.
		</p>
	</div>

	<div class="stage" data-phase={phase}>
		<!-- The chat, as you see it -->
		<section class="phone">
			<header>Chat</header>
			<div class="messages" bind:this={chatEl}>
				{#if !messages.length}
					<p class="hint">Pick a message below to start.</p>
				{/if}
				{#each messages as m, i (i)}
					<p class="bubble {m.role}">{m.text}</p>
				{/each}
				{#if phase === 'writing' || phase === 'feeding' || phase === 'encoding'}
					<p class="bubble assistant typing">
						{#if typing}{typing}{:else}<span class="dots"><i></i><i></i><i></i></span>{/if}
					</p>
				{/if}
			</div>
			<div class="options">
				{#if phase === 'choose'}
					{#each options as o (o.text)}
						<button onclick={() => send(o)}>{o.text}</button>
					{/each}
					{#if userTurns > 0}
						<button class="restart" onclick={restart}>↺ New chat</button>
					{/if}
				{:else}
					<p class="wait">…</p>
				{/if}
			</div>
		</section>

		<!-- The raw context, as the LLM sees it -->
		<section class="raw">
			<div class="raw-head">
				<span class="label">What the LLM actually sees</span>
				<span class="sub">
					{#if phase === 'encoding' || phase === 'feeding'}…as numbers: {sentThisTurn || tokens.length} of them
					{:else}the whole conversation, every time{/if}
				</span>
			</div>
			<div class="raw-body" class:sending={phase === 'feeding'}>
				<ContextView {tokens} {numeric} {fresh} caret={phase === 'writing'} />
			</div>
			<p class="raw-foot">
				<code>&lt;|im_start|&gt;</code> and <code>&lt;|im_end|&gt;</code> mark who is talking (a
				format called ChatML).
			</p>
		</section>

		<!-- The black box from step 1 -->
		<section class="machine">
			<div class="io">
				<span class="label">In</span>
				<span class="in-count" class:on={phase === 'feeding'}>
					{sentThisTurn ? `${sentThisTurn} numbers` : '—'}
				</span>
			</div>
			<Pipe vertical flowing={phase === 'feeding'} />
			<LlmBox
				mode={phase === 'feeding' ? 'thinking' : phase === 'writing' ? 'working' : 'idle'}
				size="8.5rem"
			/>
			<Pipe vertical flowing={phase === 'writing'} />
			<div class="io">
				<span class="label">Out</span>
				<span class="out">
					{#if out}
						<span class="out-num">{out.id}</span>
						{#if out.word}<span class="arrow">→</span><span class="out-word" class:end={out.word === END}
								>{out.word}</span
							>{/if}
					{:else}—{/if}
				</span>
			</div>
			{#if sentTotal}
				<p class="total">Sent so far in this chat: <strong>{sentTotal}</strong> numbers</p>
			{/if}
		</section>
	</div>

	<p class="note" class:visible={!!note}>{note}</p>
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

	.stage {
		display: grid;
		grid-template-columns: 19rem minmax(0, 1fr) 11rem;
		gap: 1.5rem;
		margin-top: 1.75rem;
		height: 27rem;
	}
	.label {
		font-size: 0.72rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}

	/* Chat */
	.phone {
		display: flex;
		flex-direction: column;
		min-height: 0;
		background: var(--card);
		border: var(--bw) solid var(--line);
		border-radius: var(--radius-lg);
		overflow: hidden;
		font-family: var(--font-ui);
	}
	.phone header {
		padding: 0.7rem 1rem;
		border-bottom: var(--bw) solid var(--line);
		font-size: 0.85rem;
		font-weight: 600;
		text-align: center;
	}
	.messages {
		flex: 1;
		overflow-y: auto;
		padding: 0.8rem;
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
	}
	.hint {
		margin: auto;
		color: var(--muted);
		font-size: 0.9rem;
	}
	.bubble {
		margin: 0;
		max-width: 85%;
		padding: 0.5rem 0.75rem;
		border-radius: var(--radius);
		font-size: 0.88rem;
		line-height: 1.4;
		animation: in 0.25s ease-out both;
	}
	@keyframes in {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
	}
	.bubble.user {
		align-self: flex-end;
		background: var(--accent);
		color: white;
		border-bottom-right-radius: 4px;
	}
	.bubble.assistant {
		align-self: flex-start;
		background: var(--track);
		border-bottom-left-radius: 4px;
	}
	.dots {
		display: inline-flex;
		gap: 3px;
	}
	.dots i {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--muted);
		animation: bounce 1s ease-in-out infinite;
	}
	.dots i:nth-child(2) {
		animation-delay: 0.15s;
	}
	.dots i:nth-child(3) {
		animation-delay: 0.3s;
	}
	@keyframes bounce {
		50% {
			transform: translateY(-3px);
			opacity: 0.5;
		}
	}
	.options {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		padding: 0.7rem;
		border-top: var(--bw) solid var(--line);
		background: var(--paper);
		min-height: 6rem;
	}
	.options button {
		font: inherit;
		font-size: 0.85rem;
		text-align: left;
		padding: 0.45rem 0.7rem;
		border-radius: var(--radius-sm);
		border: var(--bw) solid var(--line);
		background: var(--card);
		color: var(--ink);
		cursor: pointer;
	}
	.options button:hover {
		border-color: var(--accent);
		color: var(--accent);
	}
	.options .restart {
		border-style: dashed;
		color: var(--ink-soft);
	}
	.wait {
		margin: auto;
		color: var(--muted);
	}

	/* Raw context */
	.raw {
		display: flex;
		flex-direction: column;
		min-height: 0;
		min-width: 0;
		background: var(--dark);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-lift);
		overflow: hidden;
	}
	.raw-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
		padding: 0.8rem 1.1rem 0;
	}
	.raw .label {
		color: color-mix(in srgb, var(--on-dark) 60%, transparent);
	}
	.sub {
		font-size: 0.8rem;
		font-style: italic;
		color: var(--accent-mid);
	}
	.raw-body {
		flex: 1;
		min-height: 0;
		transition: box-shadow 0.4s;
	}
	.raw-body.sending {
		box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--accent-mid) 50%, transparent);
	}
	.raw-foot {
		margin: 0;
		padding: 0.6rem 1.1rem 0.8rem;
		font-size: 0.78rem;
		color: color-mix(in srgb, var(--on-dark) 50%, transparent);
		border-top: 1px solid rgba(255, 255, 255, 0.08);
	}
	.raw-foot code {
		color: var(--tag);
	}

	/* Machine */
	.machine {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.io {
		display: grid;
		justify-items: center;
		gap: 0.25rem;
		min-height: 3.2rem;
	}
	.in-count {
		font-family: var(--font-mono);
		font-size: 0.85rem;
		color: var(--ink-soft);
		transition: color 0.3s;
	}
	.in-count.on {
		color: var(--accent);
		font-weight: bold;
	}
	.out {
		font-family: var(--font-mono);
		font-size: 0.9rem;
		white-space: nowrap;
	}
	.out-num {
		color: var(--accent);
	}
	.arrow {
		margin: 0 0.3rem;
		color: var(--ink-soft);
	}
	.out-word {
		font-family: var(--font-body);
		font-size: 1.05rem;
		animation: in 0.2s ease-out both;
	}
	.out-word.end {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--tag-ink);
	}
	.total {
		margin: 0.75rem 0 0;
		font-size: 0.8rem;
		text-align: center;
		color: var(--ink-soft);
	}
	.total strong {
		color: var(--ink);
	}

	.note {
		max-width: 48rem;
		min-height: 3.4em;
		margin: 1.25rem 0 0;
		font-size: 1.05rem;
		line-height: 1.6;
		opacity: 0;
		transition: opacity 0.5s;
	}
	.note.visible {
		opacity: 1;
	}

	@media (max-width: 960px) {
		.head {
			grid-template-columns: minmax(0, 1fr);
		}
		.step-lede {
			margin-top: 1rem;
		}
		.stage {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
			grid-template-rows: 26rem auto;
			height: auto;
		}
		.machine {
			grid-column: 1 / -1;
			flex-direction: row;
			flex-wrap: wrap;
			gap: 0.5rem 1rem;
		}
	}
	@media (max-width: 640px) {
		.stage {
			grid-template-columns: minmax(0, 1fr);
			grid-template-rows: 24rem auto 20rem;
			gap: 1rem;
		}
		.machine {
			grid-row: 2;
		}
		.raw {
			grid-row: 3;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.bubble,
		.dots i,
		.out-word {
			animation: none;
		}
	}
</style>
