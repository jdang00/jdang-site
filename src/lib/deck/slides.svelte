<script lang="ts">
	import { onMount } from 'svelte';

	import Reveal from 'reveal.js';

	import 'reveal.js/dist/reveal.css';
	import 'reveal.js/dist/theme/black.css';

	import Presentation from './presentation.svelte';

	onMount(() => {
		const deck = new Reveal({
			hash: true,
			controls: false,
			progress: false
		});

		deck.initialize();
	});
</script>

<div class="reveal">
	<div class="slides">
		<Presentation />
	</div>
</div>
