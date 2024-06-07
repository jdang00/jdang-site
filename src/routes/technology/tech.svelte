<script>
	import { Laptop } from 'lucide-svelte';
	import { Tablet } from 'lucide-svelte';
	import { Computer } from 'lucide-svelte';
	import { Watch } from 'lucide-svelte';
</script>

<div class="grid gap-12 mt-8">
	<div>
		<h1 class="text-3xl font-bold tracking-tight">My Tech Setup</h1>
		<p class="text-gray-500 dark:text-gray-400 mt-2">
			A look at the personal technology I use on a daily basis.
		</p>
	</div>

	<div class="grid md:grid-cols-2 gap-8">
		<div class="grid gap-6">
			<div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 grid gap-4">
				<div class="flex items-center justify-between">
					<h2 class="text-xl font-bold">Mac MB</h2>
					<div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
						<Laptop />
						Laptop
					</div>
				</div>
				<img
					src="https://utfs.io/f/892f4805-b76c-4e75-9650-e0787de10ba1-1xckjd.JPG"
					alt="Laptop"
					width={600}
					height={400}
					class="rounded-lg object-cover"
				/>
				<div class="grid gap-2">
					<div class="flex items-center justify-between">
						<span class="text-gray-500 dark:text-gray-400">Model</span>
						<span>MacBook Pro 14"</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-gray-500 dark:text-gray-400">Processor</span>
						<span>M3 Pro</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-gray-500 dark:text-gray-400">RAM</span>
						<span>18GB</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-gray-500 dark:text-gray-400">Storage</span>
						<span>512 SSD</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-gray-500 dark:text-gray-400">Graphics</span>
						<span>M3 Pro</span>
					</div>
				</div>
				<p class="text-sm text-gray-500 dark:text-gray-400">
					My main desktop computer for work, gaming, and content creation. It's a powerful machine
					that handles everything I throw at it with ease.
				</p>
			</div>
			<div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 grid gap-4">
				<div class="flex items-center justify-between">
					<h2 class="text-xl font-bold">Smol</h2>
					<div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
						<Tablet />
						Tablet
					</div>
				</div>
				<img
					src="https://utfs.io/f/892f4805-b76c-4e75-9650-e0787de10ba1-1xckjd.JPG"
					alt="Tablet"
					width={600}
					height={400}
					class="rounded-lg object-cover"
				/>
				<div class="grid gap-2">
					<div class="flex items-center justify-between">
						<span class="text-gray-500 dark:text-gray-400">Model</span>
						<span>iPad mini 6th Generation</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-gray-500 dark:text-gray-400">Display</span>
						<span>8.3" Liquid Retina</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-gray-500 dark:text-gray-400">Processor</span>
						<span>A15 Bionic</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-gray-500 dark:text-gray-400">RAM</span>
						<span>4 GB</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-gray-500 dark:text-gray-400">Storage</span>
						<span>64 GB</span>
					</div>
				</div>
				<p class="text-sm text-gray-500 dark:text-gray-400">
					My main desktop computer for work, gaming, and content creation. It's a powerful machine
					that handles everything I throw at it with ease.
				</p>
			</div>
		</div>
		<div class="grid gap-6">
			<div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 grid gap-4">
				<div class="flex items-center justify-between">
					<h2 class="text-xl font-bold">Build R</h2>
					<div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
						<Computer />
						Desktop
					</div>
				</div>
				<img
					src="https://utfs.io/f/892f4805-b76c-4e75-9650-e0787de10ba1-1xckjd.JPG"
					alt="Desktop"
					width={600}
					height={400}
					class="rounded-lg object-cover"
				/>
				<div class="grid gap-2">
					<div class="flex items-center justify-between">
						<span class="text-gray-500 dark:text-gray-400">Model</span>
						<span>MacBook Pro 14"</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-gray-500 dark:text-gray-400">Processor</span>
						<span>AMD Ryzen 5 3600</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-gray-500 dark:text-gray-400">RAM</span>
						<span>32GB DDR4</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-gray-500 dark:text-gray-400">Storage</span>
						<span>1TB NVMe / 2TB SATA SSD</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-gray-500 dark:text-gray-400">Graphics</span>
						<span>NVIDIA RTX 2070</span>
					</div>
				</div>
				<p class="text-sm text-gray-500 dark:text-gray-400">
					My main desktop computer for work, gaming, and content creation. It's a powerful machine
					that handles everything I throw at it with ease.
				</p>
			</div>
			<div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 grid gap-4">
				<div class="flex items-center justify-between">
					<h2 class="text-xl font-bold">Apple Watch SE</h2>
					<div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
						<Watch />
						Smart Watch
					</div>
				</div>
				<img
					src="https://utfs.io/f/892f4805-b76c-4e75-9650-e0787de10ba1-1xckjd.JPG"
					alt="Watch"
					width={600}
					height={400}
					class="rounded-lg object-cover"
				/>
				<div class="grid gap-2">
					<div class="flex items-center justify-between">
						<span class="text-gray-500 dark:text-gray-400">Model</span>
						<span>Apple Watch SE</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-gray-500 dark:text-gray-400">Processor</span>
						<span>Apple S5 SiP</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-gray-500 dark:text-gray-400">RAM</span>
						<span>1 GB</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-gray-500 dark:text-gray-400">Storage</span>
						<span>32 GB</span>
					</div>
				</div>
				<p class="text-sm text-gray-500 dark:text-gray-400">
					My main desktop computer for work, gaming, and content creation. It's a powerful machine
					that handles everything I throw at it with ease.
				</p>
			</div>
		</div>
	</div>
</div>
