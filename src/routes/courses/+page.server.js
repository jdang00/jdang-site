import supabase from "$lib/supabaseClient";

export async function load() {
  const { data } = await supabase.from("collegecourses").select();
  return {
    courses: data ?? [],
  };
}