<script>
	import '../../app.css';

	import Header from '../comps/head.svelte';

	import Courses from './courses.svelte';

	import Footer from '../comps/footer.svelte';

	import Tab from '../tab.svelte';

	export let data;
</script>

<div class="flex items-center justify-between w-full flex-col p-8 min-h-screen">
	<div class="w-full max-w-3xl">
		<Header />
		<Tab highlighted="Courses" />
		<Courses {data} />
		<Footer />
	</div>
</div>
