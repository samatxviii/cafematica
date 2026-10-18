import {describe,it,expect} from 'vitest';
import fs from 'node:fs';

const html=fs.readFileSync('src/layouts/Base.astro','utf8');
const css=fs.readFileSync('src/styles/atelier.css','utf8');
const logoDesktop='public/assets/cafematica-logo-desktop.png';
const logoMobile='public/assets/cafematica-logo-mobile.png';
const size=buffer=>({width:buffer.readUInt32BE(16),height:buffer.readUInt32BE(20)});

describe('Identidade aprovada do Cafemática no cabeçalho',()=>{
 it('disponibiliza PNGs transparentes e leves para desktop e mobile',()=>{
  for(const [file,expected] of [[logoDesktop,{width:600,height:113}],[logoMobile,{width:420,height:81}]]){
   const bytes=fs.readFileSync(file);
   expect(bytes.subarray(0,8).toString('hex')).toBe('89504e470d0a1a0a');
   expect(size(bytes)).toEqual(expected);
   expect(bytes.includes(Buffer.from('tRNS'))).toBe(true);
   expect(bytes.length).toBeLessThan(20000);
  }
 });
 it('usa imagem responsiva com nome acessível e mantém link para a home',()=>{
  expect(html).toContain('<a class="brand brand-graphic" href="/" aria-label="Cafemática, início">');
  expect(html).toContain('src="/assets/cafematica-logo-desktop.png"');
  expect(html).toContain('srcset="/assets/cafematica-logo-mobile.png"');
  expect(html).toContain('alt="Cafemática"');
  expect(html).toContain('width="700" height="132"');
  expect(html).toContain('fetchpriority="high"');
  expect(html).toContain('<link rel="canonical" href={url}/>');
  expect(html).toContain('google-site-verification');
  expect(html).toContain('<script type="application/ld+json"');
 });
 it('não afeta o rodapé nem os menus e adapta a marca a telas pequenas',()=>{
  expect(html).toContain('class="footer-brand"');
  expect(html).toContain('id="main-nav"');
  expect(css).toContain('.site-header .brand-graphic img');
  expect(css).toContain('@media (max-width:800px)');
  expect(css).toContain('@media (max-width:520px)');
  expect(css).toContain('@media (max-width:350px)');
 });
});
