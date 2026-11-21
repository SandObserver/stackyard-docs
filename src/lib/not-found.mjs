// @ts-check
import { readFileSync, writeFileSync, globSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, relative } from 'node:path';
import { render } from './yard-404/render.mjs';
import { SITES } from './yard-404/sites.mjs';

const unescape = (s) => s.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

export function notFound() {
  return {
    name: 'not-found',
    hooks: {
      'astro:build:done': ({ dir }) => {
        const dist = fileURLToPath(dir);
        const { keywords } = SITES.stackyard;
        const sidebar = new Map([...readFileSync(join(dist, 'docs/index.html'), 'utf8').matchAll(/<a href="(\/docs\/[^"]*)" (?:aria-current="page" )?class="sy-nl[^"]*">(?:<svg[\s\S]*?<\/svg>)?<span>([^<]+)<\/span>/g)].map((m) => [m[1], unescape(m[2]).trim()]));
        const pages = globSync(join(dist, 'docs/**/index.html'))
          .map((f) => {
            const h1 = /<h1 id="_top">([^<]+)<\/h1>/.exec(readFileSync(f, 'utf8'));
            if (!h1) return null;
            const href = '/' + relative(dist, f).replace(/index\.html$/, '');
            const title = unescape(h1[1]).trim();
            const short = sidebar.get(href);
            const label = title.length <= 26 || !short ? title : short;
            return keywords[href] ? [label, href, keywords[href]] : [label, href];
          })
          .filter((p) => p !== null)
          .sort((a, b) => a[1].localeCompare(b[1]));
        const { html, files } = render('stackyard', pages);
        writeFileSync(join(dist, '404.html'), html);
        for (const f of files) writeFileSync(join(dist, f.path), f.content);
      },
    },
  };
}
