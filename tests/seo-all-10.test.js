import {describe,it,expect} from 'vitest';
import {getPosts,listPostFiles,normalizePostDate} from '../src/lib/content.mjs';
import {articleSeoMetadata} from '../src/lib/seo.mjs';
import {isPostPublic} from '../src/lib/publication.mjs';
import site from '../config/site.json';
import fs from 'node:fs';
import matter from 'gray-matter';

// Preserve o mesmo instante de referência para a leitura e para a contagem esperada.
const snapshotTime=new Date();
const posts=getPosts(undefined,snapshotTime);
const files=listPostFiles('content/posts');
describe('Publicação dinâmica: os artigos são editáveis pelo Pages CMS',()=>{
 it('permite qualquer quantidade de artigos publicados, inclusive novos posts e rascunhos',()=>{
  const all=files.map(file=>matter(fs.readFileSync(file,'utf8')).data);
  expect(new Set(all.map(p=>p.slug)).size).toBe(all.length);
  expect(posts.length).toBe(all.filter(p=>isPostPublic(p,snapshotTime)).length);
  for(const post of posts){
   expect(post.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
   expect(post.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
   expect(post.title.trim().length).toBeGreaterThan(0);
   expect(post.description.trim().length).toBeGreaterThan(0);
  }
 });
 it('metadados, links canônicos e BlogPosting se ajustam a edições futuras',()=>{
  for(const article of posts){
   const seo=articleSeoMetadata({title:article.title,description:article.description,article,siteUrl:site.url,pathname:'/blog/'+article.slug+'/',supabaseUrl:site.supabaseUrl});
   expect(seo.url).toBe(site.url+'/blog/'+article.slug+'/');
   expect(seo.title).toBe((article.seoTitle?.trim()||article.title)+' | Cafemática');
   expect(seo.description).toBe(article.seoDescription?.trim()||article.description);
   expect(seo.schema['@type']).toBe('BlogPosting');
   expect(seo.schema.mainEntityOfPage['@id']).toBe(seo.url);
   expect(seo.schema.headline).toBe(article.title);
   expect(seo.schema.datePublished).toBe(article.date);
   expect(seo.schema.dateModified).toBe(article.updated||article.date);
   expect(seo.schema.author.name).toBe(article.author?.trim()||'Fernando da Silva Batista');
   expect(article.tags.length).toBeLessThanOrEqual(8);
   for(const source of article.sources)expect(new URL(source.url).protocol).toBe('https:');
  }
 });
 it('links internos de artigos publicados apontam para outros artigos publicados',()=>{
  const slugs=new Set(posts.map(p=>p.slug));
  for(const article of posts){
   for(const match of article.body.matchAll(/\]\(\/blog\/([a-z0-9-]+)\/?\)/g)){
    expect(slugs.has(match[1]),article.slug+' aponta para artigo ausente ou não publicado: '+match[1]).toBe(true);
   }
  }
 });
 it('as datas são normalizadas sem depender de uma data histórica fixa',()=>{
  const now='2026-10-17';
  expect(normalizePostDate(new Date(now+'T00:00:00.000Z'))).toBe(now);
  expect(normalizePostDate(now)).toBe(now);
 });
});
