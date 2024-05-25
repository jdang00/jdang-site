import supabase from "$lib/supabaseClient";

export async function load({ fetch }) {
  const { data: coursesData, error: coursesError } = await supabase.from("collegecourses").select();
  if (coursesError) {
    console.error("Error fetching courses:", coursesError);
    throw new Error('Failed to fetch courses');
  }

  const response = await fetch('/api/posts');
  if (!response.ok) {
    console.error("Error fetching posts:", response.statusText);
    throw new Error('Failed to fetch posts');
  }
  const posts = await response.json();

  return {
    courses: coursesData ?? [],
    posts: posts ?? []
  };
}
