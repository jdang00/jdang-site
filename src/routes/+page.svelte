<script>
	import '../app.css';

	import Header from './comps/head.svelte';

	import * as Tabs from '$lib/components/ui/tabs/index';

	import About from './comps/about.svelte';

	import Tech from './comps/tech.svelte';

	import Courses from './comps/courses.svelte';

	import Footer from './comps/footer.svelte';

	import Blog from './comps/blog.svelte';

	export let data;
</script>

<div class="flex items-center justify-between w-full flex-col p-8 min-h-screen">
	<div class="w-full max-w-3xl">
		<Header />

		<Tabs.Root value="about">
			<Tabs.List>
				<Tabs.Trigger value="about">About</Tabs.Trigger>

				<Tabs.Trigger value="technology">Technology</Tabs.Trigger>

				<Tabs.Trigger value="courses">Courses</Tabs.Trigger>

				<Tabs.Trigger value="blog">Blog</Tabs.Trigger>
			</Tabs.List>

			<Tabs.Content value="about"><About /></Tabs.Content>

			<Tabs.Content value="technology"><Tech /></Tabs.Content>

			<Tabs.Content value="courses"><Courses {data} /></Tabs.Content>

			<Tabs.Content value="blog"><Blog {data} /></Tabs.Content>
		</Tabs.Root>

		<Footer />
	</div>
</div>
