<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { formSchema, type FormSchema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Avatar from '$lib/components/ui/avatar';

	export let data: {
		form: SuperValidated<Infer<FormSchema>>;
		userData: {
			firstname: string;
			lastname: string;
			avatar: string | null;
			email: string;
			username: string;
			password: string;
		};
	};

	console.log(data);

	const form = superForm(data.userData, {
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance } = form;

	import { createUploader } from '$lib/utils/uploadthing';

	import { UploadDropzone } from '@uploadthing/svelte';

	const uploader = createUploader('imageUploader', {
		onClientUploadComplete: (res) => {
			console.log(`onClientUploadComplete`, res);
			alert('Upload Completed');
		},
		onUploadError: (error: Error) => {
			alert(`ERROR! ${error.message}`);
		}
	});

	import { Upload } from 'lucide-svelte';
</script>

<form method="POST" use:enhance class="space-y-4">
	<div class="flex flex-row justify-between mb-10">
		<Avatar.Root class="h-32 w-32 self-center">
			<Avatar.Image src={$formData.avatar} alt={$formData.firstname} />
			<Avatar.Fallback>
				{data.userData.firstname.charAt(0)}{data.userData.lastname.charAt(0)}
			</Avatar.Fallback>
		</Avatar.Root>

		<UploadDropzone {uploader} class="px-12 py-8">
			<i slot="upload-icon" let:state>
				<Upload />
			</i>
			<span slot="button-content" let:state>
				{state.isUploading ? 'Uploading...' : 'Pick A File'}
			</span>
			<span slot="label" let:state>
				{state.ready ? 'Ready to upload' : 'Loading...'}
			</span>
			<span slot="allowed-content" let:state>
				You can choose between {state.fileTypes.join(', ')} files
			</span>
		</UploadDropzone>
	</div>

	<div class="grid grid-cols-2 gap-4">
		<Form.Field {form} name="firstname">
			<Form.Control let:attrs>
				<Form.Label>First Name</Form.Label>

				<Input {...attrs} bind:value={$formData.firstname} required />
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

			<Input {...attrs} bind:value={$formData.email} placeholder="mbohl@walmart.com" required />
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
	<Form.Button class="w-full">Update</Form.Button>
</form>
