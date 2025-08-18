<script lang="ts">
	const name = 'JUSTIN DANG';
	const letters = name.replace(/\s+/g, '').toUpperCase().split('');
	const groups: string[] = [];
	let size = 1;
	for (let i = 0; i < letters.length; i += size++) {
		groups.push(letters.slice(i, i + size).join(''));
	}
	const topSize = 12;
	const letterScale = 0.7;
	const acuity = [
		'20/200',
		'20/100',
		'20/70',
		'20/50',
		'20/40',
		'20/32',
		'20/25',
		'20/20',
		'20/16',
		'20/12',
		'20/10'
	];
	const greenBarAt = 2;
	const redBarAt = 3;
</script>

<div class="flex flex-col items-center justify-center gap-3 px-4 sm:p-4 sm:px-2">
	{#each groups as line, i}
		<div class="flex w-full max-w-4xl items-center justify-between">
			<span
				class="font-display flex-1 text-center font-black uppercase leading-none tracking-[.25em]"
				style="font-size: {topSize * Math.pow(letterScale, i)}rem"
			>
				{line}
			</span>
			<div class="flex items-center justify-between gap-8 sm:min-w-48 sm:gap-4 lg:gap-6">
				<span class=" hidden min-w-8 text-center text-xl lg:block">{i + 1}</span>
				<span class=" hidden text-center text-xl sm:block">{acuity[i] ?? ''}</span>
			</div>
		</div>
		{#if i === greenBarAt}
			<div class="my-2 h-3 w-full max-w-4xl bg-green-600"></div>
		{/if}
		{#if i === redBarAt}
			<div class="my-2 h-3 w-full max-w-4xl bg-red-600"></div>
		{/if}
	{/each}
</div>
