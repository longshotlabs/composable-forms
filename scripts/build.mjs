import { readFile, writeFile, mkdir, rm, cp } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = fileURLToPath(new URL('../', import.meta.url));
const read = (name) => readFile(path.join(root, name), 'utf8');
const escape = (text) => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
export async function build(output = path.join(root, 'site')) {
  const navigation = JSON.parse(await read('navigation.json'));
  const pages = navigation.flatMap(([title, target]) => Array.isArray(target) ? target.map(([title, slug]) => ({ title, slug })) : [{ title, slug: target }]);
  const template = await read('templates/page.html');
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  await cp(path.join(root, 'assets'), path.join(output, 'assets'), { recursive: true });
  const search = [];
  for (const [index, page] of pages.entries()) {
    const prefix = page.slug === 'index' ? '.' : page.slug.split('/').map(() => '..').join('/');
    const url = (slug) => `${prefix}/${slug === 'index' ? '' : `${slug}/`}`;
    const item = (title, slug) => `<a href="${url(slug)}"${slug === page.slug ? ' aria-current="page"' : ''}>${escape(title)}</a>`;
    const nav = navigation.map(([title, target]) => Array.isArray(target)
      ? `<details class="dropdown"><summary${target.some(([, slug]) => slug === page.slug) ? ' class="active"' : ''}>${title} <span class="caret"></span></summary><ul>${target.map(([title, slug]) => `<li>${item(title, slug)}</li>`).join('')}</ul></details>`
      : item(title, target)).join('\n');
    const source = await read(`docs/pages/${page.slug}.html`);
    const content = source.replaceAll('{{root}}', prefix);
    const headings = [...content.matchAll(/<h([123]) id="([^"]+)">(.*?)<a class="headerlink".*?<\/h\1>/gs)];
    const toc = headings.map(([, level, id, title]) => `<li class="level-${level}"><a href="#${id}">${title}</a></li>`).join('\n');
    const previous = pages[index - 1], next = pages[index + 1];
    const values = { root: prefix, title: escape(page.title), nav, content, toc,
      previous: previous ? `<a href="${url(previous.slug)}" rel="prev">← Previous</a>` : '<span class="disabled">← Previous</span>',
      next: next ? `<a href="${url(next.slug)}" rel="next">Next →</a>` : '<span class="disabled">Next →</span>' };
    const html = template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
      if (!(key in values)) throw new Error(`Unknown template variable: ${key}`);
      return values[key];
    });
    const destination = path.join(output, page.slug === 'index' ? 'index.html' : `${page.slug}/index.html`);
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, html);
    search.push({ title: page.title, url: page.slug === 'index' ? '' : `${page.slug}/`, text: content.replace(/<[^>]*>/g, ' ').replace(/&\w+;/g, ' ').replace(/\s+/g, ' ').trim() });
  }
  await writeFile(path.join(output, 'assets/search.json'), JSON.stringify(search));
  await writeFile(path.join(output, '404.html'), '<!doctype html><html lang="en"><meta charset="utf-8"><title>Page not found</title><h1>Page not found</h1><p>Return to the <a href="/">Composable Form Specification</a>.</p></html>');
  console.log(`Built ${pages.length} pages in ${output}`);
}
if (process.argv[1] === fileURLToPath(import.meta.url)) await build();
