// The llmbench project's sample data (data/requests.csv): recorded requests, with the answer
// Gemini gave at the time as what we expect. Everything else is made up, to give the factory
// something to show:
//   ours    – what a model on our own server answers: mostly the same, one wrong, and a few right
//             but worded differently, which an exact check can't tell apart from wrong
//   seconds – how long our server took, for the probes
//   judge   – what a second LLM decides when asked whether ours is correct, and why
//   fails   – the server never answered (only where a step lets the server fail)
export const requests = [
	{ id: 'req-0001', system: 'Answer with a single word.', question: 'What is the capital of Spain?', answer: 'Madrid', ours: 'Madrid', seconds: 0.62 },
	{ id: 'req-0002', system: 'Answer with a single word.', question: 'What is the capital of France?', answer: 'Paris', ours: 'Paris', seconds: 0.58 },
	{ id: 'req-0003', system: 'Answer with a single word.', question: 'Which planet is closest to the Sun?', answer: 'Mercury', ours: 'Venus', seconds: 0.71, judge: { ok: false, why: 'Venus is second; Mercury is the closest.', seconds: 2.1 } },
	{ id: 'req-0004', system: 'Answer with a single word.', question: 'What is the chemical symbol for gold?', answer: 'Au', ours: 'Au', seconds: 0.55 },
	{ id: 'req-0005', system: '', question: 'Reply with just the number: what is 17 * 23?', answer: '391', ours: '391', seconds: 1.34 },
	{ id: 'req-0006', system: '', question: 'Reply with just the number: how many minutes are in three days?', answer: '4320', ours: '4,320 minutes', seconds: 1.82, judge: { ok: true, why: 'Same number, written with a comma and a unit.', seconds: 2.4 } },
	{ id: 'req-0007', system: 'Answer with a single word.', question: 'In which year did the Berlin Wall fall?', answer: '1989', ours: '1989', seconds: 0.66 },
	{ id: 'req-0008', system: 'You are terse. Answer with a single word.', question: 'What language is spoken in Brazil?', answer: 'Portuguese', ours: 'Portuguese (Brazilian)', seconds: 0.6, judge: { ok: true, why: 'Correct, with a little extra detail.', seconds: 1.9 } },
	{ id: 'req-0009', system: 'Answer with a single word.', question: 'What is the largest ocean on Earth?', answer: 'Pacific', ours: 'Pacific', seconds: 0.57, fails: 'No answer: timed out after 30 s' },
	{ id: 'req-0010', system: 'Answer with a single word.', question: 'What does "HTTP" stand for? Reply with the first word only.', answer: 'Hypertext', ours: 'HyperText', seconds: 0.93, judge: { ok: true, why: 'Same word, different capitals.', seconds: 1.7 } }
];
