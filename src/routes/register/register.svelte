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

<div class="mx-auto max-w-md space-y-6 py-12">
	<Card.Root class="w-full max-w-md py-12">
		<Card.Header class="space-y-2 text-center">
			<Card.Title class="text-2xl font-bold dark:text-slate-200">Register</Card.Title>
			<Card.Description>Create your account to get started.</Card.Description>
		</Card.Header>

		<Card.Content>
			<form method="POST" use:enhance class="space-y-4">
				<div class="grid grid-cols-2 gap-4">
					<Form.Field {form} name="firstname">
						<Form.Control let:attrs>
							<Form.Label>First Name</Form.Label>

							<Input {...attrs} bind:value={$formData.firstname} placeholder="Madeline" required />
						</Form.Control>

						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="lastname">
						<Form.Control let:attrs>
							<Form.Label>Last Name</Form.Label>

							<Input {...attrs} bind:value={$formData.lastname} placeholder="Bohlman" required />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
				<Form.Field {form} name="username">
					<Form.Control let:attrs>
						<Form.Label>Username</Form.Label>

						<Input {...attrs} bind:value={$formData.username} placeholder="mbohl" required />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="email">
					<Form.Control let:attrs>
						<Form.Label>Email</Form.Label>

						<Input
							{...attrs}
							bind:value={$formData.email}
							placeholder="mbohl@walmart.com"
							required
						/>
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
							required
							type="password"
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Button class="w-full">Register</Form.Button>
			</form>
		</Card.Content>
	</Card.Root>
</div>
