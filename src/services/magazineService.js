import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase.js';

const normalizePost = (post) => ({
  id: post.id,
  category: post.category,
  title: post.title,
  description: post.description,
  image: post.image_url,
  imageAlt: `Editorial Revista Ellen Paiva: ${post.title}`,
  publishedAt: post.published_at,
});

const publishedPostsQuery = (client, category) => {
  let query = client
    .from('magazine_posts')
    .select('id, title, category, description, image_url, published_at')
    .eq('status', 'active');

  if (category && category !== 'Todos') {
    query = query.eq('category', category);
  }

  return query
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(10);
};

export async function getPublishedPosts() {
  if (!isSupabaseConfigured) {
    return [];
  }

  const client = await getSupabaseClient();

  if (!client) {
    return [];
  }

  const { data, error } = await publishedPostsQuery(client);

  if (error || !data?.length) {
    return [];
  }

  return data.map(normalizePost);
}

export async function getFeaturedPost() {
  const posts = await getPublishedPosts();
  return posts[0] ?? null;
}

export async function getPostsByCategory(category) {
  if (!isSupabaseConfigured || !category || category === 'Todos') {
    return getPublishedPosts();
  }

  const client = await getSupabaseClient();

  if (!client) {
    return [];
  }

  const { data, error } = await publishedPostsQuery(client, category);

  if (error || !data?.length) {
    return [];
  }

  return data.map(normalizePost);
}
