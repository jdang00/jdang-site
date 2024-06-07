import type { PageServerLoad, Actions } from './$types.js';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema.js';
import supabase from '$lib/supabaseClient';
import sha256 from 'crypto-js/sha256';
import { redirect } from '@sveltejs/kit';
import { userStore } from '../../stores/userStore.js';

export const load: PageServerLoad = async ({ cookies }) => {
	const sessionId = cookies.get('session_id');

	if (sessionId) {
		const { data, error } = await supabase
			.from('sessions')
			.select('session_id ,expires_at') // Only select necessary fields
			.eq('session_id', sessionId)
			.single();

		if (data && !error) {
			throw redirect(302, '/admin');
		}
	}

	return {
		form: await superValidate(zod(formSchema))
	};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(formSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const user = form.data.username;
		const password = sha256(form.data.password).toString();
		const { data, error } = await supabase
			.from('profiles')
			.select()
			.eq('username', user)
			.eq('password', password)
			.single();

		if (error) {
			return fail(400, { form, message: 'Invalid username or password' });
		}

		if (data) {
			const sessionID = crypto.randomUUID();
			const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

			const { data: insertedSession, error } = await supabase.from('sessions').insert({
				session_id: sessionID,
				user_id: data.id,
				expires_at: expiresAt
			});

			if (error) {
				console.error('Error creating session:', error);
				return fail(500, { message: 'Internal Server Error' });
			}

			cookies.set('session_id', sessionID, {
				path: '/',
				sameSite: 'strict',
				httpOnly: true,
				maxAge: 60 * 60 * 24
			});
			cookies.set('firstname', data.firstname, {
				path: '/',
				sameSite: 'strict',
				httpOnly: true,
				maxAge: 60 * 60 * 24
			});
			cookies.set('lastname', data.lastname, {
				path: '/',
				sameSite: 'strict',
				httpOnly: true,
				maxAge: 60 * 60 * 24
			});
			cookies.set('avatar', data.avatar, {
				path: '/',
				sameSite: 'strict',
				httpOnly: true,
				maxAge: 60 * 60 * 24
			});

			throw redirect(302, '/admin');
		}

		userStore.set({
			id: data.id,
			firstname: data.firstname,
			lastname: data.lastname,
			avatar: data.avatar
		});
		console.log('toto');

		return {
			form
		};
	}
};
