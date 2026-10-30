// The models we compare: Google's hosted Gemini tiers against open models small enough to run on
// our own lab box (one GPU, 32 GB). Mirrors models.py in the llmbench project, simplified.
// Sizes are in billions of parameters; Google does not publish Gemini's. Memory is approximate:
// the weights compressed to about 4 bits per parameter, before room for the text being processed.

export const GPU_GB = 32;

export const models = [
	{
		id: 'gemini-pro',
		name: 'Gemini Pro',
		family: 'Gemini',
		camp: 'cloud',
		size: null,
		note: 'Google’s strongest tier. On our list, not in our runs yet.'
	},
	{
		id: 'gemini-flash',
		name: 'Gemini Flash',
		family: 'Gemini',
		camp: 'cloud',
		size: null,
		note: 'The fast, cheaper workhorse. We test it with thinking set to high.'
	},
	{
		id: 'gemini-flash-lite',
		name: 'Gemini Flash-Lite',
		family: 'Gemini',
		camp: 'cloud',
		size: null,
		note: 'The cheapest Gemini, and the one a small model has to beat to be worth it.'
	},
	{
		id: 'qwen-35b',
		name: 'Qwen 3.6 35B',
		family: 'Qwen',
		camp: 'lab',
		size: 35,
		memory: 20,
		note: 'The biggest Qwen that still fits on the box.'
	},
	{
		id: 'qwen-27b',
		name: 'Qwen 3.8 27B',
		family: 'Qwen',
		camp: 'lab',
		size: 27,
		memory: 16,
		note: 'Tested three times over: thinking low, medium and extra high. Same weights, three results.'
	},
	{
		id: 'gemma-26b',
		name: 'Gemma 4 26B',
		family: 'Gemma',
		camp: 'lab',
		size: 26,
		memory: 15,
		note: 'Google’s own open model: a small cousin of Gemini you can download.'
	},
	{
		id: 'gemma-12b',
		name: 'Gemma 4 12B',
		family: 'Gemma',
		camp: 'lab',
		size: 12,
		memory: 7,
		note: 'The smallest contender: fast and light, if it is good enough.'
	}
];

export const camps = {
	cloud: { name: 'Google’s cloud', pays: 'Per request (per token)', data: 'Sent to Google', hardware: 'Google’s data centres' },
	lab: { name: 'Our lab box', pays: 'Nothing per request: just the machine', data: 'Never leaves the building', hardware: 'One GPU with 32 GB of memory' }
};
