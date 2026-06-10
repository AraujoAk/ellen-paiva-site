import { useEffect, useState } from 'react';
import { getPublishedPostsResult } from '../../services/magazineService.js';
import { magazineCategories, magazineFallbackArticles } from './magazineFallback.js';
import './Magazine.css';

function getReadingTime(article) {
  const text = `${article.content || ''} ${article.description || ''}`.trim();
  const words = text.split(/\s+/).filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 180));
}

function Magazine() {
  const [articles, setArticles] = useState(magazineFallbackArticles);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [hasLoadedDynamicPosts, setHasLoadedDynamicPosts] = useState(false);
  const [isMagazineEmpty, setIsMagazineEmpty] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadPublishedPosts() {
      const result = await getPublishedPostsResult();

      if (!isMounted) {
        return;
      }

      if (result.posts.length > 0) {
        setArticles(result.posts);
        setIsMagazineEmpty(false);
        setHasLoadedDynamicPosts(true);
        return;
      }

      if (result.isEmpty && !result.shouldUseFallback) {
        setArticles([]);
        setActiveCategory('Todos');
        setIsMagazineEmpty(true);
        setHasLoadedDynamicPosts(true);
      }
    }

    loadPublishedPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleArticles =
    activeCategory === 'Todos' ? articles : articles.filter((article) => article.category === activeCategory);
  const [featuredArticle, ...secondaryArticles] = visibleArticles;

  return (
    <section className="magazine page-section" id="revista" aria-labelledby="magazine-title">
      <div className="magazine-container section-container">
        <div className="magazine-heading reveal reveal-up">
          <p className="eyebrow">Revista Ellen Paiva</p>
          <h2 id="magazine-title" className="magazine-title">
            Conteúdo que inspira escolhas melhores.
          </h2>
          <p className="magazine-subtitle">
            Dicas práticas, tendências e orientações para mulheres que valorizam
            estilo, autenticidade e sofisticação na vida real.
          </p>
        </div>

        <div className="magazine-categories" aria-label="Categorias editoriais">
          {magazineCategories.map((category) => (
            <button
              className={`magazine-category ${activeCategory === category ? 'is-active' : ''}`}
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              aria-pressed={activeCategory === category}
            >
              {category}
            </button>
          ))}
        </div>

        {isMagazineEmpty ? (
          <div className="magazine-empty-state reveal reveal-up reveal-delay-1 is-visible">
            <p className="magazine-empty-kicker">Revista em atualização</p>
            <h3>Nenhum editorial publicado no momento.</h3>
            <p>
              Os conteúdos ativos foram removidos ou arquivados. Novos editoriais serão publicados em breve pela equipe.
            </p>
            <a href="#newsletter" className="magazine-empty-link" aria-label="Ir para newsletter editorial">
              Receber novidades
            </a>
          </div>
        ) : featuredArticle ? (
          <div className="magazine-layout">
            <article
              className={`magazine-card magazine-card-featured reveal reveal-up reveal-delay-1 ${
                hasLoadedDynamicPosts ? 'is-visible' : ''
              }`}
              key={featuredArticle.id ?? featuredArticle.title}
            >
              <div className="magazine-card-media magazine-card-media-1" aria-hidden={!featuredArticle.image}>
                {featuredArticle.image && (
                  <img
                    src={featuredArticle.image}
                    alt={featuredArticle.imageAlt}
                    className="magazine-card-image"
                    loading="lazy"
                    decoding="async"
                  />
                )}
              </div>
              <div className="magazine-card-content">
                <div className="magazine-card-meta">
                  <p className="magazine-card-category">{featuredArticle.category}</p>
                  <span>{getReadingTime(featuredArticle)} min de leitura</span>
                </div>
                <h3>{featuredArticle.title}</h3>
                <p>{featuredArticle.description}</p>
                <a
                  href={featuredArticle.slug ? `/revista/${featuredArticle.slug}` : '#revista'}
                  className="magazine-card-link"
                >
                  Ler editorial
                </a>
              </div>
            </article>

            {secondaryArticles.length > 0 && (
              <div className="magazine-secondary-list" aria-label="Outros editoriais da Revista Ellen Paiva">
                {secondaryArticles.map((article, index) => (
                  <article
                    className={`magazine-card magazine-card-secondary reveal reveal-up reveal-delay-1 ${
                      hasLoadedDynamicPosts ? 'is-visible' : ''
                    }`}
                    key={article.id ?? article.title}
                  >
                    <div
                      className={`magazine-card-media magazine-card-media-${
                        ((index + 1) % magazineFallbackArticles.length) + 1
                      }`}
                      aria-hidden={!article.image}
                    >
                      {article.image && (
                        <img
                          src={article.image}
                          alt={article.imageAlt}
                          className="magazine-card-image"
                          loading="lazy"
                          decoding="async"
                        />
                      )}
                    </div>
                    <div className="magazine-card-content">
                      <div className="magazine-card-meta">
                        <p className="magazine-card-category">{article.category}</p>
                        <span>{getReadingTime(article)} min</span>
                      </div>
                      <h3>{article.title}</h3>
                      <p>{article.description}</p>
                      <a href={article.slug ? `/revista/${article.slug}` : '#revista'} className="magazine-card-link">
                        Ler editorial
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default Magazine;
