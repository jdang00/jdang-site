import { json } from '@sveltejs/kit';

export const POST = async ({ cookies }) => {

    cookies.delete('session_id', { path: '/' });
    cookies.delete('firstname', { path: '/' });
    cookies.delete('lastname', { path: '/' });

  return json({ success: true });
};
