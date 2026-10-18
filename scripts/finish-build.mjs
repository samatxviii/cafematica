import fs from 'node:fs';
import path from 'node:path';
import { getPosts } from '../src/lib/content.mjs';
import { addArticleLastmod } from './article-sitemap.mjs';
import config from '../config/site.json' with {type:'json'};
const root=process.cwd(),out=path.join(root,'dist');
// Keep existing public tools and their URLs. Application source is never copied.
const legacy=['CNAME','og-cafematica.png','agenda.html','agendar.html','agendar','rifa.html','whatsapp.html','exercicio','estudos','aac'];
for(const name of legacy){if(fs.existsSync(name))fs.cpSync(name,path.join(out,name),{recursive:true});}
fs.writeFileSync(path.join(out,'.nojekyll'),'');
const noindex=['agenda.html','agendar.html','agendar/agendamento.html','rifa.html','whatsapp.html'];
for(const file of noindex){const dest=path.join(out,file);if(fs.existsSync(dest))fs.writeFileSync(dest,fs.readFileSync(dest,'utf8').replace(/<head([^>]*)>/i,'<head$1><meta name="robots" content="noindex, follow">'));}
const xml=s=>String(s).replace(/[<>&"']/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]));
const posts=getPosts();
// Astro gera as URLs; apenas as datas reais de atualização vêm do CMS.
for (const name of fs.readdirSync(out).filter(file => /^sitemap-\d+\.xml$/.test(file))) {
  const file = path.join(out, name);
  fs.writeFileSync(file, addArticleLastmod(fs.readFileSync(file, 'utf8'), posts, config.url));
}
fs.writeFileSync(path.join(out,'feed.xml'),`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Cafemática</title><link>${config.url}</link><description>Matemática, LaTeX e tecnologia.</description><language>pt-BR</language>${posts.map(p=>`<item><title>${xml(p.title)}</title><link>${config.url}/blog/${p.slug}/</link><guid>${config.url}/blog/${p.slug}/</guid><description>${xml(p.description)}</description><pubDate>${new Date(p.date+'T12:00:00-03:00').toUTCString()}</pubDate></item>`).join('')}</channel></rss>`);
fs.writeFileSync(path.join(out,'robots.txt'),`User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /membros/\nDisallow: /blog/2026-05/\nDisallow: /content/\nDisallow: /src/\nDisallow: /supabase/\nDisallow: /tests/\nSitemap: ${config.url}/sitemap-index.xml\n`);
if(config.adsensePublisherId){if(!/^ca-pub-\d{16}$/.test(config.adsensePublisherId))throw Error('ID do AdSense inválido.');fs.writeFileSync(path.join(out,'ads.txt'),`google.com, ${config.adsensePublisherId.replace('ca-','')}, DIRECT, f08c47fec0942fa0\n`);}
fs.writeFileSync(path.join(out,'publication.json'),JSON.stringify({articles:posts.map(p=>({slug:p.slug,version:p.cmsVersion||null,id:p.cmsId||null})),builtAt:new Date().toISOString()},null,2)+'\n');
console.log(`Conteúdo estático pronto: ${posts.length} artigos; URLs anteriores preservadas.`);
