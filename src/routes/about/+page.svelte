<script>
	import '../../app.css';

	import Header from '../comps/head.svelte';

	import About from '../comps/about.svelte';

	import Tab from '../tab.svelte';

	import Footer from '../comps/footer.svelte';
</script>

<div class="flex items-center justify-between w-full flex-col p-8 min-h-screen">
	<div class="w-full max-w-3xl">
		<Header />
		<Tab highlighted="About" />
		<About />
		<Footer />
	</div>
</div>
