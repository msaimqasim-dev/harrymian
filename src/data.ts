import heroImg from './assets/art/hero.jpg';
import w1 from './assets/art/w1.svg';
import w2 from './assets/art/w2.svg';
import w3 from './assets/art/w3.svg';
import w4 from './assets/art/w4.svg';
import w5 from './assets/art/w5.svg';
import w6 from './assets/art/w6.svg';

export const EMAIL = 'harry@harrymian.com';

/* Bundled local assets: one editorial photograph + six conceptual artboards (see scripts/gen-art.cjs) */
export const IMAGES = { hero: heroImg, p1: w1, p2: w2, p3: w3, p4: w4, p5: w5, p6: w6 };

export type Expertise = {
  id: string;
  num: string;
  title: string;
  short: string;
  tagline: string;
  body: string;
  background: string;
  mesh: string;
  light?: boolean;
  category: string[];
  icon: 'search' | 'answer' | 'spark' | 'target' | 'chart' | 'crown';
};

export const EXPERTISE: Expertise[] = [
  {
    id: 'seo',
    num: '01',
    title: 'Search Engine\nOptimization',
    short: 'SEO',
    tagline: 'Built to be crawled',
    body: 'My technical SEO work covers technical SEO audits, site architecture, crawling, indexing, Core Web Vitals, structured data, JavaScript rendering, site migrations, ecommerce SEO, and local SEO.',
    background: 'linear-gradient(154.8deg, #D0D8F7 22%, #FFF0C4 94%)',
    mesh: 'radial-gradient(56% 52% at 8% 6%, #CFCBFF 0%, transparent 64%), radial-gradient(54% 50% at 12% 92%, #9FE4FF 0%, transparent 64%), radial-gradient(58% 54% at 70% 20%, #FFF0C4 0%, transparent 64%), #eef1f9',
    category: ['organic'],
    icon: 'search',
  },
  {
    id: 'aeo',
    num: '02',
    title: 'Answer Engine\nOptimization',
    short: 'AEO',
    tagline: 'Written to be the answer',
    body: 'My AEO work covers answer-first content, question and prompt research, featured snippets, People Also Ask, FAQ/HowTo schema, voice search, Google AI Overviews, and AI Mode.',
    background: 'linear-gradient(154.8deg, #FF7381 22%, #F9F1CA 94%)',
    mesh: 'radial-gradient(84% 95% at -15% 22%, #F5C76B 0%, transparent 70%), radial-gradient(118% 95% at 54% 100%, #FFF2C9 0%, transparent 70%), radial-gradient(118% 95% at 54% 0%, #FFD0BC 0%, transparent 70%), #fff',
    light: true,
    category: ['ai'],
    icon: 'answer',
  },
  {
    id: 'geo',
    num: '03',
    title: 'Generative Engine\nOptimization',
    short: 'GEO',
    tagline: 'Cited by the machines',
    body: 'My GEO work covers AI search citations, LLM brand mentions, share of voice, Knowledge Graph, entity optimization, Wikidata, AI crawler accessibility, llms.txt, and AI sentiment monitoring.',
    background: 'linear-gradient(154.8deg, #F2C12E 22%, #F05722 94%)',
    mesh: 'radial-gradient(92% 85% at -22% 92%, #F5C76B 0%, transparent 70%), radial-gradient(72% 62% at 46% 12%, #FFB9A8 0%, transparent 74%), radial-gradient(118% 95% at 54% 100%, #FFF2C9 0%, transparent 70%), #fff',
    light: true,
    category: ['ai'],
    icon: 'spark',
  },
  {
    id: 'ppc',
    num: '04',
    title: 'Performance\nMarketing',
    short: 'Paid',
    tagline: 'Every dollar, accountable',
    body: 'My paid media work covers Google Ads, Microsoft Advertising, Meta Ads, Search, Shopping, Performance Max, remarketing, bid strategy, and budget optimization.',
    background: 'linear-gradient(154.8deg, #1D7FA6 22%, #3AB8CD 94%)',
    mesh: 'radial-gradient(92% 85% at -12% 10%, #D9DDF6 0%, transparent 70%), radial-gradient(120% 108% at 20% 100%, #C8F0F7 0%, transparent 70%), radial-gradient(118% 95% at 50% -8%, #EEEBFF 0%, transparent 70%), #fff',
    light: true,
    category: ['growth'],
    icon: 'target',
  },
  {
    id: 'analytics',
    num: '05',
    title: 'Analytics &\nConversion',
    short: 'Analytics',
    tagline: 'Visibility tied to revenue',
    body: 'My analytics and conversion work covers Google Analytics 4, Google Search Console, BigQuery, Looker Studio, GTM, AI referral tracking, conversion analysis, landing page testing, and ROI reporting.',
    background: 'linear-gradient(154.8deg, #C2F1FF 22%, #75E0B4 94%)',
    mesh: 'radial-gradient(92% 85% at -15% 10%, #CAF3FE 0%, transparent 70%), radial-gradient(126% 116% at 22% 105%, #91E4C2 0%, transparent 70%), radial-gradient(118% 95% at 50% -6%, #E4F9FF 0%, transparent 70%), #fff',
    category: ['growth'],
    icon: 'chart',
  },
  {
    id: 'authority',
    num: '06',
    title: 'Content, Authority\n& Leadership',
    short: 'Authority',
    tagline: 'Expertise, made visible',
    body: 'My content, authority and leadership work covers topical maps, content clusters, E-E-A-T, digital PR, link building, team leadership, strategic roadmaps, stakeholder management, and training.',
    background: 'linear-gradient(154.8deg, #EDEBFF 22%, #BAE5E5 94%)',
    mesh: 'radial-gradient(92% 85% at 95% 12%, #81B8A3 0%, transparent 70%), radial-gradient(118% 95% at 10% 100%, #89CFDB 0%, transparent 70%), radial-gradient(118% 95% at 8% 12%, #FFE8CD 0%, transparent 70%), #fff',
    category: ['organic', 'ai'],
    icon: 'crown',
  },
];

export const FILTERS = [
  { id: 'all', label: 'explore every discipline' },
  { id: 'ai', label: 'win in AI search' },
  { id: 'organic', label: 'grow organic visibility' },
  { id: 'growth', label: 'prove search ROI' },
];

export type Role = {
  title: string;
  company: string;
  years: string;
  start: number;
  bullets: string[];
  background: string;
  light?: boolean;
};

export const EXPERIENCE: Role[] = [
  {
    title: 'Senior SEO, AEO & GEO Strategist',
    company: 'Intero Digital',
    years: '2020 – Present',
    start: 2020,
    background: 'linear-gradient(154.8deg, #13193b 10%, #3a2f7a 70%, #f05722 140%)',
    light: true,
    bullets: [
      'I lead full-funnel search strategies combining traditional SEO, AEO, GEO, and paid search.',
      'I develop AI search visibility programs tracking brand citations, mentions, and share of voice.',
      'I optimize answer-first content, entity signals, structured data, and AI crawler accessibility.',
      'I build analytics dashboards connecting search visibility, AI referral traffic, and conversions.',
      'I lead digital authority initiatives, research workflows, and team training.',
    ],
  },
  {
    title: 'Senior SEO, AEO & GEO Strategist (Contract)',
    company: 'Lifebulb Counseling & Therapy',
    years: '2024 – 2026',
    start: 2024,
    background: 'linear-gradient(154.8deg, #F2FEDA 15%, #BAE5E5 60%, #75E0B4 110%)',
    bullets: [
      'I led SEO, AEO, and GEO strategies for a multi-location mental healthcare organization.',
      'I focused on patient inquiries, appointments, telehealth visibility, and local search.',
      'I developed answer-first healthcare content reviewed by licensed clinicians.',
      'I worked on healthcare schema, Google Business Profiles, local listings, and clinician authority.',
      'I tracked AI citations, search visibility, and booking conversions using privacy-conscious analytics.',
    ],
  },
  {
    title: 'PPC & SEO Specialist',
    company: 'Straight North',
    years: '2017 – 2020',
    start: 2017,
    background: 'linear-gradient(154.8deg, #FFF2C9 15%, #FFD0BA 60%, #FF9E86 115%)',
    bullets: [
      'I led PPC and SEO planning to improve organic traffic, paid search performance, and qualified leads.',
      'I managed Google Ads and Microsoft Advertising campaigns.',
      'I conducted keyword research, competitor analysis, and technical SEO improvements.',
      'I optimized content for featured snippets, question-based searches, and voice search.',
      'I implemented conversion tracking, campaign reporting, and ROI analysis.',
    ],
  },
  {
    title: 'SEO Strategist',
    company: 'Responsival Inc',
    years: '2014 – 2016',
    start: 2014,
    background: 'linear-gradient(154.8deg, #EDEBFF 15%, #D0D8F7 60%, #9FB4F5 115%)',
    bullets: [
      'I conducted keyword research and competitive analysis.',
      'I improved on-page SEO, technical optimization, crawling, indexing, and site performance.',
      'I supported link building, local SEO, and citation management.',
      'I reported search performance using Google Analytics, Search Console, and SEMrush.',
    ],
  },
];

export const TOOLS: { group: string; items: string[] }[] = [
  { group: 'AI Search & GEO', items: ['Profound', 'Semrush AI Visibility Toolkit', 'Ahrefs Brand Radar', 'Conductor', 'Otterly.AI', 'AthenaHQ', 'Goodie AI', 'Scrunch AI'] },
  { group: 'AI Platforms', items: ['ChatGPT', 'Claude', 'Gemini', 'Perplexity', 'Google AI Overviews', 'AI Mode'] },
  { group: 'SEO', items: ['Semrush', 'Ahrefs', 'Moz', 'Majestic', 'SpyFu', 'Screaming Frog', 'Sitebulb', 'Lighthouse', 'Surfer SEO', 'Clearscope', 'MarketMuse', 'Frase'] },
  { group: 'Analytics', items: ['GA4', 'Google Search Console', 'BigQuery', 'Looker Studio', 'GTM', 'Hotjar', 'Microsoft Clarity'] },
  { group: 'Paid Media', items: ['Google Ads', 'Microsoft Advertising', 'Meta Ads Manager', 'Google Merchant Center', 'Optmyzr', 'Skai', 'WordStream'] },
  { group: 'CMS & Web', items: ['WordPress', 'Shopify', 'Magento', 'Drupal', 'HTML/CSS'] },
];

export const CERTS = [
  { title: 'Google Analytics', sub: 'Certification', background: 'linear-gradient(154.8deg, #C2F1FF 22%, #75E0B4 94%)' },
  { title: 'Google Ads', sub: 'Certification', background: 'linear-gradient(154.8deg, #FFF2C9 22%, #FFD0BA 94%)' },
  { title: 'SEMrush', sub: 'Certification', background: 'linear-gradient(154.8deg, #FF7381 22%, #F9F1CA 94%)' },
  { title: 'Moz SEO', sub: 'Certification', background: 'linear-gradient(154.8deg, #EDEBFF 22%, #BAE5E5 94%)' },
];

export const PLATFORMS = ['Google AI Overviews', 'ChatGPT', 'Perplexity', 'Gemini', 'Claude', 'Microsoft Copilot'];
