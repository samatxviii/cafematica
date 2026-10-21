// Reconciliação leve, sem npm ci, entre o conteúdo esperado e o manifesto público.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isPostPublic } from '../src/lib/publication.mjs';

function postFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? postFiles(file) : entry.isFile() && file.endsWith('.md') ? [file] : [];
  });
}
function scalar(frontmatter, key) {
  const found = frontmatter.match(new RegExp('^' + key + ':[ \\t]*(.*)$', 'm'));
  if (!found) return undefined;
  const raw = found[1].trim();
  if (raw.startsWith('"') && raw.endsWith('"')) {
    try { return JSON.parse(raw); } catch { return raw.slice(1, -1); }
  }
  if (raw.startsWith("'") && raw.endsWith("'")) return raw.slice(1, -1).replace(/''/g, "'");
  return raw.replace(/[ \\t]+#.*$/, '');
}
export function expectedPublicSlugs(dir = 'content/posts', now = new Date()) {
  const slugs = [];
  for (const file of postFiles(dir)) {
    const source = fs.readFileSync(file, 'utf8');
    const header = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(source)?.[1];
    if (header === undefined) throw new Error('Frontmatter ausente: ' + file);
    const data = {
      slug: scalar(header, 'slug'),
      published: scalar(header, 'published') === 'true',
      publicationStatus: scalar(header, 'publicationStatus'),
      publishAt: scalar(header, 'publishAt')
    };
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(data.slug || ''))) throw new Error('Slug inválido: ' + file);
    if (isPostPublic(data, now)) slugs.push(data.slug);
  }
  if (new Set(slugs).size !== slugs.length) throw new Error('Slug público duplicado.');
  return slugs.sort();
}
export function requiresDeployment(expected, deployed) {
  const actual = [...new Set(deployed)].sort();
  return expected.length !== actual.length || expected.some((slug, index) => slug !== actual[index]);
}
export async function checkScheduledPosts({ directory = 'content/posts', url = 'https://www.cafematica.com.br/publication.json', now = new Date(), fetcher = fetch } = {}) {
  const expected = expectedPublicSlugs(directory, now);
  let deployed = [], reachable = false;
  try {
    const response = await fetcher(url + '?v=' + encodeURIComponent(now.toISOString()), {
      headers: { 'Cache-Control': 'no-cache' },
      signal: AbortSignal.timeout(12000)
    });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const manifest = await response.json();
    if (!Array.isArray(manifest.articles)) throw new Error('Manifesto de publicação inválido.');
    deployed = manifest.articles.map(article => article.slug);
    reachable = true;
  } catch (error) {
    console.warn('Manifesto inacessível; solicitar nova implantação:', error.message);
  }
  return { deploy: !reachable || requiresDeployment(expected, deployed), expected, deployed, reachable };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const state = await checkScheduledPosts();
  console.log('Artigos esperados:', state.expected.length, '| publicados:', state.deployed.length, '| implantar:', state.deploy);
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, 'deploy=' + state.deploy + '\n');
}
