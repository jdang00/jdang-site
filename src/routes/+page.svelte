<script lang="ts">
	import '../app.css';
	import Header from './comps/head.svelte';
	import * as Tabs from '$lib/components/ui/tabs/index';
	import About from './comps/about.svelte';
</script>

<div class="flex items-center justify-between w-full flex-col p-8 min-h-screen">
	<div class="w-full max-w-3xl">
		<Header />

		<Tabs.Root value="about">
			<Tabs.List>
				<Tabs.Trigger value="about">About</Tabs.Trigger>
				<Tabs.Trigger value="technology">Technology</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="about"><About /></Tabs.Content>
			<Tabs.Content value="technology">Testing</Tabs.Content>
		</Tabs.Root>
	</div>
</div>

<slot />
