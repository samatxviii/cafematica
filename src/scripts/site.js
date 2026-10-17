const menu=document.querySelector('.menu-toggle');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');document.querySelector('.main-nav')?.classList.toggle('is-open',open);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu?.setAttribute('aria-expanded','false');menu?.setAttribute('aria-label','Abrir menu');document.querySelector('.main-nav')?.classList.remove('is-open');}});
const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const blog=document.querySelector('[data-blog]');
if(blog){let category='all';const input=blog.querySelector('#article-search');const cards=[...blog.querySelectorAll('[data-search]')];function filter(){let n=0;for(const card of cards){const match=(category==='all'||card.dataset.category===category)&&normalize(card.dataset.search).includes(normalize(input.value.trim()));card.hidden=!match;if(match)n++;}blog.querySelector('[data-empty]').hidden=n>0;blog.querySelector('[data-result-count]').textContent=`${n} ${n===1?'artigo encontrado':'artigos encontrados'}`;}input.addEventListener('input',filter);blog.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{category=button.dataset.filter;blog.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));filter();}));}
const topicSelect=document.querySelector('#article-topic');
const sortSelect=document.querySelector('#article-sort');
if(blog&&topicSelect&&sortSelect){
  let topics={};
  try{topics=JSON.parse(document.querySelector('#blog-topics')?.textContent||'{}')}catch{}
  const grid=blog.querySelector('.post-grid');
  const cards=[...grid.querySelectorAll('.post-card')];
  const refresh=()=>{
    const active=blog.querySelector('[data-filter][aria-pressed="true"]')?.dataset.filter||'all';
    const query=normalize(blog.querySelector('#article-search').value.trim());
    let count=0;
    cards.forEach(card=>{
      const show=(active==='all'||card.dataset.category===active)&&(topicSelect.value==='all'||card.dataset.topic===topicSelect.value)&&normalize(card.dataset.search).includes(query);
      card.hidden=!show;if(show)count++;
    });
    const sorted=[...cards].sort((a,b)=>sortSelect.value==='title'?a.dataset.title.localeCompare(b.dataset.title,'pt-BR'):sortSelect.value==='oldest'?a.dataset.date.localeCompare(b.dataset.date):b.dataset.date.localeCompare(a.dataset.date));
    grid.append(...sorted);
    blog.querySelector('[data-empty]').hidden=count>0;
    blog.querySelector('[data-result-count]').textContent=count+' '+(count===1?'artigo encontrado':'artigos encontrados');
  };
  blog.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
    topicSelect.replaceChildren(new Option('Todos os assuntos','all'));
    for(const topic of topics[button.dataset.filter]||[])topicSelect.add(new Option(topic,topic));
    blog.querySelector('[data-topic-container]').hidden=!(topics[button.dataset.filter]||[]).length;
    refresh();
  }));
  topicSelect.addEventListener('change',refresh);
  sortSelect.addEventListener('change',refresh);
  blog.querySelector('#article-search').addEventListener('input',refresh);
  refresh();
}
export function toast(text){const el=document.querySelector('#toast');if(!el)return;el.textContent=text;el.hidden=false;clearTimeout(window.__toastTimer);window.__toastTimer=setTimeout(()=>el.hidden=true,4500);}
document.querySelectorAll('[data-copy-link]').forEach(b=>b.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(location.href.split('#')[0]);toast('Link copiado.');}catch{toast('Copie o endereço na barra do navegador.');}}));
const dialog=document.querySelector('#cookie-dialog');
const media=document.querySelector('#cookie-media');
const analytics=document.querySelector('#cookie-analytics');
const gaId=document.documentElement.dataset.analyticsId||'';
const gaEnabled=/^G-[A-Z0-9]+$/.test(gaId);
const privacyKey='cafematica_privacy_v2';

function getPreferences(){
  try{
    const saved=localStorage.getItem(privacyKey);
    if(saved){
      const value=JSON.parse(saved);
      return {media:value.media===true,analytics:value.analytics===true};
    }
    // Preserve the visitor's prior YouTube choice, but never infer analytics consent.
    const old=JSON.parse(localStorage.getItem('cafematica_privacy_v1')||'{}');
    return {media:old.media===true,analytics:false};
  }catch{return {media:false,analytics:false};}
}
function startAnalytics(){
  if(!gaEnabled||!getPreferences().analytics||window.__cafematicaGaStarted)return;
  window.__cafematicaGaStarted=true;
  window[`ga-disable-${gaId}`]=false;
  window.dataLayer=window.dataLayer||[];
  window.gtag=function(){window.dataLayer.push(arguments);};
  window.gtag('js',new Date());
  window.gtag('config',gaId);
  const script=document.createElement('script');
  script.async=true;
  script.src=`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
  document.head.append(script);
}
function savePreferences(allowMedia,allowAnalytics=getPreferences().analytics){
  const previous=getPreferences();
  try{
    localStorage.setItem(privacyKey,JSON.stringify({media:allowMedia===true,analytics:gaEnabled&&allowAnalytics===true,version:2,date:new Date().toISOString()}));
  }catch{toast('Não foi possível guardar a preferência neste navegador.');}
  if(!allowMedia){
    document.querySelectorAll('[data-video] iframe').forEach(f=>{
      const wrap=f.parentElement;
      f.remove();
      wrap.querySelectorAll('p,button').forEach(e=>e.hidden=false);
    });
  }
  if(gaEnabled){
    window[`ga-disable-${gaId}`]=allowAnalytics!==true;
    if(allowAnalytics)startAnalytics();
    // Unload any previously loaded analytics script when consent is withdrawn.
    else if(previous.analytics)window.location.reload();
  }
}
document.querySelectorAll('[data-cookie-settings]').forEach(b=>b.addEventListener('click',()=>{
  media.checked=getPreferences().media;
  if(analytics)analytics.checked=getPreferences().analytics;
  dialog.showModal();
}));
document.querySelector('#cookie-save')?.addEventListener('click',()=>savePreferences(media.checked,analytics?.checked===true));
document.querySelector('#cookie-reject')?.addEventListener('click',()=>savePreferences(false,false));
document.querySelectorAll('[data-video]').forEach(wrap=>{
  const load=()=>{
    if(wrap.querySelector('iframe'))return;
    const iframe=document.createElement('iframe');
    iframe.title='Vídeo relacionado ao artigo';
    iframe.src=`https://www.youtube-nocookie.com/embed/${wrap.dataset.video}`;
    iframe.allow='accelerometer; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen=true;
    wrap.querySelectorAll('p,button').forEach(e=>e.hidden=true);
    wrap.append(iframe);
  };
  wrap.querySelector('[data-load-video]')?.addEventListener('click',()=>{
    savePreferences(true);
    load();
  });
  if(getPreferences().media)load();
});
// A new analytics deployment requires a fresh choice from visitors without v2 preferences.
if(gaEnabled){
  if(getPreferences().analytics)startAnalytics();
  if(!localStorage.getItem(privacyKey)){
    media.checked=getPreferences().media;
    if(analytics)analytics.checked=false;
    dialog?.showModal();
  }
}
