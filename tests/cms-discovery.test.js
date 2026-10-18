import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { articleSeoMetadata, normalizeFaq } from '../src/lib/seo.mjs';
import { addArticleLastmod } from '../scripts/article-sitemap.mjs';

describe('CMS e descoberta orgânica dos artigos', () => {
  it('normaliza as perguntas do CMS sem gerar campos vazios ou duplicados', () => {
    expect(normalizeFaq(null)).toEqual([]);
    expect(normalizeFaq([
      { question: 'Como fazer?', answer: 'Faça a conta com cuidado.' },
      { question: ' como fazer? ', answer: 'Não duplica.' },
      { question: 'Quanto custa?', answer: 'Depende da quantidade.' },
      { question: 'Sem resposta', answer: '' },
      { question: '<script>alert(1)</script>', answer: 'Texto que o Astro renderiza escapado.' }
    ])).toEqual([
      { question: 'Como fazer?', answer: 'Faça a conta com cuidado.' },
      { question: 'Quanto custa?', answer: 'Depende da quantidade.' },
      { question: '<script>alert(1)</script>', answer: 'Texto que o Astro renderiza escapado.' }
    ]);
  });

  it('identifica as três posições dos breadcrumbs e o assunto principal', () => {
    const siteUrl = 'https://www.cafematica.com.br';
    const article = {
      title: 'Porcentagem na prática', slug: 'porcentagem-cotidiano',
      category: 'matematica', categoryInfo: { name: 'Matemática' },
      topic: 'Matemática Básica', date: '2026-10-12', published: true
    };
    const data = articleSeoMetadata({ title: article.title, description: 'Aprenda porcentagem.', article, siteUrl, pathname: '/blog/porcentagem-cotidiano/' });
    expect(data.schema['@type']).toBe('BlogPosting');
    expect(data.schema.about.name).toBe('Matemática Básica');
    expect(data.schema.isPartOf['@id']).toBe(siteUrl + '/blog/');
    expect(data.breadcrumbSchema['@type']).toBe('BreadcrumbList');
    expect(data.breadcrumbSchema.itemListElement.map(item => item.position)).toEqual([1,2,3]);
    expect(data.breadcrumbSchema.itemListElement.map(item => item.item)).toEqual([
      siteUrl + '/', siteUrl + '/matematica/', siteUrl + '/blog/porcentagem-cotidiano/'
    ]);
    expect(articleSeoMetadata({ title: 'Início', description: 'Portal', siteUrl, pathname: '/' }).breadcrumbSchema).toBeNull();
  });

  it('inclui lastmod apenas em URLs dos artigos e usa a revisão real', () => {
    const siteUrl = 'https://www.cafematica.com.br';
    const xml = '<?xml version="1.0"?><urlset>'
      + '<url><loc>' + siteUrl + '/</loc></url>'
      + '<url><loc>' + siteUrl + '/blog/a/</loc></url>'
      + '<url><loc>' + siteUrl + '/blog/b/</loc><lastmod>2025-01-01</lastmod></url>'
      + '</urlset>';
    const result = addArticleLastmod(xml, [
      {slug:'a',date:'2026-10-12',updated:'2026-10-17'},
      {slug:'b',date:'2026-10-15',updated:'2026-10-10'}
    ], siteUrl);
    expect(result).toContain('<loc>' + siteUrl + '/</loc></url>');
    expect(result).toContain('<loc>' + siteUrl + '/blog/a/</loc><lastmod>2026-10-17</lastmod>');
    expect(result).toContain('<loc>' + siteUrl + '/blog/b/</loc><lastmod>2026-10-15</lastmod>');
    expect((result.match(/<lastmod>/g)||[])).toHaveLength(2);
  });

  it('mantém o CMS como fonte de conteúdo visível, sem a meta keywords antiga', () => {
    const cms = fs.readFileSync('.pages.yml', 'utf8');
    const article = fs.readFileSync('src/pages/blog/[slug].astro', 'utf8');
    const layout = fs.readFileSync('src/layouts/Base.astro', 'utf8');
    expect(cms).toContain('name: faq');
    expect(cms).toContain('name: seoTitle');
    expect(cms).toContain('name: seoDescription');
    expect(cms).toContain('name: tags');
    expect(cms).not.toContain('name: keywords');
    expect(article).toContain('post.faq');
    expect(article).toContain('article-faq-title');
    expect(layout).toContain('seo.breadcrumbSchema');
    expect(layout).not.toContain('name="keywords"');
  });
});
