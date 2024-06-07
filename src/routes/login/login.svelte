<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { formSchema, type FormSchema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button/index.js';

	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm(data, {
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance } = form;
</script>

<div class="flex items-center justify-center min-h-[75vh] px-4 md:px-6">
	<Card.Root class="w-full max-w-sm py-6">
		<Card.Header class="space-y-1 text-center">
			<Card.Title class="text-2xl font-bold dark:text-slate-200">Login</Card.Title>
			<Card.Description>Login to your account</Card.Description>
		</Card.Header>

		<Card.Content>
			<form method="POST" use:enhance class="space-y-4">
				<Form.Field {form} name="username">
					<Form.Control let:attrs>
						<Form.Label>Username</Form.Label>

						<Input {...attrs} bind:value={$formData.username} placeholder="mbohl" type="username" />
					</Form.Control>

					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="password">
					<Form.Control let:attrs>
						<Form.Label>Password</Form.Label>
						<Input
							{...attrs}
							bind:value={$formData.password}
							placeholder="••••••••"
							type="password"
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Button class="w-full">Login</Form.Button>
				<Button variant="link" href="/register" class="w-full">Create Account</Button>
			</form>
		</Card.Content>
	</Card.Root>
</div>
