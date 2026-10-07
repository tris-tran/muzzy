// Turns a chat into the text an LLM actually sees, in the ChatML format:
//
//   <|im_start|>system
//   You are a helpful assistant.<|im_end|>
//   <|im_start|>user
//   Hi!<|im_end|>
//   <|im_start|>assistant
//   ← the model completes from here
//
// The text is split into pieces, each with a number (what the LLM really receives).
// The tag numbers are the real ones; the word numbers are made up but stable.

export const START = '<|im_start|>';
export const END = '<|im_end|>';
export const SYSTEM = 'You are a helpful assistant.';

const TAG_IDS = { [START]: 100264, [END]: 100265 };
const NEWLINE = { t: '\n', id: 198, kind: 'nl' };

export function idFor(word) {
	let h = 0;
	for (const c of word) h = (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0;
	return 300 + (h % 49700);
}

export const tag = (t) => ({ t, id: TAG_IDS[t], kind: 'tag' });

/** Words of a message; every word after the first keeps its leading space. */
export function words(text) {
	return text.split(' ').map((w, i) => ({ t: (i ? ' ' : '') + w, id: idFor(w), kind: 'word' }));
}

/** A role's opening: <|im_start|>role + newline */
export const opening = (role) => [tag(START), { t: role, id: idFor(role), kind: 'role' }, NEWLINE];

/** One full message: opening, its words, <|im_end|> + newline */
export const message = (role, text) => [...opening(role), ...words(text), tag(END), NEWLINE];

/**
 * The whole context for a chat.
 *   messages – [{ role: 'user' | 'assistant', text }]
 *   open     – true to end with an open assistant turn for the model to complete
 *   partial  – pieces the model has written so far in that open turn
 */
export function context(messages, { open = false, partial = [] } = {}) {
	const out = [...message('system', SYSTEM)];
	for (const m of messages) out.push(...message(m.role, m.text));
	if (open) out.push(...opening('assistant'), ...partial);
	return out;
}
