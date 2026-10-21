// Regras de visibilidade: data e hora de agendamento interpretadas em UTC−4 fixo.
export function publicationMode(post) {
  const status = post?.publicationStatus;
  if (status === undefined || status === null || status === '') {
    return post?.published === true ? 'published' : 'draft';
  }
  return ['draft', 'published', 'scheduled'].includes(status) ? status : 'draft';
}
export function parsePublishAt(value) {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value !== 'string') return null;
  const local = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(local)) return null;
  const timestamp = Date.parse(local + ':00-04:00');
  if (!Number.isFinite(timestamp)) return null;
  if (new Date(timestamp - 4 * 60 * 60 * 1000).toISOString().slice(0, 16) !== local) return null;
  return new Date(timestamp);
}
export function isPostPublic(post, now = new Date()) {
  const mode = publicationMode(post);
  if (mode === 'draft') return false;
  if (mode === 'published') return true;
  const at = parsePublishAt(post?.publishAt);
  // Agendamentos incompletos permanecem fora do ar por segurança.
  return Boolean(at && new Date(now).getTime() >= at.getTime());
}
