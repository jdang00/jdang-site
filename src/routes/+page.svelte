<script lang="ts">
	import { fade, fly, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	import SnellenChart from '$lib/components/SnellenChart.svelte';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import LinkPreviewDrawer from '$lib/components/LinkPreviewDrawer.svelte';

	const links = [
		{
			label: 'LearnTerms.com',
			href: 'https://www.learnterms.com',
			desc: 'AI-powered study tool',
			longDescription:
				'LearnTerms.com is a study platform I’m building while at NSUOCO. It turns class notes and slides into class-aligned questions, explanations, and quick reviews using a custom AI pipeline. It’s designed to be fast, simple, and focused on what your course actually covers, all while live updating making it a great collaborative study platform.',
			imageUrl: 'https://axcaluti7p.ufs.sh/f/DYlXFqnaImOr0iRZZjwE17POUXjVTyuaLZCAI0p9cgf4lt6w',
			linkText: 'Visit LearnTerms.com'
		},
		{
			label: 'RateMyPreceptor',
			href: 'https://www.ratemypreceptor.app/',
			desc: 'Student insights on preceptors',
			longDescription:
				"RateMyPreceptor is an in progress project. It's student-run place to share respectful, constructive reviews of clinical preceptors and rotation sites. It’s meant to help students set expectations, choose sites that fit their goals, and learn tips from those who were there before.",
			imageUrl: 'https://9g74ko9d91.ufs.sh/f/NeU6e1Cs56Vt4B2jqurodiEQwXeKJUcZtM71PW2kpT6SRB9g',
			linkText: 'View RateMyPreceptor'
		},
		{
			label: 'GitHub',
			href: 'https://github.com/jdang00',
			desc: 'Code & projects',
			longDescription:
				'A mix of production work and experiments: LearnTerms (SvelteKit + Convex), Swift Snellen, and AI/RAG prototypes for education and eye care. Repos include practical notes and trade-offs from building while in school.',
			imageUrl: 'https://9g74ko9d91.ufs.sh/f/NeU6e1Cs56VtGNiQAXEpKwoFUcPY6NWXjBZL93sxldhAkbHJ',
			linkText: 'View GitHub Profile'
		},
		{
			label: 'LinkedIn',
			href: 'https://www.linkedin.com/in/justin-a-dang/',
			desc: 'Professional profile',
			longDescription:
				"I'm not gonna lie, LinkedIn is a very funny platform to me. I don't post on there but I need connections for clout so here it is.",
			imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=400&fit=crop',
			linkText: 'Connect on LinkedIn'
		},
		{
			label: 'Instagram',
			href: 'https://www.instagram.com/justin_a_dang/',
			desc: 'Snapshots of life',
			longDescription: 'A light feed of school and clinic life, family and more.',
			imageUrl: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=800&h=400&fit=crop',
			linkText: 'Follow on Instagram'
		},
		{
			label: 'AOSA',
			href: 'https://theaosa.org/leadership/',
			desc: 'Student optometry leadership',
			longDescription:
				'The American Optometric Student Association represents optometry students nationwide through advocacy, education, and community. I serve in AOSA leadership for NSUOCO; this link goes to the current leadership page.',
			imageUrl:
				'https://theaosa.org/wp-content/uploads/2025/08/group_25_8_13_25_2_best-_copy_2.webp',
			linkText: 'Learn About AOSA'
		},
		{
			label: 'IRIS',
			href: 'https://9g74ko9d91.ufs.sh/f/NeU6e1Cs56VtnYPdOMeILkKrZ4yJs73FmR0Q6UIVc8wxhWjA',
			desc: 'Undergrad capstone project',
			longDescription:
				'IRIS was my undergraduate capstone applying practical machine-learning ideas to healthcare-adjacent problems. It shaped how I approach building simple, reliable tools for students and clinicians.',
			imageUrl: 'https://9g74ko9d91.ufs.sh/f/NeU6e1Cs56Vtpga8cCTRIldGzxhgXTM9DY0fBrbiUSvcO4m1',
			linkText: 'View IRIS Project'
		},
		{
			label: 'Full Stack Lecture',
			href: 'https://youtu.be/weUsT0jQt28',
			desc: 'Intro to full stack dev',
			longDescription:
				'A recording of a talk I gave on full-stack fundamentals—frontends, APIs, and databases—and the decisions that actually matter when shipping. Geared toward students moving from tutorials to real apps.',
			imageUrl: 'https://img.youtube.com/vi/weUsT0jQt28/0.jpg',
			linkText: 'Watch on YouTube'
		},
		{
			label: 'Swift Snellen',
			href: 'https://swiftsnellen.vercel.app/settings',
			desc: 'Online Snellen chart',
			longDescription:
				'A browser-based Snellen chart I wrote from scratch for demos and student practice from what I learned in my vision science classes. It has adjustable distance and optotype size; intended for educational use only (not a medical device).',
			imageUrl:
				'https://images.unsplash.com/photo-1517948430535-1e2469d314fe?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
			linkText: 'Try Swift Snellen'
		}
	];
</script>

<section
	class="relative overflow-hidden bg-background py-10 sm:py-14"
	aria-label="About Justin Dang"
	in:fade={{ duration: 200 }}
>
	<div class="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
		<div class="grid items-center gap-8 md:grid-cols-3 lg:gap-10">
			<div
				class="flex justify-center md:justify-start"
				in:scale={{ duration: 300, easing: quintOut, start: 0.85 }}
			>
				<Avatar.Root
					class="size-32 rounded-full bg-muted/30 shadow-md ring-1 ring-border sm:size-40 md:size-48 lg:size-56"
				>
					<Avatar.Image
						src="https://9g74ko9d91.ufs.sh/f/NeU6e1Cs56VtMnwqrV5r8ENsP4ivB3m6AOJZueSgj10RW7DI"
						alt="Portrait of Justin Dang"
						class="object-cover"
					/>
					<Avatar.Fallback class="text-lg font-semibold">JD</Avatar.Fallback>
				</Avatar.Root>
			</div>

			<div class="md:col-span-2">
				<header class="mb-4" in:fly={{ x: 16, duration: 250, delay: 50, easing: quintOut }}>
					<h1
						class="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
					>
						Justin Dang
					</h1>
					<p class="mt-1 text-muted-foreground">OD2</p>
				</header>

				<div
					class="prose prose-neutral sm:prose-base lg:prose-lg dark:prose-invert max-w-none text-muted-foreground"
					in:fly={{ x: 16, duration: 300, delay: 120, easing: quintOut }}
				>
					<p>
						I'm an optometry student at the Northeastern State University Oklahoma College of
						Optometry. Originally from Fort Smith, Arkansas, I grew up with a strong background in
						the humanities and the Great Books of the Western World. In college, I studied computer
						science with artificial intelligence and human-computer interaction.
					</p>

					<p>
						I'm interested in applying generative agents to healthcare and health education. That's
						why I'm building
						<a
							href="https://www.learnterms.com"
							target="_blank"
							rel="noopener noreferrer"
							class="font-medium text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
						>
							LearnTerms.com
						</a>
						to enhance student studying.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<section
	id="links"
	class="bg-muted/20 py-10 sm:py-14"
	aria-label="Links and things"
	in:fade={{ duration: 200 }}
>
	<div class="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
		<h2
			class="mb-6 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
			in:fly={{ y: 12, duration: 250, easing: quintOut }}
		>
			Links and things
		</h2>

		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" in:fade={{ duration: 200, delay: 80 }}>
			{#each links as link, i}
				<LinkPreviewDrawer
					title={link.label}
					description={link.longDescription}
					imageUrl={link.imageUrl}
					linkUrl={link.href}
					linkText={link.linkText}
				>
					{#snippet trigger()}
						<div
							class="group w-full cursor-pointer rounded-lg border border-border bg-background p-4 text-left shadow-sm transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
							role="button"
							tabindex="0"
							onkeydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									e.currentTarget.click();
								}
							}}
							in:fly={{
								y: 16,
								duration: 250,
								delay: 100 + i * 80,
								easing: quintOut
							}}
						>
							<div class="flex items-start justify-between">
								<div>
									<div class="font-medium text-foreground">{link.label}</div>
									<div class="text-sm text-muted-foreground">{link.desc}</div>
								</div>
								<span
									class="ms-3 inline-grid size-7 place-items-center rounded-full border border-border text-muted-foreground transition group-hover:bg-primary group-hover:text-primary-foreground"
									aria-hidden="true">→</span
								>
							</div>
						</div>
					{/snippet}
				</LinkPreviewDrawer>
			{/each}
		</div>
	</div>
</section>

<section
	id="vision"
	class="bg-muted/30 py-10 sm:py-14"
	aria-label="Vision chart"
	in:fade={{ duration: 200 }}
>
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div
			class="overflow-hidden rounded-lg bg-background p-4 shadow-sm ring-1 ring-border sm:p-6"
			in:scale={{ duration: 250, start: 0.98, easing: quintOut }}
		>
			<div
				class="flex items-center justify-center overflow-x-auto"
				in:fade={{ duration: 200, delay: 80 }}
			>
				<div class="max-w-full">
					<SnellenChart />
				</div>
			</div>
		</div>
	</div>
</section>
