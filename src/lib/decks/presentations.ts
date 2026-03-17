import type { Component } from 'svelte';

import PresentationTemplate from './presentations/PresentationTemplate.svelte';
import RetinopathyOfPrematurity from './presentations/RetinopathyOfPrematurity.svelte';
import Svelte5Runes from './presentations/Svelte5Runes.svelte';

export const deckPresentations = {
	'presentation-template': PresentationTemplate,
	'retinopathy-of-prematurity': RetinopathyOfPrematurity,
	'svelte-5-runes': Svelte5Runes
} as const satisfies Record<string, Component>;
