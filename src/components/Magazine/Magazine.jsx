import { assets } from '../../assets/assetsMap.js';
import './Magazine.css';

const categories = [
  'Todos',
  'Estilo inteligente',
  'Tendências',
  'Moda real',
  'Beleza e bem-estar',
  'Lifestyle',
];

const articles = [
  {
    category: 'Estilo inteligente',
    title: 'Como usar alfaiataria no calor do Nordeste',
    description: 'Tecidos, modelagens e combinações para manter sofisticação com leveza.',
    image: assets.magazine01,
    imageAlt: 'Editorial sobre alfaiataria no calor do Nordeste',
  },
  {
    category: 'Moda real',
    title: '5 peças que deixam o look mais sofisticado',
    description: 'Escolhas simples que elevam o visual sem exigir produções complicadas.',
    image: assets.magazine02,
    imageAlt: 'Editorial sobre peças sofisticadas para moda real',
  },
  {
    category: 'Estilo inteligente',
    title: 'Moda depois dos 35: menos excesso, mais identidade',
    description: 'Um olhar maduro sobre proporção, intenção e presença no vestir.',
    image: assets.magazine03,
    imageAlt: 'Editorial sobre moda depois dos 35',
  },
  {
    category: 'Tendências',
    title: 'Como transformar peças básicas em looks elegantes',
    description: 'O poder dos acabamentos, das cores e dos acessórios bem escolhidos.',
    image: assets.magazine04,
    imageAlt: 'Editorial sobre peças básicas em looks elegantes',
  },
  {
    category: 'Moda real',
    title: 'O erro que deixa o look visualmente cansado',
    description: 'Ajustes práticos para trazer harmonia, frescor e refinamento ao visual.',
    image: assets.magazine05,
    imageAlt: 'Editorial sobre harmonia visual no look',
  },
];

function Magazine() {
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
          {categories.map((category) => (
            <span className="magazine-category" key={category}>
              {category}
            </span>
          ))}
        </div>

        <div className="magazine-grid">
          {articles.map((article) => (
            <article className="magazine-card reveal reveal-up reveal-delay-1" key={article.title}>
              <div
                className={`magazine-card-media magazine-card-media-${articles.indexOf(article) + 1}`}
                aria-hidden={!article.image}
              >
                {article.image && (
                  <img src={article.image} alt={article.imageAlt} className="magazine-card-image" />
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
