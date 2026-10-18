import {describe,it,expect} from 'vitest';
import fs from 'node:fs';

const about=fs.readFileSync('src/pages/sobre.astro','utf8');
const styles=fs.readFileSync('src/styles/atelier.css','utf8');
const layout=fs.readFileSync('src/layouts/Base.astro','utf8');

describe('Retrato editorial do professor na página Sobre',()=>{
 it('substitui a imagem original no mesmo caminho por WebP otimizado',()=>{
  const bytes=fs.readFileSync('public/assets/prof-fernando.webp');
  expect(bytes.toString('ascii',0,4)).toBe('RIFF');
  expect(bytes.toString('ascii',8,12)).toBe('WEBP');
  expect(bytes.length).toBeGreaterThan(12000);
  expect(bytes.length).toBeLessThan(100000);
  expect(fs.existsSync('public/assets/prof-fernando.png')).toBe(false);
 });
 it('mantém a URL e atualiza proporção, dimensões e acessibilidade',()=>{
  expect(about).toContain('src="/assets/prof-fernando.webp"');
  expect(about).toContain('width="800" height="1000"');
  expect(about).toContain('alt="Prof. Fernando Batista sorrindo, com polo preta do Cafemática, em retrato editorial"');
  expect(styles).toContain('/* Retrato editorial /sobre/: formato real 4:5, sem recorte oval. */');
  expect(styles).toContain('.about-grid .about-image{');
  expect(styles).toContain('aspect-ratio:4 / 5;');
  expect(styles).toContain('border-radius:12px;');
  expect(styles).toContain('filter:none;');
 });
 it('preserva SEO e integridade das integrações no layout principal',()=>{
  expect(layout).toContain('rel="canonical"');
  expect(layout).toContain('google-site-verification');
  expect(layout).toContain('data-analytics-id={analyticsId||undefined}');
 });
});
