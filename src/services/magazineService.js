import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase.js';
import { slugify } from '../utils/slugify.js';

const publicPostFields =
  'id, title, slug, category, description, content, image_url, published_at, created_at';
const legacyPublicPostFields = 'id, title, category, description, image_url, published_at, created_at';

const normalizePost = (post) => ({
  id: post.id,
  slug: post.slug || slugify(post.title),
  category: post.category,
  title: post.title,
  description: post.description,
  content: post.content || post.description,
  image: post.image_url,
  imageAlt: `Editorial Revista Ellen Paiva: ${post.title}`,
  publishedAt: post.published_at,
  createdAt: post.created_at,
});

const publishedPostsQuery = (client, category, fields = publicPostFields) => {
  let query = client
    .from('magazine_posts')
    .select(fields)
    .eq('status', 'active');

  if (category && category !== 'Todos') {
    query = query.eq('category', category);
  }

  return query
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(10);
};

async function getPublishedPostsData(client, category) {
  const result = await publishedPostsQuery(client, category);

  if (!result.error) {
    return result;
  }

  return publishedPostsQuery(client, category, legacyPublicPostFields);
}

export async function getPublishedPosts() {
  if (!isSupabaseConfigured) {
    return [];
  }

  const client = await getSupabaseClient();

  if (!client) {
    return [];
  }

  const { data, error } = await getPublishedPostsData(client);

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

  const { data, error } = await getPublishedPostsData(client, category);

  if (error || !data?.length) {
    return [];
  }

  return data.map(normalizePost);
}

export async function getPostBySlug(slug) {
  if (!isSupabaseConfigured || !slug) {
    return null;
  }

  const client = await getSupabaseClient();

  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from('magazine_posts')
    .select(publicPostFields)
    .eq('status', 'active')
    .eq('slug', slug)
    .maybeSingle();

  if (!error && data) {
    return normalizePost(data);
  }

  const posts = await getPublishedPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}

export async function getRelatedPosts(category, currentSlug) {
  const posts = await getPostsByCategory(category);
  return posts.filter((post) => post.slug !== currentSlug).slice(0, 3);
}
