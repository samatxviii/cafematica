import DOMPurify from 'dompurify';
import { rawMarkdown } from '../lib/markdown.mjs';
import { getClient,config } from '../lib/client.js';
import katexStyles from 'katex/dist/katex.min.css?inline';
const $=id=>document.getElementById(id), form=$('editor');
const slugify=value=>String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,90);
let current=null,dirty=false,client,posts=[],busy=false,messageTimer;
function message(text,error=false){$('admin-message').textContent=text;$('admin-message').hidden=false;$('admin-message').classList.toggle('error',error);clearTimeout(messageTimer);messageTimer=setTimeout(()=>$('admin-message').hidden=true,error?14000:7000);}
function show(id){for(const part of ['setup-state','login-state','email-sent-state','unauthorized-state','dashboard'])$(part).hidden=part!==id;}
function values(){return Object.fromEntries(new FormData(form));}
function setBusy(value){busy=value;form.querySelectorAll('button').forEach(b=>b.disabled=value);$('publish-post').disabled=value||!current||dirty;}
function edited(){dirty=true;$('post-state').textContent='Alterações não salvas';$('publish-post').disabled=true;$('word-count').textContent=`${form.elements.body.value.trim().split(/\s+/).filter(Boolean).length} palavras`;}
function fill(post=null){current=post;form.reset();delete form.elements.slug.dataset.manual;for(const key of ['title','slug','category','description','body','youtube','cover'])if(post)form.elements[key].value=post[key]||'';form.elements.slug.readOnly=!!post?.published_at;dirty=false;$('editor-title').textContent=post?'Editar artigo':'Novo artigo';$('post-state').textContent=post?.publication_status==='queued'?'Enviado ao site':'Rascunho';$('publish-status').textContent=post?.publication_status==='queued'?'Enviado ao GitHub. A atualização do site pode levar alguns minutos.':'Salve e revise antes de publicar.';$('publish-post').disabled=!post;$('word-count').textContent=`${form.elements.body.value.trim().split(/\s+/).filter(Boolean).length} palavras`;showCover(post?.cover||'');document.querySelectorAll('.post-list-item').forEach(b=>b.classList.toggle('active',b.dataset.id===post?.id));}
function validCover(url){
 if(!url)return true;
 if(/^\/(?!\/)[a-zA-Z0-9/_.,-]+\.(?:avif|webp|png|jpe?g)$/i.test(url))return true;
 try{
  const image=new URL(url),backend=new URL(config.supabaseUrl);
  return image.origin===backend.origin && /^\/storage\/v1\/object\/public\/article-images\/[a-zA-Z0-9/._-]+$/i.test(image.pathname);
 }catch{return false;}
}
function showCover(url){
 const img=$('cover-preview');
 img.hidden=!url||!validCover(url);
 if(!img.hidden)img.src=url;else img.removeAttribute('src');
}
async function loadPosts(){const {data,error}=await client.from('cms_posts').select('*').order('updated_at',{ascending:false});if(error)throw error;posts=data||[];$('post-list').replaceChildren();if(!posts.length){const p=document.createElement('p');p.className='empty-state';p.textContent='Seu próximo artigo começa aqui.';$('post-list').append(p);}for(const post of posts){const b=document.createElement('button');b.className='post-list-item';b.dataset.id=post.id;const title=document.createElement('strong');title.textContent=post.title;const meta=document.createElement('small');meta.textContent=`${post.publication_status==='queued'?'Enviado':'Rascunho'} · ${new Date(post.updated_at).toLocaleDateString('pt-BR')}`;b.append(title,meta);b.onclick=()=>{if(dirty&&!confirm('Descartar as alterações que ainda não foram salvas?'))return;fill(post);};$('post-list').append(b);}}
async function enter(){
 const {data:{user},error}=await client.auth.getUser();
 if(error||!user){show('login-state');return;}
 const {data:admin,error:permissionError}=await client.rpc('is_admin');
 if(permissionError||!admin){show('unauthorized-state');return;}
 show('dashboard');await loadPosts();fill();
}
const authRedirect=new URL('/admin/',location.origin).href;
$('login-google').onclick=async()=>{
 const button=$('login-google');button.disabled=true;
 try{const {error}=await client.auth.signInWithOAuth({provider:'google',options:{redirectTo:authRedirect,scopes:'openid email profile'}});
 if(error)throw error;
 }catch(e){message('Não foi possível iniciar o login Google. Verifique se o provedor está habilitado no Supabase.',true);button.disabled=false;}
};
$('login-email-form').onsubmit=async e=>{
 e.preventDefault();const button=e.submitter;button.disabled=true;
 try{
 const email=new FormData(e.target).get('email')?.trim();
 const {error}=await client.auth.signInWithOtp({email,options:{emailRedirectTo:authRedirect,shouldCreateUser:true}});
 if(error)throw error;show('email-sent-state');
 }catch(e){message('Não foi possível enviar o link. Confira o e-mail e tente novamente.',true);}
 finally{button.disabled=false;}
};
$('back-to-login').onclick=()=>show('login-state');
async function signout(){
 if(dirty&&!confirm('Sair e descartar as alterações não salvas?'))return;
 const {error}=await client.auth.signOut();
 if(error){message('Não foi possível sair. Tente novamente.',true);return;}
 posts=[];fill();show('login-state');
}
$('signout').onclick=signout;
$('unauthorized-signout').onclick=signout;
$('new-post').onclick=()=>{if(dirty&&!confirm('Descartar as alterações não salvas?'))return;fill();form.elements.title.focus();};
form.addEventListener('input',e=>{if(e.target.name==='title'&&!current&&!form.elements.slug.dataset.manual)form.elements.slug.value=slugify(e.target.value);if(e.target.name==='slug')form.elements.slug.dataset.manual='true';if(e.target.name==='cover')showCover(e.target.value.trim());edited();});

const coverMime={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/avif':'avif'};
async function uploadImageFile(file){
 if(!file||!coverMime[file.type]||file.size>5242880)throw Error('Use uma imagem JPG, PNG, WebP ou AVIF de até 5 MB.');
 const {data:{user},error:authError}=await client.auth.getUser();
 if(authError||!user)throw Error('Entre novamente para enviar imagens.');
 const path=`${user.id}/${crypto.randomUUID()}.${coverMime[file.type]}`;
 const {error}=await client.storage.from('article-images').upload(path,file,{contentType:file.type,upsert:false,cacheControl:'3600'});
 if(error)throw error;
 const {data}=client.storage.from('article-images').getPublicUrl(path);
 if(!validCover(data.publicUrl))throw Error('O endereço da imagem não foi reconhecido.');
 return data.publicUrl;
}
$('cover-upload').onclick=async()=>{
 const file=$('cover-file').files[0];
 if(!file){message('Selecione um arquivo de imagem antes de enviar.',true);return;}
 const button=$('cover-upload');button.disabled=true;button.textContent='Enviando imagem...';
 try{
  const url=await uploadImageFile(file);
  form.elements.cover.value=url;showCover(url);edited();
  message('Imagem enviada. Salve o artigo para utilizar esta capa.');
 }catch(e){message(e.message||'Não foi possível enviar a imagem.',true);}
 finally{button.textContent='Enviar imagem';button.disabled=false;}
};
$('inline-image-file').onchange=async()=>{
 const picker=$('inline-image-file'),file=picker.files[0];if(!file)return;
 const area=form.elements.body,position=area.selectionStart;
 try{
  message('Enviando imagem do artigo...');
  const url=await uploadImageFile(file);
  const alt=prompt('Descrição da imagem para leitores e acessibilidade:','Imagem ilustrativa')||'Imagem ilustrativa';
  const cleaned=alt.split('[').join('').split(']').join('').replaceAll(String.fromCharCode(10),' ').replaceAll(String.fromCharCode(13),' ').slice(0,150);
  area.setRangeText('\n!['+cleaned+']('+url+')\n',position,position,'end');
  area.focus();edited();message('Imagem incluída no artigo. Salve o rascunho.');
 }catch(e){message(e.message||'Não foi possível enviar a imagem.',true);}
 finally{picker.value='';}
};
form.onsubmit=async e=>{e.preventDefault();if(busy)return;setBusy(true);try{const v=values();if(!validCover(v.cover?.trim()||''))throw Error('A capa deve ser uma imagem local ou enviada pelo próprio painel.');const {data,error}=await client.rpc('save_post_with_cover',{p_id:current?.id||null,p_version:current?.version||0,p_slug:v.slug,p_title:v.title,p_description:v.description,p_category:v.category,p_body:v.body,p_youtube:v.youtube||'',p_cover:v.cover?.trim()||''});if(error)throw error;dirty=false;await loadPosts();fill(data);message('Rascunho salvo.');}catch(e){message(e.message||'Não foi possível salvar.',true);}finally{setBusy(false);}};
$('publish-post').onclick=async()=>{if(busy||!current||dirty)return;if(!confirm('Publicar este artigo no site? O texto ficará disponível publicamente após a atualização.'))return;setBusy(true);try{const {data,error}=await client.functions.invoke('publish-post',{body:{id:current.id,version:current.version}});if(error){let detail;try{detail=await error.context?.json();}catch{}throw Error(detail?.error||'Não foi possível publicar. Verifique a configuração do serviço.');}if(data?.error)throw Error(data.error);await loadPosts();fill(posts.find(p=>p.id===current.id));$('publish-status').textContent=data.warning||'Artigo enviado ao GitHub. Aguarde a atualização do site e confira a página publicada.';message(data.warning||'Artigo enviado para publicação.');}catch(e){message(e.message,true);}finally{setBusy(false);}};
form.querySelectorAll('[data-format]').forEach(b=>b.onclick=()=>{const area=form.elements.body,start=area.selectionStart,end=area.selectionEnd,selection=area.value.slice(start,end);const formats={heading:['\n## ','Subtítulo','\n'],bold:['**','texto','**'],italic:['*','texto','*'],link:['[','texto','](https://exemplo.com)'],list:['\n- ','Primeiro item','\n- Segundo item\n'],math:['$','x^2 + 2x + 1','$'],code:['\n```\n','código','\n```\n']};if(b.dataset.format==='image'){$('inline-image-file').click();return;}const [before,placeholder,after]=formats[b.dataset.format];const body=selection||placeholder;area.setRangeText(before+body+after,start,end,'end');area.focus();area.setSelectionRange(start+before.length,start+before.length+body.length);edited();});
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
$('preview-post').onclick=()=>{const v=values();const html=DOMPurify.sanitize(rawMarkdown(v.body),{ADD_ATTR:['target'],FORBID_TAGS:['iframe','form','input','button','object','embed','style','script']});$('preview-frame').srcdoc=`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src https:; style-src 'unsafe-inline'; font-src ${location.origin};"><style>${katexStyles}body{max-width:740px;margin:40px auto;padding:0 24px;font:18px/1.8 Georgia,serif;color:#24342b}h1{font-size:38px;line-height:1.25}h2{margin-top:2em}pre{overflow:auto;padding:20px;background:#f4f4f0;font-size:14px}img{max-width:100%}a{color:#8a452e}.math-block{overflow:auto}</style></head><body><h1>${escape(v.title)}</h1><p>${escape(v.description)}</p><hr>${html}</body></html>`;$('preview-dialog').showModal();};
$('close-preview').onclick=()=>$('preview-dialog').close();
$('export-post').onclick=()=>{const v=values();const text=`---\n${Object.entries({title:v.title,slug:v.slug,description:v.description,category:v.category,cover:v.cover||'',published:false}).map(([k,v])=>`${k}: ${JSON.stringify(v)}`).join('\n')}\n---\n\n${v.body}\n`;const url=URL.createObjectURL(new Blob([text],{type:'text/markdown;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=`${slugify(v.slug||v.title)||'rascunho'}.md`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
async function loadComments(){const {data,error}=await client.from('comments').select('id,post_slug,display_name,body,status,created_at').eq('status',$('comments-filter').value).order('created_at',{ascending:false}).limit(100);if(error)throw error;$('moderation-list').replaceChildren();if(!data.length){$('moderation-list').textContent='Nenhum comentário nesta situação.';return;}for(const c of data){const card=document.createElement('article');card.className='moderation-card';const h=document.createElement('strong');h.textContent=c.display_name;const info=document.createElement('small');info.textContent=` · ${new Date(c.created_at).toLocaleString('pt-BR')} · ${c.post_slug}`;const body=document.createElement('p');body.textContent=c.body;const actions=document.createElement('div');actions.className='button-row';for(const [label,status] of [['Aprovar','approved'],['Recusar','rejected'],['Voltar à fila','pending']]){if(c.status===status)continue;const b=document.createElement('button');b.className='button secondary small-button';b.textContent=label;b.onclick=async()=>{b.disabled=true;const {error}=await client.rpc('moderate_comment',{p_id:c.id,p_status:status});if(error){message('Não foi possível moderar o comentário.',true);b.disabled=false;return;}await loadComments();};actions.append(b);}card.append(h,info,body,actions);$('moderation-list').append(card);}}
for(const name of ['posts','comments'])$('tab-'+name).onclick=async()=>{for(const n of ['posts','comments']){$(n+'-panel').hidden=n!==name;$('tab-'+n).setAttribute('aria-selected',String(n===name));}if(name==='comments')try{await loadComments();}catch{message('Não foi possível carregar os comentários.',true);}};
$('comments-filter').onchange=()=>loadComments().catch(()=>message('Não foi possível carregar os comentários.',true));
window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
async function init(){
 client=getClient();
 if(!client){show('setup-state');return;}
 show('login-state');
 client.auth.onAuthStateChange(event=>{if(event==='SIGNED_OUT')show('login-state');});
 // A sessão é verificada pelo servidor a cada entrada; jamais pela presença de um token local.
 await enter();
}
init().catch(()=>{show('login-state');message('Não foi possível abrir o painel. Verifique sua conexão e tente novamente.',true);});
