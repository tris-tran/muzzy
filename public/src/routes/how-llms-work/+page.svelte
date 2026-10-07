<script>
	// The explainer, one full-screen step at a time. Each step lives in steps/;
	// shared pieces (Step, LlmBox, NetworkBox, Pipe) live in components/.
	// To add, remove or reorder a step, edit this list: the "keep going" links follow it.
	import Step from './components/Step.svelte';
	import Intro from './steps/Intro.svelte';
	import BlackBox from './steps/BlackBox.svelte';
	import SearchExample from './steps/SearchExample.svelte';
	import NextWord from './steps/NextWord.svelte';
	import Training from './steps/Training.svelte';
	import Weights from './steps/Weights.svelte';
	import ModelSize from './steps/ModelSize.svelte';
	import ChatDemo from './steps/ChatDemo.svelte';
	import ChatTraining from './steps/ChatTraining.svelte';
	import Buzzwords from './steps/Buzzwords.svelte';

	// `cue` is the text on the button that leads *to the next* step
	const steps = [
		{ id: 'start', component: Intro, cue: "Let's begin" },
		{ id: 'black-box', component: BlackBox },
		{ id: 'google', component: SearchExample, cue: "Let's look closer" },
		{ id: 'next-word', component: NextWord, cue: 'How does it learn?' },
		{ id: 'training', component: Training, cue: 'Open the box' },
		{ id: 'weights', component: Weights, cue: 'Why so many?' },
		{ id: 'size', component: ModelSize, cue: 'So how does a chat work?' },
		{ id: 'chat', component: ChatDemo, cue: 'How do chat models learn?' },
		{ id: 'chat-training', component: ChatTraining, cue: 'One more thing' },
		{ id: 'buzzwords', component: Buzzwords }
	];
</script>

{#each steps as step, i (step.id)}
	<Step id={step.id} next={steps[i + 1]?.id} cue={step.cue}>
		<step.component />
	</Step>
{/each}
