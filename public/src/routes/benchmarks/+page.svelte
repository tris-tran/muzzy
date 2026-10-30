<script>
	// What a benchmark is and how ours work, one full-screen step at a time. To add, remove or
	// reorder a step, edit this list: the "keep going" links follow it.
	import Step from '#lib/presentation/Step.svelte';
	import Intro from './steps/Intro.svelte';
	import Exam from './steps/Exam.svelte';
	import TryIt from './steps/TryIt.svelte';
	import Contenders from './steps/Contenders.svelte';
	import Sources from './steps/Sources.svelte';
	import Dock from './steps/Dock.svelte';
	import Machines from './steps/Machines.svelte';
	import Judge from './steps/Judge.svelte';
	import Built from './steps/Built.svelte';
	import Recipe from './steps/Recipe.svelte';
	import Architecture from './steps/Architecture.svelte';

	// `cue` is the text on the button that leads *to the next* step
	const steps = [
		{ id: 'start', component: Intro, cue: 'So what is a benchmark?' },
		{ id: 'exam', component: Exam, cue: "Let's run one" },
		{ id: 'try-it', component: TryIt, cue: 'Which models, really?' },
		{ id: 'contenders', component: Contenders, cue: 'Where do the questions come from?' },
		{ id: 'sources', component: Sources, cue: 'Into the factory' },
		{ id: 'dock', component: Dock, cue: 'Switch the machines on' },
		{ id: 'machines', component: Machines, cue: 'A smarter check' },
		{ id: 'judge', component: Judge, cue: 'What I built' },
		{ id: 'built', component: Built, cue: 'The whole architecture' },
		{ id: 'architecture', component: Architecture, cue: 'Your turn: writing one' },
		{ id: 'recipe', component: Recipe }
	];
</script>

{#each steps as step, i (step.id)}
	<Step id={step.id} next={steps[i + 1]?.id} cue={step.cue}>
		<step.component />
	</Step>
{/each}
