import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { isPostPublic, publicationMode, parsePublishAt } from '../src/lib/publication.mjs';
import { getPosts } from '../src/lib/content.mjs';
import { expectedPublicSlugs, requiresDeployment, checkScheduledPosts } from '../scripts/check-scheduled-posts.mjs';

const before = new Date('2026-10-25T21:59:59Z');
const at = new Date('2026-10-25T22:00:00Z');
const after = new Date('2026-10-25T22:00:01Z');
function article(slug, metadata = '') {
  return ['---', 'slug: ' + slug, 'title: Teste de agendamento', 'description: Artigo artificial suficientemente completo para testar publicação sem expor conteúdo real.', 'category: matematica', 'date: 2026-10-12', metadata, '---', 'Texto do artigo.'].join('\n');
}
describe('publicação agendada UTC−4', () => {
  it('compara o horário local com o instante UTC correto', () => {
    expect(parsePublishAt('2026-10-25T18:00')?.toISOString()).toBe('2026-10-25T22:00:00.000Z');
    expect(isPostPublic({publicationStatus:'scheduled',publishAt:'2026-10-25T18:00'},before)).toBe(false);
    expect(isPostPublic({publicationStatus:'scheduled',publishAt:'2026-10-25T18:00'},at)).toBe(true);
    expect(isPostPublic({publicationStatus:'scheduled',publishAt:'2026-10-25T18:00'},after)).toBe(true);
  });
  it('não libera horários inválidos ou ausentes', () => {
    for (const value of ['',null,'2026-02-30T18:00','2026-10-25T24:00','2026-10-25','2026-10-25T18:00Z']) {
      expect(parsePublishAt(value)).toBeNull();
      expect(isPostPublic({publicationStatus:'scheduled',publishAt:value},after)).toBe(false);
    }
  });
  it('é compatível com posts antigos e permite tirar do ar posts já publicados', () => {
    expect(publicationMode({published:true})).toBe('published');
    expect(isPostPublic({published:true},before)).toBe(true);
    expect(isPostPublic({published:true,publicationStatus:'scheduled',publishAt:'2026-10-25T18:00'},before)).toBe(false);
    expect(isPostPublic({published:true,publicationStatus:'scheduled',publishAt:'2026-10-25T18:00'},at)).toBe(true);
    expect(isPostPublic({published:true,publicationStatus:'draft'},after)).toBe(false);
    expect(isPostPublic({published:false,publicationStatus:'published'},before)).toBe(true);
    expect(isPostPublic({publicationStatus:'unexpected'},after)).toBe(false);
  });
  it('gera/retira URLs sem apagar nem mover os arquivos Markdown', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(),'cafematica-scheduled-'));
    try {
      fs.mkdirSync(path.join(dir,'matematica'));
      fs.writeFileSync(path.join(dir,'antigo.md'),article('antigo','published: true\npublicationStatus: scheduled\npublishAt: "2026-10-25T18:00"'));
      fs.writeFileSync(path.join(dir,'matematica/novo.md'),article('novo','publicationStatus: scheduled\npublishAt: "2026-10-25T18:00"'));
      fs.writeFileSync(path.join(dir,'rascunho.md'),article('rascunho','publicationStatus: draft'));
      fs.writeFileSync(path.join(dir,'publico.md'),article('publico','published: true'));
      expect(getPosts(dir,before).map(p=>p.slug)).toEqual(['publico']);
      expect(expectedPublicSlugs(dir,before)).toEqual(['publico']);
      expect(getPosts(dir,at).map(p=>p.slug).sort()).toEqual(['antigo','novo','publico']);
      expect(expectedPublicSlugs(dir,at)).toEqual(['antigo','novo','publico']);
      expect(fs.existsSync(path.join(dir,'antigo.md'))).toBe(true);
    } finally { fs.rmSync(dir,{recursive:true,force:true}); }
  });
  it('dispara o build só quando o manifesto público divergir', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(),'cafematica-schedule-check-'));
    try {
      fs.writeFileSync(path.join(dir,'post.md'),article('post','publicationStatus: scheduled\npublishAt: "2026-10-25T18:00"'));
      const manifest = items => async () => ({ok:true,json:async()=>({articles:items.map(slug=>({slug}))})});
      expect((await checkScheduledPosts({directory:dir,now:before,fetcher:manifest([])})).deploy).toBe(false);
      expect((await checkScheduledPosts({directory:dir,now:at,fetcher:manifest([])})).deploy).toBe(true);
      expect((await checkScheduledPosts({directory:dir,now:after,fetcher:manifest(['post'])})).deploy).toBe(false);
      expect((await checkScheduledPosts({directory:dir,now:before,fetcher:manifest(['post'])})).deploy).toBe(true);
      expect(requiresDeployment(['a','b'],['b','a'])).toBe(false);
    } finally { fs.rmSync(dir,{recursive:true,force:true}); }
  });
  it('mantém a leitura leve equivalente ao compilador Astro', () => {
    expect(expectedPublicSlugs('content/posts')).toEqual(getPosts().map(p=>p.slug).sort());
  });
});
