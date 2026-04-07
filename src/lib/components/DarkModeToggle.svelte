<script lang="ts">
	import { onMount } from 'svelte';
	import { Moon, Sun } from 'lucide-svelte';

	let isDark = $state(false);
	let mounted = $state(false);

	onMount(() => {
		// Check for saved theme preference or default to system preference
		const savedTheme = localStorage.getItem('theme');
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

		isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
		updateTheme();
		mounted = true;

		// Listen for system theme changes
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const handleChange = (e: MediaQueryListEvent) => {
			if (!localStorage.getItem('theme')) {
				isDark = e.matches;
				updateTheme();
			}
		};

		mediaQuery.addEventListener('change', handleChange);
		return () => mediaQuery.removeEventListener('change', handleChange);
	});

	function updateTheme() {
		if (isDark) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}

	function toggleTheme() {
		isDark = !isDark;
		localStorage.setItem('theme', isDark ? 'dark' : 'light');
		updateTheme();
	}
</script>

{#if mounted}
	<button
		onclick={toggleTheme}
		class="inline-flex size-9 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
		aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
		title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
	>
		{#if isDark}
			<Sun class="size-4 transition-all" />
		{:else}
			<Moon class="size-4 transition-all" />
		{/if}
		<span class="sr-only">{isDark ? 'Switch to light mode' : 'Switch to dark mode'}</span>
	</button>
{:else}
	<!-- Placeholder to prevent layout shift -->
	<div class="size-9 rounded-md border border-border bg-background"></div>
{/if}
