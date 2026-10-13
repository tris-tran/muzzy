<script>
	// "From gramophone to Bluetooth": a bit of history, real old recordings, what sound is, how a
	// gramophone works, how electricity turned it into a speaker (and a microphone), and how a sound
	// file becomes that same electrical wiggle, radio, and finally Bluetooth. One full-screen step at a time; to add, remove or reorder a
	// step, edit this list: the "keep going" links follow it.
	import Step from '#lib/presentation/Step.svelte';
	import Intro from './steps/Intro.svelte';
	import History from './steps/History.svelte';
	import Listen from './steps/Listen.svelte';
	import Sound from './steps/Sound.svelte';
	import WaveLine from './steps/WaveLine.svelte';
	import Inside from './steps/Inside.svelte';
	import HowItWorks from './steps/HowItWorks.svelte';
	import Electric from './steps/Electric.svelte';
	import Speaker from './steps/Speaker.svelte';
	import Backwards from './steps/Backwards.svelte';
	import Spooky from './steps/Spooky.svelte';
	import NoNeedle from './steps/NoNeedle.svelte';
	import Wav from './steps/Wav.svelte';
	import Mp3 from './steps/Mp3.svelte';
	import Radio from './steps/Radio.svelte';
	import Bluetooth from './steps/Bluetooth.svelte';
	import Next from './steps/Next.svelte';
	import Credits from './steps/Credits.svelte';

	// `cue` is the text on the button that leads *to the next* step
	const steps = [
		{ id: 'start', component: Intro, cue: "Let's go back in time" },
		{ id: 'history', component: History, cue: 'What did it sound like?' },
		{ id: 'listen', component: Listen, cue: 'But what is sound?' },
		{ id: 'sound', component: Sound, cue: 'Draw it' },
		{ id: 'wave-line', component: WaveLine, cue: 'Open a gramophone' },
		{ id: 'inside', component: Inside, cue: 'Watch it work' },
		{ id: 'how-it-works', component: HowItWorks, cue: 'Now add electricity' },
		{ id: 'electric', component: Electric, cue: 'Open the speaker' },
		{ id: 'speaker', component: Speaker, cue: 'Now run it backwards' },
		{ id: 'backwards', component: Backwards, cue: 'A spooky side note' },
		{ id: 'spooky', component: Spooky, cue: 'Do we still need the needle?' },
		{ id: 'no-needle', component: NoNeedle, cue: 'How does a file become a wiggle?' },
		{ id: 'wav', component: Wav, cue: 'What about MP3?' },
		{ id: 'mp3', component: Mp3, cue: 'What about no cable at all?' },
		{ id: 'radio', component: Radio, cue: 'And finally, Bluetooth' },
		{ id: 'bluetooth', component: Bluetooth, cue: 'Wrapping up' },
		{ id: 'next', component: Next, cue: 'Credits' },
		{ id: 'credits', component: Credits }
	];
</script>

{#each steps as step, i (step.id)}
	<Step id={step.id} next={steps[i + 1]?.id} cue={step.cue}>
		<step.component />
	</Step>
{/each}
