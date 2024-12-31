<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
</script>

<div
	class="mt-24 flex min-h-screen w-full flex-col items-center justify-between px-8 pb-8 text-center sm:px-0 sm:text-start"
>
	<div class="mt-18 w-full max-w-5xl">
		<div
			class="flex flex-row flex-wrap items-center justify-center gap-12 border-b-2 pb-12 sm:justify-start"
		>
			<Avatar.Root class="size-44 shadow-lg">
				<Avatar.Image
					src="https://utfs.io/f/f42f91d1-4c4e-4b6f-a604-66170a807a71-1bqzy.webp"
					alt="@justinadang"
				/>
				<Avatar.Fallback>JD</Avatar.Fallback>
			</Avatar.Root>
			<div class="flex flex-col gap-y-2">
				<h1 class="text-5xl font-semibold">Justin A. Dang</h1>
				<p>Optometry Student</p>
			</div>
		</div>

		<div class="mt-8">
			<h2 class="text-3xl font-semibold">About Me</h2>
			<div class="mt-6 flex flex-col gap-y-2 text-start text-lg">
				<p>Saved by grace through faith.</p>
				<p>Optometry Student at Northeastern State University Oklahoma College of Optometry.</p>
				<p>Developer with interests in generative AI and human computer interaction.</p>
				<p>Building LearnTerms.com to enhance student studying.</p>
			</div>
		</div>
	</div>
</div>
