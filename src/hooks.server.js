import { redirect } from '@sveltejs/kit';
import supabase from "$lib/supabaseClient";


/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  const sessionId = event.cookies.get('session_id');
  const sessionStore = await supabase.from('sessions').select('session_id').eq('session_id', sessionId).single()
  const session = sessionId ? sessionStore.data?.session_id : null;
  if (event.url.pathname.startsWith('/admin') && !session) {
    throw redirect(302, '/login');
  }

  return await resolve(event);
}
