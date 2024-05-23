<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as Select from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';

	let selectedOption = '';
	let additionalOption = 'none';
	let additionalOptions = ['none'];
	let resetVal = 1;

	$: if (selectedOption === 'term') {
		additionalOptions = [
			'Fall 2019',
			'Spring 2020',
			'Fall 2020',
			'Spring 2021',
			'Summer 2021',
			'Fall 2021',
			'Spring 2022',
			'Summer 2022',
			'Fall 2022',
			'Spring 2023',
			'Summer 2023',
			'Fall 2023',
			'Spring 2024'
		];
	} else if (selectedOption === 'requirements') {
		additionalOptions = [
			'Computer Science',
			'Pre-Optometry',
			'Math',
			'General',
			'AP Credit',
			'Other'
		];
	} else if (selectedOption === 'department') {
		additionalOptions = ['CS', 'MATH', 'BIOL', 'CHEM'];
	} else {
		additionalOptions = ['none'];
	}

	export let data: { courses: Course[] };

	function clearFilters() {
		selectedOption = '';
		additionalOption = 'none';
		filteredCourses = data.courses;
		resetVal = resetVal + 1;
	}

	type Course = {
		courseid: number;
		coursename: string;
		department: string;
		coursenumber: string;
		instructor: string;
		semester: string;
		year: number;
		grade: string;
		notes: string | null;
	};

	$: filteredCourses = data.courses.filter((course: Course) => {
		if (selectedOption === 'term') {
			return course.semester === additionalOption;
		} else if (selectedOption === 'requirements') {
			return course.notes && course.notes.includes(additionalOption);
		} else if (selectedOption === 'department') {
			return course.department === additionalOption;
		}
		return true;
	});
</script>

<div class="mt-8">
	<div class="flex flex-row gap-3">
		{#key resetVal}
			<Select.Root>
				<Select.Trigger class="w-[180px]">
					<Select.Value placeholder="Sort By" id="sort" />
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="term" on:click={() => (selectedOption = 'term')}>Term</Select.Item>
					<Select.Item value="requirements" on:click={() => (selectedOption = 'requirements')}
						>Requirements</Select.Item
					>
					<Select.Item value="department" on:click={() => (selectedOption = 'department')}
						>Department</Select.Item
					>
				</Select.Content>
			</Select.Root>
		{/key}
		{#if selectedOption}
			<Select.Root>
				<Select.Trigger class="w-[250px]">
					<Select.Value placeholder={`Select ${selectedOption}`} id="filter" />
				</Select.Trigger>
				<Select.Content>
					{#each additionalOptions as option}
						<Select.Item value={option} on:click={() => (additionalOption = option)}
							>{option}</Select.Item
						>
					{/each}
				</Select.Content>
			</Select.Root>
		{/if}
		<Button variant="ghost" on:click={clearFilters}>Clear</Button>
	</div>

	<div class="mt-4">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Course Name</Table.Head>
					<Table.Head>Course Number</Table.Head>
					<Table.Head>Instructor</Table.Head>
					<Table.Head>Semester</Table.Head>
					<Table.Head>Grade</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each filteredCourses as course}
					<Table.Row>
						<Table.Cell>{course.coursename}</Table.Cell>
						<Table.Cell>{course.coursenumber}</Table.Cell>
						<Table.Cell>{course.instructor}</Table.Cell>
						<Table.Cell>{course.semester}</Table.Cell>
						<Table.Cell>{course.grade}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</div>
