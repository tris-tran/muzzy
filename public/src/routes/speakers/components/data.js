// Content shared by the steps: the history models, the recordings and the wave examples.

// Models live in static/models (see CREDITS.md there). CC-BY ones must show their credit.
export const history = [
	{ file: 'gramophone-a.glb', year: '1890s', name: 'Gramophone', text: 'No electricity at all. The groove shakes a needle, and a horn makes it loud.', credit: 'Model: Don Carson · Poly Pizza · CC-BY 3.0' },
	{ file: 'megaphone/Megaphone_01_1k.gltf', year: '1950s', name: 'Electric megaphone', text: 'The same horn trick, now with a small electric speaker behind it.', credit: 'Model: Ethan Simon-Law · Poly Haven · CC0', view: [0.9, 0.3, 0.5] },
	{ file: 'radio.glb', year: '1950s', name: 'Portable radio', text: 'Transistors made radios small. A little cone speaker sits behind the grille.', credit: 'Model: Quaternius · Poly Pizza · CC0' },
	{ file: 'speaker-cabinet-b.glb', year: '1970s', name: 'Hi-fi speaker', text: 'A big woofer for low notes, a small tweeter for high ones.', credit: 'Model: iPoly3D · Poly Pizza · CC0' },
	{ file: 'boombox/boombox_1k.gltf', year: '1980s', name: 'Boombox', text: 'Batteries, a cassette and two speakers. Music goes outside.', credit: 'Model: Thomas Paul Mouilleron · Poly Haven · CC0', view: [0.35, 0.25, 1] },
	{ file: 'cassette_player/cassette_player_1k.gltf', year: '1980s', name: 'Cassette recorder', text: 'Small enough for one hand, with one tiny speaker.', credit: 'Model: Oday Abuzaeed · Poly Haven · CC0', view: [0.35, 0.25, 1] }
];

// Recordings live in static/audio (see CREDITS.md there), all public domain
export const recordings = [
	{ file: '1888-edison-cylinder-lost-chord.ogg', year: 'c. 1888', name: 'The Lost Chord', who: 'Piano and cornet', how: 'Acoustic · wax cylinder' },
	{ file: '1911-caruso-una-furtiva-lagrima.ogg', year: '1911', name: 'Una furtiva lagrima', who: 'Enrico Caruso', how: 'Acoustic · disc' },
	{ file: '1917-odjb-livery-stable-blues.ogg', year: '1917', name: 'Livery Stable Blues', who: 'Original Dixieland Jass Band', how: 'Acoustic · disc' },
	{ file: '1925-01-bessie-smith-st-louis-blues.mp3', year: 'Jan 1925', name: 'St. Louis Blues', who: 'Bessie Smith and Louis Armstrong', how: 'Acoustic · disc' },
	{ file: '1925-02-art-gillham-you-may-be-lonesome.ogg', year: 'Feb 1925', name: 'You May Be Lonesome', who: 'Art Gillham', how: 'Electrical · microphone', electric: true }
];

export const waves = [
	{ name: 'Low note', parts: [[2, 0.8]] },
	{ name: 'High note', parts: [[7, 0.8]] },
	{ name: 'Quiet', parts: [[3, 0.25]] },
	{ name: 'Loud', parts: [[3, 0.95]] },
	{ name: 'A real instrument', parts: [[2, 0.5], [4, 0.25], [6, 0.15], [10, 0.08]] }
];

// Everything on these pages made by someone else, shown on the Credits step
const commons = (file) => 'https://commons.wikimedia.org/wiki/File:' + encodeURIComponent(file.replaceAll(' ', '_'));
export const credits = [
	{
		group: '3D models',
		items: [
			{ what: 'Gramophone', who: 'Don Carson', where: 'Poly Pizza', url: 'https://poly.pizza/m/9MZ0sCt1REv', license: 'CC-BY 3.0' },
			{ what: 'Megaphone 01', who: 'Ethan Simon-Law', where: 'Poly Haven', url: 'https://polyhaven.com/a/Megaphone_01', license: 'CC0' },
			{ what: 'Radio', who: 'Quaternius', where: 'Poly Pizza', url: 'https://poly.pizza/m/TPqvwkyWdV', license: 'CC0' },
			{ what: 'Speaker', who: 'iPoly3D', where: 'Poly Pizza', url: 'https://poly.pizza/m/hG0jIuHdCh', license: 'CC0' },
			{ what: 'Boombox', who: 'Thomas Paul Mouilleron', where: 'Poly Haven', url: 'https://polyhaven.com/a/boombox', license: 'CC0' },
			{ what: 'Cassette Player', who: 'Oday Abuzaeed', where: 'Poly Haven', url: 'https://polyhaven.com/a/cassette_player', license: 'CC0' }
		]
	},
	{
		group: 'Recordings',
		items: [
			{ what: '“The Lost Chord” (c. 1888), recorded by George Gouraud', who: 'Performers unknown', where: 'Wikimedia Commons', url: commons('Edison cylinder Lost Chord.ogg'), license: 'Public domain' },
			{ what: '“Una furtiva lagrima” (1911)', who: 'Enrico Caruso, Victor', where: 'Wikimedia Commons', url: commons("Enrico Caruso, L'elisir d'amore, Una furtiva lagrima.ogg"), license: 'Public domain' },
			{ what: '“Livery Stable Blues” (1917)', who: 'Original Dixieland Jass Band, Victor', where: 'Wikimedia Commons', url: commons('ODJB Livery Stable Blues 1917.ogg'), license: 'Public domain' },
			{ what: '“St. Louis Blues” (1925)', who: 'Bessie Smith and Louis Armstrong, Columbia', where: 'Wikimedia Commons', url: commons('Bessie Smith and Louis Armstrong - The St. Louis Blues (1925).mp3'), license: 'Public domain' },
			{ what: '“You May Be Lonesome” (1925)', who: 'Art Gillham, Columbia', where: 'Wikimedia Commons', url: commons('Art Gillham, The Whispering Pianist 007 Columbia 328-D Feb 25 1925 electric You May Be Lonesome.ogg'), license: 'Public domain' }
		]
	},
	{
		group: 'Fonts and software',
		items: [
			{ what: 'Plus Jakarta Sans', who: 'Tokotype', where: 'Google Fonts', url: 'https://fonts.google.com/specimen/Plus+Jakarta+Sans', license: 'SIL Open Font License' },
			{ what: 'Fira Code', who: 'Nikita Prokopov', where: 'Google Fonts', url: 'https://fonts.google.com/specimen/Fira+Code', license: 'SIL Open Font License' },
			{ what: 'three.js', who: 'three.js authors', where: 'threejs.org', url: 'https://threejs.org', license: 'MIT' },
			{ what: 'Svelte and SvelteKit', who: 'Svelte contributors', where: 'svelte.dev', url: 'https://svelte.dev', license: 'MIT' }
		]
	}
];
