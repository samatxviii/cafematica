/**
 * Restringe capas a arquivos locais do site ou ao bucket público
 * dedicado aos artigos, evitando URLs externas arbitrárias.
 */
export function safeCoverPath(value, supabaseUrl = '') {
  if (typeof value !== 'string' || !value) return '';
  if (/^\/(?!\/)[\p{L}\p{N}/_.,-]+\.(?:avif|webp|png|jpe?g)$/iu.test(value) && !value.split('/').some(part=>part==='.'||part==='..')) return value;
  try {
    const image = new URL(value);
    const backend = new URL(supabaseUrl);
    if (image.origin !== backend.origin || image.search || image.hash) return '';
    const prefix = '/storage/v1/object/public/article-images/';
    if (!image.pathname.startsWith(prefix)) return '';
    const name = image.pathname.slice(prefix.length);
    if (!name || !/^[a-zA-Z0-9/._-]+$/.test(name)) return '';
    return value;
  } catch { return ''; }
}
