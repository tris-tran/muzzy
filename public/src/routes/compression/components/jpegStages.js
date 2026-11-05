// The six JPEG stages, each with the id of its first page in the presentation
export const STAGES = [
	{
		name: 'Colour',
		id: 'jpeg-colour',
		blurb: 'Split brightness from colour, and keep less of the colour.',
		loses: true
	},
	{
		name: 'Tiles',
		id: 'jpeg-tiles',
		blurb: 'Cut the picture into small tiles of 8 × 8 pixels.',
		loses: false
	},
	{
		name: 'Patterns',
		id: 'jpeg-waves',
		blurb: 'Write each tile as a mix of 64 standard patterns.',
		loses: false
	},
	{
		name: 'Round off',
		id: 'jpeg-round',
		blurb: 'Round the mix off, dropping the details eyes miss.',
		loses: true
	},
	{
		name: 'Pack',
		id: 'jpeg-pack',
		blurb: 'Write what’s left down as tightly as possible.',
		loses: false
	},
	{
		name: 'Unpack',
		id: 'jpeg-unpack',
		blurb: 'Your device runs it all backwards to show the photo.',
		loses: null
	}
];

export const goTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
