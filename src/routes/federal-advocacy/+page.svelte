<script lang="ts">
	import DarkModeToggle from '$lib/components/DarkModeToggle.svelte';

	const points = [
		{
			title: 'The Federal Keypersons Program',
			body: 'The Federal Keypersons Program is a network of optometrists who are assigned to members of Congress to form and keep a personal and political relationship with them. By focusing on having these relationships, optometry’s message in federal legislation bears greater weight. It’s the advocacy embodiment of “it’s not what you know, it’s who you know”. We have over 95% of Congress covered by this network. When it’s time to serve patients and the profession through legislation, this program serves as an essential part of getting it done!'
		},
		{
			title: 'AOA-PAC',
			body: 'The AOA-PAC is the AOA political action committee. It works to elect and elect pro-optometry candidates for US Senate and House. A large portion of this is done through donations and contributions. This program does a significant amount of research, provides generous resources, and works to be the voice of optometry in the nation’s capitol.'
		},
		{
			title: 'AOA FAR',
			body: 'AOA FAR is the Federal Advocacy Representatives program. Each state has at least one FAR to serve as a resource for all things AOA federal advocacy. Optometry has a proud grassroots heritage, and these representatives help lead these efforts and connect the state and federal level. They also retain and recruit AOA-PAC investors!'
		}
	];
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
	<div class="mx-auto flex max-w-2xl flex-col gap-10 px-5 py-12 sm:py-16">
		<div class="flex items-center justify-between">
			<a
				href="/"
				class="text-sm text-muted-foreground transition-colors hover:text-foreground"
			>
				← Justin Dang
			</a>
			<DarkModeToggle />
		</div>

		<header class="flex flex-col gap-4 border-b border-border pb-8">
			<span
				class="w-fit rounded-full border border-border px-3 py-1 text-xs font-medium tracking-wide text-muted-foreground uppercase"
			>
				Draft — for committee review
			</span>
			<h1 class="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
				Federal Advocacy and You
			</h1>
			<p class="text-lg leading-relaxed text-muted-foreground">
				Understanding how optometry advocates on a federal level can model how it advocates on the
				state level, city level, and even to the individual level starting with the patient in your
				chair. Here are three things you need to know about how the AOA advocates for you in DC and
				all across the nation.
			</p>
		</header>

		<ol class="flex list-none flex-col gap-6 p-0">
			{#each points as point, i}
				<li class="flex gap-4 rounded-lg border border-border bg-card p-5 sm:p-6">
					<span
						class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
					>
						{i + 1}
					</span>
					<div class="flex flex-col gap-2">
						<h2 class="text-lg font-semibold">{point.title}</h2>
						<p class="leading-relaxed text-muted-foreground">{point.body}</p>
					</div>
				</li>
			{/each}
		</ol>

		<div class="rounded-lg border-l-4 border-primary bg-muted p-5 sm:p-6">
			<p class="leading-relaxed">
				With the relationships, supports and networks in place, the profession is well equipped to
				defend, promote, and advocate for itself. As students, you can be a part of this! Meet a
				keyperson on AOA on Capitol Hill. Consider giving any amount to the AOA-PAC. Reach out to a
				FAR to learn more about state and federal advocacy!
			</p>
		</div>
	</div>
</div>
