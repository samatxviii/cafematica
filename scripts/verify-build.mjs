import fs from 'node:fs';
import path from 'node:path';
import { parseHTML } from 'linkedom';
const root=path.resolve('dist');
const expected=['index.html','blog/index.html','sobre/index.html','contato/index.html','privacidade/index.html','cookies/index.html','termos/index.html','admin/index.html','404.html','robots.txt','sitemap-index.xml','feed.xml','CNAME'];
const errors=[];for(const f of expected)if(!fs.existsSync(path.join(root,f)))errors.push(`Ausente: ${f}`);
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(f=>f.isDirectory()?walk(path.join(dir,f.name)):[path.join(dir,f.name)]);
const html=walk(root).filter(f=>f.endsWith('.html')&&!['/agendar/','/exercicio/','/estudos/'].some(n=>f.includes(n))&&!/\/(agenda|agendar|rifa|whatsapp)\.html$/.test(f));
for(const file of html){const {document}=parseHTML(fs.readFileSync(file,'utf8'));if(!document.querySelector('title')?.textContent)errors.push(`Sem título: ${file}`);if(!document.querySelector('h1'))errors.push(`Sem h1: ${file}`);if(!document.querySelector('meta[name="robots"]'))errors.push(`Sem robots: ${file}`);if(!file.includes('/admin/')){if(!document.querySelector('meta[name="description"]')?.getAttribute('content'))errors.push(`Sem resumo: ${file}`);if(!document.querySelector('link[rel="canonical"]'))errors.push(`Sem canonical: ${file}`);}
 for(const el of document.querySelectorAll('a[href],img[src],script[src],link[href]')){const ref=el.getAttribute('href')||el.getAttribute('src');if(!ref.startsWith('/')||ref.startsWith('//'))continue;const clean=decodeURI(ref.split(/[?#]/)[0]);const dest=path.join(root,clean);if(!fs.existsSync(dest)||fs.statSync(dest).isDirectory()&&!fs.existsSync(path.join(dest,'index.html')))errors.push(`Link ausente ${ref} em ${path.relative(root,file)}`);}
 for(const script of document.querySelectorAll('script[type="application/ld+json"]')){try{JSON.parse(script.textContent);}catch{errors.push(`JSON-LD inválido: ${file}`);}}
 if(document.querySelector('script[src*="pagead2"]'))errors.push('Publicidade não deve ser ativada nesta entrega.');
}
for(const directory of ['src','content','supabase','membros','node_modules','.git'])if(fs.existsSync(path.join(root,directory)))errors.push(`Código interno no pacote público: ${directory}`);
if(errors.length){console.error([...new Set(errors)].join('\n'));process.exit(1);}console.log(`${html.length} páginas verificadas: títulos, links locais, metadados e separação do código interno.`);
