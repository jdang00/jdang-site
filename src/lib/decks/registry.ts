export type DeckMeta = {
	slug: string;
	title: string;
	description: string;
	accent: string;
	tags: string[];
	slides: number;
	updatedAt: string;
};

export const deckLibrary: DeckMeta[] = [
	{
		slug: 'svelte-5-runes',
		title: 'Svelte 5 Runes',
		description:
			'Runes, reactivity primitives, and migrating from Svelte 4. A deep-dive with real code.',
		accent: '#ea580c',
		tags: ['svelte', 'runes', 'reactivity', 'migration'],
		slides: 9,
		updatedAt: '2026-03-17'
	},
	{
		slug: 'presentation-template',
		title: 'Presentation Template',
		description:
			'General-purpose deck with title variations, subtitles, bullet slides, image placeholders, stats, and closing patterns.',
		accent: '#ea580c',
		tags: ['template', 'talks', 'slides'],
		slides: 14,
		updatedAt: '2026-03-17'
	},
	{
		slug: 'retinopathy-of-prematurity',
		title: 'Retinopathy of Prematurity',
		description:
			'Red-themed pediatrics deck covering pathophysiology, staging, screening, prevention, and treatment of ROP.',
		accent: '#be123c',
		tags: ['pediatrics', 'retina', 'optometry', 'clinical'],
		slides: 10,
		updatedAt: '2026-03-17'
	}
];

export function getDeckBySlug(slug: string) {
	return deckLibrary.find((deck) => deck.slug === slug);
}
