import {describe,it,expect} from 'vitest';
import {getPosts} from '../src/lib/content.mjs';
import {articleSeoMetadata} from '../src/lib/seo.mjs';
import site from '../config/site.json';

const slugs=['fracoes-sem-decorar','geogebra-funcao','formulas-latex'];
const posts=getPosts();
describe('SEO — lote 2: frações, GeoGebra e fórmulas LaTeX',()=>{
 it('preserva os três endereços e as datas originais',()=>{
  for(const slug of slugs){
   const post=posts.find(item=>item.slug===slug);
   expect(post).toBeDefined();
   expect(post.date).toBe('2026-10-12');
   expect(post.updated).toBe('2026-10-17');
   expect(post.published).toBe(true);
   expect(post.author).toBe('Fernando da Silva Batista');
  }
 });
 it('gera dados estruturados e textos de busca específicos',()=>{
  for(const slug of slugs){
   const article=posts.find(item=>item.slug===slug);
   expect(article.seoTitle.length).toBeLessThanOrEqual(75);
   expect(article.seoDescription.length).toBeLessThanOrEqual(180);
   const seo=articleSeoMetadata({title:article.title,description:article.description,article,siteUrl:site.url,pathname:'/blog/'+slug+'/',supabaseUrl:site.supabaseUrl});
   expect(seo.url).toBe(site.url+'/blog/'+slug+'/');
   expect(seo.title).toBe(article.seoTitle+' | Cafemática');
   expect(seo.description).toBe(article.seoDescription);
   expect(seo.schema['@type']).toBe('BlogPosting');
   expect(seo.schema.dateModified).toBe('2026-10-17');
   expect(seo.schema.headline).toBe(article.title);
   expect(seo.schema.author.name).toBe('Fernando da Silva Batista');
  }
 });
 it('oferece tags, respostas úteis, fontes oficiais e leitura cruzada',()=>{
  for(const slug of slugs){
   const post=posts.find(item=>item.slug===slug);
   expect(post.tags.length).toBeGreaterThanOrEqual(1);
   expect(post.tags.length).toBeLessThanOrEqual(8);
   expect(post.quickAnswer.length).toBeGreaterThan(160);
   expect(post.quickAnswer.length).toBeLessThanOrEqual(600);
   expect(post.sources.length).toBeGreaterThanOrEqual(2);
   expect(post.sources.every(src=>new URL(src.url).protocol==='https:')).toBe(true);
   expect(post.body).toContain('/blog/');
  }
 });
 it('não remove nem renomeia artigos preexistentes',()=>{
  expect(posts.length).toBeGreaterThanOrEqual(10);
  for(const slug of slugs)expect(posts.some(p=>p.slug===slug)).toBe(true);
 });
});
