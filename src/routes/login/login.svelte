<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { formSchema, type FormSchema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm(data, {
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
	<div class="flex flex-col gap-2">
		<Form.Field {form} name="username">
			<Form.Control let:attrs>
				<Input {...attrs} bind:value={$formData.username} placeholder="Username" type="username" />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="password">
			<Form.Control let:attrs>
				<Input {...attrs} bind:value={$formData.password} placeholder="Password" type="password" />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Button>Login</Form.Button>
	</div>
</form>
