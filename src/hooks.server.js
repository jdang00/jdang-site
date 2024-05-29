import { redirect } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  const accessCookie = event.cookies.get('access');

  if (event.url.pathname.startsWith('/admin') && accessCookie !== 'true') {
    throw redirect(302, '/login');
  }

  return await resolve(event);
}
