import type { PageServerLoad, Actions} from "./$types.js";
import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { formSchema } from "./schema.js";
import supabase from "$lib/supabaseClient";
import sha256 from 'crypto-js/sha256';
import {redirect} from "@sveltejs/kit"


export const load: PageServerLoad = async ({ cookies }) => {
  const sessionId = cookies.get('session_id');

  if (sessionId) {
    const sessionId = cookies.get('session_id');

  if (sessionId) {
    const { data, error } = await supabase
      .from('sessions')
      .select('sessionid')
      .eq('sessionid', sessionId)
      .single();

    if (data && !error) {
      throw redirect(302, '/admin');
    }
  }
}
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
    
      const sessionID = crypto.randomUUID();
      const error = await supabase.from('sessions').insert({sessionid: sessionID, username: user})
      console.log(error)

      cookies.set('session_id', sessionID, {
        path: '/',
        sameSite: 'strict',
        httpOnly: true,
        maxAge: 60 * 60 * 24
      });
      throw redirect(302, '/admin');
    }

    return {
      form,
    };
  },

};
