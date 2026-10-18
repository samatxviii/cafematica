import { safeCoverPath } from './cover.mjs';

export function normalizeTags(input) {
  if (!Array.isArray(input)) return [];
  const seen = new Set();
  return input
    .filter(value => typeof value === 'string')
    .map(value => value.trim().replace(/\s+/g, ' ').slice(0, 80))
    .filter(value => {
      const key = value.toLocaleLowerCase('pt-BR');
      if (!value || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 8);
}

/**
 * Perguntas reais com respostas publicadas na própria página.
 * Não gera FAQPage artificial: é conteúdo editorial visível ao leitor.
 */
export function normalizeFaq(input) {
  if (!Array.isArray(input)) return [];
  const seen = new Set();
  return input
    .filter(item => item && typeof item === 'object')
    .map(item => ({
      question: typeof item.question === 'string' ? item.question.trim().replace(/\s+/g, ' ').slice(0, 180) : '',
      answer: typeof item.answer === 'string' ? item.answer.trim().replace(/\s+/g, ' ').slice(0, 900) : ''
    }))
    .filter(item => {
      const key = item.question.toLocaleLowerCase('pt-BR');
      if (!item.question || !item.answer || seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 5);
}

export function normalizeSources(input) {
  if (!Array.isArray(input)) return [];
  return input.filter(item => {
    if (!item || typeof item !== 'object' || typeof item.title !== 'string' || typeof item.url !== 'string') return false;
    try {
      const url = new URL(item.url.trim());
      return url.protocol === 'https:' && !!url.hostname && item.title.trim().length > 0;
    } catch { return false; }
  }).map(item => ({ title: item.title.trim().slice(0, 180), url: item.url.trim() })).slice(0, 12);
}

function textOrFallback(value, fallback) {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

export function articleSeoMetadata({ title, description, article = null, siteUrl, pathname, supabaseUrl = '' }) {
  const url = new URL(pathname, siteUrl).href;
  const tags = normalizeTags(article?.tags);
  const authorName = textOrFallback(article?.author, 'Fernando da Silva Batista');
  const displayTitle = textOrFallback(article?.seoTitle, title);
  const displayDescription = textOrFallback(article?.seoDescription, description);
  const cover = safeCoverPath(article?.cover, supabaseUrl);
  const image = cover ? new URL(cover, siteUrl).href : new URL('/og-cafematica.png', siteUrl).href;
  const published = article?.date || null;
  const updated = article?.updated || published;
  const authorUrl = new URL('/sobre/', siteUrl).href;
  const categoryName = article?.categoryInfo?.name || article?.category || '';
  const breadcrumbSchema = article ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: new URL('/', siteUrl).href },
      { '@type': 'ListItem', position: 2, name: categoryName || 'Artigos', item: new URL(categoryName ? '/' + article.category + '/' : '/blog/', siteUrl).href },
      { '@type': 'ListItem', position: 3, name: article.title || title, item: url }
    ]
  } : null;
  const publisher = {
    '@type': 'Organization',
    name: 'Cafemática',
    url: new URL('/', siteUrl).href,
    logo: { '@type': 'ImageObject', url: new URL('/assets/logo-original.png', siteUrl).href }
  };

  const schema = article ? {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': url + '#article',
    headline: article.title,
    description: displayDescription,
    inLanguage: 'pt-BR',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    datePublished: published,
    dateModified: updated,
    author: {
      '@type': 'Person',
      name: authorName,
      ...(authorName === 'Fernando da Silva Batista' ? {url: authorUrl} : {})
    },
    publisher,
    articleSection: categoryName || undefined,
    isPartOf: { '@type': 'Blog', '@id': new URL('/blog/', siteUrl).href, name: 'Artigos do Cafemática' },
    ...(article.topic ? { about: { '@type': 'Thing', name: String(article.topic).trim().slice(0, 100) } } : {}),
    ...(cover ? {image: [image]} : {}),
    ...(tags.length ? {keywords: tags.join(', ')} : {}),
    ...(normalizeSources(article?.sources).length ? {citation: normalizeSources(article.sources).map(source => source.url)} : {})
  } : {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Cafemática',
    url: new URL('/', siteUrl).href,
    inLanguage: 'pt-BR'
  };
  return {
    url,
    title: displayTitle + ' | Cafemática',
    description: displayDescription,
    image,
    imageAlt: textOrFallback(article?.coverAlt, ''),
    authorName,
    published,
    updated,
    tags,
    schema,
    breadcrumbSchema
  };
}
