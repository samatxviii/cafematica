import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { renderMarkdown } from './render.mjs';
import {normalizeTags,normalizeSources} from './seo.mjs';
export const categories = {
  matematica: { name: 'Matemática', symbol: 'π', color: 'sage', description: 'Entenda o raciocínio. Ganhe confiança para resolver.', intro: 'Da base aos problemas de prova: explicações, exemplos resolvidos e exercícios para você construir conhecimento, uma ideia de cada vez.' },
  latex: { name: 'LaTeX', symbol: '{ }', color: 'sand', description: 'Dê forma às suas ideias, com precisão.', intro: 'Aprenda a escrever fórmulas, organizar documentos e criar materiais didáticos com exemplos que você pode adaptar.' },
  tecnologia: { name: 'Tecnologia', symbol: '⌘', color: 'lavender', description: 'Ferramentas que fazem diferença no seu dia.', intro: 'Tutoriais com propósito: ensinar, estudar, produzir e usar a tecnologia com mais autonomia.' }
};
export function normalizePostDate(value) {
  const date = value instanceof Date ? (Number.isNaN(value.getTime()) ? '' : value.toISOString().slice(0,10)) : String(value ?? '').slice(0,10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('Data de publicação inválida. Use AAAA-MM-DD.');
  return date;
}
/** A pasta física é apenas organização editorial; a URL pública usa o slug. */
export function listPostFiles(directory) {
  return fs.readdirSync(directory,{withFileTypes:true}).flatMap(item=>{
    const full=path.join(directory,item.name);
    return item.isDirectory() ? listPostFiles(full) : item.isFile() && item.name.endsWith('.md') ? [full] : [];
  }).sort((a,b)=>a.localeCompare(b));
}
export function getPosts(directory=path.join(process.cwd(),'content/posts')) {
  const dir = directory;
  const posts=listPostFiles(dir).map(file=>{
    const { data, content }=matter(fs.readFileSync(file,'utf8'));
    if(!data.slug || !categories[data.category]) throw new Error(`Metadados inválidos: ${file}`);
    const firstImage=content.match(/!\[[^\]]*\]\((\/[^)\s]+\.(?:png|jpe?g|webp|avif))\)/i)?.[1]||'';
    return {...data, cover:data.cover||data.image||firstImage, tags:normalizeTags(data.tags), sources:normalizeSources(data.sources), updated:data.updated?normalizePostDate(data.updated):undefined, date: normalizePostDate(data.date), body:content, html:renderMarkdown(content), minutes:Math.max(2,Math.ceil(content.split(/\s+/).length/180)), categoryInfo:categories[data.category]};
  });
  const slugs=new Set();
  for(const post of posts){
    if(slugs.has(post.slug))throw new Error('Slug duplicado em pastas diferentes: '+post.slug);
    slugs.add(post.slug);
  }
  return posts.filter(p=>p.published===true).sort((a,b)=>b.date.localeCompare(a.date)||a.title.localeCompare(b.title));
}
export const dateLabel = value => new Date(`${String(value).slice(0,10)}T12:00:00-03:00`).toLocaleDateString('pt-BR',{day:'numeric',month:'long',year:'numeric'});
