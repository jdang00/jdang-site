<script lang="ts">
	import DarkModeToggle from '$lib/components/DarkModeToggle.svelte';
</script>

<svelte:head>
	<title>Federal Advocacy and You</title>
	<meta
		name="description"
		content="Three things you need to know about how the AOA advocates for optometry in DC and all across the nation."
	/>
	<meta name="robots" content="noindex" />
	<meta property="og:title" content="Federal Advocacy and You" />
	<meta
		property="og:description"
		content="Three things you need to know about how the AOA advocates for optometry in DC and all across the nation."
	/>
	<meta property="og:type" content="article" />
	<meta property="og:url" content="https://justindang.dev/federal-advocacy" />
	<meta property="og:image" content="https://justindang.dev/federal-advocacy-og.jpg" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="749" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Federal Advocacy and You" />
	<meta name="twitter:image" content="https://justindang.dev/federal-advocacy-og.jpg" />
</svelte:head>

<div class="min-h-screen bg-background text-foreground">
	<article class="mx-auto flex max-w-[680px] flex-col px-5 py-12 sm:py-16">
		<div class="mb-12 flex items-center justify-between">
			<a
				href="/"
				class="text-sm text-muted-foreground transition-colors hover:text-foreground"
			>
				← Justin Dang
			</a>
			<DarkModeToggle />
		</div>

		<h1 class="text-4xl leading-tight font-bold tracking-tight text-balance sm:text-[2.75rem]">
			Federal Advocacy and You
		</h1>

		<figure class="mt-8 mb-10 flex flex-col gap-2">
			<img
				src="/federal-advocacy-hero.webp"
				alt="The US Capitol building under a partly cloudy sky with the words Federal Advocacy in Optometry"
				class="w-full rounded-lg"
				width="1600"
				height="998"
			/>
			<figcaption class="text-sm text-muted-foreground">
				Photo by
				<a
					href="https://www.pexels.com/@thuanvo09/"
					target="_blank"
					rel="noopener noreferrer"
					class="underline underline-offset-2 transition-colors hover:text-foreground"
				>
					Thuan Vo
				</a>
				on
				<a
					href="https://www.pexels.com"
					target="_blank"
					rel="noopener noreferrer"
					class="underline underline-offset-2 transition-colors hover:text-foreground"
				>
					Pexels
				</a>
			</figcaption>
		</figure>

		<div class="flex flex-col gap-7 text-lg leading-relaxed">
			<p>
				Understanding how optometry advocates at the federal level can serve as a model for how it
				advocates at the state level, the city level, and even the individual level — starting with
				the patient in your chair. Here are three things you need to know about how the AOA
				advocates for you in DC and all across the nation.
			</p>

			<h2 class="mt-4 text-2xl font-bold tracking-tight">1. The Federal Keypersons Program</h2>
			<p>
				The Federal Keypersons Program is a network of optometrists assigned to members of Congress
				to build and maintain a personal and political relationship with them. By focusing on these
				relationships, optometry’s message carries greater weight in federal legislation. It’s the
				advocacy embodiment of “it’s not what you know, it’s who you know.” Over 95% of Congress is
				covered by this network, and when it’s time to serve patients and the profession through
				legislation, this program is an essential part of getting it done.
				<a
					href="https://www.aoa.org/advocacy/federal/keypersons-program"
					target="_blank"
					rel="noopener noreferrer"
					class="font-medium underline underline-offset-2 transition-colors hover:text-muted-foreground"
				>
					Learn more about the Keypersons Program →
				</a>
			</p>

			<h2 class="mt-4 text-2xl font-bold tracking-tight">2. AOA-PAC</h2>
			<p>
				AOA-PAC is the AOA’s political action committee. It works to elect and re-elect
				pro-optometry candidates to the US Senate and House, largely through donations and
				contributions. The PAC conducts a significant amount of research, provides generous
				resources, and works to be the voice of optometry in the nation’s capital.
				<a
					href="https://www.aoa.org/advocacy/federal/aoa-pac"
					target="_blank"
					rel="noopener noreferrer"
					class="font-medium underline underline-offset-2 transition-colors hover:text-muted-foreground"
				>
					Learn more about AOA-PAC →
				</a>
			</p>

			<h2 class="mt-4 text-2xl font-bold tracking-tight">3. AOA FAR</h2>
			<p>
				AOA FAR is the Federal Advocacy Representatives program. Each state has at least one FAR
				who serves as a resource for all things AOA federal advocacy. Optometry has a proud
				grassroots heritage, and these representatives help lead those efforts, connecting the
				state and federal levels. They also recruit and retain AOA-PAC investors.
				<a
					href="https://www.aoa.org/advocacy/federal/federal-advocacy-representatives"
					target="_blank"
					rel="noopener noreferrer"
					class="font-medium underline underline-offset-2 transition-colors hover:text-muted-foreground"
				>
					Learn more about AOA FAR →
				</a>
			</p>

			<p>
				With these relationships, supports, and networks in place, the profession is well equipped
				to defend, promote, and advocate for itself. As a student, you can be a part of this: meet
				a Keyperson at AOA on Capitol Hill, consider giving any amount to AOA-PAC, and reach out to
				your FAR to learn more about state and federal advocacy.
			</p>
		</div>

		<footer class="mt-14 text-sm text-muted-foreground">
			Draft for committee review — written for the Trustee Report, to be sent to the communications
			team.
		</footer>
	</article>
</div>
