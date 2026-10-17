import {describe,it,expect} from 'vitest';
import {getPosts} from '../src/lib/content.mjs';
import {articleSeoMetadata} from '../src/lib/seo.mjs';
import site from '../config/site.json';

const slugs=['porcentagem-cotidiano','equacao-primeiro-grau','funcao-primeiro-grau'];
const articles=getPosts();
describe('Lote 1 — revisão editorial e SEO de três publicações',()=>{
 it('identifica os três artigos sem mudar suas URLs ou datas originais',()=>{
  for(const slug of slugs){
   const item=articles.find(post=>post.slug===slug);
   expect(item).toBeDefined();
   expect(item.date).toBe('2026-10-12');
   expect(item.updated).toBe('2026-10-17');
   expect(item.author).toBe('Fernando da Silva Batista');
   expect(item.published).toBe(true);
  }
  expect(articles.length).toBeGreaterThanOrEqual(10);
 });
 it('preenche metadados de busca realmente diferentes do título padrão',()=>{
  for(const slug of slugs){
   const article=articles.find(post=>post.slug===slug);
   const output=articleSeoMetadata({title:article.title,description:article.description,article,siteUrl:site.url,pathname:'/blog/'+slug+'/',supabaseUrl:site.supabaseUrl});
   expect(article.seoTitle.length).toBeLessThanOrEqual(75);
   expect(article.seoDescription.length).toBeLessThanOrEqual(180);
   expect(output.title).toBe(article.seoTitle+' | Cafemática');
   expect(output.description).toBe(article.seoDescription);
   expect(output.schema['@type']).toBe('BlogPosting');
   expect(output.schema.headline).toBe(article.title);
   expect(output.schema.dateModified).toBe('2026-10-17');
   expect(output.url).toBe(site.url+'/blog/'+slug+'/');
  }
 });
 it('inclui respostas curtas, temas e fontes relevantes e clicáveis',()=>{
  for(const slug of slugs){
   const article=articles.find(post=>post.slug===slug);
   expect(article.tags.length).toBeGreaterThanOrEqual(3);
   expect(article.tags.length).toBeLessThanOrEqual(6);
   expect(article.quickAnswer.length).toBeGreaterThan(110);
   expect(article.quickAnswer.length).toBeLessThanOrEqual(600);
   expect(article.sources.length).toBeGreaterThanOrEqual(2);
   for(const source of article.sources)expect(source.url.startsWith('https://')).toBe(true);
   expect(article.body).toContain('/blog/');
  }
 });
});
