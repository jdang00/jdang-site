<script lang="ts">
	import '../../app.css';
	import Dashboard from './dashboard.svelte';
	export let data;
</script>

<svelte:head>
	<title>Admin Dashboard</title>
</svelte:head>

<Dashboard {data} />
