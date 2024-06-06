<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { formSchema, type FormSchema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Card from '$lib/components/ui/card';

	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm(data, {
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance } = form;
</script>

<div class="flex items-center justify-center min-h-[100vh] px-4 md:px-6">
	<Card.Root class="w-full max-w-sm">
		<Card.Header class="space-y-1 text-center">
			<Card.Title class="text-2xl font-bold">Login</Card.Title>
			<Card.Description>Login to your account</Card.Description>
		</Card.Header>

		<Card.Content>
			<form method="POST" use:enhance>
				<Form.Field {form} name="username">
					<Form.Control let:attrs>
						<Input
							{...attrs}
							bind:value={$formData.username}
							placeholder="Username"
							type="username"
						/>
					</Form.Control>

					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="password">
					<Form.Control let:attrs>
						<div class="">
							<Input
								{...attrs}
								bind:value={$formData.password}
								placeholder="Password"
								type="password"
							/>
						</div>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Button class="w-full">Login</Form.Button>
			</form>
		</Card.Content>
	</Card.Root>
</div>
