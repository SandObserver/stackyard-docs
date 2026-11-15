/* Keep the html and body drops. Those rules restyle the whole docs page. */
const DROP = /^(html|body)(?![[\w-])|^html(\.|::|:has|:not|\.lang)|^body:not/;
const LIGHT = 'html[data-theme="light"]';
const REDUCE = 'html[data-transparency="reduce"]';

function mapSelector(sel, rootClasses) {
  const s = sel.trim();
  if (s === ':root') return ':scope';
  for (const attr of [LIGHT, REDUCE]) {
    const root = attr.replace(/^html/, ':root');
    if (s === attr) return `${root} :scope`;
    if (s.startsWith(`${attr} `)) return `${root} ${atRoot(s.slice(attr.length + 1), rootClasses)}`;
  }
  if (DROP.test(s)) return null;
  return atRoot(s.replaceAll('html[', ':root['), rootClasses);
}

const atRoot = (sel, rootClasses) =>
  rootClasses.some((c) => sel.startsWith(c) && (sel.length === c.length || /^[\s.:[>~+]/.test(sel.slice(c.length)))) ? `:scope${sel}` : sel;

function splitSelectors(prelude) {
  const out = [];
  let depth = 0;
  let cur = '';
  for (const ch of prelude) {
    if (ch === '(' || ch === '[') depth++;
    if (ch === ')' || ch === ']') depth--;
    if (ch === ',' && depth === 0) {
      out.push(cur);
      cur = '';
    } else cur += ch;
  }
  out.push(cur);
  return out;
}

function walk(text, global, rootClasses) {
  let out = '';
  let i = 0;
  while (i < text.length) {
    const open = text.indexOf('{', i);
    const semi = text.indexOf(';', i);
    if (open < 0) break;
    if (semi >= 0 && semi < open) {
      const stmt = text.slice(i, semi + 1).trim();
      if (stmt.startsWith('@')) global.push(stmt);
      i = semi + 1;
      continue;
    }
    let depth = 0;
    let end = open;
    for (; end < text.length; end++) {
      if (text[end] === '{') depth++;
      else if (text[end] === '}' && --depth === 0) break;
    }
    const prelude = text.slice(i, open).trim();
    const body = text.slice(open + 1, end);
    i = end + 1;
    if (/^@(keyframes|property|font-face|-webkit-keyframes)/.test(prelude)) {
      global.push(`${prelude}{${body}}`);
    } else if (prelude.startsWith('@')) {
      const inner = walk(body, global, rootClasses);
      if (inner.trim()) out += `${prelude}{${inner}}`;
    } else {
      const sels = splitSelectors(prelude).map((x) => mapSelector(x, rootClasses)).filter(Boolean);
      if (sels.length) out += `${sels.join(',')}{${body}}`;
    }
  }
  return out;
}

export function scopeCss(css, roots) {
  const global = [];
  const rootClasses = roots.split(',').map((r) => r.trim());
  const scoped = walk(css.replace(/\/\*[\s\S]*?\*\//g, ''), global, rootClasses);
  return `${global.join('\n')}\n@scope (${roots}) {\n${scoped}\n}\n`;
}
