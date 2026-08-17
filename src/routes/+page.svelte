<script lang="ts">
	import { fade } from 'svelte/transition';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import DarkModeToggle from '$lib/components/DarkModeToggle.svelte';
	import SnellenChart from '$lib/components/SnellenChart.svelte';

	const sections = [
		{
			heading: 'Projects',
			blurb: "I think good leadership and real collaboration have to be built on actually knowing the work, both technically and clinically. That's what these projects are for me: full-stack applications aimed at vision science, scheduling, education, and whatever else I've run into that seemed worth fixing.",
			links: [
				{
					label: 'LearnTerms.com',
					href: 'https://www.learnterms.com',
					desc: "A collaborative question bank for healthcare students that's now being used by cohorts around the country. It does board-style questions, analytics for a whole class, and there's an AI pipeline that turns course material into study content. I started it during my first year at NSUOCO because I wanted it to exist, and it has since grown into a much bigger testing and question-management system than I planned for."
				},
				{
					label: 'ClinicHub',
					href: 'https://clinic.learnterms.com/',
					desc: "Clinic scheduling for the Class of 2028 at NSUOCO. Students request shift swaps, a validation engine checks whether the swap is actually legal, admins can step in when it isn't, and everything gets logged. Before this we were all working off a spreadsheet that nobody fully understood and that fell apart once we were spread across several rotation sites."
				},
				{
					label: 'Swift Snellen',
					href: 'https://swiftsnellen.vercel.app/settings',
					desc: "A Snellen chart that runs in the browser, which I wrote from scratch mostly to understand how the sizing math works. You can set your testing distance and it scales the optotypes accordingly. It's for teaching and practice only, and it definitely isn't a medical device."
				},
				{
					label: 'IRIS',
					href: 'https://9g74ko9d91.ufs.sh/f/NeU6e1Cs56VtnYPdOMeILkKrZ4yJs73FmR0Q6UIVc8wxhWjA',
					desc: "My undergraduate capstone, a computer vision system meant to help blind shoppers navigate a grocery store. The models were the easy part. Figuring out how to communicate what the camera was seeing to someone who couldn't look at a screen was the part that actually took the year."
				}
			]
		},
		{
			heading: 'Videos',
			blurb: "I also do a fair amount of video work, usually live production for whatever is happening around school. None of it is especially glamorous, but it's a good excuse to build something for the people I'm around every day.",
			links: [
				{
					label: 'Meibomian Madness',
					href: 'https://www.youtube.com/live/6oXItG7xkeI?si=rFeq2h01Nhngb8da',
					desc: "We broadcast the NSUOCO student ping-pong tournament like it was a real sporting event, with live commentary, custom graphics, and a proper streaming setup. I built the production pipeline from scratch, and it turned out to be far more involved than any of us expected going in."
				},
				{
					label: 'White Coat Ceremony',
					href: 'https://www.youtube.com/live/FcMqQAeD9Gg?si=925a-VeqFt4vdFEw&t=1103',
					desc: "The first time the NSUOCO White Coat Ceremony had ever been streamed. I set it up for the Class of 2028 so that families who couldn't make the trip could still watch their student walk across the stage."
				},
				{
					label: 'Full Stack Lecture',
					href: 'https://youtu.be/weUsT0jQt28',
					desc: "A talk I gave to undergraduates who were past the tutorial stage and trying to build something real. I walked through frontends, APIs, and databases, but spent most of the time on the decisions you only run into once actual users are involved."
				}
			]
		},
		{
			heading: 'Social',
			blurb: "A few other places you can find me, in roughly descending order of how much I actually use them.",
			links: [
				{
					label: 'GitHub',
					href: 'https://github.com/jdang00',
					desc: "Some real production work and a lot of half-finished experiments. LearnTerms lives here, along with Swift Snellen and various AI and RAG prototypes I've been trying out on education and eye care problems."
				},
				{
					label: 'LinkedIn',
					href: 'https://www.linkedin.com/in/justin-a-dang/',
					desc: "My favorite larping platform! I post there about as often as you'd expect."
				},
				{
					label: 'Instagram',
					href: 'https://www.instagram.com/justin_a_dang/',
					desc: 'Mostly school, clinic, and family. Nothing you need to keep up with.'
				},
				{
					label: 'AOSA',
					href: 'https://theaosa.org/leadership/',
					desc: "The American Optometric Student Association. I serve in AOSA leadership, where I work on advocacy and policy alongside student community efforts across the country. It's most of what I do when I'm not in clinic or writing code."
				}
			]
		}
	];

	// Unlisted pages — no nav entry anywhere else, so these links are the only way in.
	const writing = [
		{
			label: 'Building Our Clinic Schedule',
			href: '/clinic-schedule-solver'
		},
		{
			label: 'Federal Advocacy and You',
			href: '/federal-advocacy'
		},
		{
			label: 'Seven models, one cornea, one wrong heuristic',
			href: '/ai-optometry-bench'
		},
		{
			label: 'Parking Allocation',
			href: '/parking-plan'
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
						src="/headshot.webp"
						alt="Portrait of Justin Dang"
						class="object-cover"
					/>
					<Avatar.Fallback class="text-lg font-semibold">JD</Avatar.Fallback>
				</Avatar.Root>

				<h1 class="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
					Justin Dang
				</h1>
			</div>

			<p class="mt-2 text-lg leading-relaxed text-foreground/90">
				I'm from Fort Smith, Arkansas, and I'm now a third year at the Oklahoma College of
				Optometry. I went through a classical education in high school, reading the Great Books,
				and then studied computer science in college, mostly artificial intelligence and
				human-computer interaction.
				These days I'm interested in what generative agents can do for healthcare and health
				education, which is why I'm building <a href="https://www.learnterms.com" target="_blank" rel="noopener noreferrer" class="text-foreground underline decoration-muted-foreground/50 underline-offset-2 transition-colors hover:decoration-foreground">LearnTerms.com</a>.
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
				<h2 class="mb-4 text-base font-medium tracking-widest text-muted-foreground uppercase">
					{section.heading}
				</h2>

				{#if section.blurb}
					<p class="mb-8 text-lg leading-relaxed text-foreground/80">{section.blurb}</p>
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
									class="text-lg font-semibold text-foreground underline decoration-muted-foreground/50 underline-offset-2 transition-all hover:decoration-foreground hover:text-primary"
								>
									{link.label}
								</a>
								<span class="text-xs text-muted-foreground/70 transition-colors group-hover:text-foreground">&nearr;</span>
							</div>
							<p class="mt-1 text-lg leading-relaxed text-foreground/80">
								{link.desc}
							</p>
						</div>
					{/each}
				</div>
			</section>
		{/each}

		<!-- Divider -->
		<div class="my-12 border-t border-dashed border-muted-foreground/20" in:fade={{ duration: 200, delay: 800 }}></div>

		<!-- Unlisted writing: not in the main sections, here so it's reachable -->
		<section in:fade={{ duration: 300, delay: 820 }}>
			<h2 class="mb-3 text-xs tracking-widest text-muted-foreground uppercase">
				More
			</h2>
			<ul class="space-y-2">
				{#each writing as piece}
					<li>
						<a
							href={piece.href}
							class="text-sm text-foreground/80 underline decoration-muted-foreground/40 underline-offset-2 transition-colors hover:text-foreground hover:decoration-foreground"
						>
							{piece.label}
						</a>
					</li>
				{/each}
			</ul>
		</section>

		<!-- Divider -->
		<div class="my-12 border-t border-dashed border-muted-foreground/20" in:fade={{ duration: 200, delay: 850 }}></div>

		<!-- Snellen Chart -->
		<section in:fade={{ duration: 300, delay: 870 }}>
			<div class="overflow-x-auto">
				<SnellenChart />
			</div>
		</section>

		<!-- Footer -->
		<footer class="mt-16 border-t border-dashed border-muted-foreground/20 pt-6" in:fade={{ duration: 200, delay: 900 }}>
			<p class="text-sm text-muted-foreground/80">
				Ephesians 1:4–6. SDG.
			</p>
		</footer>

	</div>
</div>
{/if}
