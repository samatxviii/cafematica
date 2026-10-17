import {describe,it,expect} from 'vitest';
import fs from 'node:fs';
import {articleSeoMetadata,normalizeTags,normalizeSources} from '../src/lib/seo.mjs';

const settings={
  siteUrl:'https://www.cafematica.com.br',
  supabaseUrl:'https://bgzxqfslersfmsluuszs.supabase.co',
  pathname:'/blog/equacao-primeiro-grau/',
  title:'Equação do primeiro grau',
  description:'Aprenda a resolver uma equação de primeiro grau.'
};
describe('SEO editorial do Cafemática',()=>{
 it('mantém título, resumo e arte padrão para artigos antigos',()=>{
  const result=articleSeoMetadata({...settings,article:{title:settings.title,date:'2026-10-12',category:'matematica'}});
  expect(result.title).toBe('Equação do primeiro grau | Cafemática');
  expect(result.description).toBe(settings.description);
  expect(result.image).toBe('https://www.cafematica.com.br/og-cafematica.png');
  expect(result.schema['@type']).toBe('BlogPosting');
  expect(result.schema.headline).toBe(settings.title);
  expect(result.schema.datePublished).toBe('2026-10-12');
  expect(result.schema.author.name).toBe('Fernando da Silva Batista');
  expect(result.schema.image).toBeUndefined();
 });
 it('usa título editorial específico sem modificar a manchete visível',()=>{
  const result=articleSeoMetadata({...settings,article:{
    title:settings.title,seoTitle:'Resolver equações do 1º grau: exemplos',
    seoDescription:'Passo a passo com exemplos resolvidos.',
    cover:'/imagens/blog/aula.webp',coverAlt:'Equação escrita em um caderno',
    date:'2026-10-12',updated:'2026-10-17',tags:['Álgebra','Equações'],
    author:'Fernando da Silva Batista',categoryInfo:{name:'Matemática'},
    sources:[{title:'Referência',url:'https://example.org/guia'}]
  }});
  expect(result.title).toBe('Resolver equações do 1º grau: exemplos | Cafemática');
  expect(result.description).toBe('Passo a passo com exemplos resolvidos.');
  expect(result.image).toBe('https://www.cafematica.com.br/imagens/blog/aula.webp');
  expect(result.imageAlt).toBe('Equação escrita em um caderno');
  expect(result.schema.headline).toBe(settings.title);
  expect(result.schema.image).toEqual([result.image]);
  expect(result.schema.keywords).toBe('Álgebra, Equações');
  expect(result.schema.dateModified).toBe('2026-10-17');
  expect(result.schema.citation).toEqual(['https://example.org/guia']);
 });
 it('rejeita tags repetidas, fontes inseguras e imagens arbitrárias',()=>{
  expect(normalizeTags(['Matemática',' matemática  ','Álgebra','',123])).toEqual(['Matemática','Álgebra']);
  expect(normalizeSources([{title:'Ataque',url:'javascript:alert(1)'},{title:'Livro',url:'https://example.org/livro'}])).toEqual([{title:'Livro',url:'https://example.org/livro'}]);
  const result=articleSeoMetadata({...settings,article:{title:settings.title,date:'2026-10-12',cover:'https://evil.example/og.png'}});
  expect(result.image).toContain('/og-cafematica.png');
 });
 it('o Pages CMS expõe campos SEO sem exigir alteração em artigos existentes',()=>{
  const yaml=fs.readFileSync('.pages.yml','utf8');
  for(const field of ['seoTitle','seoDescription','tags','coverAlt','author','updated','quickAnswer','sources']){
    expect(yaml).toContain('name: '+field);
  }
  expect(yaml).toContain('list:');
  expect(yaml).toContain('default: ""');
  expect(yaml).not.toContain('name: keywords');
 });
});
