import { json } from '@sveltejs/kit';

async function getPosts() {
    let posts = [];

    const paths = import.meta.glob('/src/posts/*.md', { eager: true });

    for (const path in paths) {

        const file = paths[path];
        const slug = path.split('/').at(-1)?.replace('.md', '');

        if (file && typeof file === 'object' && 'metadata' in file && slug) {
            const metadata = file.metadata;
            if (metadata && typeof metadata === 'object') {
                const post = { ...metadata, slug };
                // @ts-ignore
                if (post.published === true) {
                    posts.push(post);
                }
            }
        }
    }

    // @ts-ignore
    posts = posts.sort((first, second) => new Date(second.date).getTime() - new Date(first.date).getTime());
    
 
    return posts;
}

export async function GET() {
    const posts = await getPosts();
    return json(posts);
}
