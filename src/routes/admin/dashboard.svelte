<script>
	import '../../app.css';
	import BlogTable from './post_table.svelte';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import Theme from '../button.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

	import { LogOut } from 'lucide-svelte';
	import { User } from 'lucide-svelte';
	import { CreditCard } from 'lucide-svelte';

	export let data;

	import { goto } from '$app/navigation';

	async function logout() {
		const response = await fetch('/api/logout', {
			method: 'POST'
		});

		if (response.ok) {
			goto('/login');
		}
	}
</script>

<svelte:head>
	<title>Admin Dashboard</title>
</svelte:head>

<div class="border-b min-h-14 flex flex-row items-center px-8 justify-between">
	<a class="font-semibold" href="/">jdang-site</a>
	<h1 class="font-semibold">Admin Dashboard</h1>

	<div class="flex flex-row gap-4">
		<Theme />
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<Avatar.Root>
					<Avatar.Image
						src="https://utfs.io/f/11a65a73-c4ff-4b9c-96d4-27c680ec9740-ge3if.webp"
						alt="@jdang"
					/>
					<Avatar.Fallback>JD</Avatar.Fallback>
				</Avatar.Root>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Group>
					<DropdownMenu.Label>My Account</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<DropdownMenu.Item><User class="mr-2 h-4 w-4" /><span>User</span></DropdownMenu.Item>
					<DropdownMenu.Item
						><CreditCard class="mr-2 h-4 w-4" /><span>Billing</span></DropdownMenu.Item
					>
					<DropdownMenu.Item on:click={logout}
						><LogOut class="mr-2 h-4 w-4" /><span>Logout</span></DropdownMenu.Item
					>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</div>

<div class="flex items-center justify-between w-full flex-col p-8 min-h-screen">
	<div class="w-full max-w-7xl mt-6">
		<BlogTable {data} />
	</div>
</div>
