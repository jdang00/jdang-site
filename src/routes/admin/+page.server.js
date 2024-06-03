import { redirect } from '@sveltejs/kit';

export async function load({ fetch, cookies }) {
  const sessionId = cookies.get('session_id');
  if (!sessionId) {
    throw redirect(302, '/login');
  }

  const firstName = cookies.get('firstname');
  const lastName = cookies.get('lastname');
  const avatar = cookies.get('avatar');

  const userData = {
    firstName: firstName || '',
    lastName: lastName || '',
    avatar: avatar || ''
  };


  const response = await fetch('/api/posts');
  if (!response.ok) {
    console.error("Error fetching posts:", response.statusText);
    throw new Error('Failed to fetch posts');
  }
  const posts = await response.json();

  return {
    posts: posts ?? [],
    userData: userData

  };
}

