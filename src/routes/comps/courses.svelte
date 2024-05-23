<script>
	import * as Table from '$lib/components/ui/table';
	export let data;
</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head>Course Name</Table.Head>
			<Table.Head>Course Number</Table.Head>
			<Table.Head>Term</Table.Head>
			<Table.Head>Grade</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each data.courses as course}
			<Table.Row>
				<Table.Cell class="font-medium">{course.coursename}</Table.Cell>
				<Table.Cell>{course.coursenumber}</Table.Cell>
				<Table.Cell>{course.semester}</Table.Cell>
				<Table.Cell>{course.grade}</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
