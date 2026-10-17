import {describe,it,expect} from 'vitest';
import {safeCoverPath} from '../src/lib/cover.mjs';
const backend='https://bgzxqfslersfmsluuszs.supabase.co';
describe('Capas de artigos',()=>{
 it('aceita arquivos locais e imagens do bucket dedicado',()=>{
  expect(safeCoverPath('/imagens/capa.webp',backend)).toBe('/imagens/capa.webp');
  expect(safeCoverPath('/imagens/blog/equação-de-primeiro-grau.png',backend)).toBe('/imagens/blog/equação-de-primeiro-grau.png');
  expect(safeCoverPath('/imagens/blog/../private/hidden.png',backend)).toBe('');
  const src=backend+'/storage/v1/object/public/article-images/uuid/cover.jpg';
  expect(safeCoverPath(src,backend)).toBe(src);
 });
 it('não permite URLs não autorizadas ou protocolos perigosos',()=>{
  for(const src of ['javascript:alert(1)','data:image/svg+xml,test','//example.org/p.png','https://example.org/p.jpg',backend+'/storage/v1/object/public/outro/p.png',backend+'/storage/v1/object/public/article-images/a.png?token=abc']){
   expect(safeCoverPath(src,backend)).toBe('');
  }
 });
});
