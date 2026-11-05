<script>
	// "How do you make a file smaller?". One full-screen step at a time; to add, remove or reorder a
	// step, edit this list: the "keep going" links follow it.
	import Step from '#lib/presentation/Step.svelte';
	import Intro from './steps/Intro.svelte';
	import BigPicture from './steps/BigPicture.svelte';
	import Dictionary from './steps/Dictionary.svelte';
	import Backfires from './steps/Backfires.svelte';
	import Websites from './steps/Websites.svelte';
	import Lossy from './steps/Lossy.svelte';
	import JpegIntro from './steps/JpegIntro.svelte';
	import JpegColour from './steps/JpegColour.svelte';
	import JpegTiles from './steps/JpegTiles.svelte';
	import JpegWaves from './steps/JpegWaves.svelte';
	import JpegPatterns from './steps/JpegPatterns.svelte';
	import JpegRecipe from './steps/JpegRecipe.svelte';
	import JpegRound from './steps/JpegRound.svelte';
	import JpegPack from './steps/JpegPack.svelte';
	import JpegUnpack from './steps/JpegUnpack.svelte';
	import Many from './steps/Many.svelte';

	// `cue` is the text on the button that leads *to the next* step
	const steps = [
		{ id: 'start', component: Intro, cue: 'The big picture' },
		{ id: 'big-picture', component: BigPicture, cue: 'How does it do that?' },
		{ id: 'dictionary', component: Dictionary, cue: 'Does it always work?' },
		{ id: 'backfires', component: Backfires, cue: 'So where is it used?' },
		{ id: 'websites', component: Websites, cue: 'What about pictures and sound?' },
		{ id: 'lossy', component: Lossy, cue: 'How does JPEG do it?' },
		{ id: 'jpeg', component: JpegIntro, cue: 'Stage 1: colour' },
		{ id: 'jpeg-colour', component: JpegColour, cue: 'Stage 2: tiles' },
		{ id: 'jpeg-tiles', component: JpegTiles, cue: 'Stage 3: patterns' },
		{ id: 'jpeg-waves', component: JpegWaves, cue: 'From rows to tiles' },
		{ id: 'jpeg-patterns', component: JpegPatterns, cue: 'Our tile as a recipe' },
		{ id: 'jpeg-recipe', component: JpegRecipe, cue: 'Stage 4: round off' },
		{ id: 'jpeg-round', component: JpegRound, cue: 'Stage 5: pack' },
		{ id: 'jpeg-pack', component: JpegPack, cue: 'Stage 6: unpack' },
		{ id: 'jpeg-unpack', component: JpegUnpack, cue: 'There are lots of them' },
		{ id: 'many', component: Many }
	];
</script>

{#each steps as step, i (step.id)}
	<Step id={step.id} next={steps[i + 1]?.id} cue={step.cue}>
		<step.component />
	</Step>
{/each}
