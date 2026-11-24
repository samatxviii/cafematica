import { lexMarkdown, parseMarkdownTokens } from './markdown.mjs';
import { sanitizeMarkdownHtml } from './render.mjs';

const widgets = new Map([['[[calculadora-decimo-terceiro]]', 'calculadora-decimo-terceiro']]);

export function splitArticleBody(source, html) {
  if (!source.includes('[[')) return [{ html }];
  const parts = [];
  const seen = new Set();
  let pending = [];
  function flush() {
    const rendered = sanitizeMarkdownHtml(parseMarkdownTokens(pending));
    if (rendered.trim()) parts.push({ html: rendered });
    pending = [];
  }
  // The lexer resolves reference links for the entire article before it is split.
  for (const token of lexMarkdown(source)) {
    const widget = token.type === 'paragraph' && widgets.get(token.text.trim());
    if (!widget) {
      pending.push(token);
    } else if (!seen.has(widget)) {
      flush();
      parts.push({ widget });
      seen.add(widget);
    }
  }
  if (!seen.size) return [{ html }];
  flush();
  return parts;
}
