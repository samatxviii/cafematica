/**
 * Checklist SEO editorial do Cafemática.
 * Não é uma nota do Google nem prevê indexação, posições ou citações por IA.
 * São 10 verificações automáticas de completude e estrutura, descritas em docs/PASTAS-E-CHECKLIST-SEO.md.
 */
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const POSTS_ROOT=path.resolve('content/posts');
const SITE_PUBLIC=path.resolve('public');

function listPostFiles(directory) {
  return fs.readdirSync(directory,{withFileTypes:true}).flatMap(item=>{
    const filename=path.join(directory,item.name);
    return item.isDirectory() ? listPostFiles(filename) : item.isFile() && filename.endsWith('.md') ? [filename] : [];
  }).sort((a,b)=>a.localeCompare(b));
}

const text=(v)=>typeof v==='string'?v.trim():'';
const canonical=(v)=>text(v).toLocaleLowerCase('pt-BR');
const safeDate=(v)=>v instanceof Date&&!Number.isNaN(v.getTime())?v.toISOString().slice(0,10):text(v).slice(0,10);
const countH2=(s)=>(s.match(/^## [^\n]+/gm)||[]).length;
const safeCover=(v)=>{
  const cover=text(v);
  if(/^\/(?!\/)[\p{L}\p{N}/_.,-]+\.(?:jpe?g|png|webp|avif)$/iu.test(cover) && !cover.split('/').some(part=>part==='.'||part==='..')) {
    const full=path.resolve(SITE_PUBLIC,'.'+cover);
    return full.startsWith(SITE_PUBLIC+path.sep)&&fs.existsSync(full);
  }
  if(/^https:\/\/bgzxqfslersfmsluuszs\.supabase\.co\/storage\/v1\/object\/public\/article-images\/[a-zA-Z0-9/._-]+\.(?:jpe?g|png|webp|avif)$/i.test(cover))return true;
  return false;
};

export function calculateSeoChecklist(data,body,allArticles=[]) {
  const slug=text(data.slug);
  const title=text(data.title);
  const seoTitle=text(data.seoTitle);
  const description=text(data.seoDescription);
  const others=allArticles.filter(p=>p.data!==data);
  const unique=(name,v)=>v&&!others.some(p=>canonical(p.data[name])===canonical(v));
  const internalLinks=[...body.matchAll(/\]\(\/blog\/([a-z0-9-]+)\/(?:#[^\s)]*)?\)/g)];
  const validSlugs=new Set(allArticles.map(p=>text(p.data.slug)));
  const sources=Array.isArray(data.sources)?data.sources:[];
  const sourcesValid=sources.length>0&&sources.every(source=>{
    if(!text(source?.title)||!text(source?.url))return false;
    try{return new URL(source.url).protocol==='https:'}catch{return false}
  });
  const dated=/^\d{4}-\d{2}-\d{2}$/.test(safeDate(data.date));
  const checks=[
    {id:'title',label:'Título SEO descritivo e exclusivo',ok:seoTitle.length>=15&&seoTitle.length<=75&&unique('seoTitle',seoTitle)},
    {id:'description',label:'Descrição SEO preenchida e exclusiva',ok:description.length>=60&&description.length<=180&&unique('seoDescription',description)},
    {id:'headline',label:'Título principal visível e compreensível',ok:title.length>=12&&title.length<=160&&unique('title',title)},
    {id:'url',label:'Slug único e estável para URL canônica',ok:/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)&&unique('slug',slug)},
    {id:'sections',label:'Conteúdo organizado em seções',ok:countH2(body)>=2},
    {id:'internal',label:'Ao menos um link interno válido para outro artigo',ok:internalLinks.some(m=>m[1]!==slug&&validSlugs.has(m[1]))},
    {id:'sources',label:'Fontes identificadas com links HTTPS válidos',ok:sourcesValid},
    {id:'quickAnswer',label:'Resposta curta presente e clara',ok:text(data.quickAnswer).length>=80&&text(data.quickAnswer).length<=600},
    {id:'author',label:'Autoria e data de publicação identificadas',ok:text(data.author).length>=4&&dated},
    {id:'image',label:'Imagem de capa disponível com texto alternativo',ok:safeCover(data.cover)&&text(data.coverAlt).length>=12&&text(data.coverAlt).length<=180}
  ];
  return {score:checks.filter(c=>c.ok).length,total:10,checks};
}

export function auditPosts(directory=POSTS_ROOT,{write=false}={}) {
  const files=listPostFiles(directory);
  const allArticles=files.map(file=>{
    const original=fs.readFileSync(file,'utf8');
    const {data,content}=matter(original);
    return {file,data,content,original};
  });
  const results=[];
  for(const article of allArticles){
    const result=calculateSeoChecklist(article.data,article.content,allArticles);
    if(write&&article.data.seoScore!==result.score){
      const position=article.original.indexOf('\n---',4);
      if(!article.original.startsWith('---\n')||position<0)throw new Error('Frontmatter inválido: '+article.file);
      const top=article.original.slice(0,position);
      const fixed=/^seoScore:\s*.*$/m.test(top)?
        top.replace(/^seoScore:\s*.*$/m,'seoScore: '+result.score):
        top+'\nseoScore: '+result.score;
      fs.writeFileSync(article.file,fixed+article.original.slice(position),'utf8');
    }
    results.push({file:path.relative(directory,article.file).replace(/\\/g,'/'),...result});
  }
  return results;
}

if(process.argv[1]&&path.resolve(process.argv[1])===path.resolve(new URL(import.meta.url).pathname)){
  const write=process.argv.includes('--write');
  const result=auditPosts(POSTS_ROOT,{write});
  for(const item of result){
    const failed=item.checks.filter(c=>!c.ok).map(c=>c.label);
    console.log(item.file+': '+item.score+'/10'+(failed.length?' — pendências: '+failed.join('; '):' — checklist completo'));
  }
  console.log((write?'Notas atualizadas':'Avaliação concluída')+': '+result.length+' artigos.');
}
