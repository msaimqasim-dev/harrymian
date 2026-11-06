import { CASE_IMAGES } from './case-image-assets';

export type PublishedCase = {
  id: string; num: string; label: string; title: string; blurb: string;
  image: string; tint: string; accent: string; tags: string[];
  industry: string; client: string; source: string; challenge: string;
  approach: { title: string; body: string }[];
  metrics: { value: string; label: string }[];
  note: string; visual: string; journey: string[];
};
const base = 'https://www.seoworks.co.uk/case-studies/';
export const WORK: PublishedCase[] = [
  {
    id: 'holiday', num: '01', label: 'Holiday parks', title: 'Content that inspires a stay.',
    industry: 'Travel & leisure', client: 'Meadow Bay Villages',
    blurb: 'A three-part content strategy connected national holiday demand with local park experiences.',
    image: CASE_IMAGES.holiday.hero.src, tint: '#dce8dc', accent: '#64866b', tags: ['Content strategy', 'Local SEO'],
    source: base + 'conversion-focussed-content-strategy-for-holiday-parks/',
    challenge: 'Established holiday brands dominated organic discovery. Meadow Bay also needed to explain its full-service static-home holidays to people who assumed it offered caravan pitching fields.',
    approach: [
      { title: 'Capture holiday intent', body: 'Target non-location searches, from hot-tub breaks to dog-friendly holidays.' },
      { title: 'Make each park local', body: 'Build content around nearby cities, coastlines, landmarks and park activities.' },
      { title: 'Clarify the experience', body: 'Position parks as convenient alternatives to major destinations, with a consistent brand voice.' },
    ],
    metrics: [{ value: '+200.2%', label: 'Sessions YoY' }, { value: '+52.1%', label: 'Bookings YoY' }, { value: '>102%', label: 'Revenue YoY' }, { value: '+248%', label: 'Conversions YoY · Google, AIOs & ChatGPT' }],
    note: 'First-year results. The source’s headline tiles round bookings to +52% and revenue to +103%; its results text reports +52.1% and over 102%.',
    visual: 'A place to stay. A reason to discover.', journey: ['Holiday intent', 'Local discovery', 'Clearer park positioning'],
  },
  {
    id: 'seating', num: '02', label: 'Seating manufacturer', title: 'A stronger seat in AI search.',
    industry: 'B2B manufacturing', client: 'Specialist seating manufacturer · unnamed',
    blurb: 'Established organic SEO became the foundation for visibility in Google’s AI Overviews.',
    image: CASE_IMAGES.seating.hero.src, tint: '#e0dcf0', accent: '#8970bc', tags: ['GEO', 'AI share of voice'],
    source: base + 'share-of-voice-ai-overviews-for-seating-manufacturer/',
    challenge: 'AI answers appeared above organic listings for specialist seating queries. The manufacturer needed its brand named and cited where buyers now encountered answers.',
    approach: [
      { title: 'Answer commercial questions', body: 'Improve and create structured product and service pages across the seating range.' },
      { title: 'Own the definitions', body: 'Support branded and explanatory searches, including bleacher-seat definitions.' },
      { title: 'Track the competitive picture', body: 'Monitor mentions, citation positions and AI Overview share of voice.' },
    ],
    metrics: [{ value: '60.6%', label: 'AI Overview share of voice' }, { value: '>2×', label: 'Combined share of the next four competitors' }],
    note: 'Reported share of voice concerns the campaign’s priority searches. The source does not publish an overall market share or campaign duration.',
    visual: 'From product expertise to cited answers.', journey: ['Product answers', 'Definition coverage', 'Citation monitoring'],
  },
  {
    id: 'pool', num: '03', label: 'Pool rental', title: 'Making private pools discoverable.',
    industry: 'Sharing economy', client: 'UK pool-sharing platform · unnamed',
    blurb: 'Organic optimisation expanded into conversational searches used by prospective pool hosts.',
    image: CASE_IMAGES.pool.hero.src, tint: '#d9eeec', accent: '#368f99', tags: ['AI Overviews', 'GEO'],
    source: base + 'ai-overview-visibility-for-pool-rental/',
    challenge: 'Host-acquisition queries increasingly triggered AI answers before organic results. Rankings alone could leave the platform absent from these recommendations.',
    approach: [
      { title: 'Answer the host', body: 'Create scannable answers to commercial questions about listing, insurance and rental income.' },
      { title: 'Build UK relevance', body: 'Deepen hosting and hiring coverage; measure citations alongside organic rankings.' },
    ],
    metrics: [{ value: '14 / 14', label: 'Tracked AI Overviews mentioning the brand' }, { value: '+56%', label: 'AI Overview visibility' }, { value: '91.5%', label: 'AI Overview share of voice vs competitors' }, { value: '73%', label: 'Citation rate' }, { value: '3.1', label: 'Average citation position' }],
    note: 'Results across three months. GEO tracked 14 commercial searches within a broader SEO campaign of over 50 keywords.',
    visual: 'Private swimming. Public discovery.', journey: ['Host questions', 'UK-specific answers', 'AI citations'],
  },
  {
    id: 'product', num: '04', label: 'Product page SEO', title: 'Specialist products. Standout search.',
    industry: 'Specialist distribution', client: 'Tarpaflex',
    blurb: 'Richer product pages and connected content helped a family business compete with major retailers.',
    image: CASE_IMAGES.product.hero.src, tint: '#ede0cd', accent: '#b18149', tags: ['Ecommerce SEO', 'Site architecture'],
    source: base + 'product-page-optimisation-seo/',
    challenge: 'Following a complex migration, thin category and product pages needed stronger visibility and authority to compete for tarpaulin searches.',
    approach: [
      { title: 'Enrich the product pages', body: 'Add helpful copy, FAQs and links to related categories and products.' },
      { title: 'Connect the whole catalogue', body: 'Build pillar pages, improve navigation and link supporting topics to reduce keyword overlap.' },
      { title: 'Prioritise the hero product', body: 'Keep tarpaulin central while improving authority across the wider site.' },
    ],
    metrics: [{ value: '+117%', label: 'Branded clicks YoY' }, { value: '+15', label: 'Top-three keywords for tarpaulin' }, { value: '+30', label: 'Top-ten keywords' }, { value: 'No. 1', label: 'Position achieved for “tarpaulin”' }],
    note: 'The source reports a number-one ranking during the last year, while describing that position as actively contested.',
    visual: 'A connected catalogue builds authority.', journey: ['Pillar page', 'Related categories', 'Products & FAQs', 'Supporting guides'],
  },
  {
    id: 'geo', num: '05', label: 'LLM referral growth', title: 'From AI answers to qualified visits.',
    industry: 'B2B marketing', client: 'The SEO Works · own-site campaign',
    blurb: 'A GEO programme made high-value service content easier for AI assistants to understand and recommend.',
    image: CASE_IMAGES.geo.hero.src, tint: '#dadff1', accent: '#627bd2', tags: ['GEO strategy', 'AI referrals'],
    source: base + 'llm-ai-visibility/',
    challenge: 'ChatGPT sent only a few monthly visits, but these visitors reached commercially relevant service pages. The opportunity was to grow that qualified audience.',
    approach: [
      { title: 'Make answers explicit', body: 'Replace vague marketing language with direct answers and FAQs; connect services and supporting articles.' },
      { title: 'Strengthen entity signals', body: 'Improve relevant schema and consistent business details across platforms.' },
      { title: 'Build external trust', body: 'Expand reviews, directories, social distribution and journalist-led digital PR.' },
    ],
    metrics: [{ value: '2,000%', label: 'Reported increase in AI referrals' }, { value: '~5', label: 'Monthly AI referrals · starting level' }, { value: '>100', label: 'Monthly AI referrals · consistently achieved' }],
    note: 'Achieved in less than a year; Google Analytics is the source cited. The publisher describes the change as “2000% (20x)”; this is its reported figure, not a recalculation from the approximate endpoints. ChatGPT led referrals, followed by Perplexity and Gemini.',
    visual: 'Clear answers. Connected trust signals.', journey: ['Direct answers', 'Entity consistency', 'External credibility'],
  },
  {
    id: 'coffee', num: '06', label: 'Ecommerce & AI', title: 'A new route from discovery to coffee.',
    industry: 'Coffee ecommerce', client: 'Premium coffee brand · unnamed',
    blurb: 'An integrated SEO and GEO campaign linked AI discovery to measurable ecommerce performance.',
    image: CASE_IMAGES.coffee.hero.src, tint: '#e7d7cc', accent: '#b87857', tags: ['AI search', 'Revenue attribution'],
    source: base + 'ecommerce-revenue-from-ai/',
    challenge: 'The brand needed content AI systems could reference and tracking that separated chatbot traffic, engagement and sales.',
    approach: [
      { title: 'Structure for discovery', body: 'Audit intent, create modular answers and refine schema and internal links.' },
      { title: 'Show product expertise', body: 'Strengthen origin details, author attribution and physical presence through a café page.' },
      { title: 'Attribute the impact', body: 'Introduce custom tracking for ChatGPT, Copilot and Gemini referrals.' },
    ],
    metrics: [{ value: '+78%', label: 'Sales attributed to AI referrals' }, { value: '+36.5%', label: 'AI-assisted conversions YoY' }, { value: '91%', label: 'Average AI-session engagement rate' }, { value: '+900%', label: 'Signature-blend AI-attributed sales YoY' }],
    note: 'Results within twelve months. ChatGPT accounted for over 95% of AI-driven transactions. Site searches rose 182% and product-quiz completions rose 247%.',
    visual: 'Better discovery, all the way to the cup.', journey: ['Modular content', 'Product credibility', 'AI referral tracking', 'Attributed sales'],
  },
];
