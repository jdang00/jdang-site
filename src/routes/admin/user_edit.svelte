<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import EditForm from './edit_form.svelte';
	export let data;
</script>

<Dialog.Content>
	<Dialog.Header>
		<Dialog.Title>Edit Profile</Dialog.Title>
		<Dialog.Description>Update your profile information.</Dialog.Description>
	</Dialog.Header>
	<EditForm {data} />
</Dialog.Content>
