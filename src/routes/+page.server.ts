import { redirect } from '@sveltejs/kit';

export function load({ url }) {
	if (url.hostname === 'decks.justindang.dev') {
		throw redirect(307, '/decks');
	}
}
