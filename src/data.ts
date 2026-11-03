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

export type Work = {
  id: string;
  num: string;
  title: string;
  label: string;
  blurb: string;
  tags: string[];
  image: string;
  tint: string;
  accent: string;
};

export const WORK: Work[] = [
  {
    id: 'w1',
    num: '01',
    title: 'AI Search Visibility & Brand Citations',
    label: 'AI Visibility',
    blurb: 'My concept framework for tracking how a brand is mentioned, cited, and recommended across AI answer engines — and how to grow share of voice.',
    tags: ['GEO', 'Citations', 'Share of voice'],
    image: IMAGES.p1,
    tint: '#d0d8f7',
    accent: '#5b6cf0',
  },
  {
    id: 'w2',
    num: '02',
    title: 'Technical SEO & Website Optimization',
    label: 'Technical SEO',
    blurb: 'My concept audit blueprint covering architecture, crawling, indexing, rendering, and Core Web Vitals as one connected system.',
    tags: ['Crawling', 'Indexing', 'Core Web Vitals'],
    image: IMAGES.p2,
    tint: '#13193b',
    accent: '#2a7fd4',
  },
  {
    id: 'w3',
    num: '03',
    title: 'Multi-Location Healthcare Search',
    label: 'Healthcare Local',
    blurb: 'My concept approach to local visibility for multi-location care: profiles, listings, clinician authority, and answer-first patient content.',
    tags: ['Local SEO', 'Schema', 'Telehealth'],
    image: IMAGES.p3,
    tint: '#bae5e5',
    accent: '#1fa07a',
  },
  {
    id: 'w4',
    num: '04',
    title: 'Ecommerce SEO & Paid Search',
    label: 'Ecommerce',
    blurb: 'My concept playbook pairing ecommerce SEO with Shopping and Performance Max so organic and paid search work as one engine.',
    tags: ['Shopping', 'PMax', 'Ecommerce SEO'],
    image: IMAGES.p4,
    tint: '#ffd0ba',
    accent: '#f2643f',
  },
  {
    id: 'w5',
    num: '05',
    title: 'Entity Optimization & Structured Data',
    label: 'Entities',
    blurb: 'My concept model for strengthening entity signals — Knowledge Graph, Wikidata, and structured data — so machines understand the brand.',
    tags: ['Knowledge Graph', 'Wikidata', 'Schema'],
    image: IMAGES.p5,
    tint: '#edebff',
    accent: '#8a57f0',
  },
  {
    id: 'w6',
    num: '06',
    title: 'Search Analytics & Performance Intelligence',
    label: 'Intelligence',
    blurb: 'My concept dashboard connecting search visibility, AI referral traffic, and conversions into reporting tied to leads and revenue.',
    tags: ['GA4', 'BigQuery', 'Looker Studio'],
    image: IMAGES.p6,
    tint: '#1a2050',
    accent: '#f05722',
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

export type CaseStudy = {
  eyebrow: string;
  summary: string;
  challenge: string;
  goals: string[];
  approach: { title: string; body: string }[];
  deliverables: string[];
  measure: string[];
  stack: string[];
};

/* Conceptual case studies — illustrative frameworks, not completed client engagements or reported results. */
export const CASES: Record<string, CaseStudy> = {
  w1: {
    eyebrow: 'GEO · AI Visibility',
    summary: 'My concept framework for understanding how a brand appears inside AI-generated answers — and a repeatable program to become more visible, cited, and recommended.',
    challenge: 'Buyers increasingly ask ChatGPT, Perplexity, Gemini, Claude, Copilot and Google AI Overviews for recommendations. Traditional rank tracking does not show whether a brand is mentioned, how it is described, or which sources the engines cite.',
    goals: ['Establish a baseline of brand mentions and citations across AI platforms', 'Understand share of voice against competitors for priority prompts', 'Identify the sources and content formats AI engines rely on', 'Build a repeatable monitoring and optimization cadence'],
    approach: [
      { title: 'Prompt & question research', body: 'I would map the real questions buyers ask across the funnel and group them into prompt sets by intent, product line and audience.' },
      { title: 'Visibility baseline', body: 'I would track mentions, citations, sentiment and share of voice across AI platforms using dedicated AI visibility tooling.' },
      { title: 'Citation source analysis', body: 'I would identify which owned, earned and third-party pages are cited, and where the gaps in authority and coverage sit.' },
      { title: 'Optimize & monitor', body: 'I would strengthen answer-first content, entity signals and digital PR, then monitor movement and AI referral traffic over time.' },
    ],
    deliverables: ['Priority prompt library', 'AI visibility baseline report', 'Competitor share-of-voice view', 'Citation gap analysis', 'Optimization roadmap'],
    measure: ['Brand mention rate', 'Citation frequency', 'Share of voice', 'AI sentiment', 'AI referral traffic'],
    stack: ['Profound', 'Semrush AI Visibility Toolkit', 'Ahrefs Brand Radar', 'Otterly.AI', 'GA4'],
  },
  w2: {
    eyebrow: 'Technical SEO',
    summary: 'My concept audit blueprint that treats architecture, crawling, indexing, rendering and performance as one connected system rather than a checklist.',
    challenge: 'Large or fast-changing websites accumulate crawl waste, duplicate URLs, rendering issues and slow templates. Search engines and AI crawlers may struggle to discover and understand the pages that matter most.',
    goals: ['Make priority pages easy to discover, crawl and index', 'Remove technical blockers to rendering and understanding', 'Improve Core Web Vitals on key templates', 'Ensure AI crawlers can access important content'],
    approach: [
      { title: 'Crawl & architecture review', body: 'I would crawl the site to map structure, internal linking depth, orphan pages, redirects and canonical signals.' },
      { title: 'Indexation diagnostics', body: 'I would compare crawled, submitted and indexed URLs using Search Console to find exclusions and duplication.' },
      { title: 'Rendering & performance', body: 'I would test JavaScript rendering and template-level Core Web Vitals to prioritize fixes by impact.' },
      { title: 'Prioritized roadmap', body: 'I would translate findings into a developer-ready backlog ranked by effort and expected impact.' },
    ],
    deliverables: ['Technical audit', 'Architecture & internal linking map', 'Indexation report', 'Core Web Vitals review', 'Developer backlog'],
    measure: ['Indexed priority pages', 'Crawl efficiency', 'Core Web Vitals', 'Organic landing page growth'],
    stack: ['Screaming Frog', 'Sitebulb', 'Google Search Console', 'Lighthouse', 'GA4'],
  },
  w3: {
    eyebrow: 'Healthcare · Local Search',
    summary: 'My concept approach for multi-location care providers to be found in local and AI search — responsibly, accurately and with clinical credibility.',
    challenge: 'Patients search for care by location, condition and availability. Multi-location organizations need consistent listings, trustworthy content and clear clinician authority while respecting privacy requirements.',
    goals: ['Improve local visibility for each location', 'Publish accurate, answer-first patient content', 'Strengthen clinician and organization authority signals', 'Connect visibility to inquiries and bookings using privacy-conscious measurement'],
    approach: [
      { title: 'Location foundations', body: 'I would audit and align Google Business Profiles, local listings and location pages for consistency and completeness.' },
      { title: 'Answer-first content', body: 'I would create patient-focused content that answers real questions clearly, with review by licensed clinicians.' },
      { title: 'Healthcare schema & authority', body: 'I would implement relevant structured data and strengthen clinician profiles and organizational entity signals.' },
      { title: 'Privacy-conscious measurement', body: 'I would track search visibility, AI citations and booking conversions without compromising patient privacy.' },
    ],
    deliverables: ['Location & listings audit', 'Patient question map', 'Clinician-reviewed content plan', 'Schema implementation plan', 'Conversion tracking framework'],
    measure: ['Local pack visibility', 'Profile actions', 'Appointment inquiries', 'Telehealth page visibility', 'AI citations'],
    stack: ['Google Business Profile', 'Google Search Console', 'GA4', 'GTM', 'Looker Studio'],
  },
  w4: {
    eyebrow: 'Ecommerce · SEO + Paid',
    summary: 'My concept playbook pairing ecommerce SEO with Shopping and Performance Max so organic and paid search operate as one coordinated growth engine.',
    challenge: 'Ecommerce teams often run SEO and paid search in silos — duplicating spend, missing category opportunities and working from disconnected product data.',
    goals: ['Align organic and paid keyword coverage', 'Improve category and product page visibility', 'Strengthen product feed quality', 'Report on combined search performance'],
    approach: [
      { title: 'Unified keyword map', body: 'I would map category, product and long-tail demand to decide where organic, paid or both should lead.' },
      { title: 'Category & product SEO', body: 'I would improve templates, faceted navigation handling, product schema and internal linking.' },
      { title: 'Feed & Shopping optimization', body: 'I would refine titles, attributes and structure in Merchant Center to support Shopping and Performance Max.' },
      { title: 'Blended reporting', body: 'I would combine organic and paid data to guide bid strategy, budget and content priorities.' },
    ],
    deliverables: ['Organic + paid keyword map', 'Category template recommendations', 'Product feed audit', 'Campaign structure plan', 'Blended dashboard'],
    measure: ['Category visibility', 'Shopping impression share', 'Return on ad spend', 'Organic revenue contribution'],
    stack: ['Google Ads', 'Google Merchant Center', 'Shopify', 'Semrush', 'Looker Studio'],
  },
  w5: {
    eyebrow: 'Entities · Structured Data',
    summary: 'My concept model for making a brand unambiguous to search engines and large language models through entity optimization and structured data.',
    challenge: 'If machines cannot confidently identify who a brand is, what it offers and how it relates to people, places and topics, it is less likely to appear accurately in knowledge panels and AI answers.',
    goals: ['Define the brand’s core entity and relationships', 'Align structured data across the site', 'Improve consistency across trusted external sources', 'Support Knowledge Graph and AI understanding'],
    approach: [
      { title: 'Entity mapping', body: 'I would define the organization, people, products, services and topics, plus how they connect.' },
      { title: 'Schema architecture', body: 'I would design a connected structured data graph across templates rather than isolated snippets.' },
      { title: 'External consistency', body: 'I would review profiles and references such as Wikidata and directories for accuracy and alignment.' },
      { title: 'Validate & monitor', body: 'I would test markup, monitor rich results and review how AI platforms describe the brand.' },
    ],
    deliverables: ['Entity map', 'Schema architecture', 'Markup implementation guide', 'External profile audit', 'Monitoring checklist'],
    measure: ['Valid structured data coverage', 'Rich result eligibility', 'Knowledge panel accuracy', 'AI brand description accuracy'],
    stack: ['Schema.org', 'Wikidata', 'Google Search Console', 'Screaming Frog', 'ChatGPT · Gemini · Perplexity'],
  },
  w6: {
    eyebrow: 'Analytics · Intelligence',
    summary: 'My reporting concept connects search visibility, AI referral traffic and conversions — so search strategy is judged by leads, bookings and revenue.',
    challenge: 'Search data often lives in separate tools. Without a shared view, teams struggle to see how rankings, AI visibility and paid campaigns translate into business outcomes.',
    goals: ['Unify organic, paid and AI referral data', 'Track conversions reliably', 'Give stakeholders a clear, trusted view', 'Turn reporting into prioritized action'],
    approach: [
      { title: 'Measurement plan', body: 'I would define business goals, conversions and events, then align GA4 and GTM implementation.' },
      { title: 'Data consolidation', body: 'I would bring Search Console, GA4, ads and AI visibility data together, using BigQuery where scale requires it.' },
      { title: 'AI referral tracking', body: 'I would segment traffic arriving from AI platforms to understand its quality and conversion behavior.' },
      { title: 'Dashboards & insight', body: 'I would build Looker Studio views for executives and practitioners, paired with regular recommendations.' },
    ],
    deliverables: ['Measurement plan', 'GA4 & GTM audit', 'AI referral segments', 'Looker Studio dashboards', 'Reporting cadence'],
    measure: ['Conversions by channel', 'AI referral sessions', 'Lead & booking volume', 'Return on investment'],
    stack: ['GA4', 'Google Search Console', 'BigQuery', 'Looker Studio', 'GTM'],
  },
};
