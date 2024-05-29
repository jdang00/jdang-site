import type { PageServerLoad, Actions} from "./$types.js";
import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { formSchema } from "./schema.js";
import supabase from "$lib/supabaseClient";
import sha256 from 'crypto-js/sha256';
import {redirect} from "@sveltejs/kit"


export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(formSchema)),
  };
};
 
export const actions: Actions = {
  default: async ({request, cookies}) => {
    const form = await superValidate(request, zod(formSchema));

    if (!form.valid) {
      return fail(400, {
        form,
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
      cookies.set('access', 'true', {
        path: '/',
        sameSite: 'strict',
        httpOnly: true,
      });
      throw redirect(302, '/admin');
    }


    
    return {
      form,
    };
  },
};

