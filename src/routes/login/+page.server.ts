import type { PageServerLoad, Actions } from './$types.js';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema.js';
import supabase from '$lib/supabaseClient';
import bcrypt from 'bcrypt';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies }) => {
	const sessionId = cookies.get('session_id');

	if (sessionId) {
		const { data, error } = await supabase
			.from('sessions')
			.select('session_id ,expires_at, user_id')
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


		const { data, error } = await supabase
			.from('profiles')
			.select()
			.eq('username', user)
			.single();

		if (error) {
			return fail(400, { form, message: 'Invalid username or password' });
		}




		if (data) {
			const isPasswordValid = await bcrypt.compare(form.data.password, data.password);

			if (isPasswordValid) {
				const sessionID = crypto.randomUUID();
				const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

				const { error } = await supabase.from('sessions').insert({
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



				throw redirect(302, '/admin');
			} else {
				return fail(400, { form, message: 'Invalid username or password' });
			}
		}

		return fail(400, { form, message: 'Invalid username or password' });
	}
};
