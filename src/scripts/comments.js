import {getClient,config} from '../lib/client.js';
const wrap=document.querySelector('[data-comments]');
if(wrap){
 const client=config.commentsEnabled?getClient():null,status=wrap.querySelector('[data-comments-status]'),list=wrap.querySelector('[data-comments-list]'),auth=wrap.querySelector('[data-auth-box]'),form=wrap.querySelector('[data-comment-form]');
 const message=(text,error=false)=>{status.textContent=text;status.classList.toggle('error',error);status.hidden=!text;};
 if(!client){message('Os comentários serão abertos em breve. Enquanto isso, envie sua dúvida pelo contato do site.');}
 else{
 let user=null;const refreshAuth=async()=>{const {data}=await client.auth.getUser();user=data.user;auth.hidden=!!user;form.hidden=!user;wrap.querySelector('[data-user-name]').textContent=user?`Comentando como ${user.user_metadata?.full_name||user.user_metadata?.name||'leitor'}`:'';};
 async function load(){const {data,error}=await client.from('comments').select('id,display_name,body,created_at').eq('post_slug',wrap.dataset.slug).eq('status','approved').order('created_at',{ascending:false}).limit(100);if(error){message('Não foi possível carregar os comentários agora. Tente novamente mais tarde.',true);return;}list.replaceChildren();for(const c of data||[]){const item=document.createElement('article');item.className='comment';const top=document.createElement('div');top.className='comment-top';const name=document.createElement('strong');name.textContent=c.display_name;const time=document.createElement('span');time.textContent=new Date(c.created_at).toLocaleDateString('pt-BR');top.append(name,time);const body=document.createElement('p');body.className='comment-body';body.textContent=c.body;item.append(top,body);list.append(item);}message(data?.length?'':'Seja a primeira pessoa a compartilhar uma dúvida sobre este artigo.');}
 wrap.querySelector('[data-google-login]').addEventListener('click',async()=>{const {error}=await client.auth.signInWithOAuth({provider:'google',options:{redirectTo:location.origin+location.pathname}});if(error)message('Não foi possível iniciar o login. Tente novamente.',true);});
 wrap.querySelector('[data-signout]').addEventListener('click',async()=>{await client.auth.signOut();await refreshAuth();});
 form.addEventListener('submit',async e=>{e.preventDefault();const button=form.querySelector('button[type=submit]');button.disabled=true;const body=form.elements.body.value.trim();try{const {error}=await client.rpc('submit_comment',{p_slug:wrap.dataset.slug,p_body:body});if(error)throw error;form.reset();message('Comentário enviado! Ele aparecerá depois da aprovação.');}catch(err){message(err.message?.includes('Aguarde')?'Aguarde um minuto antes de enviar outro comentário.':'Não foi possível enviar. Verifique se entrou com Google e tente novamente.',true);}finally{button.disabled=false;}});
 client.auth.onAuthStateChange(()=>{setTimeout(refreshAuth,0);});refreshAuth();load();
 }
}
