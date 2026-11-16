import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
const root=process.cwd();
const entries=JSON.parse(readFileSync(join(root,'src/data/enem2026.json'),'utf8'));
const failures=[];
const colors=['amarela','cinza','azul','verde'];
const expected=Array.from({length:45},(_,i)=>i+136);
if(entries.length!==45) failures.push(`Esperadas 45 questões; recebidas ${entries.length}`);
for(const color of colors){
  const numbers=entries.map(q=>q[color]).sort((a,b)=>a-b);
  if(JSON.stringify(numbers)!==JSON.stringify(expected)) failures.push(`Numeração incompleta ou duplicada no caderno ${color}`);
}
const slugs=new Set();
let alternatives=0;
for(const q of entries){
  const slug=`amarela-${q.amarela}-cinza-${q.cinza}-azul-${q.azul}-verde-${q.verde}`;
  if(q.slug!==slug||slugs.has(slug)) failures.push(`Slug inválido ou duplicado: ${q.slug}`);
  slugs.add(slug);
  if(typeof q.bodyHtml!=='string'||!q.bodyHtml.trim()) failures.push(`Enunciado ausente: ${q.amarela}`);
  if(!Array.isArray(q.options)||q.options.length!==5) failures.push(`Alternativas incompletas: ${q.amarela}`);
  if(![1,2,3,5].includes(q.cols)) failures.push(`Colunas inválidas: ${q.amarela}`);
  for(const html of [q.bodyHtml,...q.options.map(x=>x.html||'')]){
    if(/<script\b|\son\w+\s*=|javascript:/i.test(html))failures.push(`Conteúdo HTML potencialmente inseguro: ${q.amarela}`);
  }
  const paths=[...q.bodyHtml.matchAll(/src="(\/imagens\/enem2026\/[^" ]+)"/g)].map(x=>x[1]);
  for(const opt of q.options){
    alternatives++;
    if(opt.kind==='image'&&opt.src)paths.push(opt.src);
    if(opt.kind==='html'&&!opt.html?.trim())failures.push(`Alternativa vazia: ${q.amarela}`);
  }
  for(const url of paths){
    if(!/^\/imagens\/enem2026\/[0-9]+-[0-9]+\.png$/.test(url)||!existsSync(join(root,'public',url.slice(1))))failures.push(`Figura ausente ou inválida: ${url}`);
  }
}
const imageDir=join(root,'public/imagens/enem2026');
if(!existsSync(imageDir))failures.push('Diretório de figuras ausente');
else if(readdirSync(imageDir).filter(x=>x.endsWith('.png')).length!==40)failures.push('Esperadas 40 figuras PNG fornecidas');
if(alternatives!==225)failures.push(`Esperadas 225 alternativas; recebidas ${alternatives}`);
if(failures.length){console.error([...new Set(failures)].join('\n'));process.exit(1)}
console.log('ENEM 2026: 45 páginas, numeração das quatro cores, 225 alternativas e 40 imagens conferidas.');