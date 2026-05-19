import { ContentBlock, FAQItem, Banner } from '../types/admin';

export const publicContentRegistry: ContentBlock[] = [
  // GLOBAL
  {
    id: 'global-navbar',
    key: 'global.navbar',
    page: 'global',
    type: 'navbar',
    title: 'Navbar Principal',
    status: 'published',
    active: true,
    source: 'registry',
    publicRoute: '/'
  },
  {
    id: 'global-footer',
    key: 'global.footer',
    page: 'global',
    type: 'footer',
    title: 'Rodapé Principal',
    status: 'published',
    active: true,
    source: 'registry',
    publicRoute: '/'
  },

  // HOME
  {
    id: 'home-hero',
    key: 'home.hero',
    page: 'home',
    type: 'hero',
    title: 'CAFÉS ESPECIAIS PREMIADOS DO BRASIL, TORRADOS SOB DEMANDA.',
    subtitle: 'Talvez o melhor café do Brasil ainda não esteja na sua xícara.',
    ctas: [
      { label: 'Comprar cafés premiados', url: '/cafes', type: 'primary', active: true },
      { label: 'Entrar para o Clube', url: '/assinatura', type: 'secondary', active: true }
    ],
    status: 'published',
    active: true,
    source: 'registry',
    publicRoute: '/'
  },
  {
    id: 'home-dataBar',
    key: 'home.dataBar',
    page: 'home',
    type: 'data_bar',
    title: 'Barra de Metadados do Lote',
    items: [
      { label: 'Pontuação', value: '88+ SCA' },
      { label: 'Altitude', value: '1100m' },
      { label: 'Torra', value: 'Média Clara' }
    ],
    status: 'published',
    active: true,
    source: 'registry',
    publicRoute: '/'
  },
  {
    id: 'home-storytellingCards',
    key: 'home.storytellingCards',
    page: 'home',
    type: 'storytelling_cards',
    title: 'História por trás da torra (Cards)',
    status: 'published',
    active: true,
    source: 'registry',
    publicRoute: '/'
  },
  {
    id: 'home-productShowcase',
    key: 'home.productShowcase',
    page: 'home',
    type: 'product_showcase',
    title: 'Vitrine de Produtos (Escolhas do Mestre)',
    status: 'published',
    active: true,
    source: 'registry',
    publicRoute: '/'
  },
  {
    id: 'home-comparison',
    key: 'home.comparison',
    page: 'home',
    type: 'comparison',
    title: 'Comparativo Café Comum vs CofCof',
    status: 'published',
    active: true,
    source: 'registry',
    publicRoute: '/'
  },
  {
    id: 'home-club',
    key: 'home.club',
    page: 'home',
    type: 'club_section',
    title: 'A Porta de Entrada para Cafés Extraordinários',
    subtitle: 'Assine e receba lotes premiados e experimentais que não chegam ao mercado tradicional.',
    ctas: [
      { label: 'Ver planos do Clube', url: '/assinatura', type: 'primary', active: true }
    ],
    status: 'published',
    active: true,
    source: 'registry',
    publicRoute: '/'
  },
  {
    id: 'home-b2b',
    key: 'home.b2b',
    page: 'home',
    type: 'b2b_section',
    title: 'CofCof na sua Empresa',
    subtitle: 'Eleve o nível do café no seu escritório ou evento. Condições especiais para negócios.',
    ctas: [
      { label: 'Solicitar proposta B2B', url: '/empresas#form', type: 'primary', active: true }
    ],
    status: 'published',
    active: true,
    source: 'registry',
    publicRoute: '/'
  },
  {
    id: 'home-origin',
    key: 'home.origin',
    page: 'home',
    type: 'origin_section',
    title: 'De Onde Vem Nosso Sabor',
    status: 'published',
    active: true,
    source: 'registry',
    publicRoute: '/'
  },
  {
    id: 'home-partners',
    key: 'home.partners',
    page: 'home',
    type: 'partners_locator',
    title: 'Onde encontrar CofCof',
    status: 'published',
    active: true,
    source: 'registry',
    publicRoute: '/'
  },
  {
    id: 'home-finalCta',
    key: 'home.finalCta',
    page: 'home',
    type: 'final_cta',
    title: 'Pronto para elevar sua régua de café?',
    ctas: [
      { label: 'Comprar agora', url: '/cafes', type: 'primary', active: true }
    ],
    status: 'published',
    active: true,
    source: 'registry',
    publicRoute: '/'
  },

  // CAFES
  {
    id: 'cafes-hero',
    key: 'cafes.hero',
    page: 'cafes',
    type: 'hero',
    title: 'Catálogo de Cafés Especiais',
    status: 'published',
    active: true,
    source: 'registry',
    publicRoute: '/cafes'
  },
  {
    id: 'cafes-productGrid',
    key: 'cafes.productGrid',
    page: 'cafes',
    type: 'card_grid',
    title: 'Produtos',
    status: 'published',
    active: true,
    source: 'registry',
    publicRoute: '/cafes'
  },

  // ORIGEM
  {
    id: 'origem-hero',
    key: 'origem.hero',
    page: 'origem',
    type: 'hero',
    title: 'De onde vem o sabor.',
    subtitle: 'Conheça o terroir do Cerrado Mineiro, onde nossos grãos são cultivados com precisão.',
    status: 'published',
    active: true,
    source: 'registry',
    publicRoute: '/origem'
  },

  // EMPRESAS
  {
    id: 'empresas-hero',
    key: 'empresas.hero',
    page: 'empresas',
    type: 'hero',
    title: 'CofCof na sua empresa.',
    subtitle: 'Eleve o nível do café. Encante clientes e motive o time.',
    status: 'published',
    active: true,
    source: 'registry',
    publicRoute: '/empresas'
  },
  
  // PARCEIROS
  {
    id: 'parceiros-hero',
    key: 'parceiros.hero',
    page: 'parceiros',
    type: 'hero',
    title: 'Onde encontrar CofCof',
    subtitle: 'Nos principais hubs de inovação e escritórios parceiros.',
    status: 'published',
    active: true,
    source: 'registry',
    publicRoute: '/parceiros'
  },

  // ASSINATURA
  {
    id: 'assinatura-hero',
    key: 'assinatura.hero',
    page: 'assinatura',
    type: 'hero',
    title: 'Assine e receba lotes premiados',
    status: 'published',
    active: true,
    source: 'registry',
    publicRoute: '/assinatura'
  }
];

export const publicFAQRegistry: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'O café é enviado em grão ou moído?',
    answer: 'Temos as duas opções. Você escolhe a moagem ideal na página do produto (Grão, Filtro, Prensa Francesa, Espresso).',
    page: 'global',
    category: 'Produto',
    status: 'published',
    active: true
  },
  {
    id: 'faq-2',
    question: 'Quando o café é torrado?',
    answer: 'Torramos sob demanda. Seu café é torrado 24h a 48h antes do envio para chegar no pico do sabor.',
    page: 'global',
    category: 'Produção',
    status: 'published',
    active: true
  },
  {
    id: 'faq-3',
    question: 'Quanto tempo demora para chegar?',
    answer: 'Depende da sua região. Para o Sudeste, geralmente de 2 a 5 dias úteis após a torra.',
    page: 'global',
    category: 'Envio',
    status: 'published',
    active: true
  },
  {
    id: 'faq-4',
    question: 'Vocês vendem para empresas?',
    answer: 'Sim! Oferecemos planos corporativos, equipamentos em comodato e grãos e moídos para seu escritório. Acesse a página B2B.',
    page: 'empresas',
    category: 'B2B',
    status: 'published',
    active: true
  },
  {
    id: 'faq-5',
    question: 'Como funciona o Clube?',
    answer: 'Você escolhe quantos pacotes quer receber por mês, qual o estilo de torra e recebe os melhores microlotes na sua casa antes de todo mundo.',
    page: 'assinatura',
    category: 'Assinatura',
    status: 'published',
    active: true
  },
  {
    id: 'faq-6',
    question: 'Qual café escolher na primeira compra?',
    answer: 'Recomendamos começar pelos lotes de torra média-clara com notas de chocolate e caramelo, que são mais acessíveis, ou um kit degustação.',
    page: 'global',
    category: 'Produto',
    status: 'published',
    active: true
  },
  {
    id: 'faq-7',
    question: 'O que significa pontuação SCA?',
    answer: 'É a avaliação oficial da Specialty Coffee Association. Cafés acima de 80 pontos são considerados especiais. Nossos lotes geram de 84 a 90+ pontos.',
    page: 'global',
    category: 'Produto',
    status: 'published',
    active: true
  },
  {
    id: 'faq-8',
    question: 'Posso pausar minha assinatura?',
    answer: 'Sim, a qualquer momento pelo painel do assinante.',
    page: 'assinatura',
    category: 'Assinatura',
    status: 'published',
    active: true
  },
  {
    id: 'faq-9',
    question: 'Como encontrar parceiros CofCof?',
    answer: 'Acesse nossa página de parceiros para ver o mapa com as principais cafeterias e empórios que servem CofCof.',
    page: 'parceiros',
    category: 'Parceiros',
    status: 'published',
    active: true
  },
  {
    id: 'faq-10',
    question: 'Posso comprar para presente?',
    answer: 'Sim! Durante o checkout, você pode adicionar uma embalagem para presente e enviar direto para a pessoa, sem nota fiscal impressa.',
    page: 'checkout',
    category: 'Envio',
    status: 'published',
    active: true
  }
];

export const publicBannerRegistry: Banner[] = [
  {
    id: 'banner-1',
    title: 'Frete Grátis Sudeste',
    subtitle: 'Em compras acima de R$ 150.',
    page: 'global',
    position: 'topbar',
    active: true,
    type: 'promo'
  }
];
