<script lang="ts">
	import { Transition } from '@animotion/core';

	import Notes from '$lib/deck/Notes.svelte';
	import Slide from '$lib/deck/Slide.svelte';
</script>

<!-- 1 · Title -->
<Slide class="grid grid-rows-[auto_1fr_auto]">
	<Transition>
		<p class="text-[1.4rem] text-slate-400">
			Course Name &ndash; Department
			<span class="ml-6">University or Organization</span>
		</p>
	</Transition>
	<div class="self-end">
		<Transition>
			<h1 class="text-[4.5rem] leading-[1.05] tracking-tight text-slate-900">
				Presentation Title
			</h1>
			<p class="mt-4 text-[2.2rem] text-slate-400">Presentation Subtitle</p>
		</Transition>
	</div>
	<Transition>
		<p class="mt-10 text-[1.4rem] text-slate-400">
			Author Name
			<span class="mx-2 text-slate-300">&bull;</span>
			Collaborator Name
		</p>
	</Transition>
</Slide>

<!-- 2 · Title Only -->
<Slide>
	<Transition>
		<h2 class="text-[3.2rem] tracking-tight text-slate-900">Slide Title</h2>
		<p class="mt-3 text-[1.8rem] text-slate-400">Slide Subtitle</p>
	</Transition>
</Slide>

<!-- 3 · Title & Bullets -->
<Slide>
	<Transition>
		<h2 class="text-[3.2rem] tracking-tight text-slate-900">Slide Title</h2>
		<p class="mt-2 text-[1.8rem] text-slate-400">Slide Subtitle</p>
	</Transition>
	<ul class="mt-10 list-disc pl-[1.2em] space-y-[0.8em] text-[1.8rem] leading-relaxed text-slate-600">
		<Transition visible order={1}><li>First point goes here</li></Transition>
		<Transition visible order={2}><li>Second point goes here</li></Transition>
		<Transition visible order={3}><li>Third point goes here</li></Transition>
	</ul>
</Slide>

<!-- 4 · Bullets Only -->
<Slide class="grid content-center">
	<ul class="list-disc pl-[1.2em] space-y-[0.8em] text-[1.8rem] leading-relaxed text-slate-600">
		<Transition visible order={1}><li>First point goes here</li></Transition>
		<Transition visible order={2}><li>Second point goes here</li></Transition>
		<Transition visible order={3}><li>Third point goes here</li></Transition>
		<Transition visible order={4}><li>Fourth point goes here</li></Transition>
	</ul>
</Slide>

<!-- 5 · Title, Bullets & Photo -->
<Slide>
	<Transition>
		<h2 class="text-[3.2rem] tracking-tight text-slate-900">Slide Title</h2>
		<p class="mt-2 text-[1.8rem] text-slate-400">Slide Subtitle</p>
	</Transition>
	<div class="mt-8 grid grid-cols-[1fr_1fr] items-start gap-10">
		<ul class="list-disc pl-[1.2em] space-y-[0.8em] text-[1.8rem] leading-relaxed text-slate-600">
			<Transition visible order={1}><li>First point goes here</li></Transition>
			<Transition visible order={2}><li>Second point goes here</li></Transition>
			<Transition visible order={3}><li>Third point goes here</li></Transition>
		</ul>
		<Transition order={4}>
			<div
				class="flex aspect-4/3 w-full items-center justify-center rounded bg-slate-100 text-[1.1rem] text-slate-300"
			>
				image
			</div>
		</Transition>
	</div>
</Slide>

<!-- 6 · Title & Photo Alt (text left, large image right) -->
<Slide class="grid grid-cols-[1fr_1fr] items-center gap-10">
	<Transition>
		<div>
			<h2 class="text-[3.2rem] tracking-tight text-slate-900">Slide Title</h2>
			<p class="mt-3 text-[1.8rem] text-slate-400">Slide Subtitle</p>
		</div>
	</Transition>
	<Transition order={1}>
		<div
			class="flex aspect-4/3 w-full items-center justify-center rounded bg-slate-100 text-[1.1rem] text-slate-300"
		>
			image
		</div>
	</Transition>
</Slide>

<!-- 7 · Section -->
<Slide class="grid content-end">
	<Transition>
		<h2 class="text-[4rem] tracking-tight text-slate-900">Section Title</h2>
	</Transition>
</Slide>

<!-- 8 · Statement -->
<Slide class="grid content-center place-items-center">
	<Transition>
		<p class="text-center text-[3.2rem] tracking-tight text-slate-700">Statement</p>
	</Transition>
</Slide>

<!-- 9 · Agenda -->
<Slide>
	<Transition>
		<h2 class="text-[3.2rem] tracking-tight text-slate-900">Agenda Title</h2>
		<p class="mt-2 text-[1.8rem] text-slate-400">Agenda Subtitle</p>
	</Transition>
	<div class="mt-10 space-y-[0.6em] text-[1.8rem] text-slate-600">
		<Transition visible order={1}><p>Topic One</p></Transition>
		<Transition visible order={2}><p>Topic Two</p></Transition>
		<Transition visible order={3}><p>Topic Three</p></Transition>
	</div>
</Slide>

<!-- 10 · Big Fact -->
<Slide class="grid content-center place-items-center">
	<Transition>
		<p class="text-center text-[7rem] tracking-tight text-slate-900">100%</p>
	</Transition>
	<Transition order={1}>
		<p class="mt-6 text-center text-[1.8rem] text-slate-400">Fact information</p>
	</Transition>
</Slide>

<!-- 11 · Quote -->
<Slide class="grid content-center">
	<Transition>
		<p class="text-[2.8rem] leading-snug text-slate-700">"Notable Quote"</p>
	</Transition>
	<Transition order={1}>
		<p class="mt-8 text-[1.4rem] text-slate-400">&mdash; Attribution</p>
	</Transition>
</Slide>

<!-- 12 · Photo — 3 Up -->
<Slide class="grid grid-cols-[1fr_auto] items-center gap-6">
	<Transition>
		<div
			class="flex h-full w-full items-center justify-center rounded bg-slate-100 text-[1.1rem] text-slate-300"
		>
			image
		</div>
	</Transition>
	<div class="grid h-full grid-rows-2 gap-6">
		<Transition order={1}>
			<div
				class="flex w-[260px] items-center justify-center rounded bg-slate-100 text-[1.1rem] text-slate-300"
			>
				image
			</div>
		</Transition>
		<Transition order={2}>
			<div
				class="flex w-[260px] items-center justify-center rounded bg-slate-100 text-[1.1rem] text-slate-300"
			>
				image
			</div>
		</Transition>
	</div>
</Slide>

<!-- 13 · Photo (full bleed) -->
<Slide class="p-0! grid content-center place-items-center bg-slate-100">
	<p class="text-[1.1rem] text-slate-300">image</p>
</Slide>

<!-- 14 · Blank -->
<Slide>
	<Notes>Blank slide — add whatever you need.</Notes>
</Slide>
