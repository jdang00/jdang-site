<script>
	import '../app.css';
	import Nav from '$lib/Nav.svelte'
	import grad from '../img/grad.webp'
	import cce from '../img/cce.webp'
	import optom from '../img/optom.webp'
	import CourseTable from './classes/data-table.svelte'
	import { Button } from '$lib/components/ui/button'
</script>

<Nav />

<div class="flex flex-col mx-auto my-24 gap-14 flex-wrap">
	<div class="flex flex-row flex-wrap justify-center gap-x-10 text-center">
		<div class="flex flex-col mb-10">
			<h1 class="text-5xl font-bold">Justin A. Dang</h1>
			<p class="mt-4 text-gray-600">Oklahoma School of Optometry | Northeastern State University</p>
			<p class="mt-2 text-gray-600">
				Computer Science and Mathematics | University of Arkansas – Fort Smith
			</p>
			<h2 class="text-3xl">I love my sister Faith.</h2>
		</div>
	</div>

	<div class="text-left">
		<div class="flex flex-row justify-evenly mx-10 flex-wrap gap-5">
			<div class="max-w-sm rounded overflow-hidden shadow-lg">
				<div class="overflow-hidden">
					<img
						class="hover:scale-110 transition-all duration-500 cursor-pointer"
						src={cce}
						alt="logos"
					/>
				</div>

				<div class="px-6 py-4">
					<div class="font-bold text-xl mb-2">Classically Educated.</div>
					<p class="text-gray-700 text-base">
						I fell in love with the classics at Logos Online School who gave me an incredible
						Classical Christian Education experience. Read more about my thoughts on homeschooling
						and Christian thinking about cultural issues.
					</p>
					<Button class="mt-4" variant="outline">Read more</Button>
				</div>
			</div>
			<div class="max-w-sm rounded overflow-hidden shadow-lg">
				<div class="overflow-hidden">
					<img
						class="hover:scale-110 transition-all duration-500 cursor-pointer"
						src={grad}
						alt="cs"
					/>
				</div>
				<div class="px-6 py-4">
					<div class="font-bold text-xl mb-2">Coder to the Core.</div>
					<p class="text-gray-700 text-base">
						I studied computer science at UAFS, where I gained my passion for software engineering,
						AI, and technology. Learn more about my research and development projects during
						undergraduate.
					</p>
					<Button class="mt-4" variant="outline" href="/undergrad">Learn more</Button>
				</div>
			</div>
			<div class="max-w-sm rounded overflow-hidden shadow-lg">
				<div class="overflow-hidden">
					<img
						class="hover:scale-110 transition-all duration-500 cursor-pointer"
						src={optom}
						alt="op"
					/>
				</div>
				<div class="px-6 py-4">
					<div class="font-bold text-xl mb-2">A Vision For the Future.</div>
					<p class="text-gray-700 text-base">
						I'm currently a student at the Oklahoma School of Optometry learning to give
						professional vision care for all. Keep up with my adventures in the field of optometry
						and my plans for the future.
					</p>
					<Button class="mt-4" variant="outline">Learn more</Button>
				</div>
			</div>
		</div>
	</div>
</div>

<slot />
