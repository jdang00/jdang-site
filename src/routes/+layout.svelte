<script>
	import '../app.css';
	import Nav from '$lib/Nav.svelte';
	import self from '../img/justin.webp';
	import CourseTable from './classes/data-table.svelte';
</script>

<Nav />

<div class="relative flex flex-row mx-auto w-full my-24 justify-center gap-14 flex-wrap">
	<div>
		<img src={self} class="h-96 rounded-lg" alt="Justin Dang" />
	</div>
	<div class="flex flex-col">
		<h1 class="text-5xl font-bold">Justin A. Dang</h1>
		<p class="mt-4 text-gray-600">
			Northeastern State University | University of Arkansas – Fort Smith
		</p>
		<p class="mt-8">Lover of God, family, and learning.</p>
	</div>
</div>

<ul class="list-disc list-inside mt-6 mx-20">
	<li>
		I fell in love with the classics at Logos Online School who gave me an incredible Classical
		Christian Education experience.
	</li>
	<li>
		I studied computer science at UAFS, where I gained my passion for software engineering, AI, and
		technology.
	</li>
	<li>
		I'm currently a student at the Oklahoma School of Optometry learning to give professional vision
		care for all.
	</li>
</ul>

<div class="mx-24 mt-10"><CourseTable /></div>
<slot />
