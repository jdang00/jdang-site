<script lang="ts">
	import { fade } from 'svelte/transition';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import DarkModeToggle from '$lib/components/DarkModeToggle.svelte';
	import SnellenChart from '$lib/components/SnellenChart.svelte';

	const sections = [
		{
			heading: 'Projects',
			blurb: "I'm a big believer that great leadership and collaboration starts with a foundation of true technical and clinical expertise. My projects focus on combining my experience writing full stack applications and platforms with vision science, scheduling, education, and more.",
			links: [
				{
					label: 'LearnTerms.com',
					href: 'https://www.learnterms.com',
					desc: 'Collaborative question bank platform for healthcare students, now in use nationally. Features board-style questions, cohort analytics, and an AI pipeline that generates study material from course content. Built during my first year at NSUOCO to solve a problem I had. It grew into a fairly complex Q-bank management and testing project.'
				},
				{
					label: 'ClinicHub',
					href: 'https://clinic.learnterms.com/',
					desc: "Clinic scheduling platform built for NSUOCO's Class of 2028 cohort. Handles student swap requests with a validation engine, admin controls, and full audit logging. Replaced a confusing spreadsheet process that couldn't scale across multiple rotation sites."
				},
				{
					label: 'Eyegnosis',
					href: 'https://clinic.learnterms.com/eyegnosis',
					desc: 'Wordle for optometry. A daily word game built around eye care terminology. Harder than it sounds.'
				},
				{
					label: 'Swift Snellen',
					href: 'https://swiftsnellen.vercel.app/settings',
					desc: 'Browser-based Snellen chart written from scratch. Adjustable distance and optotype size. For educational use only: not a medical device.'
				},
				{
					label: 'IRIS',
					href: 'https://9g74ko9d91.ufs.sh/f/NeU6e1Cs56VtnYPdOMeILkKrZ4yJs73FmR0Q6UIVc8wxhWjA',
					desc: "My undergraduate capstone. An AI navigation system for blind grocery shopping using computer vision. It's where I first learned that useful ML is mostly a UX problem."
				}
			]
		},
		{
			heading: 'Videos',
			blurb: "Media production work spanning live broadcasting, ceremony coverage, and technical education. All built around the communities I'm part of.",
			links: [
				{
					label: 'Meibomian Madness',
					href: 'https://www.youtube.com/live/6oXItG7xkeI?si=rFeq2h01Nhngb8da',
					desc: "Produced a full live sports broadcast of NSUOCO's student ping-pong tournament. Real-time commentary, custom graphics, and full streaming setup. Built the production pipeline from scratch."
				},
				{
					label: 'White Coat Ceremony',
					href: 'https://www.youtube.com/live/FcMqQAeD9Gg?si=925a-VeqFt4vdFEw&t=1103',
					desc: 'Implemented the first-ever livestream of the NSUOCO White Coat Ceremony for the Class of 2028, enabling families across the country to attend remotely.'
				},
				{
					label: 'Full Stack Lecture',
					href: 'https://youtu.be/weUsT0jQt28',
					desc: 'Technical talk on full-stack development covering frontends, APIs, and databases — with an emphasis on the decisions that matter when shipping real software. Delivered to undergraduates moving past tutorials into production work.'
				}
			]
		},
		{
			heading: 'Social',
			blurb: "Other places you can find me and what I'm up to.",
			links: [
				{
					label: 'GitHub',
					href: 'https://github.com/jdang00',
					desc: 'A mix of production work and experiments: LearnTerms (SvelteKit + Convex), Swift Snellen, and AI/RAG prototypes for education and eye care.'
				},
				{
					label: 'LinkedIn',
					href: 'https://www.linkedin.com/in/justin-a-dang/',
					desc: 'My favorite larping platform!'
				},
				{
					label: 'Instagram',
					href: 'https://www.instagram.com/justin_a_dang/',
					desc: 'A light feed of school and clinic life, family and more.'
				},
				{
					label: 'AOSA',
					href: 'https://theaosa.org/leadership/',
					desc: 'American Optometric Student Association. I serve in AOSA leadership on advocacy, policy, and student community initiatives nationwide.'
				}
			]
		}
	];

	let mounted = $state(false);

	$effect(() => {
		mounted = true;
	});
</script>

<svelte:head>
	<style>
		@keyframes blink {
			0%, 100% { opacity: 1; }
			50% { opacity: 0; }
		}
	</style>
</svelte:head>

{#if mounted}
<div
	class="relative min-h-screen selection:bg-primary/30 selection:text-foreground"
	in:fade={{ duration: 150 }}
>
	<!-- Subtle scanline overlay -->
	<div
		class="pointer-events-none fixed inset-0 z-50 opacity-[0.015]"
		style="background: repeating-linear-gradient(0deg, transparent, transparent 2px, currentColor 2px, currentColor 3px);"
	></div>

	<div class="mx-auto max-w-2xl px-6 py-12 font-[--font-display] sm:py-20">

		<!-- Dark mode toggle, right-aligned within max-w -->
		<div class="mb-8 flex justify-end" in:fade={{ duration: 200 }}>
			<DarkModeToggle />
		</div>

		<!-- Header block with profile pic -->
		<header class="mb-12" in:fade={{ duration: 300, delay: 50 }}>
			<div class="mb-8 flex items-center gap-7 sm:gap-8">
				<Avatar.Root
					class="size-20 shrink-0 rounded-full bg-muted/30 ring-1 ring-border sm:size-24"
				>
					<Avatar.Image
						src="https://9g74ko9d91.ufs.sh/f/NeU6e1Cs56VtaCGFzB8i7eavAH56VknjNhUmWYgLzFQZRw4M"
						alt="Portrait of Justin Dang"
						class="object-cover"
					/>
					<Avatar.Fallback class="text-lg font-semibold">JD</Avatar.Fallback>
				</Avatar.Root>

				<div>
					<h1 class="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
						Justin Dang
					</h1>
					<p class="mt-1 text-base text-muted-foreground/60">OD2 @ NSUOCO</p>
				</div>
			</div>

			<p class="mt-2 text-lg leading-relaxed text-foreground/70">
				Originally from Fort Smith, Arkansas. Background in the humanities and the Great Books.
				Studied computer science with a focus on artificial intelligence and human-computer interaction.
				Now interested in applying generative agents to healthcare and health education.
				That's why I'm building <a href="https://www.learnterms.com" target="_blank" rel="noopener noreferrer" class="text-foreground underline decoration-muted-foreground/40 underline-offset-2 transition-colors hover:decoration-foreground">LearnTerms.com</a>.
			</p>
		</header>

		<!-- Divider -->
		<div class="mb-10 border-t border-dashed border-muted-foreground/20" in:fade={{ duration: 200, delay: 150 }}></div>

		<!-- Links sections -->
		{#each sections as section, si}
			{#if si > 0}
				<div class="my-10 border-t border-dashed border-muted-foreground/20" in:fade={{ duration: 200, delay: 200 + si * 150 }}></div>
			{/if}

			<section in:fade={{ duration: 300, delay: 200 + si * 150 }}>
				<h2 class="mb-4 text-base tracking-widest text-muted-foreground/60 uppercase">
					{section.heading}
				</h2>

				{#if section.blurb}
					<p class="mb-8 text-lg leading-relaxed text-foreground/60">{section.blurb}</p>
				{/if}

				<div class="space-y-6">
					{#each section.links as link, i}
						<div
							class="group"
							in:fade={{ duration: 250, delay: 250 + si * 150 + i * 60 }}
						>
							<div class="flex items-baseline gap-2">
								<a
									href={link.href}
									target="_blank"
									rel="noopener noreferrer"
									class="text-lg font-semibold text-foreground underline decoration-muted-foreground/30 underline-offset-2 transition-all hover:decoration-foreground hover:text-primary"
								>
									{link.label}
								</a>
								<span class="text-xs text-muted-foreground/40 transition-colors group-hover:text-muted-foreground/60">&nearr;</span>
							</div>
							<p class="mt-1 text-lg leading-relaxed text-foreground/60">
								{link.desc}
							</p>
						</div>
					{/each}
				</div>
			</section>
		{/each}

		<!-- Divider -->
		<div class="my-12 border-t border-dashed border-muted-foreground/20" in:fade={{ duration: 200, delay: 800 }}></div>

		<!-- Snellen Chart -->
		<section in:fade={{ duration: 300, delay: 850 }}>
			<div class="overflow-x-auto">
				<SnellenChart />
			</div>
		</section>

		<!-- Footer -->
		<footer class="mt-16 border-t border-dashed border-muted-foreground/20 pt-6" in:fade={{ duration: 200, delay: 900 }}>
			<p class="text-sm text-muted-foreground/40">
				Ephesians 1:4–6. SDG.
			</p>
		</footer>

	</div>
</div>
{/if}
