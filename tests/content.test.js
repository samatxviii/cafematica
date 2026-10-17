import { describe,it,expect } from 'vitest';
import { renderMarkdown,slugify } from '../src/lib/render.mjs';
import { getPosts, normalizePostDate } from '../src/lib/content.mjs';
import { postMarkdown } from '../supabase/functions/_shared/publish.ts';
import matter from 'gray-matter';
describe('conteúdo público',()=>{
 it('aceita datas YAML do Pages CMS como texto ou Date',()=>{
  expect(normalizePostDate('2026-10-12')).toBe('2026-10-12');
  expect(normalizePostDate(new Date('2026-10-12T00:00:00.000Z'))).toBe('2026-10-12');
  expect(()=>normalizePostDate('invalid')).toThrow();
 });
 it('preserva valores em reais sem interpretá-los como fórmulas',()=>{expect(renderMarkdown('O preço era R$ 150 e passou a R$ 120.')).toContain('R$ 150 e passou a R$ 120');});
 it('remove XSS de HTML e links sem perder fórmulas ou código',()=>{const html=renderMarkdown('<script>alert(1)</script>\n\n<img src="x" onerror="alert(1)">\n\n[x](javascript:alert(1))\n\n$\\frac{1}{2}$\n\n```html\n<script>x</script>\n```');expect(html).not.toMatch(/onerror|href="javascript:|<script/);expect(html).toContain('katex');expect(html).toContain('&lt;script&gt;');});
 it('mantém todos os artigos válidos e únicos',()=>{const posts=getPosts();expect(Array.isArray(posts)).toBe(true);expect(new Set(posts.map(p=>p.slug)).size).toBe(posts.length);for(const post of posts){expect(post.slug).toBe(slugify(post.slug));expect(post.description.length).toBeGreaterThan(30);expect(post.body.trim().length).toBeGreaterThan(0);expect(post.html).not.toContain('<iframe');expect(post.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);}});
 it('isola metadados do texto enviado ao GitHub',()=>{const post={id:'a',version:4,slug:'teste-seguro',title:'Título com "aspas"\nslug: invadido',description:'Resumo suficientemente completo para este teste.',category:'matematica',body:'Um texto útil. '.repeat(100),youtube:'',published_at:'2026-10-01T00:00:00Z'};const parsed=matter(postMarkdown(post,'2026-10-12T00:00:00Z'));expect(parsed.data.title).toBe(post.title);expect(parsed.data.slug).toBe('teste-seguro');expect(parsed.data.date).toBe('2026-10-01');expect(parsed.data.cmsVersion).toBe(4);expect(()=>postMarkdown({...post,slug:'../../index'},'2026-10-12')).toThrow();});
});
