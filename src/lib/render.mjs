import sanitizeHtml from 'sanitize-html';
import { rawMarkdown } from './markdown.mjs';

export function renderMarkdown(source = '') {
  return sanitizeHtml(rawMarkdown(source), {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img', 'span', 'div', 'sup', 'sub', 'math', 'semantics', 'annotation', 'mrow', 'mi', 'mn', 'mo', 'mfrac', 'msup', 'msub', 'msubsup', 'mover', 'munder', 'munderover', 'msqrt', 'mroot', 'mtable', 'mtr', 'mtd', 'mtext', 'mspace', 'mpadded', 'menclose', 'mmultiscripts', 'mprescripts', 'none'],
    allowedAttributes: { '*': ['class','aria-hidden','mathvariant','stretchy','fence','separator','accent','accentunder','columnalign','rowspacing','columnspacing','linethickness','scriptlevel'], math:['xmlns','display'], annotation:['encoding'], a: ['href','title','rel'], img: ['src','alt','title','width','height','loading'], span: ['class','style','aria-hidden'], div: ['class','style'], code: ['class'] },
    allowedSchemes: ['https','http','mailto'], allowedSchemesByTag: { img: ['https'] }, allowProtocolRelative: false,
    allowedStyles: { '*': { 'height': [/^-?[\d.]+(?:em|px|%)$/], 'width': [/^-?[\d.]+(?:em|px|%)$/], 'min-width': [/^-?[\d.]+(?:em|px|%)$/], 'top': [/^-?[\d.]+(?:em|px|%)$/], 'left': [/^-?[\d.]+(?:em|px|%)$/], 'vertical-align': [/^-?[\d.]+(?:em|px|%)$/], 'margin-left': [/^-?[\d.]+(?:em|px|%)$/], 'margin-right': [/^-?[\d.]+(?:em|px|%)$/], 'padding-left': [/^-?[\d.]+(?:em|px|%)$/], 'border-bottom-width': [/^[\d.]+(?:em|px)$/], 'position': [/^relative$/] } },
    transformTags: { a: (tag, a) => ({ tagName: tag, attribs: { ...a, rel: 'noopener noreferrer' } }), img: (tag,a) => ({tagName:tag,attribs:{...a,loading:'lazy'}}) }
  });
}

export function slugify(value) { return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,90); }
export function escapeHtml(value) { return String(value).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s])); }
