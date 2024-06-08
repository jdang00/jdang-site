import { redirect } from '@sveltejs/kit';
import supabase from '$lib/supabaseClient';
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { formSchema } from "./schema";
import type { Actions } from "./$types.js";
import { fail } from "@sveltejs/kit";

export async function load({ fetch, cookies }) {
  const sessionId = cookies.get('session_id');
  if (!sessionId) {
    throw redirect(302, '/login');
  }

  // Fetch the session and profile data from Supabase
  const { data: sessionData, error: sessionError } = await supabase
    .from('sessions')
    .select('user_id, profiles (firstname, lastname, avatar, email, username)')
    .eq('session_id', sessionId)
    .single();

  if (sessionError || !sessionData) {
    console.error('Error fetching session data:', sessionError);
    throw redirect(302, '/login');
  }


  interface Profile {
    firstname: string;
    lastname: string;
    avatar: string | null;
    email: string;
    username: string;
  }

  const profiles: Profile = sessionData.profiles

  const userData = {
    firstname: profiles.firstname,
    lastname: profiles.lastname,
    avatar: profiles.avatar,
    email: profiles.email,
    username: profiles.username,
  };

  // Fetch posts
  const response = await fetch('/api/posts');
  if (!response.ok) {
    console.error('Error fetching posts:', response.statusText);
    throw new Error('Failed to fetch posts');
  }
  const posts = await response.json();

  return {
    posts: posts ?? [],
    userData,
    form: await superValidate(zod(formSchema)),

  };
}


export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }
    return {
      form,
    };
  },
};
