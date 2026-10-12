import { Marked } from 'marked';
import katex from 'katex';
const markdown = new Marked({ gfm: true, breaks: false });
const math = (value, displayMode) => katex.renderToString(value, { displayMode, throwOnError: false, trust: false, strict: 'warn', output: 'htmlAndMathml', maxExpand: 500 });
markdown.use({ extensions: [
  { name: 'mathBlock', level: 'block', start: (s) => s.indexOf('$$'), tokenizer(src) { const m = /^\$\$\s*([\s\S]+?)\s*\$\$(?:\n|$)/.exec(src); if(m) return { type: 'mathBlock', raw: m[0], value: m[1] }; }, renderer: (t) => `<div class="math-block">${math(t.value,true)}</div>` },
  { name: 'mathInline', level: 'inline', start: (s) => s.indexOf('$'), tokenizer(src) { const m = /^\$([^$\n]+?)\$/.exec(src); if(m) return { type: 'mathInline', raw: m[0], value: m[1] }; }, renderer: (t) => math(t.value,false) }
] });

export const rawMarkdown = (source) => markdown.parse(String(source));
