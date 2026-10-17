import {describe,it,expect} from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {getPosts,listPostFiles} from '../src/lib/content.mjs';
import {moveArticle,planArticleMove} from '../scripts/move-post.mjs';

const cms=fs.readFileSync('.pages.yml','utf8');
// Read the article by filename no matter which CMS subfolder it currently occupies.
// Fixtures are independent of the actual posts: editing/unpublishing content must not break the build.
const article=[
 '---',
 'slug: equacao-primeiro-grau',
 'title: "Artigo fictício para testar o movimento"',
 'description: "Esta descrição permite testar a reorganização das pastas sem depender das publicações reais."',
 'category: matematica',
 'date: 2026-10-12',
 'published: true',
 '---',
 '## Primeiro passo',
 'Um conteúdo de teste para a estrutura editorial.',
 '## Segundo passo',
 'A URL permanece baseada no slug após mover o arquivo.'
].join('\n');
const payload=(file,folder)=>({
 source:'pages-cms',
 action:{name:'move-post-folder'},
 repository:{owner:'samatxviii',repo:'cafematica',ref:'main'},
 context:{type:'entry',name:'posts',path:file},
 inputs:{folder}
});

describe('Pastas no Pages CMS e URLs estáveis',()=>{
 it('habilita subpastas e oferece escolha de destino sem liberar renomeações',()=>{
  expect(cms).toContain('subfolders: true');
  expect(cms).toContain('layout: tree');
  expect(cms).toContain('label: Mover artigo para pasta');
  expect(cms).toContain('scope: entry');
  expect(cms).toContain('workflow: pages-cms-move-post.yml');
  expect(cms).toContain('value: raiz');
  expect(cms).toContain('value: matematica');
  expect(cms).toContain('value: latex');
  expect(cms).toContain('value: tecnologia');
  expect(cms).toContain('rename: false');
 });
 it('descobre artigos Markdown em diretórios aninhados sem mudar o slug público',()=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'cafematica-move-'));
  try{
   const posts=path.join(root,'content/posts');
   fs.mkdirSync(posts,{recursive:true});
   const post=path.join(posts,'equacao-primeiro-grau.md');
   fs.writeFileSync(post,article);
   expect(getPosts(posts)[0].slug).toBe('equacao-primeiro-grau');
   const done=moveArticle(payload('content/posts/equacao-primeiro-grau.md','matematica'),root);
   expect(done.moved).toBe(true);
   expect(fs.existsSync(post)).toBe(false);
   expect(fs.existsSync(path.join(posts,'matematica/equacao-primeiro-grau.md'))).toBe(true);
   expect(listPostFiles(posts)).toHaveLength(1);
   expect(getPosts(posts)[0].slug).toBe('equacao-primeiro-grau');
   expect(moveArticle(payload('content/posts/matematica/equacao-primeiro-grau.md','raiz'),root).moved).toBe(true);
   expect(fs.existsSync(post)).toBe(true);
   expect(getPosts(posts)[0].slug).toBe('equacao-primeiro-grau');
   const page=fs.readFileSync('src/pages/blog/[slug].astro','utf8');
   expect(page).toContain('params:{slug:post.slug}');
  } finally {fs.rmSync(root,{recursive:true,force:true});}
 });
 it('recusa caminhos suspeitos, destinos fora da lista e arquivos inexistentes',()=>{
  const base=payload('content/posts/equacao-primeiro-grau.md','tecnologia');
  expect(()=>planArticleMove({...base,inputs:{folder:'../src'}})).toThrow();
  expect(()=>planArticleMove({...base,context:{...base.context,path:'content/posts/../../../package.json'}})).toThrow();
  expect(()=>planArticleMove({...base,repository:{...base.repository,ref:'testing'}})).toThrow();
  expect(()=>planArticleMove({...base,action:{name:'wrong-action'}})).toThrow();
 });
 it('impede dois arquivos de pastas diferentes com o mesmo slug',()=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'cafematica-duplicate-'));
  try {
   fs.mkdirSync(path.join(root,'matematica'),{recursive:true});
   fs.writeFileSync(path.join(root,'a.md'),article);
   fs.writeFileSync(path.join(root,'matematica/b.md'),article);
   expect(()=>getPosts(root)).toThrow(/Slug duplicado/);
  } finally {fs.rmSync(root,{recursive:true,force:true});}
 });
});

describe('Editor simplificado sem notas ou explicações automáticas',()=>{
 it('mostra apenas título, categoria, publicação e data na tabela',()=>{
  expect(cms).toContain('fields: [title, category, published, date]');
  for(const key of ['seoScore','seoSummary','seoChecklist']){
   expect(cms).not.toContain(key);
  }
 });
 it('mantém todos os campos úteis de publicação e SEO',()=>{
  const essential=['title','slug','description','seoTitle','seoDescription','tags','category','topic','cover','coverAlt','author','date','updated','published','youtube','quickAnswer','sources','body'];
  for(const field of essential){
   expect(cms).toContain('name: '+field);
  }
  expect(cms).toContain('label: Mover artigo para pasta');
 });
 it('limpa notas e diagnósticos antigos de todos os artigos, sem perder dados editoriais',()=>{
  const files=listPostFiles('content/posts');
  expect(files.length).toBeGreaterThanOrEqual(10);
  for(const file of files){
   const source=fs.readFileSync(file,'utf8');
   const metadata=source.split('\n---',2)[0];
   for(const key of ['seoScore','seoSummary','seoChecklist']){
    expect(metadata).not.toMatch(new RegExp('^'+key+':','m'));
   }
   for(const key of ['seoTitle','seoDescription','tags','quickAnswer','sources']){
    expect(metadata).toMatch(new RegExp('^'+key+':','m'));
   }
  }
 });
 it('não recria notas através do GitHub Actions',()=>{
  expect(fs.existsSync('.github/workflows/seo-checklist.yml')).toBe(false);
  expect(fs.existsSync('scripts/seo-score.mjs')).toBe(false);
  expect(fs.existsSync('.github/workflows/pages-cms-move-post.yml')).toBe(true);
 });
});
