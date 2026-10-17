import {describe,it,expect} from 'vitest';
import fs from 'node:fs';
import {getPosts} from '../src/lib/content.mjs';

const file=path=>fs.readFileSync(path,'utf8');

describe('Editor simples de artigos no GitHub',()=>{
  it('usa um CMS integrado ao GitHub, sem login próprio',()=>{
    const page=file('src/pages/admin/index.astro');
    expect(page).toContain('https://app.pagescms.org/');
    expect(page).toContain('samatxviii/cafematica');
    expect(page).not.toContain('type="password"');
    expect(page).not.toContain('signInWithOtp');
  });
  it('mapeia os artigos Markdown existentes e seus metadados',()=>{
    const config=file('.pages.yml');
    expect(config).toContain('path: content/posts');
    expect(config).toContain('format: yaml-frontmatter');
    expect(config).toContain('merge: true');
    expect(config).toContain('"{fields.slug}.md"');
    for(const field of ['title','slug','description','category','topic','cover','date','published','body']){
      expect(config).toContain('name: '+field);
    }
    expect(getPosts().length).toBeGreaterThanOrEqual(10);
  });
  it('salva imagens públicas na pasta estática do Astro e evita renomear posts',()=>{
    const config=file('.pages.yml');
    expect(config).toContain('input: public/imagens/blog');
    expect(config).toContain('output: /imagens/blog');
    expect(config).toContain('rename: false');
    expect(config).toContain('delete: false');
  });
  it('mantém o GitHub Actions responsável pela publicação',()=>{
    const workflow=file('.github/workflows/portal.yml');
    expect(workflow).toContain('branches: [main]');
    expect(workflow).toContain('npm run build');
    expect(workflow).toContain('actions/deploy-pages@v5');
  });
});
