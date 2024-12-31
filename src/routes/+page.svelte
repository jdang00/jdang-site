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
				<h1 class="text-5xl font-medium">Justin A. Dang</h1>
				<p>Optometry Student</p>
			</div>
		</div>

		<div class="mt-8">
			<h2 class="text-3xl font-medium">About Me</h2>
			<div class=" mt-6 flex flex-col gap-y-2 text-start">
				<p>
					I'm Justin Dang, an optometry student at Northeastern State University Oklahoma College of
					Optometry. Originally from Fort Smith Arkansas, I grew up with a strong background in the
					humanities and the Great Books of the Western World. In college, I studied computer
					science with artificial intelligence and human computer interaction.
				</p>
				<p>
					My current interests are in using generative agents in the field of healthcare and health
					education. That's why I'm building <a
						href="https://www.learnterms.com"
						target="_blank"
						class="text-blue-500 underline">LearnTerms.com</a
					> to enhance student studying.
				</p>
			</div>
		</div>
	</div>
</div>
