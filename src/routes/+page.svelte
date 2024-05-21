<script>
	import '../app.css';
	import Nav from '$lib/Nav.svelte';
	const profile = 'https://utfs.io/f/50ee5591-301f-4c0f-b9cc-66b188de8d5e-1w6ku.png';
	const instagramIcon = 'https://utfs.io/f/eafd333b-264a-4e66-bb72-a2154efbce15-nyy399.svg';
	const githubIcon = 'https://utfs.io/f/8f2a449a-1e47-4828-9f7e-6765cefcc135-rz0awz.svg';
	const linkedinIcon = 'https://utfs.io/f/7d482c1c-109e-47c7-84da-3e65551be882-t5c96b.svg';
</script>

<Nav />

<div class="flex items-center justify-between w-full flex-col p-8 min-h-screen">
	<div class="w-full max-w-3xl">
		<a href="/">
			<img src={profile} alt="justin_picture" height="100" width="100" class="rounded-full" />
		</a>
		<h1 class="font-medium text-gray-900 mt-3 text-xl">Justin Dang</h1>
		<p class="text-gray-500">Doctor of Optometry (O.D.) Student</p>
		<div class="flex flex-row justify-between items-center mt-6">
			<div class="flex flex-row gap-x-3">
				<a href="https://www.instagram.com/justin_a_dang/" target="_blank" rel="noreferer">
					<img src={instagramIcon} alt="Instagram" /></a
				>
				<a href="https://github.com/jdang00" target="_blank" rel="noreferer">
					<img src={githubIcon} alt="GitHub" /></a
				>
				<a
					href="https://www.linkedin.com/in/justin-dang-08743b223/"
					target="_blank"
					rel="noreferer"
				>
					<img src={linkedinIcon} alt="LinkedIn" /></a
				>
			</div>
		</div>
	</div>
</div>

<slot />
