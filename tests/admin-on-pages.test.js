import {describe,it,expect} from 'vitest';
import fs from 'node:fs';
const file=p=>fs.readFileSync(p,'utf8');
describe('Administração do blog no próprio GitHub Pages',()=>{
 it('usa autenticação sem senha e verifica autorização no banco',()=>{
  const page=file('src/pages/admin/index.astro');
  const logic=file('src/scripts/admin.js');
  expect(page).toContain('id="login-google"');
  expect(page).toContain('id="login-email-form"');
  expect(page).not.toContain('type="password"');
  expect(logic).toContain('signInWithOAuth');
  expect(logic).toContain('signInWithOtp');
  expect(logic).toContain("client.rpc('is_admin')");
  expect(logic).not.toContain('signInWithPassword');
  expect(logic).not.toContain('adminOrigin===new URL(config.url).origin');
 });
 it('explica bloqueios temporários de envio sem culpar o endereço',()=>{
  const logic=file('src/scripts/admin.js');
  expect(logic).toContain('function emailLoginError(error)');
  expect(logic).toContain("code==='over_email_send_rate_limit'");
  expect(logic).toContain('limite temporário de envio de e-mails');
  expect(logic).toContain('message(emailLoginError(error),true)');
 });
 it('não confunde chave publicável com credenciais secretas',()=>{
  const config=JSON.parse(file('config/site.json'));
  expect(config.authEnabled).toBe(true);
  expect(config.adminUrl).toBe('/admin/');
  expect(config.supabaseUrl).toMatch(/^https:\/\/[a-z0-9-]+\.supabase\.co$/);
  expect(config.supabasePublishableKey).toMatch(/^sb_publishable_/);
  expect(JSON.stringify(config)).not.toContain('service_role');
  expect(JSON.stringify(config)).not.toContain('ghp_');
 });
 it('mantém artigos e capa protegidos pela autorização de administrador',()=>{
  const migration=file('supabase/migrations/20261017173000_cms_cover_storage.sql');
  const logic=file('src/scripts/admin.js');
  expect(migration).toContain('private.is_admin()');
  expect(migration).toContain("bucket_id='article-images'");
  expect(logic).toContain("client.rpc('save_post_with_cover'");
  expect(logic).toContain("client.storage.from('article-images').upload");
  expect(logic).toContain('showCover');
 });
 it('publica somente pelo serviço protegido e preserva URLs públicas',()=>{
  const fn=file('supabase/functions/publish-post/index.ts');
  expect(fn).toContain('sessionClient.auth.getUser(token)');
  expect(fn).toContain("rpc('is_admin')");
  expect(fn).toContain("get('GITHUB_TOKEN')");
  expect(fn).toContain("const branch=Deno.env.get('GITHUB_BRANCH')||'main'");
  expect(fn).toContain('allowed.includes(origin)');
 });
});
