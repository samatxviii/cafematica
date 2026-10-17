import { createClient } from 'npm:@supabase/supabase-js@2.117.3';
import { postMarkdown } from '../_shared/publish.ts';
const get = (key: string) => { const value=Deno.env.get(key); if(!value) throw new Error(`Configuração ausente: ${key}`); return value; };
Deno.serve(async (req: Request) => {
 const origin=req.headers.get('origin')||'';
 const allowed=(Deno.env.get('ADMIN_ORIGINS')||'https://www.cafematica.com.br').split(',').map(x=>x.trim()).filter(Boolean);
 const headers={'Access-Control-Allow-Origin':allowed.includes(origin)?origin:'null','Access-Control-Allow-Headers':'authorization, apikey, content-type, x-client-info','Access-Control-Allow-Methods':'POST, OPTIONS','Vary':'Origin','Content-Type':'application/json','Cache-Control':'no-store'};
 const reply=(status:number,data:any)=>new Response(JSON.stringify(data),{status,headers});
 if(!allowed.includes(origin))return reply(403,{error:'Origem não autorizada.'});
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
 if(req.method!=='POST')return reply(405,{error:'Método inválido.'});
 let service:any, id:string|undefined, publishToken:string|undefined, commitCreated=false;
 try {
  const authorization=req.headers.get('authorization')||'';
  const token=authorization.startsWith('Bearer ')?authorization.slice(7).trim():'';
  if(!token)return reply(401,{error:'Sessão não encontrada. Entre novamente.'});
  const sessionClient=createClient(get('SUPABASE_URL'),get('SUPABASE_ANON_KEY'),{global:{headers:{Authorization:authorization}},auth:{persistSession:false}});
  const {data:{user},error:authError}=await sessionClient.auth.getUser(token);
  if(authError||!user)return reply(401,{error:'Sessão expirada. Entre novamente.'});
  const {data:admin,error:adminError}=await sessionClient.rpc('is_admin');
  if(adminError||!admin)return reply(403,{error:'Acesso restrito ao administrador.'});
  const payload=await req.json(); id=payload.id;
  if(typeof id!=='string'||!Number.isInteger(payload.version))return reply(400,{error:'Artigo ou versão inválidos.'});
  service=createClient(get('SUPABASE_URL'),get('SUPABASE_SERVICE_ROLE_KEY'),{auth:{persistSession:false}});
  publishToken=crypto.randomUUID();
  const {data:post,error:claimError}=await service.rpc('claim_publication',{p_id:id,p_version:payload.version,p_token:publishToken});
  if(claimError)throw new Error('O artigo mudou ou está sendo publicado. Reabra e tente novamente.');
  const now=new Date().toISOString(); const content=postMarkdown(post,now);
  const repo=Deno.env.get('GITHUB_REPOSITORY')||'samatxviii/cafematica'; const branch=Deno.env.get('GITHUB_BRANCH')||'main';
  if(!/^[\w.-]+\/[\w.-]+$/.test(repo))throw new Error('Repositório inválido.');
  const github=async(path:string,method='GET',body?:any)=>{
   const response=await fetch(`https://api.github.com/repos/${repo}/${path}`,{method,headers:{Authorization:`Bearer ${get('GITHUB_TOKEN')}`,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json'},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(25000)});
   if(!response.ok)throw new Error(`GitHub não concluiu a publicação (${response.status}).`);
   return response.json();
  };
  const ref=await github(`git/ref/heads/${encodeURIComponent(branch)}`);
  const head=await github(`git/commits/${ref.object.sha}`);
  // Preflight path ownership: never replace an unrelated article with the same slug.
  const existing=await fetch(`https://api.github.com/repos/${repo}/contents/content/posts/${post.slug}.md?ref=${encodeURIComponent(branch)}`,{headers:{Authorization:`Bearer ${get('GITHUB_TOKEN')}`,Accept:'application/vnd.github.raw+json'},signal:AbortSignal.timeout(25000)});
  if(existing.ok){
   const text=await existing.text();
   if(!new RegExp(`^cmsId: ["']?${post.id}["']?$`,'m').test(text))throw new Error('Este endereço pertence a outro artigo. Importe o artigo existente ou escolha outro endereço.');
  } else if(existing.status!==404)throw new Error('Não foi possível verificar o endereço no GitHub.');
  const tree=await github('git/trees','POST',{base_tree:head.tree.sha,tree:[{path:`content/posts/${post.slug}.md`,mode:'100644',type:'blob',content}]});
  const commit=await github('git/commits','POST',{message:`Publica artigo: ${post.title.replace(/[\r\n]/g,' ')}`,tree:tree.sha,parents:[ref.object.sha]});
  await github(`git/refs/heads/${encodeURIComponent(branch)}`,'PATCH',{sha:commit.sha,force:false});
  commitCreated=true;
  const {error:finishError}=await service.rpc('complete_publication',{p_id:id,p_token:publishToken,p_sha:commit.sha,p_date:now});
  if(finishError)return reply(202,{queued:true,sha:commit.sha,warning:'Artigo enviado ao GitHub. O registro no painel precisa ser sincronizado; não publique novamente antes de verificar.'});
  return reply(202,{queued:true,sha:commit.sha,url:`https://www.cafematica.com.br/blog/${post.slug}/`});
 } catch(error) {
  // Preserve state after a successful GitHub commit; a retry must not falsely claim nothing happened.
  if(service&&id&&publishToken&&!commitCreated)await service.from('cms_posts').update({publish_lock_until:null,publish_token:null}).eq('id',id).eq('publish_token',token);
  const message=error instanceof Error?error.message:'Falha na publicação.';
  return reply(400,{error:message});
 }
});
