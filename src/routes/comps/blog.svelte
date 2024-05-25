<script lang="ts">
	export let data;
	console.log(data);

	function formatDate(inputDate: string) {
		const months = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		];

		const [year, month, day] = inputDate.split('-').map(Number);
		const formattedDate = `${months[month - 1]} ${day}, ${year}`;

		return formattedDate;
	}
</script>

<div class="mt-8">
	{#each data.posts as post}
		<h1 class="text-4xl">{post.title}</h1>
		<p class="text-gray-500">{post.description}</p>
		<p class="text-gray-500">{formatDate(post.date)}</p>
		<div class="mb-24"></div>
	{/each}
</div>
