import { useEffect, useState } from 'react';
import { getPublishedPosts } from '../../services/magazineService.js';
import { magazineCategories, magazineFallbackArticles } from './magazineFallback.js';
import './Magazine.css';

function Magazine() {
  const [articles, setArticles] = useState(magazineFallbackArticles);

  useEffect(() => {
    let isMounted = true;

    async function loadPublishedPosts() {
      const posts = await getPublishedPosts();

      if (isMounted && posts.length > 0) {
        setArticles(posts);
      }
    }

    loadPublishedPosts();

    return () => {
      isMounted = false;
    };
  }, []);

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
            <span className="magazine-category" key={category}>
              {category}
            </span>
          ))}
        </div>

        <div className="magazine-grid">
          {articles.map((article, index) => (
            <article className="magazine-card reveal reveal-up reveal-delay-1" key={article.id ?? article.title}>
              <div
                className={`magazine-card-media magazine-card-media-${(index % magazineFallbackArticles.length) + 1}`}
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
                <p className="magazine-card-category">{article.category}</p>
                <h3>{article.title}</h3>
                <p>{article.description}</p>
                <a href="#revista" className="magazine-card-link">
                  Leia mais
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Magazine;
