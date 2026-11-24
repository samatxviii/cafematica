(() => {
  'use strict';
  const byId = id => document.getElementById(id);
  const viewer=byId('viewer'), viewport=byId('viewport'), paper=byId('paper'), slide=byId('slide'), progress=byId('progress'), counter=byId('counter');
  const prev=byId('prev'), next=byId('next'), minus=byId('minus'), plus=byId('plus'), fit=byId('fit'), full=byId('fullscreen'), zoomLabel=byId('zoom-label');
  const total=32, storageKey='cafematica:senar-beyblade:v1', base=new URL('.',document.currentScript.src);
  let current=1, zoom=1, start=null;
  const images=new Map();
  const url=n=>new URL('slides/'+String(n).padStart(2,'0')+'.webp',base).href;
  const label=n=>n===1?'Capa':n===31?'Montagem concluída':n===32?'Conexões A e B':'Etapa '+(n-1);
  function readSaved(){try{return Number(localStorage.getItem(storageKey))||1;}catch{return 1;}}
  function save(){try{localStorage.setItem(storageKey,String(current));}catch{}}
  function resize(){const w=Math.min(viewport.clientWidth,viewport.clientHeight*4/3);paper.style.setProperty('--paper-width',`${w*zoom}px`);paper.style.setProperty('--paper-height',`${w*.75*zoom}px`);viewport.classList.toggle('zoomed',zoom>1);}
  function setZoom(value){zoom=Math.max(1,Math.min(3,Math.round(value*100)/100));resize();zoomLabel.textContent=Math.round(zoom*100)+'%';minus.disabled=zoom===1;plus.disabled=zoom===3;if(zoom===1){viewport.scrollTop=0;viewport.scrollLeft=0;}}
  function preload(n){if(n<1||n>total||images.has(n))return;const img=new Image();img.src=url(n);images.set(n,img);}
  function show(n){current=Math.max(1,Math.min(total,Math.round(Number(n)||1)));slide.src=url(current);slide.alt=label(current)+' — manual de montagem do lançador de Beyblade';counter.textContent=`${label(current)} · ${current} / ${total}`;progress.value=String(current);progress.setAttribute('aria-valuetext',`${label(current)}, página ${current} de ${total}`);prev.disabled=current===1;next.disabled=current===total;save();setZoom(1);preload(current+1);preload(current-1);}
  prev.addEventListener('click',()=>show(current-1));next.addEventListener('click',()=>show(current+1));progress.addEventListener('input',()=>show(progress.value));byId('restart').addEventListener('click',()=>show(1));minus.addEventListener('click',()=>setZoom(zoom-.25));plus.addEventListener('click',()=>setZoom(zoom+.25));fit.addEventListener('click',()=>setZoom(1));
  if(!document.fullscreenEnabled||!viewer.requestFullscreen){full.hidden=true;full.style.display='none';}else{full.addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await viewer.requestFullscreen();}catch{}});document.addEventListener('fullscreenchange',()=>{const active=!!document.fullscreenElement;full.setAttribute('aria-label',active?'Sair da tela cheia':'Tela cheia');full.title=full.getAttribute('aria-label');resize();});}
  document.addEventListener('keydown',e=>{if(e.altKey||e.ctrlKey||e.metaKey||e.target===progress||e.target?.matches?.('input,textarea,select,[contenteditable]'))return;let action;switch(e.key){case'ArrowLeft':action=()=>show(current-1);break;case'ArrowRight':action=()=>show(current+1);break;case'Home':action=()=>show(1);break;case'End':action=()=>show(total);break;case'+':case'=':action=()=>setZoom(zoom+.25);break;case'-':action=()=>setZoom(zoom-.25);break;}if(action){e.preventDefault();action();}});
  viewport.addEventListener('touchstart',e=>{start=zoom===1&&e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY}:null;},{passive:true});viewport.addEventListener('touchend',e=>{if(!start||zoom!==1||!e.changedTouches.length){start=null;return;}const dx=e.changedTouches[0].clientX-start.x,dy=e.changedTouches[0].clientY-start.y;start=null;if(Math.abs(dx)>45&&Math.abs(dx)>1.5*Math.abs(dy))show(current+(dx<0?1:-1));},{passive:true});viewport.addEventListener('touchcancel',()=>{start=null;},{passive:true});
  if('ResizeObserver'in window)new ResizeObserver(resize).observe(viewport);else window.addEventListener('resize',resize);
  show(readSaved());
})();
