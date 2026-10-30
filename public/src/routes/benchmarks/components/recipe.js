// What you decide to make a new benchmark, in the order you decide it, as pseudocode. Every part
// is a list of lines; a line with a `key` can be tapped, and `fields[key]` explains it, with an
// example and, where it helps, a few lines showing how it's used.
// Names and rules are the project's own (llmbench/bench, llmbench/engine, main.py).
//   line:  [code, key?, note?]
//   field: { title, text, use?: [pseudocode lines], example?, note? }

export const parts = [
	{
		id: 'source',
		tab: 'The source',
		title: 'Where the inputs come from, and how to read them',
		text: 'The first decision. Your data can live anywhere; the source is the one piece that knows where, and turns it into inputs, one at a time.',
		code: [
			['source <your source>:', 'source'],
			['  set up with:  where the data lives', 'source-setup'],
			['', null],
			['  items():', 'source-items'],
			['    open it', 'source-open'],
			['    for each record:', 'source-each'],
			['      tidy it up', 'source-tidy'],
			['      give back one input', 'source-give'],
			['', null],
			['  describe():  one line for the log', 'source-describe']
		],
		chips: {
			label: 'A source can read',
			items: ['a CSV or spreadsheet', 'a database table', 'a folder of files', 'an API', 'a queue', 'questions generated on the fly', 'a short list written by hand']
		}
	},
	{
		id: 'input',
		tab: 'The input shape',
		title: 'What one item of work looks like',
		text: 'Whatever the source read, it hands over the same shape every time. You choose the fields: everything the steps will need.',
		code: [
			['input <your input>:', 'input'],
			['  id', 'input-id', 'required'],
			['  …your fields…', 'input-fields'],
			['', null],
			['for example:', null],
			['  question', 'input-question'],
			['  expected answer   (optional)', 'input-expected'],
			['  a document to read', 'input-document'],
			['  language, difficulty, tags…', 'input-tags']
		]
	},
	{
		id: 'step',
		tab: 'A step',
		title: 'A machine: everything run is handed',
		text: 'A step says what it takes, what it gives, and has one function, run. Five things are handed to run, and between them a step can do almost anything. Tap each one.',
		code: [
			['step <name>:', 'step-name'],
			['  takes:  <a shape>', 'step-takes'],
			['  gives:  <a shape>', 'step-gives'],
			['', null],
			['  run(', 'step-run'],
			['    item,', 'p-item', 'what comes in'],
			['    trace,', 'p-trace', 'everything before'],
			['    runtime,', 'p-runtime', 'the model, and where we are'],
			['    logger,', 'p-logger', 'say things'],
			['    stats', 'p-stats', 'keep numbers'],
			['  ):', null],
			['    …your work…', 'step-work', 'anything code can do'],
			['    return  (keep going?, output)', 'step-return']
		]
	},
	{
		id: 'returns',
		tab: 'What a step returns',
		title: 'How a card leaves a machine',
		text: 'Every step ends in one of three ways, and hands over an output whose shape you design, just like the input.',
		code: [
			['return go on (output)', 'r-go', 'the next step gets it'],
			['return stop (output)', 'r-stop', 'finished, on purpose'],
			['throw an error', 'r-fail', 'failed'],
			['', null],
			['output <your output>:', 'out'],
			['  input id', 'out-id'],
			['  …your fields…', 'out-fields'],
			['', null],
			['kept for every input, by the engine:', 'result'],
			['  benchmark · provider · model', 'result-who'],
			['  input id · repetition', 'result-id'],
			['  ending:  completed · stopped · failed', 'result-ending'],
			['  steps run · output · error', 'result-output'],
			['  duration · stats', 'result-stats']
		]
	},
	{
		id: 'benchmark',
		tab: 'The benchmark',
		title: 'The benchmark and its conditions',
		text: 'Put it together: the input shape, the steps in order, and the conditions to run under. The steps never say which model; that lives here, so swapping the model is one line.',
		code: [
			['benchmark:', 'bench'],
			['  name', 'bench-name'],
			['  description', 'bench-description'],
			['  input type', 'bench-input'],
			['  steps', 'bench-steps', 'in order'],
			['  config:', 'config'],
			['    model', 'cfg-model'],
			['    embedding model', 'cfg-embedding'],
			['    repetitions', 'cfg-repetitions'],
			['    concurrency', 'cfg-concurrency'],
			['    limit', 'cfg-limit'],
			['    on error', 'cfg-onerror', 'stop · record'],
			['', null],
			['model:', 'model'],
			['  provider', 'model-provider'],
			['  name', 'model-name'],
			['  thinking', 'model-thinking', 'none · low · medium · high'],
			['  max output', 'model-max'],
			['  provider options', 'model-options'],
			['', null],
			['main(data folder):  return benchmark + source', 'main']
		]
	},
	{
		id: 'running',
		tab: 'Running it',
		title: 'The conditions of the run, not of the benchmark',
		text: 'How to run is decided once for the whole run, outside any benchmark: the same benchmarks can run one at a time today and in parallel tomorrow, written to files or kept in memory.',
		code: [
			['run:', 'run'],
			['  data folder', 'run-data'],
			['  results folder', 'run-results'],
			['  only', 'run-only', 'which benchmarks'],
			['', null],
			['  runner', 'run-runner', 'sequential · parallel'],
			['    max workers', 'run-workers'],
			['  clients', 'run-clients', 'one per provider'],
			['  sink', 'run-sink', 'where results go'],
			['  logger', 'run-logger', 'where lines go'],
			['', null],
			['  returns:  a report per run', 'run-report']
		]
	}
];

export const fields = {
	// The source
	source: { title: 'A source', text: 'Yours to write, one per kind of data. Behind it, the rest of the benchmark never knows whether the inputs came from a file or a database: swap the source and nothing else changes.' },
	'source-setup': { title: 'Set up with', text: 'Whatever it needs to find the data, given when it’s created.', example: 'a file path · a database connection and a query · an API address and a key' },
	'source-items': { title: 'items()', text: 'The one function you must write. It gives back inputs one at a time, as they’re read, never as one big list. The engine reads it once, from the top.', example: 'a million rows never have to fit in memory' },
	'source-open': { title: 'Open it', text: 'Open the file, run the query, call the API. Page through it if it’s big.' },
	'source-each': { title: 'One record at a time', text: 'The first input is on its way to the model before the last record is read.' },
	'source-tidy': { title: 'Tidy it up', text: 'The source is the place to clean: trim spaces, turn an empty cell into “nothing”, skip rows you don’t want, build a stable id.', example: 'skip rows without a question' },
	'source-give': { title: 'Give back one input', text: 'Always in your input shape (next tab), whatever the record looked like.' },
	'source-describe': { title: 'describe()', text: 'Optional. One line saying what it reads, written in the run’s log.', example: '“orders table, last 30 days”' },

	// The input shape
	input: { title: 'The input shape', text: 'A name and a list of fields. Once made, an input can’t be changed, so every step sees exactly what the source gave.' },
	'input-id': { title: 'id', text: 'The only required field. Chosen by you and stable: a request id, a database key, a hash of the text. Never “the 3rd row”: that breaks the moment you filter or reorder. An empty id is refused.', example: 'every result points back to its input by this id' },
	'input-fields': { title: 'Your fields', text: 'Anything the steps will need later. If a step will need it, put it in the input, not in the step.' },
	'input-question': { title: 'A question', text: 'What the model will be asked, or the material to build the prompt from.' },
	'input-expected': { title: 'An expected answer', text: 'If there is an answer key. Not every benchmark has one: some only measure speed, or let a judge decide.' },
	'input-document': { title: 'A document', text: 'For summaries, extraction, translation: the text to work on, or where to find it.' },
	'input-tags': { title: 'Labels', text: 'Anything to slice the results by later.', example: 'accuracy per difficulty level' },

	// A step
	'step-name': { title: 'name', text: 'Unique within the benchmark: later steps use it to look this one up, and its numbers are filed under it.', example: '“answer”, “check”, “judge”' },
	'step-takes': { title: 'takes', text: 'What comes in: the input shape for the first step, the previous step’s output for the rest.' },
	'step-gives': { title: 'gives', text: 'What comes out. If the next step takes something else, the benchmark refuses to be built: you find out before input 400, not at it.' },
	'step-run': { title: 'run(…)', text: 'Called once per card. Everything it may use arrives as one of these five, so a step never has to go looking for anything.' },
	'p-item': {
		title: 'item',
		text: 'This step’s input: the card as the previous step left it, or the input itself for the first step.',
		use: ['item.question', 'item.text          (if the last step asked a model)']
	},
	'p-trace': {
		title: 'trace',
		text: 'Every earlier step’s input and output, by name. A step deep in the chain can reach back for the original question without the steps in between carrying it.',
		use: ['trace: the first input', 'trace: what "answer" was given', 'trace: what "answer" gave', 'trace: the step just before']
	},
	'p-runtime': {
		title: 'runtime',
		text: 'The model under test, already connected: a step never says which model or where. Ask it as often as you like. Also: which card, which pass, and the run’s settings.',
		use: [
			'runtime.model: generate(prompt)',
			'   → text · tokens · latency',
			'runtime.embedding model: embed(texts)',
			'runtime: input id · repetition · config'
		],
		note: 'Most first steps only ask the model. For those there’s a ready-made step: you write how to build the prompt; asking, timing, counting tokens and stopping on an empty answer are done for you.'
	},
	'p-logger': {
		title: 'logger',
		text: 'Say what’s happening, at four levels. Each line is already tagged with the card and the step. Loud while you write a benchmark, quiet in a big run, and the step doesn’t change.',
		use: ['logger: debug "prompt built"', 'logger: info "answers differ"', 'logger: warning "answer was cut off"']
	},
	'p-stats': {
		title: 'stats',
		text: 'Numbers worth keeping beside the output, saved with the result and filed under the step’s name. Three kinds, read differently later.',
		use: ['stats: count "retries" + 1        a running total', 'stats: record "score" 0.82          a series to average', 'stats: note "rule" "loose"          a fact'],
		note: 'Every step’s time is recorded without asking.'
	},
	'step-work': {
		title: 'Your work',
		text: 'A step is ordinary code. Compare texts, parse JSON, run a calculation, ask the model twice, read a dictionary, call a web service, write a file.',
		use: ['write file "out/{input id}.json"'],
		note: 'Several cards may run at once: name files by the input id so they don’t overwrite each other.'
	},
	'step-return': { title: 'return', text: 'Whether the card goes on, and the output. More in the next tab.' },

	// What a step returns
	'r-go': { title: 'go on', text: 'The next step gets this output as its item. After the last step, the card is completed.' },
	'r-stop': { title: 'stop', text: 'The card is finished here, on purpose: nothing left worth asking. Its output is kept, and the remaining steps don’t run.', example: 'a cheap check already settled it · the row is out of scope · the model said nothing' },
	'r-fail': { title: 'throw an error', text: 'Something broke: a timeout, a refusal, bad data. The card is marked failed with the reason, and the time is still recorded. The config’s “on error” decides what it costs.' },
	out: { title: 'The output shape', text: 'Designed by you, like the input. The last step’s output is the benchmark’s answer for that input.' },
	'out-id': { title: 'input id', text: 'Not required, but worth carrying, so the output still makes sense on its own.' },
	'out-fields': { title: 'Your fields', text: 'Keep what a person will want to see later, not just a yes or no: both answers, the score, the reason.', example: 'agrees · expected · got · score · why' },
	result: { title: 'The result', text: 'Around your output, the engine records the rest for every input, the same way for every benchmark, and hands it to the sink.' },
	'result-who': { title: 'benchmark · provider · model', text: 'Which execution it belongs to.' },
	'result-id': { title: 'input id · repetition', text: 'Which input, and which pass over it, counting from 0.' },
	'result-ending': { title: 'ending', text: 'completed: went all the way. stopped: a step ended it on purpose. failed: a step threw an error.' },
	'result-output': { title: 'steps run · output · error', text: 'How far it got, what the last step returned, and the error if it failed.' },
	'result-stats': { title: 'duration · stats', text: 'How long the card took in total, and every number every step recorded, including each step’s own time.' },

	// The benchmark
	bench: { title: 'The benchmark', text: 'Built once, before anything runs, and checked: the input shape has an id, there’s at least one step, names are unique, and each step takes what the one before gives.' },
	'bench-name': { title: 'name', text: 'Names this execution in the results. Two configs of one model (two thinking levels, say) need two names, or the run refuses.' },
	'bench-description': { title: 'description', text: 'One line for humans.' },
	'bench-input': { title: 'input type', text: 'The input shape. The first step must take it.' },
	'bench-steps': { title: 'steps', text: 'The machines, in order. The same step can be reused with different settings, as long as each copy has its own name.' },
	config: { title: 'config', text: 'The conditions this benchmark runs under. Part of the benchmark, so every result carries what produced it. Same steps, another model: swap only this.' },
	'cfg-model': { title: 'model', text: 'The model under test: a description, not a connection. The run connects it.' },
	'cfg-embedding': { title: 'embedding model', text: 'Only for steps that compare meanings instead of texts. Nothing, if no step needs one.' },
	'cfg-repetitions': { title: 'repetitions', text: 'How many times each input runs. More than one to see how much the answers vary.', example: '1 · 5 for variance' },
	'cfg-concurrency': { title: 'concurrency', text: 'How many of this benchmark’s cards may be in flight at once. A small GPU wants 1; a cloud API can take many.' },
	'cfg-limit': { title: 'limit', text: 'Only take the first N inputs. A small number for a quick, cheap try; nothing for all of them.', example: '20 for a smoke test' },
	'cfg-onerror': { title: 'on error', text: 'stop: the first error ends the whole run, which is what you want while writing it. record: mark that card failed and carry on, which is what you want unattended.' },
	model: { title: 'A model', text: 'A model as we want to call it. Defined once in models.py and shared by every benchmark.' },
	'model-provider': { title: 'provider', text: 'Which machine serves it, and which protocol it speaks.', example: 'our lab box over OpenAI · Google Vertex' },
	'model-name': { title: 'name', text: 'What the server calls it.' },
	'model-thinking': { title: 'thinking', text: 'How hard to think before answering. Or nothing at all, for models that don’t think.' },
	'model-max': { title: 'max output', text: 'A cap on the answer’s length, in tokens. Nothing for the model’s own.' },
	'model-options': { title: 'provider options', text: 'The escape hatch: raw settings sent as they are, for knobs the library doesn’t know about.', example: 'temperature · a seed · a thinking level past “high”' },
	main: { title: 'main(data folder)', text: 'Each benchmark is a folder with one entry point. The app passes the data folder; the benchmark builds its source from it and hands back both. Then one line adds it to the list of benchmarks.' },

	// Running it
	run: { title: 'A run', text: 'One command runs any number of benchmarks. Everything here is about how, not what.' },
	'run-data': { title: 'data folder', text: 'Handed to every benchmark’s main, so each finds its own data in there.' },
	'run-results': { title: 'results folder', text: 'Where the sink writes.' },
	'run-only': { title: 'only', text: 'Run just some benchmarks, by name. Or list them all.' },
	'run-runner': { title: 'runner', text: 'sequential: one card at a time, easiest to follow while writing a benchmark. parallel: many at once, for the real run. Same results either way.' },
	'run-workers': { title: 'max workers', text: 'How much the parallel runner does at all. Each benchmark’s concurrency is how much of that it may use: two limits, and the smaller wins.' },
	'run-clients': { title: 'clients', text: 'One live connection per provider: the lab box, Vertex. A benchmark whose model has no client here is refused before it starts.' },
	'run-sink': { title: 'sink', text: 'Where each result goes the moment it’s done.', use: ['JSON files     one per execution', 'JSON lines     one line per input, as it finishes', 'memory         for tests', 'several        a file and memory at once'] },
	'run-logger': { title: 'logger', text: 'Where the steps’ lines go, and how much of it.', use: ['console, from “info” up', 'quiet', 'into the app’s own logging'] },
	'run-report': { title: 'The report', text: 'Per benchmark: when it started and finished, how long it took, and how many inputs completed, stopped and failed.' }
};
