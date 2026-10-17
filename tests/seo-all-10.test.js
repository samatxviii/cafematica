import {describe,it,expect} from 'vitest';
import {getPosts} from '../src/lib/content.mjs';
import {articleSeoMetadata} from '../src/lib/seo.mjs';
import site from '../config/site.json';

const finalSlugs=['primeiro-documento-latex','lista-exercicios-latex','organizar-google-drive','obs-primeira-aula'];
const posts=getPosts();
describe('SEO — finalização editorial das dez publicações do Cafemática',()=>{
 it('preserva exatamente os dez artigos, slugs e data de publicação originais',()=>{
  expect(posts).toHaveLength(10);
  expect(new Set(posts.map(p=>p.slug)).size).toBe(10);
  for(const article of posts){
   expect(article.date).toBe('2026-10-12');
   expect(article.updated).toBe('2026-10-17');
   expect(article.published).toBe(true);
   expect(article.author).toBe('Fernando da Silva Batista');
  }
 });
 it('os dez artigos usam SEO title, description, tags, autoria, resposta e fontes',()=>{
  for(const article of posts){
   expect(article.seoTitle.length).toBeGreaterThan(15);
   expect(article.seoTitle.length).toBeLessThanOrEqual(75);
   expect(article.seoDescription.length).toBeGreaterThan(65);
   expect(article.seoDescription.length).toBeLessThanOrEqual(180);
   expect(article.tags.length).toBeGreaterThanOrEqual(3);
   expect(article.tags.length).toBeLessThanOrEqual(8);
   expect(article.quickAnswer.length).toBeGreaterThan(100);
   expect(article.quickAnswer.length).toBeLessThanOrEqual(600);
   expect(article.sources.length).toBeGreaterThanOrEqual(2);
   const seo=articleSeoMetadata({title:article.title,description:article.description,article,siteUrl:site.url,pathname:'/blog/'+article.slug+'/',supabaseUrl:site.supabaseUrl});
   expect(seo.url).toBe(site.url+'/blog/'+article.slug+'/');
   expect(seo.title).toBe(article.seoTitle+' | Cafemática');
   expect(seo.description).toBe(article.seoDescription);
   expect(seo.schema.headline).toBe(article.title);
   expect(seo.schema['@type']).toBe('BlogPosting');
   expect(seo.schema.dateModified).toBe('2026-10-17');
   expect(seo.schema.author.name).toBe('Fernando da Silva Batista');
   expect(seo.schema.citation.length).toBeGreaterThanOrEqual(2);
  }
 });
 it('os quatro artigos finais contêm links e fontes relevantes e válidas',()=>{
  for(const slug of finalSlugs){
   const article=posts.find(p=>p.slug===slug);
   expect(article).toBeDefined();
   expect(article.tags.length).toBeGreaterThanOrEqual(1);
   expect(article.tags.length).toBeLessThanOrEqual(8);
   expect(article.sources.length).toBeGreaterThanOrEqual(2);
   expect(article.sources.every(source=>new URL(source.url).protocol==='https:')).toBe(true);
   expect(article.body).toMatch(/\]\(\/blog\//);
  }
 });
 it('os links editoriais internos apontam para artigos que existem',()=>{
  const slugs=new Set(posts.map(p=>p.slug));
  for(const article of posts){
   const links=article.body.matchAll(/\]\(\/blog\/([a-z0-9-]+)\/?\)/g);
   for(const match of links){
    expect(slugs.has(match[1]),article.slug+' aponta para '+match[1]).toBe(true);
   }
  }
 });
});
