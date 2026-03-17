import { error } from '@sveltejs/kit';

import { getDeckBySlug } from '$lib/decks/registry';

export const ssr = false;

export function load({ params }) {
	const deck = getDeckBySlug(params.slug);

	if (!deck) {
		throw error(404, 'Deck not found');
	}

	return { deck };
}
