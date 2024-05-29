import { redirect } from '@sveltejs/kit';

export async function load({ fetch, cookies }) {
  const sessionId = cookies.get('session_id');
  if (!sessionId) {
    throw redirect(302, '/login');
  }
  const response = await fetch('/api/posts');
  if (!response.ok) {
    console.error("Error fetching posts:", response.statusText);
    throw new Error('Failed to fetch posts');
  }
  const posts = await response.json();

  return {
    posts: posts ?? []
  };
}

