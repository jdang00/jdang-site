

<script lang="ts">
    import * as Table from "$lib/components/ui/table/index.js";

    type Course = {
      name: string;
      course: string;
      date: string;
    };
   
    const data: Course[] = [
      {
       name: "Programming 1",
       course: "CS 1014",
       date: "Fall 2020",
      },
      {
       name: "Programming 2",
       course: "CS 1024",
       date: "Spring 2021",
      },
      {
       name: "Data Structures",
       course: "CS 2003",
       date: "Fall 2021",
      },
      {
       name: "Algorithms",
       course: "CS 3103",
       date: "Fall 2022",
      },
      {
       name: "Artificial Intelligence",
       course: "CS 3113",
       date: "Spring 2023",
      },
      {
       name: "Computer Graphics",
       course: "CS 3323",
       date: "Fall 2023",
      },
    ];

  </script>

<Table.Root>
    <Table.Caption>Courses taken.</Table.Caption>
    <Table.Header>
      <Table.Row>
        <Table.Head>Name</Table.Head>
        <Table.Head>Course</Table.Head>
        <Table.Head>Date</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each data as data, i (i)}
        <Table.Row>
          <Table.Cell class="font-medium">{data.name}</Table.Cell>
          <Table.Cell>{data.course}</Table.Cell>
          <Table.Cell>{data.date}</Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>