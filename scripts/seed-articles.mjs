// Import only the initial public articles. This never exports private database drafts.
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import matter from 'gray-matter';
const sqlString=value=>"'"+String(value).replace(/'/g,"''")+"'";
let sql='-- Initial public content, with stable content IDs independent of database-generated IDs.\n';
for(const file of fs.readdirSync('content/posts').filter(f=>f.endsWith('.md'))){
 const name='content/posts/'+file;const {data,content}=matter(fs.readFileSync(name,'utf8'));
 if(!data.published)continue;
 const hex=createHash('sha256').update('cafematica:'+data.slug).digest('hex');
 data.cmsId ||= `${hex.slice(0,8)}-${hex.slice(8,12)}-4${hex.slice(13,16)}-a${hex.slice(17,20)}-${hex.slice(20,32)}`;data.cmsVersion ||= 1;
 fs.writeFileSync(name,'---\n'+Object.entries(data).map(([k,v])=>`${k}: ${JSON.stringify(v)}`).join('\n')+'\n---\n'+content);
 const vals=[data.cmsId,data.slug,data.title,data.description,data.category,content.trim(),data.youtube||'',data.date+'T12:00:00-03:00'].map(sqlString);
 sql+=`insert into public.cms_posts(id,slug,title,description,category,body,youtube,published_at,publication_status,queued_version) values(${vals.join(',')},'queued',1) on conflict(slug) do nothing;\n`;
 sql+=`insert into public.published_posts(slug,title,published_at) values(${[data.slug,data.title,data.date+'T12:00:00-03:00'].map(sqlString).join(',')}) on conflict(slug) do nothing;\n`;
}
const target=fs.readdirSync('supabase/migrations').find(f=>f.endsWith('_initial_articles.sql'));
if(!target)throw Error('Crie a migração initial_articles com a CLI do Supabase primeiro.');
fs.writeFileSync('supabase/migrations/'+target,sql);console.log('Migração dos artigos iniciais sincronizada.');
