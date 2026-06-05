import { getSupabaseClient } from '../lib/supabase.js';
import { slugify } from '../utils/slugify.js';

const MAGAZINE_BUCKET = 'magazine-images';
const MAGAZINE_FOLDER = 'magazine';
const MAX_UPLOAD_SIZE = 4 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/webp', 'image/jpeg', 'image/png'];
const adminPostFields =
  'id, title, slug, category, description, content, image_url, image_path, status, published_at, created_at, updated_at';
const legacyAdminPostFields =
  'id, title, category, description, image_url, image_path, status, published_at, created_at, updated_at';

const adminErrorMessages = [
  {
    match: /bucket|storage/i,
    message: 'Nao foi possivel acessar o bucket de imagens da Revista.',
  },
  {
    match: /permission|policy|rls|not authorized|unauthorized|forbidden/i,
    message: 'Seu usuario nao tem permissao para concluir esta acao.',
  },
  {
    match: /failed to fetch|network|connection|fetch/i,
    message: 'Nao foi possivel conectar ao Supabase. Verifique a conexao e tente novamente.',
  },
  {
    match: /jwt|session|token/i,
    message: 'Sua sessao expirou. Saia e entre novamente.',
  },
  {
    match: /duplicate|already exists/i,
    message: 'Ja existe um arquivo ou registro com esses dados.',
  },
];

const toAdminError = (error, fallbackMessage) => {
  const rawMessage = error?.message || String(error || '');
  const matchedError = adminErrorMessages.find((item) => item.match.test(rawMessage));

  return new Error(matchedError?.message || fallbackMessage || rawMessage || 'Nao foi possivel concluir a acao.');
};

const isMissingArticleColumns = (error) =>
  /slug|content|column|schema cache/i.test(error?.message || String(error || ''));

const sanitizeFileName = (fileName) =>
  fileName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9.]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();

const ensureSupabaseClient = async () => {
  const client = await getSupabaseClient();

  if (!client) {
    throw new Error('Supabase nao configurado para o painel editorial.');
  }

  return client;
};

async function getUniqueSlug(client, post, currentId) {
  const baseSlug = slugify(post.slug || post.title);
  const fallbackSlug = baseSlug || `editorial-${Date.now()}`;
  const { data, error } = await client
    .from('magazine_posts')
    .select('id, slug')
    .ilike('slug', `${fallbackSlug}%`);

  if (error) {
    throw toAdminError(error, 'Nao foi possivel validar o slug do post.');
  }

  const usedSlugs = new Set(
    (data || [])
      .filter((item) => item.id !== currentId)
      .map((item) => item.slug)
      .filter(Boolean),
  );

  if (!usedSlugs.has(fallbackSlug)) {
    return fallbackSlug;
  }

  let index = 2;
  let candidate = `${fallbackSlug}-${index}`;

  while (usedSlugs.has(candidate)) {
    index += 1;
    candidate = `${fallbackSlug}-${index}`;
  }

  return candidate;
}

async function normalizePostPayload(client, post, currentId) {
  const slug = await getUniqueSlug(client, post, currentId);

  return {
    title: post.title.trim(),
    slug,
    category: post.category,
    description: post.description.trim(),
    content: post.content?.trim() || post.description.trim(),
    image_url: post.image_url?.trim() || null,
    image_path: post.image_path || null,
    status: post.status,
    published_at: post.status === 'active' ? post.published_at || new Date().toISOString() : post.published_at || null,
  };
}

const normalizeLegacyPayload = (post) => ({
  title: post.title.trim(),
  category: post.category,
  description: post.description.trim(),
  image_url: post.image_url?.trim() || null,
  image_path: post.image_path || null,
  status: post.status,
  published_at: post.status === 'active' ? post.published_at || new Date().toISOString() : post.published_at || null,
});

const normalizeAdminPost = (post) => ({
  ...post,
  slug: post.slug || slugify(post.title),
  content: post.content || post.description,
});

export async function getAllMagazinePosts() {
  const client = await ensureSupabaseClient();

  const result = await client
    .from('magazine_posts')
    .select(adminPostFields)
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (!result.error) {
    return (result.data ?? []).map(normalizeAdminPost);
  }

  if (!isMissingArticleColumns(result.error)) {
    throw toAdminError(result.error, 'Nao foi possivel carregar os posts da Revista.');
  }

  const legacyResult = await client
    .from('magazine_posts')
    .select(legacyAdminPostFields)
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (legacyResult.error) {
    throw toAdminError(legacyResult.error, 'Nao foi possivel carregar os posts da Revista.');
  }

  return (legacyResult.data ?? []).map(normalizeAdminPost);
}

export async function createMagazinePost(post) {
  const client = await ensureSupabaseClient();
  let payload;

  try {
    payload = await normalizePostPayload(client, post);
  } catch (error) {
    if (!isMissingArticleColumns(error)) {
      throw error;
    }

    payload = normalizeLegacyPayload(post);
  }

  let result = await client
    .from('magazine_posts')
    .insert(payload)
    .select(adminPostFields)
    .single();

  if (result.error && isMissingArticleColumns(result.error)) {
    result = await client
      .from('magazine_posts')
      .insert(normalizeLegacyPayload(post))
      .select(legacyAdminPostFields)
      .single();
  }

  if (result.error) {
    throw toAdminError(result.error, 'Nao foi possivel criar o post.');
  }

  return normalizeAdminPost(result.data);
}

export async function updateMagazinePost(id, post) {
  const client = await ensureSupabaseClient();
  let payload;

  try {
    payload = await normalizePostPayload(client, post, id);
  } catch (error) {
    if (!isMissingArticleColumns(error)) {
      throw error;
    }

    payload = normalizeLegacyPayload(post);
  }

  let result = await client
    .from('magazine_posts')
    .update(payload)
    .eq('id', id)
    .select(adminPostFields)
    .single();

  if (result.error && isMissingArticleColumns(result.error)) {
    result = await client
      .from('magazine_posts')
      .update(normalizeLegacyPayload(post))
      .eq('id', id)
      .select(legacyAdminPostFields)
      .single();
  }

  if (result.error) {
    throw toAdminError(result.error, 'Nao foi possivel atualizar o post.');
  }

  return normalizeAdminPost(result.data);
}

export async function archiveMagazinePost(id) {
  const client = await ensureSupabaseClient();

  let result = await client
    .from('magazine_posts')
    .update({
      status: 'archived',
      archived_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select(adminPostFields)
    .single();

  if (result.error && isMissingArticleColumns(result.error)) {
    result = await client
      .from('magazine_posts')
      .update({
        status: 'archived',
        archived_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(legacyAdminPostFields)
      .single();
  }

  if (result.error) {
    throw toAdminError(result.error, 'Nao foi possivel arquivar o post.');
  }

  return normalizeAdminPost(result.data);
}

export async function deleteMagazinePost(id) {
  const client = await ensureSupabaseClient();

  const { error } = await client.from('magazine_posts').delete().eq('id', id);

  if (error) {
    throw toAdminError(error, 'Nao foi possivel excluir o post.');
  }
}

export async function duplicateMagazinePost(post) {
  return createMagazinePost({
    title: `${post.title} - copia`,
    slug: `${post.slug || slugify(post.title)}-copia`,
    category: post.category,
    description: post.description,
    content: post.content,
    image_url: post.image_url,
    image_path: post.image_path,
    status: 'inactive',
    published_at: null,
  });
}

export async function uploadMagazineImage(file) {
  if (!file) {
    return null;
  }

  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Envie uma imagem em WebP, JPG ou PNG.');
  }

  if (file.size > MAX_UPLOAD_SIZE) {
    throw new Error('A imagem deve ter ate 4 MB.');
  }

  const client = await ensureSupabaseClient();
  const safeName = sanitizeFileName(file.name || 'imagem-revista');
  const filePath = `${MAGAZINE_FOLDER}/${Date.now()}-${safeName}`;

  const { error } = await client.storage.from(MAGAZINE_BUCKET).upload(filePath, file, {
    cacheControl: '31536000',
    upsert: false,
  });

  if (error) {
    throw toAdminError(error, 'Nao foi possivel enviar a imagem para o bucket da Revista.');
  }

  const { data } = client.storage.from(MAGAZINE_BUCKET).getPublicUrl(filePath);

  if (!data?.publicUrl) {
    throw new Error('Upload concluido, mas a URL publica da imagem nao foi gerada.');
  }

  return {
    image_url: data.publicUrl,
    image_path: filePath,
  };
}
