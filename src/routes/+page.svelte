<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
</script>

<div
	class="mt-24 flex min-h-screen w-full flex-col items-center justify-between px-12 pb-8 text-center sm:px-0 sm:text-start"
>
	<div class="mt-18 w-full max-w-3xl">
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
				<h1 class="text-4xl font-medium">Justin A. Dang</h1>
				<p class="text-gray-500">Optometry Student</p>
				<div class="flex flex-row justify-center space-x-2 sm:justify-start">
					<a
						href="https://github.com/jdang00"
						target="_blank"
						class="text font-mono text-blue-500 underline hover:text-blue-400">GitHub</a
					>
					<a
						href="https://www.instagram.com/justin_a_dang/"
						target="_blank"
						class="text font-mono text-blue-500 underline hover:text-blue-400">Instagram</a
					>
					<a
						href="https://www.linkedin.com/in/justin-a-dang/"
						target="_blank"
						class="text font-mono text-blue-500 underline hover:text-blue-400">LinkedIn</a
					>
					<a href="/translate" class="text font-mono text-blue-500 underline hover:text-blue-400"
						>Translate</a
					>
				</div>
			</div>
		</div>

		<div class="mt-8">
			<h2 class="text-3xl font-medium">About Me</h2>
			<div class=" mt-6 flex flex-col gap-y-2 text-start">
				<p>
					I'm Justin Dang, an optometry student at the Northeastern State University Oklahoma
					College of Optometry. Originally from Fort Smith Arkansas, I grew up with a strong
					background in the humanities and the Great Books of the Western World. In college, I
					studied computer science with artificial intelligence and human computer interaction.
				</p>
				<p>
					My current interests are in using generative agents in the field of healthcare and health
					education. That's why I'm building <a
						href="https://www.learnterms.com"
						target="_blank"
						class="text-blue-500 underline hover:text-blue-400">LearnTerms.com</a
					> to enhance student studying.
				</p>
			</div>
		</div>
	</div>
</div>
