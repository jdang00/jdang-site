import type { PageServerLoad, Actions } from "./$types.js";
import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import supabase from '$lib/supabaseClient';
import { formSchema } from "./schema";
import bcrypt from 'bcrypt';
import { redirect } from '@sveltejs/kit';



export const load: PageServerLoad = async () => {
    return {
        form: await superValidate(zod(formSchema)),
    };
};

export const actions: Actions = {
    default: async (event) => {
        const form = await superValidate(event, zod(formSchema));
        if (!form.valid) {
            return fail(400, {
                form,
            });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(form.data.password, saltRounds);


        const { data, error } = await supabase.from('profiles').insert({
            username: form.data.username,
            password: hashedPassword,
            firstname: form.data.firstname,
            lastname: form.data.lastname,
            email: form.data.email
        })


        if (error) {
            console.error('Error creating account:', error);
            return fail(500, { message: 'Internal Server Error' });
        }


        throw redirect(302, '/')


    }
};