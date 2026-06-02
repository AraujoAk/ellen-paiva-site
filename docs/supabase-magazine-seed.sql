-- Seed controlado para validar a Revista Ellen Paiva com dados reais no Supabase.
-- Revisar manualmente antes de executar.
-- A tabela planejada usa o campo "description"; ele representa o excerpt/descrição curta.

insert into public.magazine_posts (
  title,
  category,
  description,
  image_url,
  status,
  published_at
)
values
  (
    'Como usar alfaiataria leve na rotina',
    'Estilo inteligente',
    'Um guia prático para usar peças estruturadas com conforto, sofisticação e naturalidade.',
    'https://ellen-paiva-site.vercel.app/magazine/seed-alfaiataria.webp',
    'active',
    now() - interval '2 days'
  ),
  (
    'Peças versáteis para dias reais',
    'Moda real',
    'Escolhas funcionais que acompanham trabalho, lazer e encontros sem perder elegância.',
    'https://ellen-paiva-site.vercel.app/magazine/seed-pecas-versateis.webp',
    'active',
    now() - interval '1 day'
  ),
  (
    'Detalhes que elevam uma produção simples',
    'Tendências',
    'Acessórios, textura e proporção como aliados de uma imagem madura e sofisticada.',
    'https://ellen-paiva-site.vercel.app/magazine/seed-detalhes.webp',
    'active',
    now()
  );

-- Validação esperada após execução:
-- select id, title, category, description, image_url, status, published_at
-- from public.magazine_posts
-- where status = 'active'
-- order by published_at desc nulls last, created_at desc
-- limit 10;
