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
</svelte:head>

<div class="min-h-screen bg-background text-foreground">
	<article class="mx-auto flex max-w-2xl flex-col gap-8 px-5 py-12 sm:py-16">
		<div class="flex items-center justify-between">
			<a
				href="/"
				class="text-sm text-muted-foreground transition-colors hover:text-foreground"
			>
				← Justin Dang
			</a>
			<DarkModeToggle />
		</div>

		<header class="flex flex-col gap-5">
			<h1 class="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
				Federal Advocacy and You
			</h1>
			<p class="text-lg leading-relaxed">
				Understanding how optometry advocates at the federal level can serve as a model for how it
				advocates at the state level, the city level, and even the individual level — starting with
				the patient in your chair. Here are three things you need to know about how the AOA
				advocates for you in DC and all across the nation.
			</p>
		</header>

		<section class="flex flex-col gap-2">
			<h2 class="text-xl font-semibold tracking-tight">1. The Federal Keypersons Program</h2>
			<p class="leading-relaxed">
				The Federal Keypersons Program is a network of optometrists assigned to members of Congress
				to build and maintain a personal and political relationship with them. By focusing on these
				relationships, optometry’s message carries greater weight in federal legislation. It’s the
				advocacy embodiment of “it’s not what you know, it’s who you know.” Over 95% of Congress is
				covered by this network, and when it’s time to serve patients and the profession through
				legislation, this program is an essential part of getting it done.
			</p>
		</section>

		<section class="flex flex-col gap-2">
			<h2 class="text-xl font-semibold tracking-tight">2. AOA-PAC</h2>
			<p class="leading-relaxed">
				AOA-PAC is the AOA’s political action committee. It works to elect and re-elect
				pro-optometry candidates to the US Senate and House, largely through donations and
				contributions. The PAC conducts a significant amount of research, provides generous
				resources, and works to be the voice of optometry in the nation’s capital.
			</p>
		</section>

		<section class="flex flex-col gap-2">
			<h2 class="text-xl font-semibold tracking-tight">3. AOA FAR</h2>
			<p class="leading-relaxed">
				AOA FAR is the Federal Advocacy Representatives program. Each state has at least one FAR
				who serves as a resource for all things AOA federal advocacy. Optometry has a proud
				grassroots heritage, and these representatives help lead those efforts, connecting the
				state and federal levels. They also recruit and retain AOA-PAC investors.
			</p>
		</section>

		<section class="flex flex-col gap-2 border-t border-border pt-8">
			<p class="leading-relaxed">
				With these relationships, supports, and networks in place, the profession is well equipped
				to defend, promote, and advocate for itself. As a student, you can be a part of this: meet
				a Keyperson at AOA on Capitol Hill, consider giving any amount to AOA-PAC, and reach out to
				your FAR to learn more about state and federal advocacy.
			</p>
		</section>

		<footer class="text-sm text-muted-foreground italic">
			Draft — for committee review. Not for distribution.
		</footer>
	</article>
</div>
