// A pretend gzip, made of the idea rather than the real thing: count the words, give the repeated
// ones a one-symbol code, write that dictionary in a header, and swap the words for their codes.
// Real gzip points back at earlier text instead of keeping a list, but the idea is the same:
// write repeats only once.

// One symbol each, never used by the sample texts
export const CODES = [...'①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳'];

/** Split a text into pieces: words, and the bits between them (spaces, commas, new lines). */
export function tokenize(text) {
	let w = 0;
	return text
		.split(/(\p{L}+)/u)
		.filter((t) => t !== '')
		.map((t) => (/^\p{L}+$/u.test(t) ? { t, word: w++ } : { t, word: -1 }));
}

/** How often each word appears among the first `upTo` words, most common first */
export function countWords(tokens, upTo = Infinity) {
	const counts = new Map();
	for (const tok of tokens) {
		if (tok.word < 0 || tok.word >= upTo) continue;
		counts.set(tok.t, (counts.get(tok.t) ?? 0) + 1);
	}
	return [...counts]
		.map(([word, count]) => ({ word, count }))
		.sort(
			(a, b) => b.count - a.count || b.word.length - a.word.length || a.word.localeCompare(b.word)
		);
}

// A header entry costs the code, the word, and a separator
const entryCost = (word) => word.length + 2;
// Every time a word is swapped, its letters shrink to one symbol
const saving = ({ word, count }) => count * (word.length - 1) - entryCost(word);

/**
 * Pick the words worth a code: those that save more space in the text than they cost in the header.
 * Returns every repeated word with its decision, plus the dictionary itself (word → code).
 */
export function buildDictionary(counts) {
	const worth = counts
		.filter((c) => c.count > 1 && saving(c) > 0)
		.sort((a, b) => saving(b) - saving(a))
		.slice(0, CODES.length);
	// Codes go to the most common words first, so ① is the most used
	const chosen = new Set(worth.map((c) => c.word));
	const codes = new Map();
	counts.filter((c) => chosen.has(c.word)).forEach((c, i) => codes.set(c.word, CODES[i]));
	return codes;
}

/** Size of the header that holds the dictionary (plus the line that ends it) */
export const headerSize = (codes) =>
	[...codes.keys()].reduce((sum, w) => sum + entryCost(w), 0) + 1;

/** Size of the text after the first `swapped` words have been replaced by their codes */
export function bodySize(tokens, codes, swapped = Infinity) {
	let size = 0;
	for (const tok of tokens)
		size += tok.word >= 0 && tok.word < swapped && codes.has(tok.t) ? 1 : [...tok.t].length;
	return size;
}

/** Pack: the text with every dictionary word swapped for its code */
export const pack = (tokens, codes) =>
	tokens.map((tok) => (tok.word >= 0 && codes.get(tok.t)) || tok.t).join('');

/** Unpack: look every code up in the header and put the word back */
export function unpack(packed, codes) {
	const words = new Map([...codes].map(([w, c]) => [c, w]));
	return [...packed].map((ch) => words.get(ch) ?? ch).join('');
}
