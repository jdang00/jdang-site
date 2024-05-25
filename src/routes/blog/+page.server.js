
export async function load({ fetch }) {
 
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