/* =========================================================
   CARREGAMENTO DAS PARTES DO SITE
   Mantém o index.html limpo e injeta menu, conteúdo e rodapé
   a partir de arquivos separados.
   ========================================================= */
const partesDoSite = [
  { seletor: '#menu-site', arquivo: 'menu.html' },
  { seletor: '#conteudo-site', arquivo: 'conteudo.html' },
  { seletor: '#rodape-site', arquivo: 'rodape.html' }
];

async function carregarParte({ seletor, arquivo }) {
  const destino = document.querySelector(seletor);
  if (!destino) return;

  try {
    const resposta = await fetch(arquivo);
    if (!resposta.ok) {
      throw new Error(`Erro ${resposta.status} ao carregar ${arquivo}`);
    }
    destino.innerHTML = await resposta.text();
  } catch (erro) {
    console.error(`Não foi possível carregar ${arquivo}.`, erro);
  }
}

async function carregarPartesDoSite() {
  await Promise.all(partesDoSite.map(carregarParte));
  iniciarMenuMobile();
  iniciarAnimacoesAoRolar();
  ajustarRolagemInicialPorHash();
}

function iniciarMenuMobile() {
  /* =========================================================
     MENU MOBILE
     Abre e fecha o menu no celular. Ao clicar em um link, o menu fecha.
     ========================================================= */
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  menuToggle?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      menuToggle?.setAttribute('aria-expanded', 'false');
    });
  });
}

function iniciarAnimacoesAoRolar() {
  /* =========================================================
     ANIMAÇÕES AO ROLAR
     Usa IntersectionObserver para revelar elementos apenas quando
     entram na tela, preservando performance.
     ========================================================= */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
  }
}

function ajustarRolagemInicialPorHash() {
  if (!window.location.hash) return;

  const id = decodeURIComponent(window.location.hash.slice(1));
  const alvo = document.getElementById(id);

  if (alvo) {
    requestAnimationFrame(() => alvo.scrollIntoView());
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', carregarPartesDoSite);
} else {
  carregarPartesDoSite();
}
