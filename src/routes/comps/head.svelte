<script>
	const profile = 'https://utfs.io/f/f42f91d1-4c4e-4b6f-a604-66170a807a71-1bqzy.webp';
	const instagramIcon = 'https://utfs.io/f/eafd333b-264a-4e66-bb72-a2154efbce15-nyy399.svg';
	const githubIcon = 'https://utfs.io/f/8f2a449a-1e47-4828-9f7e-6765cefcc135-rz0awz.svg';
	const linkedinIcon = 'https://utfs.io/f/7d482c1c-109e-47c7-84da-3e65551be882-t5c96b.svg';

	import Theme from '../button.svelte';
</script>

<div class="flex flex-row justify-between">
	<a href="/">
		<img src={profile} alt="justin_picture" height="100" width="100" class="rounded-full" />
	</a>

	<Theme />
</div>

<h1 class="font-medium mt-3 text-3xl">Justin Dang</h1>
<p class="text-gray-500">Doctor of Optometry (O.D.) Student</p>
<div class="flex flex-row justify-between items-center mt-6">
	<div class="flex flex-row gap-x-3">
		<a href="https://www.instagram.com/justin_a_dang/" target="_blank" rel="noreferer">
			<img src={instagramIcon} alt="Instagram" class="icon" /></a
		>
		<a href="https://github.com/jdang00" target="_blank" rel="noreferer">
			<img src={githubIcon} alt="GitHub" class="icon" /></a
		>
		<a href="https://www.linkedin.com/in/justin-a-dang" target="_blank" rel="noreferer">
			<img src={linkedinIcon} alt="LinkedIn" class="icon" /></a
		>
	</div>
</div>
<div class="border-b w-full my-8"></div>
