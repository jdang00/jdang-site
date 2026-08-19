<script lang="ts">
	import { onMount } from 'svelte';

	type Section = { id: string; label: string };
	let { sections }: { sections: Section[] } = $props();

	// '' is the top of the article.
	let activeId = $state('');

	const entries = $derived([{ id: '', label: 'Top' }, ...sections]);
	const activeIndex = $derived(
		Math.max(
			0,
			entries.findIndex((e) => e.id === activeId)
		)
	);

	let locked = false;

	function tween(to: number) {
		const root = document.documentElement;
		const from = window.scrollY;
		const dist = to - from;
		if (Math.abs(dist) < 2) return;

		if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
			window.scrollTo(0, to);
			return;
		}

		// Capped so a jump to the far end of the article stays quick.
		const duration = Math.min(620, 240 + Math.abs(dist) * 0.05);
		const start = performance.now();
		const previous = root.style.scrollBehavior;
		root.style.scrollBehavior = 'auto';
		locked = true;

		let done = false;
		const finish = () => {
			if (done) return;
			done = true;
			window.scrollTo(0, to);
			root.style.scrollBehavior = previous;
			locked = false;
		};

		const step = (now: number) => {
			if (done) return;
			const p = Math.min(1, (now - start) / duration);
			const eased = p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;
			window.scrollTo(0, from + dist * eased);
			if (p < 1) requestAnimationFrame(step);
			else finish();
		};
		requestAnimationFrame(step);
		// Frames stop in a hidden tab; make sure the jump still lands.
		setTimeout(finish, duration + 120);
	}

	function go(event: MouseEvent, id: string) {
		event.preventDefault();
		activeId = id;
		const target = id ? document.getElementById(id) : null;
		tween(target ? window.scrollY + target.getBoundingClientRect().top - 36 : 0);
		history.replaceState(null, '', id ? `#${id}` : location.pathname);
	}

	onMount(() => {
		const targets = sections
			.map((s) => document.getElementById(s.id))
			.filter((el): el is HTMLElement => el !== null);

		let queued = false;
		const measure = () => {
			queued = false;
			if (locked) return;
			let current = '';
			for (const el of targets) {
				if (el.getBoundingClientRect().top <= 140) current = el.id;
			}
			activeId = current;
		};
		const onScroll = () => {
			if (queued) return;
			queued = true;
			requestAnimationFrame(measure);
			setTimeout(() => queued && measure(), 250);
		};

		measure();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);
		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
		};
	});
</script>

<nav class="rail" aria-label="Sections">
	<div class="list">
		<span class="marker" style="--i: {activeIndex}"></span>
		{#each entries as entry (entry.id)}
			<a
				href={entry.id ? `#${entry.id}` : '#'}
				class:on={entry.id === activeId}
				class:top={entry.id === ''}
				aria-current={entry.id === activeId ? 'true' : undefined}
				onclick={(e) => go(e, entry.id)}
			>
				<i></i>
				<span>{entry.label}</span>
			</a>
		{/each}
	</div>
</nav>

<details class="inline-toc">
	<summary>Contents<span>{sections.length} sections</span></summary>
	<ol>
		{#each sections as section (section.id)}
			<li><a href="#{section.id}" onclick={(e) => go(e, section.id)}>{section.label}</a></li>
		{/each}
	</ol>
</details>

<style>
	.rail {
		position: fixed;
		top: 50%;
		left: max(1.5rem, calc(50% - 48rem));
		z-index: 5;
		display: none;
		width: 12.5rem;
		max-height: 84vh;
		overflow-y: auto;
		transform: translateY(-50%);
		scrollbar-width: none;
	}

	.rail::-webkit-scrollbar {
		display: none;
	}

	/* Only once there is genuinely room beside the widest figure. */
	@media (min-width: 1560px) {
		.rail {
			display: block;
		}
	}

	.list {
		--row: 26px;

		position: relative;
	}

	/* One-line rows mean the bar can be placed from the index alone. */
	.marker {
		position: absolute;
		top: 0;
		left: 0;
		width: 1px;
		height: 1px;
		background: var(--primary);
		transform: translateY(calc(var(--i) * var(--row))) scaleY(26);
		transform-origin: 0 0;
		transition: transform 320ms cubic-bezier(0.25, 0.9, 0.3, 1);
	}

	.list a {
		display: flex;
		gap: 0.6rem;
		align-items: center;
		height: var(--row);
		padding-left: 0.75rem;
		color: var(--muted-foreground);
		font-size: 0.74rem;
		text-decoration: none;
		white-space: nowrap;
	}

	/* Idle: a column of ticks, with only the current section named. */
	.list a i {
		width: 0.5rem;
		height: 1px;
		background: color-mix(in oklab, var(--muted-foreground) 55%, transparent);
		transition:
			width 260ms cubic-bezier(0.25, 0.9, 0.3, 1),
			background-color 260ms ease;
	}

	.list a span {
		overflow: hidden;
		text-overflow: ellipsis;
		opacity: 0;
		transition:
			opacity 260ms ease,
			transform 260ms cubic-bezier(0.25, 0.9, 0.3, 1),
			color 200ms ease;
		transform: translateX(-3px);
	}

	.list a.on i {
		width: 1rem;
		background: var(--primary);
	}

	.list a.on span {
		color: var(--foreground);
		opacity: 1;
		transform: none;
	}

	.list a.top i {
		width: 0.85rem;
		background: color-mix(in oklab, var(--muted-foreground) 70%, transparent);
	}

	/* Revealed on approach. */
	.rail:hover a span,
	.rail:focus-within a span {
		opacity: 1;
		transform: none;
	}

	.rail:hover a:hover span,
	.rail:focus-within a:focus-visible span {
		color: var(--foreground);
	}

	.rail:hover a:hover i {
		width: 1rem;
		background: color-mix(in oklab, var(--foreground) 60%, transparent);
	}

	.list a:focus-visible {
		border-radius: 0.25rem;
		outline: 2px solid var(--ring);
		outline-offset: -2px;
	}

	.inline-toc {
		margin: 0 0 3rem;
		padding: 0.9rem 1.1rem;
		border: 1px solid var(--border);
		border-radius: 0.7rem;
		background: var(--card);
	}

	@media (min-width: 1560px) {
		.inline-toc {
			display: none;
		}
	}

	.inline-toc summary {
		display: flex;
		gap: 0.55rem;
		align-items: baseline;
		color: var(--foreground);
		font-size: 0.85rem;
		font-weight: 600;
		list-style: none;
		cursor: pointer;
	}

	.inline-toc summary::-webkit-details-marker {
		display: none;
	}

	.inline-toc summary span {
		margin-left: auto;
		color: var(--muted-foreground);
		font-family: 'Geist Mono', monospace;
		font-size: 0.66rem;
		font-weight: 400;
	}

	.inline-toc summary::after {
		order: -1;
		color: var(--primary);
		content: '+';
		font-family: 'Geist Mono', monospace;
		font-size: 0.9rem;
	}

	.inline-toc[open] summary::after {
		content: '−';
	}

	.inline-toc ol {
		margin: 0.9rem 0 0;
		padding: 0.85rem 0 0 1.35rem;
		border-top: 1px solid var(--border);
		list-style: decimal;
	}

	.inline-toc li {
		padding-left: 0.25rem;
		font-size: 0.85rem;
		line-height: 1.5;
	}

	.inline-toc li + li {
		margin-top: 0.5rem;
	}

	.inline-toc li::marker {
		color: color-mix(in oklab, var(--muted-foreground) 70%, transparent);
		font-family: 'Geist Mono', monospace;
		font-size: 0.7rem;
	}

	.inline-toc a {
		color: var(--muted-foreground);
		text-decoration: none;
		transition: color 160ms ease;
	}

	.inline-toc a:hover {
		color: var(--foreground);
	}

	@media (prefers-reduced-motion: reduce) {
		.marker,
		.list a i,
		.list a span {
			transition: none;
		}
	}
</style>
