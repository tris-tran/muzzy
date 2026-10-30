// The llmbench project as a graph: the providers out there, the library's three layers, and the
// app with its benchmarks. Positions are in SVG units on a 1280 × 860 drawing.
// Names are the project's own (llmbench/*/__init__.py, main.py, models.py, benchmarks/replay/).

export const SIZE = { w: 1280, h: 860 };
const W = 160;
const H = 56;

// Areas drawn behind the boxes, outermost first
export const groups = [
	{ id: 'providers', x: 16, y: 578, w: 220, h: 262, title: 'Out there · the providers' },
	{ id: 'library', x: 252, y: 34, w: 588, h: 806, title: 'llmbench · the library' },
	{ id: 'engine-layer', x: 268, y: 74, w: 556, h: 236, title: 'llmbench.engine · running benchmarks', layer: true },
	{ id: 'bench-layer', x: 268, y: 326, w: 556, h: 236, title: 'llmbench.bench · defining benchmarks', layer: true },
	{ id: 'llm-layer', x: 268, y: 578, w: 556, h: 246, title: 'llmbench.llm · calling models', layer: true },
	{ id: 'app', x: 856, y: 34, w: 408, h: 806, title: 'The app · this repository' },
	{ id: 'benchmarks', x: 872, y: 182, w: 376, h: 494, title: 'benchmarks/ · one package each' },
	{ id: 'replay', x: 886, y: 218, w: 348, h: 352, title: 'replay/ · re-run recorded requests', accent: true },
	{ id: 'next', x: 886, y: 586, w: 348, h: 74, title: 'your next benchmark/', dashed: true, sub: 'inputs · source · steps · main' }
];

const node = (id, x, y, title, sub, info, extra = {}) => ({ id, x, y, w: W, h: H, title, sub, info, ...extra });

export const nodes = [
	// The providers
	node('openai', 40, 616, 'OpenAI', 'hosted API', 'OpenAI’s own service. Spoken to with the OpenAI protocol.', { w: 172, kind: 'outside' }),
	node('lab', 40, 686, 'Our lab box', 'lab-8088 · vLLM / Ollama', 'One GPU with 32 GB, serving Gemma and Qwen. It speaks the OpenAI protocol, so the same client talks to it under its own name.', { w: 172, h: 70, kind: 'outside', sub2: 'Gemma · Qwen' }),
	node('vertex', 40, 770, 'Google Vertex', 'Gemini', 'Google’s cloud, where Gemini runs. Spoken to with the Vertex protocol.', { w: 172, kind: 'outside' }),

	// llmbench.engine
	node('source', 290, 116, 'InputSource', 'your data, as a stream', 'Anything that can hand over inputs one at a time. Each benchmark writes its own: a CSV, a table, a folder.'),
	node('engine', 460, 116, 'ExecutionEngine', 'Sequential · Parallel', 'Reads the source once and puts every input through every benchmark. Sequential while you write one; parallel (a pool of threads) for the real run.', { key: true }),
	node('clients', 640, 116, 'Clients', 'a client per provider', 'Pairs each provider a benchmark names with a live client, so steps never build connections themselves.'),
	node('result', 290, 214, 'InputResult', 'output · ending · stats', 'One input, one pass, one benchmark: the output, how it ended (completed, stopped, failed), which steps ran, its stats and its time.'),
	node('sink', 460, 214, 'ResultSink', 'JSON files · memory', 'Where results go, the moment each one is done. The engine never learns about file formats.'),
	node('report', 640, 214, 'RunReport', 'the counts per run', 'What a run returns: which engine, which source, how long, and the counts per benchmark.'),

	// llmbench.bench
	node('benchmark', 290, 368, 'Benchmark', 'input type + steps + config', 'A benchmark is a frozen definition: the shape of its inputs, a chain of steps, and the conditions. The chain is checked when it is built, not at input 400.', { key: true }),
	node('config', 460, 368, 'BenchmarkConfig', 'model · repetitions · …', 'The conditions: which model, how many repetitions, how many at once, a row limit, and what to do on an error.'),
	node('input', 640, 368, 'BenchmarkInput', 'one item, with an id', 'The base of every input shape: one item of work, carrying its own id.'),
	node('step', 290, 462, 'Step', 'in → (keep going?, output)', 'One machine on the belt: takes an input, returns whether to keep going and an output. A GenerationStep is a Step that asks the model: it only builds the prompt; asking the model, timing it and counting tokens is done for it.', { key: true }),
	node('trace', 460, 462, 'Trace · Runtime', 'the past · the model', 'The trace lets a step look back at every earlier step. The runtime holds the bound model and times every step.'),
	node('stats', 640, 462, 'StepLogger · Stats', 'says · counts', 'Handed to every step: a logger to say what it is doing, and somewhere to count and record numbers.'),

	// llmbench.llm
	node('client', 290, 620, 'LLMClient', 'generate · embed', 'The one interface every backend implements. A step only ever sees this, never a provider’s own SDK.', { key: true }),
	node('provider', 460, 620, 'Provider', 'deployment + protocol', 'Which machine serves a model, and which protocol it speaks: “lab-8088 over OpenAI”. A client refuses models from other providers.'),
	node('model', 640, 620, 'Model · Context', 'what to call · send', 'A model as we want to call it (thinking level, output limit…), and the prompt: system text and messages.'),
	node('openaiC', 290, 720, 'OpenAIClient', 'OpenAI protocol', 'The OpenAI backend. Talks to OpenAI itself and to anything OpenAI-compatible, like our lab box.'),
	node('vertexC', 460, 720, 'VertexClient', 'Vertex protocol', 'The Vertex backend, for Gemini.'),
	node('response', 640, 720, 'Response · Usage', 'text · tokens · latency', 'What comes back, the same shape from every provider: the text, token counts, how long it took.'),

	// The app
	node('main', 880, 76, 'main.py', 'CLI · registry · runner', 'The app: takes a data folder and a results folder, picks the runner, and asks each registered benchmark what to run.', { w: 176 }),
	node('modelsPy', 1072, 76, 'models.py', 'Models enum · lab client', 'Every model we can measure (Gemma, Qwen, Gemini…) and the client for our lab box. Shared by all benchmarks.', { w: 176 }),
	node('rInputs', 902, 262, 'RecordedRequest', 'inputs.py', 'Replay’s input shape: the id, the instructions, the question and the answer recorded at the time.', { w: 154 }),
	node('rSource', 1066, 262, 'CsvRequests', 'source.py', 'Replay’s dock: reads requests.csv one row at a time and yields RecordedRequests.', { w: 154 }),
	node('rReplay', 902, 356, 'Replay', 'steps/replay.py', 'Step 1, a GenerationStep: builds the prompt from the recorded instructions and question. Which model answers is the config’s business.', { w: 154 }),
	node('rJudge', 1066, 356, 'Judge', 'steps/judge.py', 'Step 2: compares the new answer with the recorded one (ignoring capitals here) and stops with a Verdict.', { w: 154 }),
	node('rMain', 984, 450, 'main() → Job', 'benchmark + source', 'Replay’s entry point: builds the Benchmark (Replay, then Judge, under its config) and returns it with its source.', { w: 154 }),
	node('data', 880, 700, 'data/requests.csv', 'the recorded requests', 'The sample data: ten recorded requests with the answer we got at the time.', { w: 176, kind: 'file' }),
	node('results', 1072, 700, 'results/*.json', 'one file per execution', 'What a run leaves behind: one JSON file per benchmark, provider and model, with every input’s result.', { w: 176, kind: 'file' })
];

// [from, to, label]
export const edges = [
	['engine', 'source', 'reads'],
	['engine', 'clients', 'uses'],
	['engine', 'result', 'makes'],
	['engine', 'sink', 'hands results to'],
	['engine', 'report', 'returns'],
	['engine', 'benchmark', 'runs'],
	['sink', 'results', 'writes'],
	['benchmark', 'step', 'a chain of'],
	['benchmark', 'config', 'under'],
	['benchmark', 'input', 'takes'],
	['step', 'trace', 'sees'],
	['step', 'stats', 'reports to'],
	['step', 'client', 'asks the model'],
	['clients', 'client', 'holds'],
	['client', 'openaiC', 'is'],
	['client', 'vertexC', 'is'],
	['client', 'response', 'returns'],
	['client', 'model', 'takes'],
	['model', 'provider', 'belongs to'],
	['openaiC', 'openai', ''],
	['openaiC', 'lab', ''],
	['vertexC', 'vertex', ''],
	['main', 'rMain', 'asks for a Job'],
	['main', 'engine', 'picks the runner'],
	['main', 'clients', 'builds'],
	['modelsPy', 'model', 'defines'],
	['modelsPy', 'lab', 'points at'],
	['rInputs', 'input', 'is a'],
	['rSource', 'source', 'is a'],
	['rReplay', 'step', 'is a'],
	['rJudge', 'step', 'is a'],
	['rMain', 'benchmark', 'builds'],
	['data', 'rSource', 'read by']
];

// One input's journey through the whole stack
export const journey = [
	['data', 'A row waits in data/requests.csv.'],
	['rSource', 'CsvRequests reads it and yields a RecordedRequest.'],
	['source', 'To the engine it is just an InputSource: “give me the next one”.'],
	['engine', 'The engine (sequential or parallel) puts the input through the benchmark.'],
	['rReplay', 'Replay, a GenerationStep, builds the prompt.'],
	['client', 'The runtime hands it to the bound model’s LLMClient.'],
	['openaiC', 'OpenAIClient translates it into the OpenAI protocol…'],
	['lab', '…and sends it to our lab box, where Qwen answers.'],
	['response', 'The answer comes back as a Response: text, tokens, latency.'],
	['rJudge', 'Judge compares it with the recorded answer and stops with a Verdict.'],
	['result', 'The engine wraps it up as an InputResult: output, ending, stats, time.'],
	['sink', 'It goes to the ResultSink the moment it’s done…'],
	['results', '…and lands in a JSON file, one per model run.']
];
