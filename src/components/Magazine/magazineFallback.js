import { assets } from '../../assets/assetsMap.js';

export const magazineCategories = [
  'Todos',
  'Estilo inteligente',
  'Tendências',
  'Moda real',
  'Beleza e bem-estar',
  'Lifestyle',
];

export const magazineFallbackArticles = [
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
