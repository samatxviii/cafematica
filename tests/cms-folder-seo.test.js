import {describe,it,expect} from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {getPosts,listPostFiles} from '../src/lib/content.mjs';
import {moveArticle,planArticleMove} from '../scripts/move-post.mjs';
import {auditPosts} from '../scripts/seo-score.mjs';

const cms=fs.readFileSync('.pages.yml','utf8');
const article=fs.readFileSync('content/posts/equacao-primeiro-grau.md','utf8');
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

describe('Checklist editorial SEO de zero a dez',()=>{
 it('coloca a nota calculada exatamente antes da categoria na tabela',()=>{
  expect(cms).toContain('fields: [title, seoScore, category, published, date]');
  expect(cms).toContain('name: seoScore');
  expect(cms).toContain('label: Checklist SEO (0-10)');
  expect(cms).toContain('readonly: true');
 });
 it('audita artigos de verdade e explica cada ponto sem alegar ranking',()=>{
  const results=auditPosts();
  expect(results.length).toBeGreaterThanOrEqual(10);
  for(const result of results){
   expect(result.checks).toHaveLength(10);
   expect(result.score).toBeGreaterThanOrEqual(0);
   expect(result.score).toBeLessThanOrEqual(10);
   expect(result.score).toBe(result.checks.filter(c=>c.ok).length);
   expect(new Set(result.checks.map(c=>c.id)).size).toBe(10);
  }
  const documentation=fs.readFileSync('docs/PASTAS-E-CHECKLIST-SEO.md','utf8');
  expect(documentation).toMatch(/não.*(nota do Google|classificação do Google)|nota.*não.*Google/i);
 });
 it('grava o campo seoScore no frontmatter e é idempotente',()=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'cafematica-seo-'));
  try{
   fs.writeFileSync(path.join(root,'equacao-primeiro-grau.md'),article);
   const [first]=auditPosts(root,{write:true});
   const changed=fs.readFileSync(path.join(root,'equacao-primeiro-grau.md'),'utf8');
   expect(changed).toMatch(/^seoScore: [0-9]+$/m);
   expect(first.score).toBeGreaterThanOrEqual(0);
   const [second]=auditPosts(root,{write:true});
   expect(second.score).toBe(first.score);
   expect(fs.readFileSync(path.join(root,'equacao-primeiro-grau.md'),'utf8')).toBe(changed);
  } finally {fs.rmSync(root,{recursive:true,force:true});}
 });
 it('atualiza após salvar e não dispara commits quando a nota não mudou',()=>{
  const seoWorkflow=fs.readFileSync('.github/workflows/seo-checklist.yml','utf8');
  const moveWorkflow=fs.readFileSync('.github/workflows/pages-cms-move-post.yml','utf8');
  expect(seoWorkflow).toContain('node scripts/seo-score.mjs --write');
  expect(seoWorkflow).toContain('if git diff --cached --quiet; then');
  expect(moveWorkflow).toContain('node scripts/move-post.mjs');
  expect(moveWorkflow).toContain('workflow_dispatch:');
 });
});
