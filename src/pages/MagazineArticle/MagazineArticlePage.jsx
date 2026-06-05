import { useEffect, useMemo, useState } from 'react';
import { getPostBySlug, getRelatedPosts } from '../../services/magazineService.js';
import './MagazineArticlePage.css';

const siteUrl = 'https://ellen-paiva-site.vercel.app';

function getReadingTime(content) {
  const words = String(content || '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 180));
}

function setMeta(name, content, attribute = 'name') {
  if (!content) {
    return;
  }

  let element = document.querySelector(`meta[${attribute}="${name}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

function setCanonical(url) {
  let canonical = document.querySelector('link[rel="canonical"]');

  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }

  canonical.setAttribute('href', url);
}

function getShareUrls(postUrl, title) {
  return {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${postUrl}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`,
  };
}

function MagazineArticlePage({ slug }) {
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const articleUrl = `${siteUrl}/revista/${slug}`;
  const readingTime = getReadingTime(post?.content);
  const shareUrls = useMemo(() => getShareUrls(articleUrl, post?.title || 'Revista Ellen Paiva'), [articleUrl, post]);

  useEffect(() => {
    let isMounted = true;

    async function loadArticle() {
      setIsLoading(true);

      const article = await getPostBySlug(slug);

      if (!isMounted) {
        return;
      }

      setPost(article);

      if (article) {
        const related = await getRelatedPosts(article.category, article.slug);

        if (isMounted) {
          setRelatedPosts(related);
        }
      }

      setIsLoading(false);
    }

    loadArticle();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  useEffect(() => {
    if (!post) {
      document.title = 'Revista Ellen Paiva | Conteudo editorial';
      return;
    }

    const title = `${post.title} | Revista Ellen Paiva`;
    const description = post.description;

    document.title = title;
    setMeta('description', description);
    setCanonical(articleUrl);
    setMeta('og:title', title, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:type', 'article', 'property');
    setMeta('og:url', articleUrl, 'property');
    setMeta('og:image', post.image, 'property');
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', post.image);
  }, [articleUrl, post]);

  if (isLoading) {
    return (
      <main className="article-page">
        <p className="article-loading">Carregando editorial...</p>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="article-page">
        <section className="article-empty">
          <p className="eyebrow">Revista Ellen Paiva</p>
          <h1>Conteudo nao encontrado.</h1>
          <a href="/#revista">Voltar para a Revista</a>
        </section>
      </main>
    );
  }

  return (
    <main className="article-page">
      <article className="article-shell">
        <nav className="article-breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span>&gt;</span>
          <a href="/#revista">Revista</a>
          <span>&gt;</span>
          <span>{post.title}</span>
        </nav>

        <header className="article-header">
          <p className="eyebrow">{post.category}</p>
          <h1>{post.title}</h1>
          <p>{post.description}</p>
          <span>{readingTime} min de leitura</span>
        </header>

        {post.image && (
          <figure className="article-hero-image">
            <img src={post.image} alt={post.imageAlt} />
          </figure>
        )}

        <div className="article-content">
          {String(post.content || post.description)
            .split(/\n{2,}/)
            .map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
        </div>

        <section className="article-share" aria-label="Compartilhar artigo">
          <h2>Compartilhar</h2>
          <div>
            <a href={shareUrls.whatsapp} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
            <a href={shareUrls.facebook} target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
            <a href={shareUrls.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
        </section>

        {relatedPosts.length > 0 && (
          <section className="article-related" aria-labelledby="article-related-title">
            <h2 id="article-related-title">Mais conteudos da mesma categoria</h2>
            <div className="article-related-grid">
              {relatedPosts.map((relatedPost) => (
                <a href={`/revista/${relatedPost.slug}`} key={relatedPost.id ?? relatedPost.slug}>
                  <span>{relatedPost.category}</span>
                  <strong>{relatedPost.title}</strong>
                  <small>{relatedPost.description}</small>
                </a>
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}

export default MagazineArticlePage;

