import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { renderMarkdown } from './render.mjs';
export const categories = {
  matematica: { name: 'Matemática', symbol: 'π', color: 'sage', description: 'Entenda o raciocínio. Ganhe confiança para resolver.', intro: 'Da base aos problemas de prova: explicações, exemplos resolvidos e exercícios para você construir conhecimento, uma ideia de cada vez.' },
  latex: { name: 'LaTeX', symbol: '{ }', color: 'sand', description: 'Dê forma às suas ideias, com precisão.', intro: 'Aprenda a escrever fórmulas, organizar documentos e criar materiais didáticos com exemplos que você pode adaptar.' },
  tecnologia: { name: 'Tecnologia', symbol: '⌘', color: 'lavender', description: 'Ferramentas que fazem diferença no seu dia.', intro: 'Tutoriais com propósito: ensinar, estudar, produzir e usar a tecnologia com mais autonomia.' }
};
export function getPosts() {
  const dir = path.join(process.cwd(),'content/posts');
  return fs.readdirSync(dir).filter(f=>f.endsWith('.md')).map(file=>{
    const { data, content }=matter(fs.readFileSync(path.join(dir,file),'utf8'));
    if(!data.slug || !categories[data.category]) throw new Error(`Metadados inválidos: ${file}`);
    const firstImage=content.match(/!\\[[^\\]]*\\]\\((\\/[^)\\s]+\\.(?:png|jpe?g|webp|avif))\\)/i)?.[1]||'';
    return {...data, cover:data.cover||data.image||firstImage, date: String(data.date), body:content, html:renderMarkdown(content), minutes:Math.max(2,Math.ceil(content.split(/\s+/).length/180)), categoryInfo:categories[data.category]};
  }).filter(p=>p.published===true).sort((a,b)=>b.date.localeCompare(a.date)||a.title.localeCompare(b.title));
}
export const dateLabel = value => new Date(`${String(value).slice(0,10)}T12:00:00-03:00`).toLocaleDateString('pt-BR',{day:'numeric',month:'long',year:'numeric'});
