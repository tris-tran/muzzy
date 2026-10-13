<script>
	// What an LLM does with a question that has no right answer, one full-screen step at a time.
	// To add, remove or reorder a step, edit this list: the "keep going" links follow it.
	import Step from '#lib/presentation/Step.svelte';
	import Intro from './steps/Intro.svelte';
	import NoDoubt from './steps/NoDoubt.svelte';
	import RawModel from './steps/RawModel.svelte';
	import Shaping from './steps/Shaping.svelte';
	import Recipes from './steps/Recipes.svelte';
	import Recap from './steps/Recap.svelte';

	// `cue` is the text on the button that leads *to the next* step
	const steps = [
		{ id: 'start', component: Intro, cue: "Let's see" },
		{ id: 'no-doubt', component: NoDoubt, cue: 'So where do the bars come from?' },
		{ id: 'raw-model', component: RawModel, cue: 'How does it learn to be careful?' },
		{ id: 'shaping', component: Shaping, cue: 'Who writes those examples?' },
		{ id: 'recipes', component: Recipes, cue: 'Wrapping up' },
		{ id: 'recap', component: Recap }
	];
</script>

{#each steps as step, i (step.id)}
	<Step id={step.id} next={steps[i + 1]?.id} cue={step.cue}>
		<step.component />
	</Step>
{/each}
