<script>
	import '../app.css';
	import Nav from '$lib/Nav.svelte';
</script>

<Nav/>

<div class="relative flex flex-col mx-auto text-center w-full my-24">
	<h1 class="text-5xl font-bold">Justin A. Dang</h1>
	<p class="mt-4 text-gray-600">Northeastern State University | University of Arkansas – Fort Smith</p>
	<p class="mt-8">Lover of God, family, and learning.</p>

</div>

<ul class="list-disc list-inside mt-6 mx-20">
	<li>I fell in love with the classics at Logos Online School who gave me an incredible Classical Christian Education experience.</li>
	<li>I studied computer science at UAFS, where I gained my passion for software engineering, AI, and technology.</li>
	<li>I'm currently a student at the Oklahoma School of Optometry learning to give professional vision care for all.</li>
</ul>

<slot />
